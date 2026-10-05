import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AvatarModule } from '@openng/optimus-ui/avatar';
import { AvatarGroupModule } from '@openng/optimus-ui/avatargroup';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, AvatarModule, AvatarGroupModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-avatar-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-avatar-article .stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-avatar-article .stage--col {
        flex-direction: column;
        align-items: flex-start;
      }

      app-avatar-article .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      app-avatar-article .grid li {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      app-avatar-article .byline {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin: 0;
      }

      app-avatar-article .muted {
        color: var(--text-color-secondary);
        font-size: 0.85rem;
      }

      app-avatar-article .people {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      app-avatar-article .people li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      app-avatar-article .demo-btn {
        font: inherit;
        padding: 0.4rem 0.8rem;
        border: 1px solid var(--control-border);
        background: var(--surface-card);
        color: var(--text-color);
        cursor: pointer;
      }

      app-avatar-article .demo-btn[aria-pressed='true'] {
        background: var(--surface-section);
        font-weight: 600;
      }

      app-avatar-article .demo-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-avatar-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-avatar-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        min-width: 0;
      }

      app-avatar-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-avatar-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-avatar-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
        overflow-x: auto;
      }

      app-avatar-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-avatar-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-avatar-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-avatar-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-avatar-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-avatar-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Avatar and AvatarGroup (Guides, category `library`).
 *
 * Subject: `p-avatar` — a box that shows a text label, an icon class, or an
 * image — and `p-avatar-group`, a flex row that overlaps them. Neither has a
 * role, and the image variant renders an `<img>` without an `alt` attribute.
 * Everything claimed comes from the shipped source of Optimus UI 2.0.2.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-avatar.mjs unless noted):
 *   - Inputs label, icon, image, size ('normal'), shape ('square'), styleClass
 *     (deprecated), ariaLabel, ariaLabelledBy; output onImageError (:89-135).
 *   - Host bindings: class, attr.aria-label, attr.aria-labelledby, attr.data-p;
 *     no role (:184-189).
 *   - Template precedence label > icon > image, ng-content first (:168-181).
 *   - The image branch: <img [src] (error) [attr.aria-label]> — no alt (:177).
 *   - The icon span carries the icon classes and no aria-hidden (:174).
 *   - AvatarGroup: selectors p-avatarGroup / p-avatar-group / p-avatargroup,
 *     inputs styleClass and style, template <ng-content> only, no role
 *     (openng-optimus-ui-avatargroup.mjs:62).
 *   - CSS: @openng/optimus-ui-styles/dist/avatar/index.mjs (group rules live in
 *     the avatar sheet; img is width/height 100% with no object-fit).
 *   - Tokens: @openng/optimus-ui-themes/dist/aura/avatar/index.mjs; semantic
 *     resolution from .../aura/base/index.mjs; radius per visual style from
 *     src/app/services/ui-styles.ts (primitive.borderRadius.md).
 *   - The label pair is gated in docs/generated/CONTRAST.MD ("avatar"); the
 *     box-on-card ratio is computed from stock Aura with the WCAG 2.2 formula.
 */
@Component({
  selector: 'app-avatar-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'avatar'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          An avatar is a small box with initials, an icon, or a picture in it. It says nothing about who it shows: the
          host has no role, and the picture has no alt text. The name always comes from you — either as visible text
          beside it or as a name you give the avatar itself.
        </p>

        <h3>Three kinds of content, two shapes, three sizes</h3>
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
          Live <code>p-avatar</code> instances from <code>&#64;openng/optimus-ui/avatar</code>. The visible word under
          each box is its caption, so the boxes are hidden from assistive technology. Sizes are
          <code>avatar.width</code> 2rem, <code>avatar.lg.width</code> 3rem, <code>avatar.xl.width</code> 4rem in
          <code>&#64;openng/optimus-ui-themes/dist/aura/avatar/index.mjs</code>.
        </p>

        <h3>A byline: the name is text, the avatar is decoration</h3>
        <div class="stage">
          <p class="byline">
            <p-avatar [image]="portraitUri" shape="circle" size="large" aria-hidden="true" />
            <span><strong>Ada Example</strong><br /><span class="muted">Author</span></span>
          </p>
        </div>
        <p class="src-note">
          The person's name is visible text, so the avatar adds nothing a screen reader needs:
          <code>aria-hidden="true"</code> keeps it out of the tree. The name and portrait are synthetic.
        </p>

        <h3>A standalone avatar: name the host and give it a role</h3>
        <div class="stage">
          <p-avatar label="AE" shape="circle" role="img" ariaLabel="Ada Example" />
          <p-avatar [image]="portraitUri" shape="circle" role="img" ariaLabel="Ada Example" />
        </div>
        <p class="src-note">
          <code>ariaLabel</code> is written onto the host and, in the image branch, onto the inner
          <code>&lt;img&gt;</code> too (<code>openng-optimus-ui-avatar.mjs:177</code>, <code>:186</code>). The static
          <code>role="img"</code> makes the host a nameable image whose children are presentational, so the name is
          announced once and the initials are not spelled out.
        </p>

        <h3>A group with an overflow count</h3>
        <div class="stage">
          <p-avatar-group role="img" [attr.aria-label]="m.groupName">
            <p-avatar label="AE" shape="circle" />
            <p-avatar label="GH" shape="circle" />
            <p-avatar label="KJ" shape="circle" />
            <p-avatar label="+3" shape="circle" />
          </p-avatar-group>
        </div>
        <p class="src-note">
          <code>p-avatar-group</code> renders nothing but <code>&lt;ng-content&gt;</code> on a flex host
          (<code>openng-optimus-ui-avatargroup.mjs:62</code>); the overlap is
          <code>.p-avatar-group .p-avatar + .p-avatar</code> with <code>margin-inline-start: -0.75rem</code>. The
          whole group is one image here, named with the full sentence the pictures stand for.
        </p>

        <h3>When the picture fails to load</h3>
        <div class="stage stage--col">
          <button type="button" class="demo-btn" [attr.aria-pressed]="broken()" (click)="toggleBroken()">
            Simulate a failed image
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
          <code>onImageError</code> re-emits the image's <code>error</code> event
          (<code>openng-optimus-ui-avatar.mjs:137-139</code>). The component does not fall back on its own: the
          handler swaps in a <code>label</code>, which wins over <code>image</code> in the template
          (<code>:170-179</code>). The failing source is a malformed data URI, so no request leaves the page.
        </p>

        <h3>What the component renders</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Host bindings from <code>openng-optimus-ui-avatar.mjs:184-189</code>, template from <code>:168-181</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which naming pattern</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Situation</th><th>Markup</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>The name is visible next to the avatar</td>
                <td><code>aria-hidden="true"</code> on <code>p-avatar</code></td>
                <td>{{ m.useAdjacent }}</td>
              </tr>
              <tr>
                <td>The avatar stands alone</td>
                <td><code>role="img"</code> + <code>ariaLabel</code></td>
                <td>{{ m.useAlone }}</td>
              </tr>
              <tr>
                <td>The avatar opens a profile</td>
                <td>a link around it, the avatar hidden</td>
                <td>{{ m.useLink }}</td>
              </tr>
              <tr>
                <td>A stack of people, as one fact</td>
                <td><code>p-avatar-group role="img"</code> + one name</td>
                <td>{{ m.useGroup }}</td>
              </tr>
              <tr>
                <td>Each person in the stack matters</td>
                <td>a list, no group overlap</td>
                <td>{{ m.useList }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Neither host binds a role (<code>openng-optimus-ui-avatar.mjs:184-189</code>,
          <code>openng-optimus-ui-avatargroup.mjs:62</code>). An autonomous custom element maps to
          <code>generic</code> (HTML-AAM), and WAI-ARIA 1.2 prohibits naming a generic element — so an
          <code>ariaLabel</code> on a host without a role is not a dependable name.
        </p>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — initials as the only name</span>
            <div class="dd__stage">
              <p-avatar label="AE" shape="circle" />
            </div>
            <p class="dd__why">{{ m.initialsWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the full name, once</span>
            <div class="dd__stage">
              <p-avatar label="AE" shape="circle" role="img" ariaLabel="Ada Example" />
            </div>
            <p class="dd__why">{{ m.initialsDoWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a click handler on the avatar</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ clickBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.clickWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a real link, the avatar inside it</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ clickGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.clickDoWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an overlapping group of people who each matter</span>
            <div class="dd__stage">
              <p-avatar-group role="img" aria-label="Reviewers">
                <p-avatar label="AE" />
                <p-avatar label="GH" />
                <p-avatar label="KJ" />
              </p-avatar-group>
            </div>
            <p class="dd__why">{{ m.groupWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a list with names</span>
            <div class="dd__stage">
              <ul class="people" aria-label="Reviewers">
                <li><p-avatar label="AE" shape="circle" aria-hidden="true" /> Ada Example</li>
                <li><p-avatar label="GH" shape="circle" aria-hidden="true" /> Grace Hopkins</li>
                <li><p-avatar label="KJ" shape="circle" aria-hidden="true" /> Kay Jensen</li>
              </ul>
            </div>
            <p class="dd__why">{{ m.groupDoWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          All six cells are live or quote the markup they describe. The overlap in the first group is the stylesheet's
          <code>-0.75rem</code> inline margin at the default size; the square shape follows the visual style's radius.
        </p>

        <h3>Sources</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-avatar.mjs</code> and <code>openng-optimus-ui-avatargroup.mjs</code> (Optimus UI
            2.0.2) — every input, host binding, and template branch cited here.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-styles/dist/avatar/index.mjs</code> — the box, the image sizing, and the group
            overlap; <code>&#64;openng/optimus-ui-themes/dist/aura/avatar/index.mjs</code> — the token defaults.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#img" rel="noopener noreferrer" target="_blank">WAI-ARIA 1.2,
              img role</a>
            — why <code>role="img"</code> can carry a name and hides its children.
          </li>
          <li>
            <a href="https://www.w3.org/TR/html-aam-1.0/" rel="noopener noreferrer" target="_blank">HTML-AAM</a>
            — autonomous custom elements map to <code>generic</code>, which may not be named.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html" rel="noopener noreferrer"
              target="_blank">WCAG 2.2 SC 1.1.1</a>
            — every picture needs a text alternative or must be marked decorative.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/images/decorative/" rel="noopener noreferrer" target="_blank"
              >W3C Images Tutorial, decorative images</a>
            — when an image next to its own caption is decoration.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura value</th><th>Resolves to</th></tr>
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
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/avatar/index.mjs</code>; semantic resolutions from
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (stock slate light, zinc dark).
        </p>

        <h3>Corner radius per visual style</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Style</th><th><code>border.radius.md</code></th><th>Square avatar, 2rem</th></tr>
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
          <code>primitive.borderRadius</code> overrides per style in <code>src/app/services/ui-styles.ts</code>;
          <code>shape="circle"</code> sets <code>border-radius: 50%</code> on the host and the image and ignores the
          style. No <code>html.style-*</code> block in <code>src/styles.scss</code> touches the avatar.
        </p>

        <h3>Contrast</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Pair</th><th>Light</th><th>Dark</th><th>Criterion</th></tr>
            </thead>
            <tbody>
              <tr><td>label text on avatar background</td><td>{{ m.crTextLight }}</td><td>{{ m.crTextDark }}</td><td>SC 1.4.3, 4.5:1</td></tr>
              <tr><td>avatar background on <code>--surface-card</code></td><td>{{ m.crBgCard }}</td><td>{{ m.crBgCardDark }}</td><td>{{ m.crBgNote }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The label pair is gated: the "avatar" rows of <code>docs/generated/CONTRAST.MD</code>
          (<code>avatar.color</code> on <code>avatar.background</code>, <code>#334155</code> on <code>#e2e8f0</code>;
          <code>#ffffff</code> on <code>#3f3f46</code>), the same in every visual style, recomputed on every build. The
          box against the card is informational and not gated — computed with the WCAG 2.2 formula against the werkbund
          card surfaces (<code>#ffffff</code>, <code>#1d1d21</code>).
        </p>

        <h3>The picture is stretched, not cropped</h3>
        <p>{{ m.stretch }}</p>
        <pre class="code-block"><code>{{ coverSnippet }}</code></pre>
        <p class="src-note">
          <code>.p-avatar img</code> sets <code>width: 100%; height: 100%</code> and nothing else in
          <code>&#64;openng/optimus-ui-styles/dist/avatar/index.mjs</code>; the <code>image</code> pass-through section is
          the <code>&lt;img&gt;</code> (<code>openng-optimus-ui-avatar.mjs:177</code>).
        </p>

        <h3>Narrow screens</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          The avatar sheet has no media or container query; <code>.p-avatar-group</code> is
          <code>display: flex</code> with no <code>flex-wrap</code>.
        </p>

        <h3>Motion</h3>
        <p>{{ m.motion }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>p-avatar inputs and output</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Type / default</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>label</code></td><td>string</td><td>{{ m.apiLabel }}</td></tr>
              <tr><td><code>icon</code></td><td>string (icon classes)</td><td>{{ m.apiIcon }}</td></tr>
              <tr><td><code>image</code></td><td>string (URL)</td><td>{{ m.apiImage }}</td></tr>
              <tr><td><code>size</code></td><td><code>'normal'</code> · <code>'large'</code> · <code>'xlarge'</code></td><td>{{ m.apiSize }}</td></tr>
              <tr><td><code>shape</code></td><td><code>'square'</code> · <code>'circle'</code></td><td>{{ m.apiShape }}</td></tr>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td>string</td><td>{{ m.apiAria }}</td></tr>
              <tr><td><code>styleClass</code></td><td>string</td><td>{{ m.apiStyleClass }}</td></tr>
              <tr><td><code>onImageError</code></td><td>output, <code>Event</code></td><td>{{ m.apiError }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared at <code>openng-optimus-ui-avatar.mjs:89-135</code>; <code>dt</code>, <code>pt</code> and
          <code>unstyled</code> are inherited from <code>BaseComponent</code>. Pass-through sections:
          <code>host</code>, <code>root</code>, <code>label</code>, <code>icon</code>, <code>image</code>.
        </p>

        <h3>p-avatar-group</h3>
        <p>{{ m.apiGroup }}</p>
        <p class="src-note">
          <code>openng-optimus-ui-avatargroup.mjs:62</code> — three selectors, two inputs, a template of
          <code>&lt;ng-content&gt;</code>. Its CSS lives in the avatar sheet, so the group has no styles until an avatar
          on the page has loaded them.
        </p>

        <h3>Fallback on a failed image</h3>
        <pre class="code-block"><code>{{ fallbackSnippet }}</code></pre>
        <p class="src-note">
          The label branch is checked first (<code>openng-optimus-ui-avatar.mjs:170</code>), so setting
          <code>label</code> after the error replaces the broken image without removing <code>image</code>.
        </p>

        <h3>Server rendering</h3>
        <p>{{ m.ssr }}</p>

        <h3>Checklist</h3>
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
        <h3>What the library contributes</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          The avatar template renders only your <code>label</code>; nothing is read from the Optimus translation
          configuration.
        </p>

        <h3>Initials do not travel</h3>
        <p>{{ m.i18nInitials }}</p>

        <h3>The name, translated</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The kit pattern: <code>TranslationService.translate()</code> inside a <code>computed</code>, which re-runs on a
          language switch.
        </p>

        <h3>Writing direction</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.1</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the label pair is cited from
            the gated CONTRAST.MD "avatar" rows.
          </li>
          <li><strong>1.0</strong> — 2026-09-23 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class AvatarArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Demo state: the image source is replaced by a malformed data URI. */
  readonly broken = signal(false);
  /** Set by onImageError; the template then renders the initials instead. */
  readonly failed = signal(false);

  toggleBroken(): void {
    const next = !this.broken();
    this.broken.set(next);
    this.failed.set(false);
  }

  /** Synthetic portrait, inline so no request leaves the page (PRIV-001). */
  readonly portraitUri: string = 'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
        '<rect width="64" height="64" fill="#475569"/>' +
        '<circle cx="32" cy="25" r="12" fill="#cbd5e1"/>' +
        '<path d="M10 64c0-13 10-21 22-21s22 8 22 21z" fill="#cbd5e1"/>' +
        '</svg>',
    );

  /** A data URI that cannot decode — fires the error event without a request. */
  readonly brokenUri: string = 'data:image/png;base64,AAAA';

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    groupName: 'Edited by Ada Example, Grace Hopkins, Kay Jensen, and 3 others',

    // usage — naming table
    useAdjacent:
      'The name is already in the tree as text. A second copy from the avatar is noise; initials would be spelled out letter by letter.',
    useAlone:
      'role="img" turns the generic host into an image that may carry a name, and makes its children presentational — the initials or the inner picture are not read twice.',
    useLink:
      'The link is the interactive element and takes its name from the visible name inside it. The avatar has no keyboard support, focus, or role of its own.',
    useGroup:
      'When the stack means one thing ("7 people edited this"), one name for the whole group says it. Members are presentational children of the image.',
    useList:
      'Overlap hides part of every avatar but the last, and a group has no list semantics. When each person counts, a list gives count, order, and a name per item.',

    // usage — do/don't
    initialsWhy:
      'Without a role or a name, the label span is plain text: a screen reader reads "A E", which is neither a name nor a hint that it stands for a person.',
    initialsDoWhy:
      'role="img" with ariaLabel announces "Ada Example, image" once. The initials stay visible and drop out of the tree as presentational children.',
    clickWhy:
      'p-avatar has no tabindex, no role, and no key handling: a mouse can click it, a keyboard cannot reach it, and a screen reader does not know it does anything.',
    clickDoWhy:
      'The anchor brings focus, Enter, the link role, and a name from the visible text; the avatar inside is hidden as decoration.',
    groupWhy:
      'Every avatar but the last is partly covered, and the one image name has to carry every person. Nobody can move from one reviewer to the next.',
    groupDoWhy:
      'A list announces how many reviewers there are and lets a screen reader step through them; the visible names make the initials decorative.',

    // design
    tokBg: '{surface.200} light (#e2e8f0), {surface.700} dark (#3f3f46)',
    tokFg: '{text.color}: {surface.700} light (#334155), {surface.0} dark (#ffffff)',
    tokRadius: '{border.radius.md} — per visual style, see the next table; circle ignores it',
    tokSize: 'width and height of the box; the image fills it at 100% by 100%',
    tokFont: 'label size; icons use avatar.icon.size (1rem · 1.5rem · 2rem)',
    tokGroupBorder: 'a 2px ring in {surface.0} light (#ffffff), {surface.900} dark (#18181b) — stock Aura, not the kit page ground',
    tokOffset: 'negative inline-start margin of every avatar after the first, per size',
    radWerkbund: 'a sharp square',
    radLern: 'a rounded square, close to a circle at this size',
    radSkizze: 'a rounded square',
    radBlau: 'a nearly sharp square',

    crTextLight: '8.40:1',
    crTextDark: '10.44:1',
    crBgCard: '1.23:1',
    crBgCardDark: '1.61:1',
    crBgNote: 'none — an avatar is not a control; informational',

    stretch:
      'The inner image is sized to the box in both directions with no object-fit, so a portrait that is not square is squashed, not cropped. Crop it at the source, or set object-fit: cover on the image through the pass-through section.',
    narrow:
      'No intrinsic responsive behavior. Avatar sizes are fixed rem values at every viewport; the group is a single flex row that never wraps and overflows its container when it runs out of width. Cap the visible count and end with a "+N" avatar, or switch to a list under your own breakpoint.',
    motion:
      'None. The avatar and group styles declare no transition and no animation, so nothing changes under prefers-reduced-motion.',

    // development
    apiLabel: 'Text in the box. Checked first: if set, icon and image are ignored.',
    apiIcon: 'Class list for an icon font span (the kit loads @openng/icons). The span has no aria-hidden.',
    apiImage: 'Rendered as <img [src]> with no alt attribute; bound only when label and icon are empty.',
    apiSize: 'Adds p-avatar-lg or p-avatar-xl; "normal" adds nothing.',
    apiShape: 'circle adds p-avatar-circle (50% radius on host and image).',
    apiAria:
      'Written onto the host, which has no role. ariaLabel is also written onto the inner <img> in the image branch — the only way that image gets a name.',
    apiStyleClass: 'Deprecated since v20.0.0 — use class.',
    apiError: 'Re-emits the <img> error event. No built-in fallback.',
    apiGroup:
      'A wrapper with the class p-avatar-group and nothing else: inputs styleClass and style, no role, no name, no count, no overflow logic. The "+N" avatar is one you write yourself. The overlap and the 2px ring come from rules in the avatar stylesheet that target .p-avatar-group .p-avatar.',
    ssr: 'Nothing browser-only: both components render complete on the server. The image error event fires only in the browser, so a fallback decided in onImageError appears after hydration.',

    checkName: 'Every avatar is either hidden next to a visible name or carries role="img" and a full-name ariaLabel.',
    checkRole: 'No ariaLabel on a host without a role — a generic element cannot be named.',
    checkInteractive: 'Clickable avatars sit inside a real <a> or <button>; never a (click) on p-avatar.',
    checkFallback: 'An image avatar handles onImageError by switching to a label.',
    checkGroup: 'A group is one image with one sentence, or it is a list — never a row of unnamed pictures.',
    checkData: 'Portraits and names in examples are synthetic (PRIV-001).',

    // i18n
    i18nLibrary:
      'Nothing. The avatar has no built-in strings and no entry in the Optimus translation configuration. The label, the name, and any "+N" count are yours, and so is their translation.',
    i18nInitials:
      'Two letters from a first and a last name is a Latin-script habit. Names with particles, one-word names, and non-Latin scripts do not reduce to it, and a screen reader spells initials out in the page language. Derive a label with care, keep it visual only, and let the accessible name be the full name. In Easy Language variants, show the name as text next to the avatar.',
    i18nRtl:
      'The group overlap uses margin-inline-start, so under dir="rtl" the stack runs from the right with the same overlap. The avatar itself has no directional rule.',
  };

  readonly anatomySnippet: string = '<!-- <p-avatar [image]="url" ariaLabel="Ada Example" shape="circle" /> renders: -->\n' +
    '<p-avatar class="p-avatar p-component p-avatar-image p-avatar-circle"\n' +
    '          aria-label="Ada Example" data-p="circle normal">\n' +
    '  <img src="…" aria-label="Ada Example" />   <!-- no alt attribute -->\n' +
    '</p-avatar>\n' +
    '<!-- no role on the host: the aria-label sits on a generic element -->';

  readonly clickBadSnippet: string = '<p-avatar label="AE" (click)="openProfile()" />';

  readonly clickGoodSnippet: string = '<a routerLink="/people/ada" class="person">\n' +
    '  <p-avatar label="AE" shape="circle" aria-hidden="true" />\n' +
    '  Ada Example\n' +
    '</a>';

  readonly coverSnippet: string = '<p-avatar [image]="url" shape="circle" aria-hidden="true"\n' +
    '          [pt]="{ image: { style: { \'object-fit\': \'cover\' } } }" />';

  readonly fallbackSnippet: string = 'readonly failed = signal(false);\n' +
    '\n' +
    '<p-avatar [image]="person.photo"\n' +
    '          [label]="failed() ? person.initials : undefined"\n' +
    '          role="img" [ariaLabel]="person.name"\n' +
    '          (onImageError)="failed.set(true)" />';

  readonly i18nSnippet: string = 'private readonly i18n = inject(TranslationService);\n' +
    'readonly editedBy = computed(() =>\n' +
    '  this.i18n.translate(this.keys.editedBy).replace("%names", this.names()),\n' +
    ');\n' +
    '\n' +
    '<p-avatar-group role="img" [attr.aria-label]="editedBy()"> … </p-avatar-group>';
}
