import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ChipModule } from '@openng/optimus-ui/chip';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { TagModule } from '@openng/optimus-ui/tag';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * The severities `p-tag` accepts, mirrored from `@openng/optimus-ui/types/tag`. Omitting
 * the input entirely is a seventh case and deliberately NOT in this union — it
 * falls back to the brand palette, which is a different thing from a severity.
 */
export type TagSeverity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    RouterLink,
    TagModule,
    ChipModule,
    SelectButtonModule,
    ButtonModule,
    ToggleSwitchModule,
    FormsModule,
  ];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      :host {
        display: block;
      }
      .lead {
        max-width: 46rem;
        line-height: 1.6;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-5);
      }
      h3 {
        margin: 1.5rem 0 0.6rem;
        font-size: 1.05rem;
        color: var(--text-color);
      }
      h4 {
        margin: 1.2rem 0 0.5rem;
        font-size: 0.95rem;
        color: var(--text-color);
      }
      p,
      li {
        line-height: 1.6;
        color: var(--text-color);
      }
      ul {
        padding-left: 1.4rem;
        margin: 0 0 1rem;
      }
      li {
        margin: 0.35rem 0;
      }
      kbd {
        font-family: var(--font-mono);
        font-size: 0.8em;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-bottom-width: 2px;
        border-radius: var(--radius-sm);
        padding: 0.05em 0.4em;
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      .src-note {
        max-width: 46rem;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0.4rem 0 1.2rem;
      }
      .rule-line {
        max-width: 46rem;
        margin: 0 0 var(--space-4);
        padding: var(--space-4);
        border-left: 3px solid var(--primary-color-fg);
        background: var(--surface-section);
        border-radius: var(--radius-md);
        font-size: 1.05rem;
      }
      .mono {
        font-family: var(--font-mono);
        font-size: 0.78rem;
      }
      .fail {
        color: var(--semantic-red-fg);
        font-weight: var(--font-weight-medium);
      }

      /* --- Playground --- */
      .pg {
        margin: 0 0 var(--space-6);
        padding: var(--space-5);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .pg__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-5);
      }
      .pg__controls {
        border: 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .pg__controls legend {
        padding: 0;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        margin-bottom: var(--space-1);
      }
      .pg__field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .pg__label,
      .pg__field label {
        font-size: 0.85rem;
        color: var(--text-color);
        font-weight: var(--font-weight-medium);
      }
      /* Seven severities do not fit one half-width row; wrap the segments instead
         of letting them shrink and clip their labels ("seconda", "succes"). */
      .pg__field p-selectbutton {
        flex-wrap: wrap;
      }
      .pg__field--switch {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .pg__field--switch label {
        flex: 1;
      }
      .pg__preview-wrap {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .pg__preview-label,
      .pg__code-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .pg__hint {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .pg__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        min-height: 5rem;
        padding: var(--space-4);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      @media (max-width: 760px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Examples --- */
      .ex {
        margin: 0 0 var(--space-6);
      }
      .ex__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-1);
      }
      .ex__title {
        margin: 0;
        font-size: 1rem;
      }
      .ex__note {
        margin: 0 0 var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .ex__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--space-4);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .ex__stage--column {
        flex-direction: column;
        align-items: stretch;
      }
      .sev {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-1);
      }
      .sev__caption {
        font-size: 0.72rem;
        color: var(--text-color-secondary);
      }

      .card-demo {
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-card);
      }
      .card-demo__head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: var(--space-3);
        margin-bottom: var(--space-2);
      }
      .card-demo__title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: var(--font-weight-medium);
      }
      .card-demo__tags,
      .card-demo__chips {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-2);
      }
      .card-demo__body {
        margin: var(--space-2) 0 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .card-demo__empty {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }

      /* --- Do / Don't --- */
      .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .dd__cell {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }
      .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg, #15803d);
      }
      .dd__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
      }
      .dd__why {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }
      .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }
      .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg, #15803d) 16%, transparent);
        color: var(--semantic-green-fg, #15803d);
      }
      /* The Don't example is deliberately a tag wearing a button's clothes. */
      .fake-button {
        cursor: pointer;
      }
      .fake-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      @media (max-width: 640px) {
        .dd {
          grid-template-columns: 1fr;
        }
      }

      .checklist {
        list-style: none;
        padding-left: 0;
      }
      .checklist li {
        margin: 0.3rem 0;
      }

      .copy-btn {
        appearance: none;
        flex: 0 0 auto;
        padding: 0.35rem 0.8rem;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: var(--font-weight-medium);
        color: var(--primary-color-fg);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: border-color 0.15s ease;
      }
      .copy-btn:hover {
        border-color: var(--primary-color-fg);
      }
      .copy-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .code-block {
        margin: 0 0 var(--space-4);
        padding: var(--space-4);
        overflow-x: auto;
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        font-family: var(--font-mono);
        font-size: 0.82rem;
        line-height: 1.55;
        color: var(--text-color);
      }
      .table-wrap {
        overflow-x: auto;
        margin: 0 0 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      th,
      td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
        vertical-align: top;
      }
      th {
        color: var(--text-color-secondary);
        font-weight: var(--font-weight-medium);
      }
      .sources a,
      .history strong {
        color: var(--primary-color-fg);
      }
      @media (prefers-reduced-motion: reduce) {
        .copy-btn {
          transition: none;
        }
      }
    `;

/**
 * Guide article: Tags and Chips (SPEC N5, Guides extension).
 *
 * One guide for two components that are constantly swapped for each other.
 * The subject is the LINE between them: `p-tag` is a read-only status or
 * category LABEL; `p-chip` is a compact representation of an OBJECT that can
 * carry a picture and can be removed. Everything else in here follows from
 * that line — including the two gray zones (clickable "filter chips" and
 * removable "tags") where the mix-up shows up most often.
 *
 * Claims this guide makes, with their provenance (Optimus UI 2.0.2; browser
 * measurements from the 21 pass are marked). Optimus ships Aura 2.x tokens, so
 * the Aura 3.0 shrink is undone and the 21 geometry carries again: tag 14px
 * text at 4/8px padding, chip label inherited (no chip.label token), remove
 * icon 16px, image 2rem. styleClass is back on p-tag as a @deprecated input.
 *   - p-tag renders NO accessibility semantics at all: the host template is
 *     `<span class="p-tag-icon">` + `<span class="p-tag-label">{{ value }}</span>`
 *     with no role, no aria-*, no tabindex (@openng/optimus-ui/fesm2022/openng-optimus-ui-tag.mjs,
 *     the inline template). `severity` only appends a class — `p-tag-success`,
 *     `p-tag-info`, … (the `classes.root` map at the top of the same file). It
 *     also writes `data-p="success"`, which is a styling hook, not an ARIA hook.
 *     Consequence: severity is COLOUR ALONE unless the value text says the same
 *     thing (WCAG 1.4.1).
 *   - p-chip DOES carry semantics, in one place and one place only: the remove
 *     control is `role="button"`, `tabindex="0"` (`-1` when disabled) with
 *     `aria-label` = `config.getTranslation(ARIA).removeLabel`, default the
 *     English literal `'Remove'` (@openng/optimus-ui/fesm2022/openng-optimus-ui-config.mjs:229). It
 *     is a global, not a per-call-site string: this kit feeds it from its i18n
 *     modules through `setTranslation` on every language switch.
 *   - The chip's remove KEYBOARD contract is `Enter` or `Backspace`
 *     (`onKeydown` in openng-optimus-ui-chip.mjs). `Space` — required by the APG button
 *     pattern for `role="button"` — and `Delete` do nothing (measured).
 *   - Removal is UNCONTROLLED: `close()` sets the component's own `visible`
 *     field to false, which the style hook turns into `display: none` on the
 *     host, and only THEN emits `onRemove`. The chip disappears whether or not
 *     the parent removes it from the model, and `visible` is not an @Input, so
 *     the parent cannot veto or restore it. (While the chip IS visible the hook
 *     evaluates to `false`, which Angular drops — measured: no `style`
 *     attribute is written at all.)
 *   - The chip HOST carries `[attr.aria-label]="label"` on an element with no
 *     role — measured in the accessibility tree as `generic` with that name, so
 *     the label is announced twice.
 *   - `severity="warning"` is a PrimeNG 17-era value; Optimus types severity as
 *     BadgeSeverity — 'warn' and five others, no 'warning'
 *     (openng-optimus-ui-types-badge.d.ts:29; Optimus has no TagSeverity type
 *     at all), so it matches nothing and falls back to the brand palette.
 *   - Severity contrast was measured in both themes, compositing the tag's own
 *     background over the first OPAQUE ancestor. Only the severity-less tag is
 *     chain-sensitive (its dark background is a 16% tint): 5.14 / 6.93 / 8.38
 *     over --surface-section / -card / -ground.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-tags-and-chips-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tags-and-chips'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two components, one recurring mistake. A <code>p-tag</code> is a
          <strong>label the system puts on something</strong> — a status, a state, a category. A <code>p-chip</code> is
          a <strong>compact stand-in for a thing</strong> — a person, a file, a filter the user added — which is why
          only the chip can carry a picture and only the chip can be removed. Everything below is a live control; the
          playground configures both side by side and writes out the markup.
        </p>

        <!-- Mini playground: two configurators, one for each component. -->
        <section class="pg" aria-label="Tag and chip playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure the tag</legend>

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
                <label for="pg-tag-rounded">Rounded</label>
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
                <span class="pg__preview-label">Preview</span>
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
                <span class="pg__code-label">Generated markup</span>
                <button type="button" class="copy-btn" (click)="copy('pg-tag', pgTagCode())">
                  {{ copiedId() === 'pg-tag' ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="code-block"><code>{{ pgTagCode() }}</code></pre>
            </fieldset>

            <fieldset class="pg__controls">
              <legend>Configure the chip</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-chip-removable">Removable</label>
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
                <label for="pg-chip-image">Image (wins over icon)</label>
                <p-toggleswitch
                  inputId="pg-chip-image"
                  [ngModel]="pgChipImage()"
                  (ngModelChange)="pgChipImage.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-chip-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-chip-disabled"
                  [ngModel]="pgChipDisabled()"
                  (ngModelChange)="pgChipDisabled.set($event)"
                />
              </div>

              <div class="pg__preview-wrap">
                <span class="pg__preview-label">Preview</span>
                <div class="pg__stage">
                  @if (pgChipVisible()) {
                    <p-chip
                      [label]="'Ada Lovelace'"
                      [icon]="pgChipIcon() && !pgChipImage() ? 'pi pi-user' : undefined"
                      [image]="pgChipImage() ? avatarDataUri : undefined"
                      [alt]="pgChipImage() ? 'Portrait of Ada Lovelace' : undefined"
                      [removable]="pgRemovable()"
                      [disabled]="pgChipDisabled()"
                      (onRemove)="pgChipVisible.set(false)"
                    />
                  } @else {
                    <p-button
                      label="Bring the chip back"
                      size="small"
                      [text]="true"
                      (click)="pgChipVisible.set(true)"
                    />
                  }
                </div>
                <p class="pg__hint">
                  Removing it hides the chip <em>and</em> tells the parent. The button above is the parent putting it
                  back — the chip cannot restore itself (see Development → "Removal is not controlled").
                </p>
              </div>

              <div class="ex__head">
                <span class="pg__code-label">Generated markup</span>
                <button type="button" class="copy-btn" (click)="copy('pg-chip', pgChipCode())">
                  {{ copiedId() === 'pg-chip' ? 'Copied' : 'Copy' }}
                </button>
              </div>
              <pre class="code-block"><code>{{ pgChipCode() }}</code></pre>
            </fieldset>
          </div>
        </section>

        <!-- The severity row: one tag per severity, in the Design tab's order. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Every severity, side by side</h3>
            <button type="button" class="copy-btn" (click)="copy('sev', severityCode)">
              {{ copiedId() === 'sev' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            All seven, in the order the Design tab's contrast table lists them. Note the first one: no
            <code>severity</code> at all is not "neutral" — it is the <em>brand</em>
            palette, so it changes with the color the reader picked in settings.
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
            <h3 class="ex__title">What a chip can carry</h3>
            <button type="button" class="copy-btn" (click)="copy('chipvariants', chipVariantsCode)">
              {{ copiedId() === 'chipvariants' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            Label, icon, image, remove control, disabled. The image and the remove control are the two things a
            <code>p-tag</code> cannot do — and they are the reason to reach for a chip.
          </p>
          <div class="ex__stage" id="chip-row">
            <p-chip label="Plain label" />
            <p-chip label="With icon" icon="pi pi-file" />
            <p-chip label="Ada Lovelace" [image]="avatarDataUri" alt="Portrait of Ada Lovelace" />
            @if (demoChipVisible()) {
              <p-chip label="Removable" [removable]="true" (onRemove)="demoChipVisible.set(false)" />
            } @else {
              <p-button label="Restore" size="small" [text]="true" (click)="demoChipVisible.set(true)" />
            }
            <p-chip label="Disabled" icon="pi pi-ban" [removable]="true" [disabled]="true" />
          </div>
          <pre class="code-block"><code>{{ chipVariantsCode }}</code></pre>
        </section>

        <!-- The two collections, next to each other. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">The same page, both jobs</h3>
            <button type="button" class="copy-btn" (click)="copy('both', bothCode)">
              {{ copiedId() === 'both' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            A card header states <em>what the system knows</em> about the item — tags. The filter bar shows
            <em>what the user added</em> and lets them take it back — chips. Reading the markup, you can tell which is
            which without seeing the screen.
          </p>
          <div class="ex__stage ex__stage--column">
            <div class="card-demo">
              <div class="card-demo__head">
                <h4 class="card-demo__title">Prompt Engineering für Einsteiger</h4>
                <div class="card-demo__tags">
                  <p-tag value="Draft" severity="warn" [rounded]="true" />
                  <p-tag value="Beginner" severity="info" [rounded]="true" />
                  <p-tag value="Updated" severity="success" [rounded]="true" icon="pi pi-check" />
                </div>
              </div>
              <p class="card-demo__body">
                Three states the reader did not choose and cannot remove. Each one is a word, not only a color.
              </p>
            </div>

            <div class="card-demo">
              <div class="card-demo__head">
                <span class="card-demo__title">Active filters</span>
              </div>
              <div class="card-demo__chips">
                @for (f of activeFilters(); track f.id) {
                  <p-chip [label]="f.label" [removable]="true" (onRemove)="dropFilter(f.id)" />
                }
                @if (activeFilters().length === 0) {
                  <span class="card-demo__empty">No filters — add some back:</span>
                }
                @if (activeFilters().length < allFilters.length) {
                  <p-button label="Reset filters" size="small" [text]="true" (click)="resetFilters()" />
                }
              </div>
              <p class="card-demo__body">
                Each chip is an object the user put there. Tab to one, press
                <kbd>Enter</kbd> — it goes. (Press <kbd>Space</kbd> and nothing happens; see Development.)
              </p>
            </div>
          </div>
          <pre class="code-block"><code>{{ bothCode }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>The line, in one sentence</h3>
        <p class="rule-line">
          <strong>A tag is something the system says about an item; a chip is an item.</strong>
        </p>
        <p>
          That single test settles almost every case. "Draft", "Beta", "3 errors", "Advanced" — the system's verdict,
          printed onto a card: <code>p-tag</code>. "Ada Lovelace", "report-q3.pdf", "Chapter: Prompting" — a thing the
          user picked, listed, and possibly taken back: <code>p-chip</code>. The two follow-up questions are mechanical:
          <em>can it carry a face?</em> and <em>can the user delete it?</em> Both are yes only for the chip.
        </p>

        <h3>Which one? The honest table</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>It represents</th>
                <th>Who put it there</th>
                <th>Interactive?</th>
                <th>Carries an image</th>
                <th>Color system</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-tag</code></td>
                <td>a status, a state, a category</td>
                <td>the system</td>
                <td><strong>no</strong> — no role, no tabindex, no handlers</td>
                <td>no (icon only, 12px)</td>
                <td><code>severity</code> × 6 + the brand default</td>
              </tr>
              <tr>
                <td><code>p-chip</code></td>
                <td>an object: a person, a file, a chosen filter</td>
                <td>usually the user</td>
                <td>only its <em>remove</em> control</td>
                <td><strong>yes</strong> — <code>image</code> + <code>alt</code>, 32px circle</td>
                <td>one neutral surface; no severities</td>
              </tr>
              <tr>
                <td><code>p-selectbutton</code></td>
                <td>a choice among options</td>
                <td>the user, by pressing</td>
                <td><strong>yes</strong>, and it is a real radio/checkbox group</td>
                <td>no</td>
                <td>selected / unselected</td>
              </tr>
              <tr>
                <td><code>p-togglebutton</code></td>
                <td>one independent on/off filter</td>
                <td>the user, by pressing</td>
                <td><strong>yes</strong>, with <code>aria-pressed</code></td>
                <td>no</td>
                <td>on / off</td>
              </tr>
              <tr>
                <td><code>p-button</code> (text / outlined)</td>
                <td>an action</td>
                <td>—</td>
                <td><strong>yes</strong></td>
                <td>no</td>
                <td>severities, as buttons</td>
              </tr>
              <tr>
                <td><code>p-badge</code> / <code>pBadge</code></td>
                <td>a count or a dot on another control</td>
                <td>the system</td>
                <td>no</td>
                <td>no</td>
                <td>severities</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is.</strong> Columns 4–6 are behavior read from the Optimus UI 2.0.2 sources in
          <code>node_modules</code> and checked against the rendered examples; columns 2–3 are the
          <em>editorial</em> rule this kit follows, not something the library enforces — nothing stops you from putting
          a <code>p-tag</code> on a user-created object. It will just be a label the user cannot take off.
        </p>

        <h3>The gray zone: "filter chips" are toggle buttons</h3>
        <p>
          The pill-shaped filter row that every product has — those are not chips and not tags. They are a
          <strong>group of toggles that happen to be pill-shaped</strong>. Whatever you render them with has to be
          focusable, has to say whether it is on, and has to react to <kbd>Space</kbd>. Neither <code>p-tag</code> nor
          <code>p-chip</code> does any of that, so the honest answer is <code>p-selectbutton</code> (or
          <code>p-togglebutton</code> for a single independent one) — see the
          <a routerLink="/dev/design/guide/button">Button guide</a> for the whole action family. Bolting
          <code>role="button"</code> and <code>tabindex="0"</code> onto a tag gets you a control that Chrome will focus
          and that keyboards will not operate, because there is no key handler underneath.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a tag pretending to be a filter button</span>
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
              The pattern as it is usually written: <code>role="button"</code>, <code>tabindex="0"</code> and
              <code>aria-pressed</code> bolted onto a tag — <em>without</em> key handlers, because they are a separate
              thing to remember. Focus one and press <kbd>Enter</kbd> or <kbd>Space</kbd>: nothing toggles, because a
              <code>p-tag</code> ships no key handling of its own. That is the cost of the pattern: every keyboard
              affordance is hand-written, and the moment one is forgotten the control is focusable but dead.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a real multi-select of toggles</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-filter-good-label">Media types</span>
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
              One import, no hand-rolled ARIA. Each option is a real button with
              <code>aria-pressed</code>, reachable and operable with the keyboard, and the pressed state is not carried
              by color alone.
            </p>
          </div>
        </div>
        <p class="src-note">
          <strong>Even the careful version of this pattern leaks.</strong> Write the two key handlers as well, and an
          <code>[attr.aria-label]</code> that tracks the state, and the control does toggle on both keys — the
          <code>aria-label</code> even works here, unlike on a <code>p-select</code>, precisely because the host carries
          an explicit <code>role="button"</code>. Two defects still survive that diligence, and both are typical rather
          than exotic. A <code>(keydown.space)</code> handler that does not call <code>preventDefault()</code> toggles
          <em>and</em> scrolls the page, because the tag is not a <code>&lt;button&gt;</code> and nothing suppresses the
          default. And the selected state usually ends up appended to the label — <code>value + ' ✓'</code> — which puts
          a state marker inside translated content and hands the screen reader a tick to read out instead of a pressed
          state. The argument against the pattern is therefore not "it is broken" but "it is seven hand-written
          attributes and handlers reimplementing what <code>p-selectbutton</code> ships, and it drifts."
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a removable tag (mouse only)</span>
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
                <p-button label="Reset" size="small" [text]="true" (click)="resetBad()" />
              }
            </div>
            <p class="dd__why">
              A click handler on a <code>p-tag</code> with a times icon — the shape an "active filter" row grows into
              when nobody asks which component it should have been. No <code>role</code>, no <code>tabindex</code>, no
              name: a keyboard user cannot clear the filter at all, and the ✕ is decoration rather than a button. The
              tag renders nothing focusable, so there is no ARIA to forget here — there is only the wrong component.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a removable chip</span>
            <div class="dd__stage">
              @for (f of ddRemovableGood(); track f) {
                <p-chip [label]="f" [removable]="true" (onRemove)="removeGood(f)" />
              }
              @if (ddRemovableGood().length === 0) {
                <p-button label="Reset" size="small" [text]="true" (click)="resetGood()" />
              }
            </div>
            <p class="dd__why">
              Kit convention for revocable filters, and one line shorter than the tag version. The ✕ is a real
              <code>role="button"</code> with <code>tabindex="0"</code> and a name. Two caveats you still own: the name
              comes from the library's own vocabulary and has to be fed from your i18n layer, and only <kbd>Enter</kbd> and
              <kbd>Backspace</kbd> work — not <kbd>Space</kbd>.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — severity as the whole message</span>
            <div class="dd__stage">
              <p-tag value="Kapitel 3" severity="danger" />
              <p-tag value="Kapitel 4" severity="success" />
              <p-tag value="Kapitel 5" severity="warn" />
            </div>
            <p class="dd__why">
              Three identical-looking labels in three colors. <code>severity</code> writes a CSS class and a
              <code>data-p</code> attribute — <strong>nothing reaches the accessibility tree</strong>. A screen reader
              hears "Kapitel 3, Kapitel 4, Kapitel 5"; so does anyone who cannot separate red from green.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — say it in the value</span>
            <div class="dd__stage">
              <p-tag value="Kapitel 3 · überfällig" severity="danger" icon="pi pi-exclamation-triangle" />
              <p-tag value="Kapitel 4 · fertig" severity="success" icon="pi pi-check" />
              <p-tag value="Kapitel 5 · läuft" severity="warn" icon="pi pi-clock" />
            </div>
            <p class="dd__why">
              The state is in the text, the color merely repeats it, and the icon gives a third channel. Now the tag
              survives grayscale, a screen reader, and a translated build.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a chip for a status</span>
            <div class="dd__stage">
              <p-chip label="Entwurf" />
              <p-chip label="Fortgeschritten" />
            </div>
            <p class="dd__why">
              Pricing, difficulty, deployment — three statuses if ever there were any — rendered as chips. They all come
              out the same neutral gray, so the severity scale is gone; and the call site then re-paints each one with
              an inline <code>[style]</code> object built in TypeScript, which is how a design system dies.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a tag with a severity</span>
            <div class="dd__stage">
              <p-tag value="Entwurf" severity="warn" [rounded]="true" />
              <p-tag value="Fortgeschritten" severity="info" [rounded]="true" />
            </div>
            <p class="dd__why">
              Same words, half the markup, and the color comes from the theme instead of an inline style — so it
              follows the reader's chosen palette and the kit's dark-mode contrast fix. Read the Design tab before
              picking the severity, though: two of them pass in light mode with almost no headroom.
            </p>
          </div>
        </div>

        <h3>Collections: how many is too many</h3>
        <ul>
          <li>
            <strong>Tags on a card: two or three.</strong> They compete with the title. Past three, the reader stops
            reading them and the card header wraps to a second line on a 360px screen.
          </li>
          <li>
            <strong>Chips in a filter bar: however many the user made</strong> — but wrap them, never scroll them
            horizontally, and give the row a <code>&lt;span&gt;</code> caption ("Active filters:") so the group has a
            name.
          </li>
          <li>
            <strong>Give a chip collection a "clear all" escape.</strong> Removing eight chips one <kbd>Enter</kbd> at a
            time is a chore, and each removal moves focus (see the Development tab).
          </li>
          <li>
            <strong>Do not sort a chip collection.</strong> The user added them in an order; re-ordering under their
            hands moves the ✕ they were aiming at.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — the criterion a bare <code>severity</code> fails: color must not be the only visual means of conveying
            information. This is the whole argument for putting the state into the tag's <code>value</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            — the 4.5:1 threshold the Design tab's severity table is measured against (tag text is 12px bold in Aura
            3.0, which does not reach the 18.66px "large text" exemption).
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — 24×24 CSS pixels. The reference for the chip's remove control, which Aura 2.x — the token set Optimus
            ships — sizes at <code>1rem</code> (16px).
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Button pattern</a
            >
            — "activated by <kbd>Enter</kbd> <em>and</em> <kbd>Space</kbd>". The contract the chip's
            <code>role="button"</code> remove control does not fully meet.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#generic" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, the <code>generic</code> role</a
            >
            — "the generic role … does not support the aria-label attribute". Why the chip host's
            <code>aria-label</code> is not a reliable name.
          </li>
          <li>
            <a href="https://optimus.openng.org/tag" target="_blank" rel="noopener noreferrer"> Optimus UI — Tag</a> and
            <a href="https://optimus.openng.org/chip" target="_blank" rel="noopener noreferrer">Chip</a>
            — the vendor API surface, checked against the shipped
            <code>node_modules/&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tag.mjs</code> and
            <code>openng-optimus-ui-chip.mjs</code> rather than taken on trust.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>Both components render their own host element, with no wrapper and no native control.</p>
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
                  <code>data-p</code> mirrors severity + rounded
                </td>
                <td>
                  <code>&lt;p-chip class="p-chip p-component"&gt;</code>, <code>aria-label</code> = the label,
                  <code>data-p="removable"</code>
                </td>
              </tr>
              <tr>
                <td>Icon</td>
                <td><code>span.p-tag-icon</code>, 0.625rem — rendered only when <code>icon</code> is set</td>
                <td><code>span.p-chip-icon</code>, 0.875rem</td>
              </tr>
              <tr>
                <td>Image</td>
                <td>—</td>
                <td>
                  <code>img.p-chip-image</code>, 2rem circle, pulled into the padding with a negative
                  <code>margin-inline-start</code> of <code>chip.padding.y</code>
                </td>
              </tr>
              <tr>
                <td>Label</td>
                <td><code>span.p-tag-label</code></td>
                <td><code>div.p-chip-label</code> (a block element inside an inline-flex box)</td>
              </tr>
              <tr>
                <td>Remove</td>
                <td>—</td>
                <td>
                  <code>svg.p-chip-remove-icon</code> (or a span with your icon class), <code>role="button"</code>,
                  <code>tabindex="0"</code>, <code>aria-label</code>
                </td>
              </tr>
              <tr>
                <td>Projection</td>
                <td colspan="2">
                  Both start with <code>&lt;ng-content&gt;</code>, so free content lands <em>before</em> the icon and
                  label.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the inline templates in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tag.mjs</code> and <code>openng-optimus-ui-chip.mjs</code>
          (Optimus UI 2.0.2, <code>node_modules/&#64;openng/optimus-ui/package.json</code>); DOM structure confirmed in
          the running app on 21 — the templates are unchanged in Optimus.
        </p>

        <h3>Geometry — tokens and measured boxes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th><code>p-tag</code></th>
                <th><code>p-chip</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size / weight</td>
                <td>0.875rem (14px) / <strong>700</strong></td>
                <td>
                  inherited (16px here) / normal — Aura 2.x has no <code>chip.label</code> token and the stylesheet has
                  no <code>.p-chip-label</code> rule
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
                <td>6px, or 12px with <code>[rounded]</code></td>
                <td>16px, always</td>
              </tr>
              <tr>
                <td>icon size</td>
                <td>0.75rem (12px)</td>
                <td>1rem (16px)</td>
              </tr>
              <tr>
                <td><strong>height</strong></td>
                <td>
                  <strong>{{ M.tagHeight }}</strong>
                </td>
                <td>
                  <strong>{{ M.chipHeight }}</strong>
                </td>
              </tr>
              <tr>
                <td>with an image</td>
                <td>—</td>
                <td>
                  <strong>{{ M.chipImageHeight }}</strong> (2rem avatar + half padding)
                </td>
              </tr>
              <tr>
                <td>remove control box</td>
                <td>—</td>
                <td>
                  <strong>{{ M.removeIconBox }}</strong> — the 1rem token, with no padding around it
                </td>
              </tr>
              <tr>
                <td>transition</td>
                <td>none declared</td>
                <td>
                  none on the chip itself; 0.2s on the <em>remove control's</em> <code>outline-color</code> and
                  <code>box-shadow</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and values from <code>&#64;openng/optimus-ui-themes/dist/aura/tag/index.mjs</code> and
          <code>&#8230;/aura/chip/index.mjs</code> (<code>--p-tag-*</code> / <code>--p-chip-*</code>). Heights are
          computed style on rendered controls at a 16px root font, before any visual-style border: every style block in
          <code>styles.scss</code> (<code>html.style-&lt;name&gt; .p-tag</code>) gives the tag an outline border in
          <code>--style-outline</code> and its own radius, which adds to the height. <strong>The two numbers that
          matter:</strong> a chip is roughly a third taller than a tag, so mixing them in one row looks like a mistake
          even when it isn't; and the remove
          control's {{ M.removeIconBox }} box is well under the 24×24 CSS pixels of WCAG 2.2 SC 2.5.8 —
          {{ M.removeSpacingNote }}
        </p>

        <h3>Severity: color, and only color</h3>
        <p>
          <code>severity</code> appends one class (<code>p-tag-success</code>, …) and writes <code>data-p</code>. That
          is the entire mechanism — verified in the <code>classes.root</code> map at the top of
          <code>openng-optimus-ui-tag.mjs</code>, which is a plain object of class-name predicates with no attribute output. There
          is no <code>role="status"</code>, no <code>aria-label</code>, no hidden text. Whatever the color means, the
          <code>value</code> has to say it too.
        </p>
        <p>
          A tag with <strong>no</strong> <code>severity</code> is not neutral either: the base <code>.p-tag</code> rule
          paints it from <code>tag.primary.*</code>, i.e. the <em>brand</em> palette, which this kit lets the reader
          change (<code>THEME_COLORS</code> in <code>theme.service.ts</code> ships ten). A default tag is therefore a
          different color for different readers — fine for "featured", wrong for anything that means a specific state.
        </p>

        <h4>Contrast, both themes</h4>
        <p>
          Text on 14px <strong>bold</strong> is not "large text" under WCAG (that starts at 18.66px bold), so the bar is
          <strong>4.5:1</strong>. Measured on one tag per severity, compositing each background down the ancestor chain
          — which matters, because Aura's dark severities are <code>color-mix(&#8230;, transparent 84%)</code> and only
          look right over the surface they happen to sit on. Where a range is given, it is the span across this kit's
          three dark surfaces; the exact compositing rule is spelled out under the table, because a contrast figure
          without its method is not a measurement.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>severity</th>
                <th>Light — colors</th>
                <th>Light</th>
                <th>Dark — colors</th>
                <th>Dark</th>
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
                <td><code>p-chip</code> (no severities)</td>
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
          <strong>The method, because this number is method-sensitive.</strong> Read the resolved
          <code>background-color</code> of the tag, walk the ancestor chain compositing until an opaque background is
          found, and apply the WCAG relative-luminance formula against <em>that</em>. Repeat per theme, and let the swap
          settle before reading — values taken in the same tick as a theme change still describe the old theme.
          {{ M.contrastNote }}
        </p>

        <h4>The kit patches five of them, and two cases fall through</h4>
        <p>
          The kit's <code>styles.scss</code> carries five <code>!important</code> overrides under
          <code>.dark-theme .p-tag.p-tag-*</code> that replace Aura's dark tints with saturated 700-shade backgrounds
          and white text, for <code>success</code>, <code>info</code>, <code>warn</code>, <code>danger</code> and
          <code>secondary</code>. Its own comment justifies them with untreated tints of "3.9-4.4:1".
          {{ M.overrideNote }}
        </p>
        <p class="src-note">
          What the five rules do not cover: a <code>p-tag</code> with no <code>severity</code>, and
          <code>severity="contrast"</code>. The severity-less case is not hypothetical — it arrives by accident whenever
          a call site forgets the input, or passes <strong><code>'warning'</code></strong
          >, a PrimeNG 17-era value. Optimus still tests <code>severity === 'warn'</code> and nothing else (the
          <code>classes.root</code> map in <code>openng-optimus-ui-tag.mjs</code>), so <code>'warning'</code> matches no class and
          the tag silently renders in the brand palette instead of orange. It is a typo the type system cannot catch
          when the value arrives from a method whose return type still declares the old union — worth a grep in any
          codebase that came through a v17 upgrade.
        </p>

        <h3>The chip has no severity scale — and that is the point</h3>
        <p>
          Aura gives the chip exactly one color pair per theme (<code>{{ '{' }}surface.800{{ '}' }}</code> on
          <code>{{ '{' }}surface.100{{ '}' }}</code> in light, <code>{{ '{' }}surface.0{{ '}' }}</code> on
          <code>{{ '{' }}surface.800{{ '}' }}</code> in dark) and no variants. That is a deliberate
          design, not a gap: a chip stands for an <em>object</em>, and objects do not have severities. When you catch
          yourself wanting a red chip, you wanted a tag.
        </p>
        <p>
          What a codebase does instead, once it has decided a chip must be red, is bind an inline
          <code>[style]</code> object from a <code>get&#8230;ChipStyle()</code> method. Those colors are computed in
          TypeScript: they bypass the theme entirely, they do not follow the dark-mode switch, and they multiply — one
          method per attribute, one attribute per card. This kit's catalog is where it happened here.
        </p>
        <p class="src-note">
          If a chip really must carry a color, the cheap escape is
          <code>styleClass</code> plus a CSS rule reading <code>--primary-*</code> custom properties, <em>with</em> a
          <code>.dark-theme</code> counterpart — that at least follows the theme. It is still the wrong
          <em>component</em> for a status; it is just not also a theme bypass.
        </p>

        <h3>Focus and motion</h3>
        <ul>
          <li>
            <strong>Only the chip's remove control is focusable</strong>, and it wears the kit's one focus ring — the
            ring every focusable Optimus part wears, replacing Aura's 1px <code>focus.ring</code>: {{ M.focusRing }}
          </li>
          <li>
            <strong>The ring is drawn with <code>outline</code> on a circle</strong> (<code>border-radius: 50%</code>),
            so it hugs the icon. At {{ M.removeIconBox }} plus offset, it is small but visible.
          </li>
          <li>
            <strong>Nothing else animates.</strong> The chip transitions <code>outline-color</code> and
            <code>box-shadow</code> only; the tag has no transition at all. Removal is instant (<code
              >display: none</code
            >), with no exit animation to respect <code>prefers-reduced-motion</code> — if you want one, you own it.
          </li>
        </ul>

        <h3>Narrow screens</h3>
        <p>
          Neither component has responsive behavior: both are inline-flex, keep their size at every viewport, and never
          truncate — a long value or label simply makes the pill wider. Reflow belongs to the row you put them in: give
          it <code>display: flex; flex-wrap: wrap</code> and a <code>gap</code>, so a tag row or a filter-chip bar wraps
          to a second line at 360px instead of scrolling or pushing the card wider.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 1.4.3 for the four state severities, clearing 4.5:1 in both themes (light
          4.52–5.30, dark 5.02–6.47, independent of style and accent); and SC 2.4.7 for the chip's remove
          control, whose ring is the kit's 2px ring at 2px offset, visible in both themes and gated on the chip (4.73:1
          and up). <strong>Failing:</strong> SC 1.4.1
          — severity is color and nothing else, measured as a bare static-text node with no role and no name, so the
          state has to be in the value as well; SC 2.5.8 — the remove control is a 16×16px box (Aura 2.x
          <code>chip.removeIcon.size</code> 1rem) against the 24×24 floor, and a tight row loses the spacing exemption on top of that; and SC 2.4.3 — after a
          removal the focus is measured on the document body rather than anywhere near the chip that went away.
          SC 1.4.3 also holds for the severity-less (every accent, 7.62:1 and up), <code>secondary</code> and
          <code>contrast</code> tags and for the chip (gated, see the table). <strong>Conditional:</strong> SC 4.1.2
          for the remove control, which is a
          real button with a name and a tab stop, but whose handler answers only Enter and Backspace, so Space does
          nothing and the announced role's contract is not met. <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Two separate entry points, each exporting one standalone component. Neither is a
          <code>ControlValueAccessor</code> and neither takes part in forms — they are display components with, in the
          chip's case, one event.
        </p>

        <h3><code>p-tag</code> — the whole API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>string</td>
                <td>The text. Rendered into <code>span.p-tag-label</code>.</td>
              </tr>
              <tr>
                <td><code>severity</code></td>
                <td><code>BadgeSeverity</code> = <code>'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'</code></td>
                <td>Appends one class. Omit it and you get the brand palette.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>string</td>
                <td>
                  Class of an icon font glyph, e.g. <code>pi pi-check</code>. Rendered <code>aria-hidden</code>-less but
                  also role-less, so it is invisible to AT either way.
                </td>
              </tr>
              <tr>
                <td><code>rounded</code></td>
                <td>boolean</td>
                <td>
                  Swaps 6px for 12px radius. <code>booleanAttribute</code>-transformed, so <code>rounded</code> bare
                  works.
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Deprecated, not removed:</strong> <code>styleClass</code> — PrimeNG 22 dropped it; Optimus
                  keeps the v21 input, marked <code>&#64;deprecated</code> since v20, and it still reaches the host
                  (<code>[class]="cn(cx('root'), styleClass)"</code>). Use plain <code>class</code> anyway.
                </td>
              </tr>
              <tr>
                <td><code>&lt;ng-template #icon&gt;</code></td>
                <td>template</td>
                <td>
                  Replaces the icon span. The only content slot (direct child — the query is
                  <code>&#123; descendants: false &#125;</code>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          That is the complete surface: <strong>five inputs (one deprecated), zero outputs, no methods</strong> — the
          <code>#icon</code> row above is a content slot, not an input. If a requirement needs anything else — a click,
          a state, a name — it is not a tag.
        </p>

        <h3><code>p-chip</code> — the whole API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Type</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>label</code></td>
                <td>string</td>
                <td>The text — and, verbatim, the host's <code>aria-label</code>.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>string</td>
                <td>
                  Icon class. Ignored when <code>image</code> is set (the template is an <code>*ngIf/else</code>).
                </td>
              </tr>
              <tr>
                <td><code>image</code></td>
                <td>string</td>
                <td>An <code>&lt;img src&gt;</code>, rendered as a 2rem circle.</td>
              </tr>
              <tr>
                <td><code>alt</code></td>
                <td>string</td>
                <td>
                  The image's alt text. <strong>Always set it</strong> — it is empty by default, which makes the avatar
                  an unnamed image.
                </td>
              </tr>
              <tr>
                <td><code>removable</code></td>
                <td>boolean</td>
                <td>Renders the remove control. Read "Removal is not controlled" below before using it.</td>
              </tr>
              <tr>
                <td><code>removeIcon</code></td>
                <td>string</td>
                <td>Icon class for the remove control instead of the built-in times-circle SVG.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  Adds <code>p-disabled</code> and sets the remove control's <code>tabindex</code> to <code>-1</code>.
                  It does <strong>not</strong> add <code>aria-disabled</code>, and the click handler still fires.
                </td>
              </tr>
              <tr>
                <td><code>chipProps</code></td>
                <td>object</td>
                <td>
                  Bulk-set the above from one object. Assigns onto private <code>_</code>-prefixed fields in the setter
                  and mirrors a subset in <code>ngOnChanges</code> — an odd, partly-redundant path; prefer explicit
                  inputs.
                </td>
              </tr>
              <tr>
                <td><code>(onRemove)</code></td>
                <td><code>MouseEvent | KeyboardEvent</code></td>
                <td>Fired <em>after</em> the chip hid itself.</td>
              </tr>
              <tr>
                <td><code>(onImageError)</code></td>
                <td><code>Event</code></td>
                <td>The avatar failed to load — swap to an icon or initials.</td>
              </tr>
              <tr>
                <td><code>&lt;ng-template #removeicon&gt;</code></td>
                <td>template</td>
                <td>
                  Replaces the remove glyph. The wrapper keeps <code>role="button"</code>, the tabindex and the
                  aria-label, so this is safe.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Members read from the <code>Chip</code> and <code>Tag</code> classes in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-chip.mjs</code> / <code>openng-optimus-ui-tag.mjs</code>, with the host bindings taken
          from each component's <code>host:</code> block rather than from the docs.
        </p>

        <h3>Removal is not controlled</h3>
        <p>This is the one thing to know before you ship a removable chip. The handler is three lines:</p>
        <pre class="code-block"><code>{{ closeSnippet }}</code></pre>
        <p>Three consequences follow:</p>
        <ul>
          <li>
            <strong>You cannot veto a removal.</strong> The chip is already hidden by the time
            <code>onRemove</code> reaches you, so "are you sure?" flows are impossible without re-rendering the chip
            yourself.
          </li>
          <li>
            <strong>It hides, it does not unmount.</strong> <code>visible: false</code> becomes an inline
            <code>display: none</code> via the style hook — the element stays in the DOM. (The hook is
            <code>display: !instance.visible &amp;&amp; 'none'</code>, which yields the value <code>false</code> while
            the chip is visible; Angular drops falsy style values, so nothing is written — measured, a visible chip
            carries no <code>style</code> attribute at all.) If your parent <em>also</em> removes the item from its
            list, the whole node goes; if it forgets, you get an invisible chip that keeps its
            <code>aria-label</code> in the tree. Always drive the collection from your own model and let
            <code>&#64;for</code> do the removing.
          </li>
          <li>
            <strong>Re-showing takes a new component.</strong> <code>visible</code> is a plain field, not an
            <code>@Input</code>, so the parent cannot set it back. Add the item back to the model and let
            <code>&#64;for</code> create a fresh chip — which is what the "Restore" buttons in the Examples tab do.
          </li>
        </ul>
        <pre class="code-block"><code>{{ collectionSnippet }}</code></pre>

        <h3>Theming with CSS custom properties</h3>
        <p>
          Every token is exposed as <code>--p-tag-*</code> / <code>--p-chip-*</code> and geometry passes through
          cleanly. Color is where the kit intervenes: the five dark-mode <code>!important</code> tag rules in
          <code>styles.scss</code> beat any custom property you set. Scope overrides to a class, never globally.
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix is set in <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). A caveat worth knowing: Optimus injects a component's token block the first time that component renders,
          so <code>--p-chip-*</code> reads back as an empty string on a page with no chip on it — measured, and a real
          trap when you probe tokens from the console.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>What the accessibility tree actually receives</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Measured role / name</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;p-tag severity="success" value="Verfügbar"&gt;</code></td>
                <td>{{ M.a11yTag }}</td>
                <td>
                  <strong>Text only.</strong> The severity is not in the tree in any form — neither role, nor state, nor
                  description.
                </td>
              </tr>
              <tr>
                <td><code>&lt;p-chip label="Kapitel 3"&gt;</code> host</td>
                <td>{{ M.a11yChipHost }}</td>
                <td>{{ M.a11yChipHostVerdict }}</td>
              </tr>
              <tr>
                <td>the chip's remove control</td>
                <td>{{ M.a11yRemove }}</td>
                <td>
                  <strong>A real button</strong> — named from the library's own vocabulary, not from your call site (see the
                  I18n tab).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the accessibility tree with uninteresting nodes included — a
          <code>p-tag</code> is exactly the kind of node a filtered snapshot drops, so an "interesting only" view will
          show you nothing and let you conclude the wrong thing.
          {{ M.a11yNote }}
        </p>

        <h4>Keyboard — measured, key by key</h4>
        <p>
          The tag has no keyboard behavior to test: nothing in it is focusable. For the chip's remove control, with the
          control focused:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Result</th>
                <th>Expected by the APG button pattern</th>
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
          The mechanism is one method in <code>openng-optimus-ui-chip.mjs</code>:
          <code>onKeydown(e) &#123; if (e.key === 'Enter' || e.key === 'Backspace') this.close(e); &#125;</code>.
          <kbd>Space</kbd> is not in it, so a <code>role="button"</code> element silently fails the pattern it declares
          — and because the element is an <code>&lt;svg&gt;</code>, not a <code>&lt;button&gt;</code>, the browser adds
          nothing back.
          {{ M.keyboardNote }}
        </p>

        <h4>Focus after removal</h4>
        <p>
          {{ M.focusAfterRemove }} Whatever the browser does with it, the fix is yours: after <code>onRemove</code>,
          move focus deliberately — to the next chip, or to the group's caption if the list is now empty.
        </p>
        <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

        <h4>Known gaps — do not paper over them silently</h4>
        <ul>
          <li>
            <strong>Severity is invisible to assistive technology.</strong> Not a bug you can fix with a wrapper — put
            the meaning in the <code>value</code>.
          </li>
          <li>
            <strong>The remove control's name defaults to the English literal "Remove"</strong> and is not reachable
            from the call site. Fixable globally; see the I18n tab.
          </li>
          <li>
            <strong><kbd>Space</kbd> does not activate the remove control</strong>, and there is no per-call-site
            workaround short of <code>&lt;ng-template #removeicon&gt;</code> plus your own key handler.
          </li>
          <li>
            <strong>The remove control is {{ M.removeIconBox }}</strong> — under SC 2.5.8's 24×24. On a phone, next to
            another chip, it is a genuinely hard target.
          </li>
          <li>
            <strong><code>[disabled]</code> on a chip is cosmetic</strong> plus a <code>tabindex="-1"</code>: no
            <code>aria-disabled</code>, and the click path is still live, so a mouse user can remove a "disabled" chip.
            Verified in the template — the <code>(click)="close($event)"</code> binding is not guarded by
            <code>disabled</code>.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            ☐ Applying the one-sentence test gives the component you actually used: is it a statement about an item, or
            an item?
          </li>
          <li>
            ☐ No <code>p-tag</code> in the file carries <code>(click)</code>, <code>role</code> or
            <code>tabindex</code>.
          </li>
          <li>
            ☐ Every tag's meaning survives grayscale — the state is in the <code>value</code>, not only in
            <code>severity</code>.
          </li>
          <li>
            ☐ The severity used is one of the five the kit patches for dark mode, or you have checked the contrast
            yourself.
          </li>
          <li>☐ Every <code>[image]</code> has a real <code>alt</code>.</li>
          <li>
            ☐ Removable chips are driven by a model + <code>&#64;for</code>, and <code>onRemove</code> updates that
            model.
          </li>
          <li>☐ Focus is moved explicitly after a removal.</li>
          <li>☐ A chip group has a visible caption, and a "clear all" if it can hold more than three.</li>
          <li>☐ No <code>[style]</code> object is repainting a chip or a tag per call site.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) pinning the two rules that regress most often — a tag that stays
          inert, and a removable chip whose parent owns the collection:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Your strings</h3>
        <ul>
          <li>
            <strong><code>value</code> and <code>label</code> are content.</strong> Bind them to the kit's
            <code>TranslationService</code>, and build any list of them in a <code>computed()</code> so a language
            switch re-renders — a plain field is captured once and freezes.
          </li>
          <li>
            <strong>A status word is not a status key.</strong> Tags usually render an enum (<code>draft</code>,
            <code>published</code>); translate through a key map, never by capitalizing the enum value.
          </li>
          <li>
            <strong><code>alt</code> is a string too.</strong> An avatar's alt text is as translatable as the label next
            to it.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>The library's own string: "Remove"</h3>
        <p>
          The chip's remove control names itself from
          <code>config.getTranslation(ARIA).removeLabel</code>, whose shipped default is the English literal
          <code>'Remove'</code>
          (<code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-config.mjs:229</code>). Nothing you write on a
          <code>&lt;p-chip&gt;</code> reaches it — it is a global, and it is the only library string either of these two
          components produces. Unlike the select's hard-coded trigger label, this one <em>is</em> reachable:
        </p>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Feed it, or ship English.</strong> A static <code>translation</code> block in
            <code>provideOptimus</code> covers a single-language app. This kit switches language at runtime, so it keeps
            the ARIA vocabulary in its own translation modules and pushes it into the <code>Optimus</code> config again on
            every switch — the
            same mechanism that names the tab strip's scroll chevrons.
          </li>
          <li>
            <strong>Merge, do not replace.</strong> <code>setTranslation</code> merges one level deep, so handing it a
            fresh <code>aria</code> object drops every key you did not list. Spread the current block first.
          </li>
          <li>
            <strong>Then check it.</strong> The name only shows up in the accessibility tree, so a wrong or missing
            translation is invisible on screen: read the remove button's name there, in a non-default language.
          </li>
        </ul>
        <p class="src-note">
          Read from the default translation object in <code>openng-optimus-ui-config.mjs</code> and the
          <code>removeAriaLabel</code> getter in <code>openng-optimus-ui-chip.mjs</code>.
        </p>

        <h3>Length: tags do not truncate, they grow</h3>
        <p>
          Neither component sets <code>white-space</code>, <code>overflow</code> or a max width, so a long translated
          value makes the box wider and, inside a constrained column, wraps to a second line. {{ M.wrapNote }} That is
          friendlier than the select's ellipsis, but it means
          <strong>a row of tags reflows when the language changes</strong>: German status words run 20–40% longer than
          English ("Veröffentlicht" vs "Published"), and a card header that fits three tags in English fits two in
          German.
        </p>
        <ul>
          <li>
            Let the container wrap (<code>display: flex; flex-wrap: wrap</code>) — never
            <code>overflow: hidden</code> on a tag row.
          </li>
          <li>Check the card header at 360px in the longest language you ship, not in English.</li>
          <li>Do not force a width on a tag; if the row must be one line, ship fewer tags.</li>
        </ul>

        <h3>RTL</h3>
        <p>
          The chip is written in logical properties throughout —
          <code>padding-inline</code>, <code>padding-block</code>, <code>margin-inline-start</code> on the avatar, and
          the <code>:has(.p-chip-remove-icon)</code> rule tightens <code>padding-inline-end</code> — so the avatar and
          the ✕ swap sides correctly under <code>direction: rtl</code>. The tag uses a plain
          <code>padding</code> shorthand, which is symmetric anyway. Nothing here needs per-call-site work.
        </p>
        <p class="src-note">
          Read from the shipped rules in
          <code>&#64;openng/optimus-ui-styles/dist/chip/index.mjs</code> and <code>&#8230;/tag/index.mjs</code>. Not verified by
          rendering an RTL locale — the kit ships none.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the chip's remove control
            wears the kit's one 2px ring, cited from the CONTRAST.MD "focus ring" row on the chip.
          </li>
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Every contrast row quoted from the gated CONTRAST.MD "tag" and
            "chip" rows; the "per style — measure" rows filled in (these colors are Aura's own scale, which the
            styles do not replace); the severity-less tag spans all ten accents.
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Contrast table split by what the visual styles (ADR-0016) change: the four state
            severities hold in every style; the severity-less, secondary, and contrast tags and the chip
            follow the accent or the style's surface scale and are marked "measure". Per-style tag
            borders noted; focus ring stated as <code>&#123;primary.color&#125;</code>; narrow-screen statement added;
            agent-doc pointer line restored to the standard wording; history ordered newest first.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Two v22 claims flipped:
            <code>styleClass</code> is not removed — Optimus keeps it as a <code>&#64;deprecated</code> input that still
            lands on the host, so <code>p-tag</code> has five inputs again; and there is no <code>TagSeverity</code>
            type, <code>severity</code> is typed <code>BadgeSeverity</code> (same six values). All geometry is back on
            Aura 2.x, re-read from
            <code>&#64;openng/optimus-ui-themes/dist/aura/tag/index.mjs</code> and its chip sibling: tag 14px/700 at 4/8px padding,
            icon 12px; chip 8/12px padding, 2rem image, 16px remove control, and no <code>chip.label</code> token at all
            — so the 21 height measurements stand unchanged and the SC 2.5.8 gap is 16×16, not 14×14. Line refs
            re-derived against the Optimus bundles (config <code>removeLabel</code> at :229).
          </li>
          <li>
            <strong>v0.5</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1.2 / Aura 3.0:
            <code>styleClass</code> removed from <code>p-tag</code> (four inputs now); geometry shrank across the board
            — tag 12px/700 at 2/6px padding, chip label an explicit 12px token, remove control down to 14×14px (further
            under SC 2.5.8); severity union, remove-keyboard contract (Enter/Backspace only), uncontrolled
            <code>close()</code> and the double-announced chip label all re-confirmed in the 22 source. Color
            measurements from 21 carry — the tag/chip color tokens are unchanged.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-07-30 — Rewritten to state findings rather than how they were found; call-site
            attributions replaced by generic patterns, and the "Remove" chapter rewritten around the translation
            mechanism that actually feeds it.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-29 — Corrected the severity-less dark contrast figure to 5.14/6.93/8.38
            across the three dark surfaces and stated the compositing rule; the tag has five inputs, not six.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide, written as one document because the two components are
            chosen wrongly as a pair: a live playground for both, four Do/Don't pairs, and a severity contrast table in
            both themes.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TagsAndChipsArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  /**
   * A 1x1-ish inline avatar. A data URI keeps the example self-contained: no
   * asset, no network request, and it still exercises the `image` code path
   * (which is what the guide is demonstrating).
   */
  readonly avatarDataUri: string = 'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
        '<rect width="32" height="32" fill="#334155"/>' +
        '<circle cx="16" cy="12" r="6" fill="#94a3b8"/>' +
        '<path d="M4 32c0-7 5.5-11 12-11s12 4 12 11z" fill="#94a3b8"/>' +
        '</svg>',
    );

  // --- Playground: tag ---------------------------------------------------------
  /** The exact union `p-tag` accepts — mirrored from @openng/optimus-ui/types/tag. */
  readonly severityOptions: { label: string; value: TagSeverity | 'none' }[] = [
    { label: 'none', value: 'none' },
    { label: 'secondary', value: 'secondary' },
    { label: 'success', value: 'success' },
    { label: 'info', value: 'info' },
    { label: 'warn', value: 'warn' },
    { label: 'danger', value: 'danger' },
    { label: 'contrast', value: 'contrast' },
  ];

  readonly pgSeverity = signal<TagSeverity | 'none'>('success');
  readonly pgRounded = signal(false);
  readonly pgTagIcon = signal(false);

  /** 'none' means: omit the input entirely and inherit the brand palette. */
  readonly pgSeverityInput = computed<TagSeverity | undefined>(() => {
    const s = this.pgSeverity();
    return s === 'none' ? undefined : s;
  });

  readonly pgTagValue = computed<string>(() => (this.pgSeverity() === 'none' ? 'Featured' : this.pgSeverity()));

  readonly pgTagCode = computed(() => {
    const attrs: string[] = [`value="${this.pgTagValue()}"`];
    if (this.pgSeverityInput()) attrs.push(`severity="${this.pgSeverityInput()}"`);
    if (this.pgRounded()) attrs.push('[rounded]="true"');
    if (this.pgTagIcon()) attrs.push('icon="pi pi-check-circle"');
    return `<p-tag ${attrs.join(' ')} />`;
  });

  // --- Playground: chip --------------------------------------------------------
  readonly pgRemovable = signal(true);
  readonly pgChipIcon = signal(false);
  readonly pgChipImage = signal(false);
  readonly pgChipDisabled = signal(false);
  readonly pgChipVisible = signal(true);

  readonly pgChipCode = computed(() => {
    const attrs: string[] = ['label="Ada Lovelace"'];
    if (this.pgChipImage()) attrs.push('[image]="avatarUrl"', 'alt="Portrait of Ada Lovelace"');
    else if (this.pgChipIcon()) attrs.push('icon="pi pi-user"');
    if (this.pgRemovable()) attrs.push('[removable]="true"', '(onRemove)="drop(person)"');
    if (this.pgChipDisabled()) attrs.push('[disabled]="true"');
    return `<p-chip\n  ${attrs.join('\n  ')} />`;
  });

  // --- Severity row (the Design tab's contrast table was measured here) --------
  readonly severityRow: { id: string; severity: TagSeverity | undefined; label: string; caption: string }[] = [
    { id: 'none', severity: undefined, label: 'Featured', caption: 'no severity — brand palette' },
    { id: 'secondary', severity: 'secondary', label: 'Draft', caption: 'secondary' },
    { id: 'success', severity: 'success', label: 'Published', caption: 'success' },
    { id: 'info', severity: 'info', label: 'Beginner', caption: 'info' },
    { id: 'warn', severity: 'warn', label: 'Review due', caption: 'warn' },
    { id: 'danger', severity: 'danger', label: 'Broken link', caption: 'danger' },
    { id: 'contrast', severity: 'contrast', label: 'New', caption: 'contrast' },
  ];

  // --- Do/Don't state ----------------------------------------------------------
  readonly ddFilterOptions = [
    { label: 'Video', value: 'video' },
    { label: 'Artikel', value: 'article' },
    { label: 'Podcast', value: 'podcast' },
  ];
  readonly ddBadFilters = signal<string[]>(['video']);
  readonly ddGoodFilters = signal<string[]>(['video']);

  toggleBadFilter(value: string): void {
    const current = this.ddBadFilters();
    this.ddBadFilters.set(current.includes(value) ? current.filter((v) => v !== value) : [...current, value]);
  }

  protected readonly removableSeed = ['Kapitel 3', 'Typ: Buch', 'Suche: KI'];
  readonly ddRemovableBad = signal<string[]>([...this.removableSeed]);
  readonly ddRemovableGood = signal<string[]>([...this.removableSeed]);

  removeBad(label: string): void {
    this.ddRemovableBad.set(this.ddRemovableBad().filter((f) => f !== label));
  }
  resetBad(): void {
    this.ddRemovableBad.set([...this.removableSeed]);
  }
  removeGood(label: string): void {
    this.ddRemovableGood.set(this.ddRemovableGood().filter((f) => f !== label));
  }
  resetGood(): void {
    this.ddRemovableGood.set([...this.removableSeed]);
  }

  // --- The "same page, both jobs" example --------------------------------------
  readonly allFilters: { id: string; label: string }[] = [
    { id: 'chapter', label: 'Kapitel 3' },
    { id: 'type', label: 'Typ: Buch' },
    { id: 'search', label: 'Suche: Prompting' },
  ];
  readonly activeFilters = signal<{ id: string; label: string }[]>([...this.allFilters]);

  dropFilter(id: string): void {
    this.activeFilters.set(this.activeFilters().filter((f) => f.id !== id));
  }
  resetFilters(): void {
    this.activeFilters.set([...this.allFilters]);
  }

  readonly demoChipVisible = signal(true);

  /**
   * Measured values, kept in one object so every number on the page has one
   * place to be corrected when the theme or the library moves. Color and tree
   * readings were measured on PrimeNG 21. Optimus ships Aura 2.x — the same
   * token values those measurements were taken against — so both the color
   * and the geometry entries carry unchanged.
   */
  readonly M = {
    // Heights were measured on 21 and stand: Optimus's Aura 2.x tokens are the
    // ones those boxes were rendered from. The remove box follows the
    // removeIcon token 1:1.
    tagHeight: '27px',
    chipHeight: '37px',
    chipImageHeight: '40px',
    removeIconBox: '16×16px',
    removeSpacingNote:
      'SC 2.5.8 lets spacing rescue an undersized target, but only if a 24px circle centered on ' +
      'it overlaps nothing else, so a tight chip row loses that exemption too. Measure your own gaps.',
    contrastNote:
      'Every row is gated: the "tag" and "chip" rows of docs/generated/CONTRAST.MD, recomputed ' +
      'on every build. The state severities, secondary, contrast and the chip read fixed Aura ' +
      'steps (Aura’s own slate/zinc scale — the visual styles do not replace it) or the kit’s ' +
      'dark 700-shade overrides, so one figure holds in every style. The severity-less tag ' +
      'follows the reader’s accent: its range spans ten accents, and in dark mode the 16% tint ' +
      'is composited over both page surfaces. Watch the units: the browser returns these as ' +
      'color(srgb … / 0.16), which a naive parser reads as fully opaque and overstates the ratio. ' +
      'Two light-mode margins are thin (warn 4.52, success 4.57), so a nudge to the palette ' +
      'breaks them.',
    overrideNote:
      'Recomputing Aura’s untreated dark tints from the token values (a 16% mix of the 500 shade ' +
      'under the 300-shade text) over dark surfaces gives ratios well above 4.5 on the surfaces ' +
      'this was checked on, so the quoted 3.9–4.4:1 is surface-specific. Keep the rules anyway: ' +
      'an opaque background is independent of whatever sits behind it, which is worth having on ' +
      'its own.',
    focusRing:
      '2px solid --primary-color-fg at 2px offset in both themes (src/styles.scss). The chip’s ' +
      '0.5rem padding keeps the ring on the chip, so it is measured there: the "focus ring" row on ' +
      'chip.background in docs/generated/CONTRAST.MD, 4.73–16.30:1 across every style, mode and accent.',
    a11yTag: 'StaticText "Published" — no wrapper node at all',
    a11yChipHost: 'generic, name "Ada Lovelace" — plus a StaticText "Ada Lovelace" inside it',
    a11yChipHostVerdict:
      'Announced twice. ARIA 1.2 says the generic role does not support aria-label; Chrome exposes ' +
      'it anyway, so the label lands both as the container’s name and as its text. Harmless-ish, ' +
      'but it means you cannot use label as a place to add extra context.',
    a11yRemove: 'button, name from Translation.aria.removeLabel (default "Remove")',
    a11yNote:
      'The tag result does not depend on the surrounding page: wherever it renders, the host ' +
      'carries no role, no aria-label, and no tabindex, and the tree receives StaticText and ' +
      'nothing else.',
    keyboardNote: 'The behavior is the component’s own, so it is the same wherever a removable chip appears.',
    focusAfterRemove:
      'Measured: with the remove control focused, pressing Enter leaves document.activeElement on ' +
      '<body> — the focus ring simply vanishes and the next Tab restarts from the top of the ' +
      'document.',
    wrapNote: 'Measured on both: white-space computes to normal and overflow to visible, with no max-width.',
  };

  readonly contrastRows: {
    sev: string;
    lightColors: string;
    light: string;
    lightFail: boolean;
    darkColors: string;
    dark: string;
    darkFail: boolean;
  }[] = [
    {
      sev: '(none)',
      lightColors: 'accent: {primary.700} on {primary.100}',
      light: '7.62–16.33',
      lightFail: false,
      darkColors: 'accent: {primary.300} on a 16% tint over ground / card',
      dark: '7.89–13.49',
      darkFail: false,
    },
    {
      sev: 'secondary',
      lightColors: '#475569 on #f1f5f9',
      light: '6.92',
      lightFail: false,
      darkColors: '#ffffff on #475569 (kit)',
      dark: '7.58',
      darkFail: false,
    },
    {
      sev: 'success',
      lightColors: '#15803d on #dcfce7',
      light: '4.57',
      lightFail: false,
      darkColors: '#ffffff on #15803d (kit)',
      dark: '5.02',
      darkFail: false,
    },
    {
      sev: 'info',
      lightColors: '#0369a1 on #e0f2fe',
      light: '5.17',
      lightFail: false,
      darkColors: '#ffffff on #0369a1 (kit)',
      dark: '5.93',
      darkFail: false,
    },
    {
      sev: 'warn',
      lightColors: '#c2410c on #ffedd5',
      light: '4.52',
      lightFail: false,
      darkColors: '#ffffff on #c2410c (kit)',
      dark: '5.18',
      darkFail: false,
    },
    {
      sev: 'danger',
      lightColors: '#b91c1c on #fee2e2',
      light: '5.30',
      lightFail: false,
      darkColors: '#ffffff on #b91c1c (kit)',
      dark: '6.47',
      darkFail: false,
    },
    {
      sev: 'contrast',
      lightColors: '#ffffff on #020617',
      light: '20.17',
      lightFail: false,
      darkColors: '#09090b on #ffffff',
      dark: '19.90',
      darkFail: false,
    },
  ];

  readonly chipContrast = {
    lightColors: '#1e293b on #f1f5f9',
    light: '13.35 ✓',
    lightFail: false,
    darkColors: '#ffffff on #27272a',
    dark: '14.89 ✓',
    darkFail: false,
  };

  readonly keyRows: { key: string; result: string; expected: string; fail: boolean }[] = [
    {
      key: 'Tab',
      result: 'Reaches the remove control (tabindex="0"); the chip body itself is never focused.',
      expected: 'Yes — a button is in the tab order.',
      fail: false,
    },
    {
      key: 'Enter',
      result: 'Removes the chip. Focus falls back to <body>.',
      expected: 'Activates. Focus management is the author’s job.',
      fail: false,
    },
    {
      key: 'Space',
      result: 'Nothing happens — and the page scrolls, because nothing calls preventDefault.',
      expected: 'Must activate. This is the one the pattern requires and the component omits.',
      fail: true,
    },
    {
      key: 'Backspace',
      result: 'Removes the chip, exactly like Enter.',
      expected: 'Not part of the button pattern — a bonus, not a substitute.',
      fail: false,
    },
    {
      key: 'Delete',
      result: 'Nothing happens.',
      expected: 'Not required, but the key most users try after Backspace.',
      fail: true,
    },
  ];

  // --- Code snippets -----------------------------------------------------------
  readonly severityCode: string = `<p-tag value="Featured" />                       <!-- brand palette -->
<p-tag value="Draft"       severity="secondary" />
<p-tag value="Published"   severity="success" />
<p-tag value="Beginner"    severity="info" />
<p-tag value="Review due"  severity="warn" />
<p-tag value="Broken link" severity="danger" />
<p-tag value="New"         severity="contrast" />`;

  readonly chipVariantsCode: string = `<p-chip label="Plain label" />
<p-chip label="With icon" icon="pi pi-file" />
<p-chip label="Ada Lovelace" [image]="avatarUrl" alt="Portrait of Ada Lovelace" />
<p-chip label="Removable" [removable]="true" (onRemove)="drop(item)" />
<p-chip label="Disabled" icon="pi pi-ban" [removable]="true" [disabled]="true" />`;

  readonly bothCode: string = `<!-- What the system says about the lesson: tags. -->
<div class="card-tags">
  <p-tag [value]="t('status.draft')" severity="warn" [rounded]="true" />
  <p-tag [value]="t('level.beginner')" severity="info" [rounded]="true" />
</div>

<!-- What the user added, and can take back: chips. -->
<span id="active-filters-label">{{ '{{' }} t('filter.active') {{ '}}' }}</span>
<div class="filter-chips" role="group" aria-labelledby="active-filters-label">
  @for (f of activeFilters(); track f.id) {
    <p-chip [label]="f.label" [removable]="true" (onRemove)="dropFilter(f.id)" />
  }
</div>`;

  readonly devImport: string = `import { TagModule } from '@openng/optimus-ui/tag';
import { ChipModule } from '@openng/optimus-ui/chip';

@Component({
  standalone: true,
  imports: [TagModule, ChipModule],
  // ...
})`;

  readonly closeSnippet: string = `// @openng/optimus-ui/fesm2022/openng-optimus-ui-chip.mjs
close(event) {
  this.visible = false;      // -> inline "display: none" via the style hook
  this.onRemove.emit(event); // -> your handler, AFTER the fact
}
onKeydown(event) {
  if (event.key === 'Enter' || event.key === 'Backspace') this.close(event);
}`;

  readonly collectionSnippet: string = `// The parent owns the collection; the chip only reports.
readonly filters = signal<Filter[]>([]);

dropFilter(id: string): void {
  this.filters.set(this.filters().filter((f) => f.id !== id));
}

// template
// @for (f of filters(); track f.id) {
//   <p-chip [label]="f.label" [removable]="true" (onRemove)="dropFilter(f.id)" />
// }`;

  readonly themingSnippet: string = `/* Scoped to one region — geometry travels, color is contested. */
.filter-bar {
  --p-chip-border-radius: 6px;      /* square off the pills */
  --p-chip-padding-y: 0.25rem;
  --p-chip-remove-icon-size: 1.25rem;
}

/* A tag scale for dense tables. */
.dense-table {
  --p-tag-font-size: 0.75rem;
  --p-tag-padding: 0.125rem 0.375rem;
}

/* Will NOT work in dark mode: styles.scss sets five severities under
   .dark-theme .p-tag.p-tag-* with !important. Change them there, or
   not at all. */
.dense-table { --p-tag-success-background: #0f5132; }`;

  readonly i18nSnippet: string = `// A status enum -> a translated tag. The map is a computed(), so a
// language switch rebuilds the labels instead of freezing them.
readonly statusLabels = computed<Record<LessonStatus, string>>(() => ({
  draft: this.i18n.translate('lesson.status.draft'),
  review: this.i18n.translate('lesson.status.review'),
  published: this.i18n.translate('lesson.status.published'),
}));

readonly statusSeverity: Record<LessonStatus, 'warn' | 'info' | 'success'> = {
  draft: 'warn', review: 'info', published: 'success',
};

// template
// <p-tag [value]="statusLabels()[lesson.status]"
//        [severity]="statusSeverity[lesson.status]" [rounded]="true" />`;

  readonly primengTranslationSnippet: string = `// Static, for a single-language app: app.config.ts
provideOptimus({
  theme: { preset: Aura, options: { prefix: 'p', darkModeSelector: '.dark-theme' } },
  translation: {
    // Names the chip's remove button. Default is the English literal 'Remove'
    // (openng-optimus-ui-config.mjs:229), read via Translation.aria.removeLabel.
    aria: { removeLabel: 'Entfernen' },
  },
});

// Runtime language switching: push the block again, and SPREAD it first —
// setTranslation merges one level deep, so a bare { aria: { … } } drops
// every key you did not list.
this.primeng.setTranslation({
  aria: {
    ...(this.primeng.translation.aria ?? {}),
    removeLabel: t('optimus.removeLabel'),
  },
});`;

  readonly focusSnippet: string = `// Removal destroys the focused element. Decide where focus goes.
@ViewChildren('chipEl', { read: ElementRef }) chips!: QueryList<ElementRef>;

dropFilter(id: string, index: number): void {
  this.filters.set(this.filters().filter((f) => f.id !== id));
  // Let the @for re-render, then aim at the neighbor that took its place.
  afterNextRender(() => {
    const next = this.chips.get(Math.min(index, this.chips.length - 1));
    const target = next?.nativeElement.querySelector('.p-chip-remove-icon');
    (target ?? this.groupCaption.nativeElement).focus();
  }, { injector: this.injector });
}`;

  readonly testSnippet: string = `import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { TagModule } from '@openng/optimus-ui/tag';
import { ChipModule } from '@openng/optimus-ui/chip';

@Component({
  standalone: true,
  imports: [TagModule, ChipModule],
  template: \`
    <p-tag value="Draft" severity="warn" />
    @for (f of filters(); track f) {
      <p-chip [label]="f" [removable]="true" (onRemove)="drop(f)" />
    }\`,
})
class HostComponent {
  filters = signal(['a', 'b']);
  drop(f: string) { this.filters.set(this.filters().filter((x) => x !== f)); }
}

describe('tags and chips', () => {
  it('leaves the tag inert — no role, no tabindex, no handler', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector('p-tag') as HTMLElement;
    expect(tag.getAttribute('role')).toBeNull();
    expect(tag.getAttribute('tabindex')).toBeNull();
    // The regression this guards: someone "makes the tag clickable".
    expect(tag.className).toContain('p-tag-warn');
  });

  it('removes a chip from the MODEL, not just from view', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const remove = fixture.nativeElement.querySelector('.p-chip-remove-icon') as HTMLElement;
    remove.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    // Two assertions, because the chip hides itself either way.
    expect(fixture.componentInstance.filters()).toEqual(['b']);
    expect(fixture.nativeElement.querySelectorAll('p-chip').length).toBe(1);
  });
});`;

  copy(id: string, text: string): void {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        this.copiedId.set(id);
        if (this.copyTimer !== null) clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => {
          this.copiedId.set(null);
          this.copyTimer = null;
        }, 1500);
      },
      () => {
        /* clipboard denied — leave the label unchanged */
      },
    );
  }
}
