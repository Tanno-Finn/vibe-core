import { ChangeDetectionStrategy, Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
import { TableModule } from '@openng/optimus-ui/table';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

interface Bird {
  id: number;
  name: string;
  family: string;
  wingspan: number;
  status: string;
}

interface RowReadout {
  row: string;
  visual: string;
  aria: string;
}

interface TableReadout {
  role: string;
  rows: RowReadout[];
}

/**
 * Guide article: Table — p-table (SPEC N5, Guides).
 *
 * Renders through app-guide-shell and projects each tab body as an appGuideTab
 * template. Scope is deliberate and declared on the page: the core of the
 * component (columns and templates, sorting, selection, the paginator,
 * responsive behavior, the empty state, tokens, and semantics) is covered with
 * measurements; the industrial extensions (virtual scroll, lazy loading, row
 * edit, frozen columns, resize/reorder, row expansion, export) are named as a
 * boundary and not documented in depth.
 *
 * VERIFIED CLAIMS (read from the shipped source of @openng/optimus-ui 2.0.2, or measured
 * in the browser; provenance is carried in the tabs):
 *   - The library owns the <table>, the three rowgroups and the paginator; every
 *     <tr> and <td> comes from the templates the caller writes. role="table" and
 *     role="rowgroup" are static attributes in the component's own template
 *     (openng-optimus-ui-table.mjs:3205-3252); rows and cells are native HTML.
 *   - pSortableColumn is a header-cell directive, not a button: role="columnheader"
 *     is a static host attribute, tabindex is 0 while enabled, aria-sort is bound
 *     to a string the directive recomputes ('ascending' | 'descending' | 'none'),
 *     and Enter and Space are the only keys it listens for
 *     (openng-optimus-ui-table.mjs:4615-4682; the value is computed in
 *     updateSortState(), :4638-4651).
 *   - pSelectableRow sets NO aria-selected. Its host bindings are the class, a
 *     roving tabindex and data-p-selectable-row; a selected row differs
 *     from an unselected one by Aura's tint alone (the kit adds a 4px accent
 *     bar in styles.scss, visual only). Searching the whole shipped
 *     module for aria-selected returns nothing.
 *   - AND adding the attribute by hand is not a fix on its own: measured in the
 *     accessibility tree, a <tr aria-selected="true"> exposes no selected state
 *     while the table's role is "table", and exposes selected=true as soon as the
 *     role is grid or treegrid (confirmed twice: on the rendered guide table and
 *     on a synthetic control table). Hence the two documented routes — a checkbox
 *     column, or role="grid" via [pt].table together with the attribute.
 *   - The library's fallback names for the row checkboxes are absent at first
 *     paint (measured: aria-label is null on every checkbox until the first
 *     selection event), then frozen: after selecting and deselecting row 1 it
 *     still reads "Row Selected" while the box is unchecked, and every other row
 *     reads "Row Unselected".
 *   - The deprecated stack layout costs the COLUMN HEADERS, not the cells: with
 *     its declarations in force the header cells resolve to role "none" and drop
 *     out of the tree, while the body cells still map as cells.
 *   - The row and header-checkbox aria labels are assigned inside the selection
 *     subscription (ariaLabel = ariaLabel || aria.selectRow, :5982 for the row
 *     checkbox and radio, :6167 for the header checkbox), so they are absent
 *     until the first event that fires it, frozen afterwards, and never follow a
 *     language switch. PrimeNG 22 had briefly resolved them in a live computed;
 *     Optimus is back on the v21 subscription. Their defaults are state sentences
 *     ('Row Selected' / 'Row Unselected', openng-optimus-ui-config.mjs:207-208), applied to
 *     a checkbox that already announces its own checked state.
 *   - The paginator reads its labels through method calls in the template
 *     (getAriaLabel, openng-optimus-ui-paginator.mjs:366, called from the button
 *     bindings :543-619), so those DO follow a language
 *     switch — but currentPageReportTemplate defaults to the English literal
 *     '{currentPage} of {totalPages}' (:213) and is not part of the translation
 *     config at all.
 *   - responsiveLayout is back in Optimus (default 'scroll', :943): 'stack' calls
 *     createResponsiveStyle() from onInit (:1324-1325), which injects a media
 *     query setting display:none on the header cells and display:flex on the body
 *     cells (:3007-3046). PrimeNG 22 had removed the input; the fork restores the
 *     deprecated mode and its semantic cost with it.
 *   - Aura routes the sorted header cell and the selected row to the same
 *     {highlight.*} pair, so those two surfaces are the same material.
 *
 * The sentinel binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-table-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    TableModule,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule,
    InputTextModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'table'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A data table is a grid of records you compare against each other. Optimus UI's
          <code>p-table</code> is not a renderer for that grid — it is a harness around one you write yourself: it owns
          the table element, the three row groups, the sort state, the selection state, and the paginator, and every
          single row and cell comes out of your templates. Everything below is live.
        </p>
        <p class="scope-note">
          <strong>Scope.</strong> This guide covers the core in full: columns and templates, sorting, selection, the
          paginator, responsive behavior, the empty state, the token chain, and what the whole thing looks like in the
          accessibility tree. The industrial extensions — virtual scroll, lazy loading, row edit, frozen columns, column
          resize and reorder, row expansion, CSV export — are named where they matter and otherwise left to the vendor
          documentation; they are a second guide's worth of surface and pretending otherwise would be worse than saying
          so.
        </p>

        <!-- Playground -->
        <section class="pg" aria-label="Table playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-sel-label"
                  >selectionMode <span class="pg__aside">(click a row)</span></span
                >
                <p-select
                  [ariaLabelledBy]="'pg-sel-label'"
                  size="small"
                  [options]="selectionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSelectionMode()"
                  (ngModelChange)="setSelectionMode($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-sort-label">sortMode</span>
                <p-select
                  [ariaLabelledBy]="'pg-sort-label'"
                  size="small"
                  [options]="sortModeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSortMode()"
                  (ngModelChange)="pgSortMode.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">size</span>
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
                <label for="pg-checkbox">checkbox column</label>
                <p-toggleswitch
                  inputId="pg-checkbox"
                  [ngModel]="pgCheckbox()"
                  (ngModelChange)="pgCheckbox.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-striped">stripedRows</label>
                <p-toggleswitch inputId="pg-striped" [ngModel]="pgStriped()" (ngModelChange)="pgStriped.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-gridlines">showGridlines</label>
                <p-toggleswitch
                  inputId="pg-gridlines"
                  [ngModel]="pgGridlines()"
                  (ngModelChange)="pgGridlines.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-hover">rowHover</label>
                <p-toggleswitch inputId="pg-hover" [ngModel]="pgHover()" (ngModelChange)="pgHover.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-paginator">paginator <span class="pg__aside">(4 rows per page)</span></label>
                <p-toggleswitch
                  inputId="pg-paginator"
                  [ngModel]="pgPaginator()"
                  (ngModelChange)="pgPaginator.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview</span>
              <div class="pg__stage">
                <p-table
                  [value]="birds"
                  dataKey="id"
                  styleClass="pg-table"
                  [tableStyle]="{ 'min-width': '26rem' }"
                  [pt]="pgPt()"
                  [stripedRows]="pgStriped()"
                  [showGridlines]="pgGridlines()"
                  [rowHover]="pgHover()"
                  [size]="pgSize()"
                  [sortMode]="pgSortMode()"
                  [selectionMode]="pgSelectionMode()"
                  [selection]="pgSelection()"
                  (selectionChange)="pgSelection.set($event)"
                  [paginator]="pgPaginator()"
                  [rows]="4"
                  [showCurrentPageReport]="pgPaginator()"
                  [currentPageReportTemplate]="pgReport"
                >
                  <ng-template #header>
                    <tr>
                      @if (pgCheckbox()) {
                        <th class="cell--pick"><p-tableHeaderCheckbox [ariaLabel]="'Select all rows'" /></th>
                      }
                      <th pSortableColumn="name">Species <p-sortIcon field="name" /></th>
                      <th pSortableColumn="family">Family <p-sortIcon field="family" /></th>
                      <th pSortableColumn="wingspan" class="cell--num">Wingspan <p-sortIcon field="wingspan" /></th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row" [attr.aria-selected]="isPgSelected(row) ? true : null">
                      @if (pgCheckbox()) {
                        <td class="cell--pick"><p-tableCheckbox [value]="row" [ariaLabel]="'Select ' + row.name" /></td>
                      }
                      <td>{{ row.name }}</td>
                      <td>{{ row.family }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <p class="pg__hint">{{ pgHint() }}</p>
              </div>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        <!-- Selection semantics instrument -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">What a screen reader gets from a selected row</h3>
          </div>
          <p class="ex__note">
            Click a row in each table and read the journal underneath it. All three highlight the row;
            <strong>only the third one is selected as far as assistive technology is concerned.</strong> The library's
            directive sets a class, a roving <code>tabindex</code> and a data attribute — never
            <code>aria-selected</code>, and there is no input that makes it. Adding the attribute by hand is not enough
            either: a row only carries a selected state when the table it is in is a <code>grid</code>.
          </p>
          <div class="ex__stage">
            <div class="three">
              <div class="two__col">
                <span class="row__tag">Library defaults</span>
                <p-table
                  [value]="fewBirds"
                  dataKey="id"
                  styleClass="ax-bare"
                  selectionMode="single"
                  [selection]="bareSelection()"
                  (selectionChange)="onBareSelect($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th>Species</th>
                      <th class="cell--num">Wingspan</th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row">
                      <td>{{ row.name }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <ul class="journal">
                  <li><strong>table role</strong>: {{ bareReadout().role }}</li>
                  @for (r of bareReadout().rows; track r.row) {
                    <li>{{ r.row }} — {{ r.visual }}, <code>aria-selected</code>: {{ r.aria }}</li>
                  }
                  <li class="journal__verdict">Announced as selected: no</li>
                </ul>
              </div>
              <div class="two__col">
                <span class="row__tag">aria-selected added</span>
                <p-table
                  [value]="fewBirds"
                  dataKey="id"
                  styleClass="ax-attr"
                  selectionMode="single"
                  [selection]="attrSelection()"
                  (selectionChange)="onAttrSelect($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th>Species</th>
                      <th class="cell--num">Wingspan</th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row" [attr.aria-selected]="attrSelection()?.id === row.id ? true : null">
                      <td>{{ row.name }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <ul class="journal">
                  <li><strong>table role</strong>: {{ attrReadout().role }}</li>
                  @for (r of attrReadout().rows; track r.row) {
                    <li>{{ r.row }} — {{ r.visual }}, <code>aria-selected</code>: {{ r.aria }}</li>
                  }
                  <li class="journal__verdict">Announced as selected: still no</li>
                </ul>
              </div>
              <div class="two__col">
                <span class="row__tag">grid role + aria-selected</span>
                <p-table
                  [value]="fewBirds"
                  dataKey="id"
                  styleClass="ax-grid"
                  selectionMode="single"
                  [selection]="gridSelection()"
                  [pt]="{ table: { role: 'grid', 'aria-label': 'Species, selectable' } }"
                  (selectionChange)="onGridSelect($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th>Species</th>
                      <th class="cell--num">Wingspan</th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row" [attr.aria-selected]="gridSelection()?.id === row.id ? true : null">
                      <td>{{ row.name }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <ul class="journal">
                  <li><strong>table role</strong>: {{ gridReadout().role }}</li>
                  @for (r of gridReadout().rows; track r.row) {
                    <li>{{ r.row }} — {{ r.visual }}, <code>aria-selected</code>: {{ r.aria }}</li>
                  }
                  <li class="journal__verdict">Announced as selected: yes</li>
                </ul>
              </div>
            </div>
          </div>
          <p class="src-note">
            The verdicts are read from the accessibility tree, not from the markup — the middle table has the attribute
            in its DOM and no selected state in the tree, because
            <code>aria-selected</code> on a row is only supported inside a <code>grid</code> or <code>treegrid</code>.
            Verify it in your own build the same way: select a row and look at the row node, not at the element.
          </p>
          <pre class="code-block"><code>{{ selectionSnippet }}</code></pre>
        </section>

        <!-- Sorting instrument -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Sortable headers: the state is announced, the control is not</h3>
          </div>
          <p class="ex__note">
            Tab into the header row and press Enter or Space. Each header is a focusable
            <code>&lt;th&gt;</code> with a live <code>aria-sort</code>, which is exactly what the grid pattern asks for
            — but it is a cell, not a button, so nothing tells a screen reader user that pressing something here will do
            anything. The read-out is taken from the rendered attributes.
          </p>
          <div class="ex__stage">
            <div class="two__col two__col--wide">
              <p-table [value]="fewBirds" dataKey="id" styleClass="sort-demo" [sortMode]="'multiple'">
                <ng-template #header>
                  <tr>
                    <th pSortableColumn="name">Species <p-sortIcon field="name" /></th>
                    <th pSortableColumn="family">Family <p-sortIcon field="family" /></th>
                    <th pSortableColumn="wingspan" class="cell--num">Wingspan <p-sortIcon field="wingspan" /></th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.family }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                  </tr>
                </ng-template>
              </p-table>
              <ul class="journal">
                @for (h of sortReadout(); track h.row) {
                  <li>
                    <strong>{{ h.row }}</strong> — <code>aria-sort</code>: {{ h.aria }}, {{ h.visual }}
                  </li>
                }
              </ul>
              <p-button
                [label]="'Refresh read-out'"
                size="small"
                severity="secondary"
                (onClick)="refreshSortReadout()"
              />
            </div>
          </div>
          <p class="src-note">
            <code>sortMode="multiple"</code> here, so a second header adds to the sort instead of replacing it; with the
            default <code>"single"</code> the previous column resets to <code>none</code>. Either way every sortable
            header carries an <code>aria-sort</code> value, including <code>none</code> on the ones that are not sorted
            — that is the correct spelling, not an omission.
          </p>
        </section>

        <!-- Empty state -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">The empty state, and the cell it has to live in</h3>
            <button type="button" class="copy-btn" (click)="copy('empty', emptySnippet)">
              {{ copiedId() === 'empty' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            Type something that matches nothing. Without an <code>emptymessage</code> template the body simply renders
            zero rows and the table becomes a header with nothing under it — no message, no announcement. The template
            is one row, and its single cell needs a <code>colspan</code> or it sits in the first column.
          </p>
          <div class="ex__stage">
            <div class="two__col two__col--wide">
              <label class="filter-label" for="empty-filter">Filter by species</label>
              <input
                id="empty-filter"
                pInputText
                class="filter-input"
                [ngModel]="emptyFilter()"
                (ngModelChange)="emptyFilter.set($event)"
                placeholder="try: swift"
              />
              <p-table [value]="filteredBirds()" dataKey="id" styleClass="empty-demo">
                <ng-template #header>
                  <tr>
                    <th>Species</th>
                    <th>Family</th>
                    <th class="cell--num">Wingspan</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.family }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                  </tr>
                </ng-template>
                <ng-template #emptymessage>
                  <tr>
                    <td colspan="3" class="empty-cell">
                      <span aria-live="polite">No species matches that filter.</span>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
          <pre class="code-block"><code>{{ emptySnippet }}</code></pre>
        </section>

        <!-- Paginator -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">The paginator, and the one string that is not translatable</h3>
            <button type="button" class="copy-btn" (click)="copy('pager', pagerSnippet)">
              {{ copiedId() === 'pager' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The paginator's buttons take their accessible names from the library's translation config and re-read them on
            every change detection, so a language switch reaches them. The page report does not: it is a template string
            you supply, and the shipped default contains an English word. Switch the report below to see the difference
            between the default and a bound one.
          </p>
          <div class="ex__stage">
            <div class="two__col two__col--wide">
              <div class="pg__field">
                <span class="pg__label" id="rep-label">currentPageReportTemplate</span>
                <p-select
                  [ariaLabelledBy]="'rep-label'"
                  size="small"
                  [options]="reportOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="reportTemplate()"
                  (ngModelChange)="reportTemplate.set($event)"
                />
              </div>
              <p-table
                [value]="birds"
                dataKey="id"
                styleClass="pager-demo"
                [paginator]="true"
                [rows]="3"
                [rowsPerPageOptions]="[3, 5, 8]"
                [showCurrentPageReport]="true"
                [currentPageReportTemplate]="reportTemplate()"
              >
                <ng-template #header>
                  <tr>
                    <th>Species</th>
                    <th class="cell--num">Wingspan</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
          <pre class="code-block"><code>{{ pagerSnippet }}</code></pre>
        </section>

        <!-- Responsive -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Narrow viewport: the table scrolls, it does not shrink</h3>
            <button type="button" class="copy-btn" (click)="copy('resp', responsiveSnippet)">
              {{ copiedId() === 'resp' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            The box below is deliberately narrow. The table inside it carries a
            <code>min-width</code>, so the container scrolls horizontally and every row stays a row — the columns keep
            their meaning, and so does the accessibility tree. It is also the only responsive answer worth taking: the
            stack alternative that reflows each row into label/value pairs is still shipped in Optimus, and the
            Development tab records what it costs the semantics.
          </p>
          <div class="ex__stage">
            <div class="narrow">
              <p-table
                [value]="fewBirds"
                dataKey="id"
                styleClass="resp-demo"
                [tableStyle]="{ 'min-width': '40rem' }"
                [pt]="{ table: { 'aria-label': 'European birds by wingspan' } }"
              >
                <ng-template #header>
                  <tr>
                    <th>Species</th>
                    <th>Family</th>
                    <th class="cell--num">Wingspan</th>
                    <th>Status</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.family }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                    <td>{{ row.status }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
          <pre class="code-block"><code>{{ responsiveSnippet }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Is a data table the right shape at all?</h3>
        <p>
          A table earns its weight when a reader has to <em>compare records field by field</em>. If they only need to
          find one item, or the records have three fields, something cheaper reads better. The table is ordered by how
          often each alternative turns out to be the real answer.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shape</th>
                <th>It is the answer when…</th>
                <th>What it is to a screen reader</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>a plain <code>&lt;table&gt;</code></td>
                <td>
                  the data is static: a reference matrix, a specification, a price list. No sorting, no selection, no
                  paging.
                </td>
                <td>a table, entirely from native HTML</td>
              </tr>
              <tr>
                <td>a definition list or a card</td>
                <td>
                  you are showing <em>one</em> record's fields. A one-row table is a layout table wearing a costume.
                </td>
                <td>a list, or whatever you write</td>
              </tr>
              <tr>
                <td>a list of links</td>
                <td>people scan for one item and then leave. Rank matters, columns do not.</td>
                <td>a list</td>
              </tr>
              <tr>
                <td><code>p-table</code></td>
                <td>records are compared across columns, and at least one of sorting, selection, or paging is real.</td>
                <td>a table — with the rows and cells you wrote</td>
              </tr>
              <tr>
                <td><code>p-dataview</code></td>
                <td>the same records need a card layout as well as a list, and the columns were never the point.</td>
                <td>whatever your item template is</td>
              </tr>
              <tr>
                <td><code>p-treetable</code></td>
                <td>
                  rows nest: a file tree, a chart of accounts. A flat table with an indent column is not the same thing.
                </td>
                <td>a treegrid</td>
              </tr>
              <tr>
                <td><code>p-orderlist</code> / <code>p-picklist</code></td>
                <td>the interaction <em>is</em> the reordering or the moving, not the reading.</td>
                <td>listbox widgets</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The identities in the last column matter for the choice: two surfaces that look alike on screen can be a table
          and a listbox to a screen reader, and the keyboard model that comes with them is different. What
          <code>p-table</code> contributes to that column is only the outer frame — <code>role="table"</code> and three
          <code>role="rowgroup"</code> elements are static attributes in its own template
          (<code>openng-optimus-ui-table.mjs:3205-3252</code>); rows and cells are the native elements you write.
        </p>

        <h3>The contract: what the library owns and what you own</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The library owns</th>
                <th>You own</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  The <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>,
                  <code>&lt;tfoot&gt;</code> and the scroll container around them
                </td>
                <td>
                  Every <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code> and <code>&lt;td&gt;</code> inside them,
                  including their scope, their alignment, and their formatting
                </td>
              </tr>
              <tr>
                <td>Sort state, selection state, page state, and the events that change them</td>
                <td>Where that state is stored, and whether it survives a reload</td>
              </tr>
              <tr>
                <td>The paginator, and the accessible names of its buttons</td>
                <td>The page-report string, and the table's own accessible name</td>
              </tr>
              <tr>
                <td><code>aria-sort</code> on sortable headers</td>
                <td>Everything that says a row is <em>selected</em> — there is no input for it</td>
              </tr>
              <tr>
                <td>The empty-state slot</td>
                <td>The empty-state row, its <code>colspan</code> and its wording</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The practical consequence is that a bad table is almost never the library's fault. If the header cells have no
          <code>scope</code>, if numbers are left-aligned, if the empty state is a blank rectangle — that is all
          template code, and it is all fixable without touching a single input.
        </p>

        <h3>House style</h3>
        <ul>
          <li>
            <strong>Name the table.</strong> A table with no accessible name is announced as "table" and its row and
            column counts. Give it a <code>&lt;caption&gt;</code> through the <code>caption</code> template, or an
            <code>aria-label</code> through the pass-through API — and prefer the caption, because it is visible.
          </li>
          <li>
            <strong>Set <code>dataKey</code> whenever there is selection, expansion, or paging.</strong> Without it the
            component compares row objects by deep equality on every selection check, and selection breaks the moment
            the array is replaced by a fresh fetch of the same records.
          </li>
          <li>
            <strong
              >Give the table a <code>min-width</code> through <code>[tableStyle]</code>, not a fixed width.</strong
            >
            That is what makes the container scroll instead of the columns collapsing into unreadable slivers.
          </li>
          <li>
            <strong>Right-align numbers, left-align text</strong> — in the header cell as well as the body cell, or the
            column reads as two columns.
          </li>
          <li>
            <strong>Templates bind via reference names.</strong> <code>#header</code>, <code>#body</code> and the rest
            are the house style. In Optimus <code>pTemplate</code> works again — the v21
            <code>PrimeTemplate</code> content query survived the fork
            (<code>openng-optimus-ui-table.mjs:3080</code>) and <code>onAfterContentInit</code> still switches on
            <code>getType()</code> (<code>:1329-1331</code>) — but reference names are the shape this kit writes. Each
            <code>p-table</code> queries its own content, so several tables in one component template each declare their
            own <code>#body</code>; this page does exactly that.
          </li>
          <li>
            <strong>Always ship an <code>emptymessage</code> template.</strong> The zero-row state is the one every
            table reaches eventually, and the default for it is nothing.
          </li>
          <li>
            <strong>Do not put a link or a button in a selectable row and expect both to work.</strong> The row click
            handler bails out on <code>INPUT</code>, <code>BUTTON</code> and <code>A</code> targets, which is the right
            behavior and also means the row is not selectable where those controls sit.
          </li>
        </ul>

        <h3>Where this guide stops</h3>
        <p>
          <code>p-table</code> ships a second half aimed at data-grid workloads. It is real and it works; it is also
          large enough that documenting it properly is a separate exercise. What follows is the boundary, so that nobody
          mistakes silence for absence:
        </p>
        <ul>
          <li>
            <strong>Virtual scroll</strong> (<code>[virtualScroll]</code> + <code>virtualScrollItemSize</code>) — swaps
            the body for a <code>p-scroller</code>. Everything in the Design tab still holds; the keyboard and
            screen-reader story does not, because rows leave the DOM.
          </li>
          <li>
            <strong>Lazy loading</strong> (<code>[lazy]</code>, <code>(onLazyLoad)</code>, <code>[totalRecords]</code>)
            — you serve one page at a time and own sorting and filtering server-side. Note that
            <code>totalRecords</code> defaults to <code>0</code>, so a lazy table with an unset total renders no
            paginator.
          </li>
          <li>
            <strong>Row edit and cell edit</strong> (<code>editMode</code>, <code>pEditableColumn</code>,
            <code>p-cellEditor</code>) — an editing surface with its own focus rules.
          </li>
          <li>
            <strong>Frozen columns and rows</strong> (<code>pFrozenColumn</code>, <code>[frozenValue]</code>) — sticky
            positioning, and only inside a scrollable table.
          </li>
          <li>
            <strong>Column resize and reorder</strong> (<code>[resizableColumns]</code>,
            <code>[reorderableColumns]</code>) — pointer-driven, with no keyboard equivalent in the library.
          </li>
          <li>
            <strong>Row expansion</strong> (<code>pRowToggler</code>) — needs <code>aria-expanded</code> on the toggle
            and a relationship to the expanded row that you supply.
          </li>
          <li>
            <strong>Export</strong> (<code>exportCSV()</code>, <code>csvSeparator</code>, <code>exportFilename</code>) —
            a method on the component instance.
          </li>
          <li>
            <strong>Column filters</strong> (<code>p-columnFilter</code>) — a filter menu per column, with its own
            overlay and its own translation keys.
          </li>
        </ul>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              Selection wired up with <code>selectionMode</code> and nothing else, on the grounds that the highlighted
              row is obvious. It is obvious to people who can see it; to everyone else the row is unchanged, because the
              library sets no <code>aria-selected</code> — and adding the attribute on its own does not help either.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Put the state in a checkbox column, or — if the row click has to be the interaction — set
              <code>role="grid"</code> through <code>[pt].table</code> <em>and</em> bind
              <code>[attr.aria-selected]</code>. Those are the two combinations that reach the accessibility tree.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              A table of twelve columns squeezed into a phone by letting the columns shrink. Every cell wraps to four
              lines and the comparison the table existed for is gone.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Set a <code>min-width</code> and let the container scroll, or drop columns below a breakpoint and keep the
              ones that carry the decision. A scrollable table is honest; a shrunken one is not.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              Paging a list of fifteen records because the paginator was already there. Every page change costs a round
              trip through the reader's attention and hides two thirds of a set that fits on one screen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Show them all, and reach for the paginator when the set is long enough that scrolling stops being
              navigation. If you do page, show the page report so the size of the whole is visible.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <p class="dd__why">
              An unnamed table with a heading floating above it. The heading is a sibling; the table's own name is still
              empty, and a screen reader's table list shows a nameless entry.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Put the words in a <code>caption</code> template. It is visible, it is the table's accessible name, and it
              survives being read out of context.
            </p>
          </div>
        </div>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/table/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Table pattern</a
            >
            — the baseline this component's outer frame matches: a static grid of data with no interactive widget
            semantics, which is what a sortable-but-not-editable table is.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Grid pattern</a
            >
            — the pattern people assume they are getting once rows are selectable, and the keyboard contract that
            assumption implies. Worth reading precisely because
            <code>p-table</code> does not adopt it.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/tables/" target="_blank" rel="noopener noreferrer">
              W3C — WAI Tables Tutorial</a
            >
            — the normative-adjacent source for the parts the library hands back to you:
            <code>scope</code>, <code>caption</code>, header association, and when a table needs to be split instead of
            nested.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-sort" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-sort</code></a
            >
            — the allowed values and, importantly, that only one column at a time should claim a direction. Relevant to
            <code>sortMode="multiple"</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — the criterion a selected-by-background-only row fails, and the reason the Examples tab measures the
            selection instead of describing it.
          </li>
          <li>
            <a href="https://primeng.org/table" target="_blank" rel="noopener noreferrer"> PrimeNG — Table</a>
            — upstream API docs for the v21 code base Optimus forks, including the extensions this guide draws a
            boundary around. Everything stated here was checked against the shipped source of
            <code>&#64;openng/optimus-ui</code> 2.0.2.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <ul>
          <li>
            <strong>Root</strong> — <code>.p-datatable</code>, a
            <code>position: relative; display: block</code> wrapper. Modifier classes land here:
            <code>p-datatable-striped</code>, <code>p-datatable-gridlines</code>, <code>p-datatable-hoverable</code>,
            <code>p-datatable-sm</code> / <code>-lg</code>, <code>p-datatable-scrollable</code>.
          </li>
          <li>
            <strong>Header / footer bands</strong> — <code>.p-datatable-header</code> and
            <code>.p-datatable-footer</code>, rendered only when you project a <code>caption</code> or
            <code>summary</code> template. They sit outside the table element.
          </li>
          <li>
            <strong>Table container</strong> — <code>.p-datatable-table-container</code>, the element that scrolls. Its
            <code>max-height</code> comes from <code>scrollHeight</code>.
          </li>
          <li>
            <strong>Table</strong> — <code>.p-datatable-table</code> with <code>border-collapse: separate</code>,
            <code>border-spacing: 0</code> and <code>width: 100%</code>. It carries an explicit
            <code>role="table"</code> and a generated <code>id</code>.
          </li>
          <li>
            <strong>Row groups</strong> — <code>.p-datatable-thead</code>, <code>-tbody</code>, <code>-tfoot</code>,
            each with an explicit <code>role="rowgroup"</code>.
          </li>
          <li>
            <strong>Header cell</strong> — your <code>&lt;th&gt;</code>. With <code>pSortableColumn</code> it also gets
            <code>.p-datatable-sortable-column</code>, <code>role="columnheader"</code>, <code>tabindex="0"</code> and a
            live <code>aria-sort</code>; when it is the sorted one, <code>.p-datatable-column-sorted</code>.
          </li>
          <li>
            <strong>Sort icon</strong> — <code>p-sortIcon</code> renders one of three SVGs depending on the direction.
            It is a separate component you place inside the header cell; a sortable column without one sorts silently.
          </li>
          <li>
            <strong>Row</strong> — your <code>&lt;tr&gt;</code>. With <code>pSelectableRow</code> it gains
            <code>.p-datatable-selectable-row</code>, a roving <code>tabindex</code>,
            <code>data-p-selectable-row</code> and — while selected — <code>.p-datatable-row-selected</code>.
          </li>
          <li>
            <strong>Paginator</strong> — a full <code>p-paginator</code> instance above, below, or both, with its own
            border tokens (<code>datatable.paginator.top|bottom.border.*</code>).
          </li>
        </ul>

        <h3>Token chain</h3>
        <p>
          The datatable group is unusually alias-heavy: almost every surface is an alias of the shared
          <code>content.*</code>, <code>highlight.*</code> and <code>text.*</code> groups, which is why a table looks
          like the rest of the app without any work. Two consequences worth knowing up front:
          <strong>a sorted header cell and a selected row are the same material</strong> (both
          <code>&#123;highlight.*&#125;</code>), and
          <strong>a striped row changes its background but not its text color</strong>. Preset values from
          <code>&#64;openng/optimus-ui-themes/dist/aura/datatable/index.mjs</code>; the last two columns resolve the aliases.
          The kit re-points the header, row and footer fills to the style's <code>--surface-card</code> and adds two
          rules of its own — the 4px selected-row bar and the one focus ring; everything else is Aura's.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CSS variable</th>
                <th>Aura alias</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              @for (row of tokenRows; track row.varName) {
                <tr>
                  <td>
                    <code>{{ row.varName }}</code>
                  </td>
                  <td>{{ row.alias }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ tokenNote }}</p>

        <h3>Contrast, one row variant at a time</h3>
        <p>
          Every row state paints its own background, so every row state has its own contrast question. Each pair below
          is taken against the surface that row actually renders — not against the page, and not against the default
          row background.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Light</th>
                <th>Dark</th>
                <th>Floor</th>
              </tr>
            </thead>
            <tbody>
              @for (row of contrastRows; track row.pair) {
                <tr>
                  <td>{{ row.pair }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                  <td>{{ row.floor }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ contrastNote }}</p>

        <h3>Geometry</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What</th>
                <th>Value</th>
                <th>Where it comes from</th>
              </tr>
            </thead>
            <tbody>
              @for (row of geometryRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                  <td>{{ row.origin }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ geometryNote }}</p>

        <h3>The focus rings, and why they are inset</h3>
        <p>{{ focusRingNote }}</p>

        <h3>Restyling it</h3>
        <ul>
          <li>
            Scope the datatable tokens on a <code>styleClass</code>, which lands on the root element:
            <code>.compact-table &#123; --p-datatable-body-cell-padding: 0.25rem 0.5rem; &#125;</code>. Reach for the
            <code>size</code> input first — <code>"small"</code> and <code>"large"</code> are five padding tokens each
            (the header band, the header cell, the body cell, the footer cell, and the footer band), already tuned.
          </li>
          <li>
            The component's stylesheet is unencapsulated, so a bare <code>.p-datatable-tbody &#123; … &#125;</code> rule
            in any global stylesheet retunes every table in the application. Always prefix it with your own class.
          </li>
          <li>
            Column widths belong in a <code>colgroup</code> template or on the header cells, not on the body cells —
            <code>border-collapse: separate</code> means the first row decides and the rest follow.
          </li>
          <li>
            Do not restyle the sorted header with a hand-picked color. It is
            <code>&#123;highlight.background&#125;</code>, the same pair the selected row uses; changing one and not the
            other is how a table ends up with two different "this is active" colors.
          </li>
          <li>
            Striped rows are <code>:nth-child(odd)</code> on the rendered rows, so the stripe follows the position on
            the <em>page</em>, not the record. With a paginator the first row of every page is striped. That is normal,
            and it is also why a stripe must never be the only way to tell two record kinds apart.
          </li>
          <li>
            The kit forbids <code>::ng-deep</code>. A table rendered inside your component is reachable from a component
            stylesheet only through <code>:host</code> plus a <code>styleClass</code>; anything else goes in a global
            rule with your own prefix.
          </li>
        </ul>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 1.4.3 for every row variant in both themes (default accent), the tightest being
          the selected row and the sorted header at 9.34:1 light and 7.54:1 dark — gated over every style's card and
          every accent (lowest 6.59:1); SC 1.4.11 for the sort icon at rest (4.76:1 light, 5.12:1 dark), for the kit's
          4px selected-row bar and for the kit focus ring (both at least 3.48:1 on every fill they meet, gated); SC
          1.4.1 for what the eye sees — the bar marks a selected row by shape, not by the tint alone; SC 2.4.7, the
          ring being drawn in both themes; SC 2.1.1 for sorting (Enter and Space on the header cell) and for the row
          model (arrows, Home and End, Space and Enter); and SC 4.1.2 for a sorted column, which is a
          <code>columnheader</code> carrying a live <code>aria-sort</code>. <strong>Failing:</strong> SC 4.1.2 for
          row selection — <code>pSelectableRow</code> ships only a class, and a row's <code>aria-selected</code> is
          ignored under <code>role="table"</code>, so the bar is seen and not heard; and SC 4.1.2 on the selection
          checkboxes, whose name is assigned once inside a subscription, so it is absent until that first fires and
          frozen afterwards unless you pass it in. <strong>AAA</strong> is not assessed for this component.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          No intrinsic responsive behavior: columns keep their content width and the table container scrolls
          horizontally once the table is wider than its parent — the container sets <code>overflow: auto</code> even
          without <code>[scrollable]</code>. Give the table a <code>min-width</code> through <code>[tableStyle]</code>
          and let it scroll; drop columns before a phone, never shrink them. The stack layout is not an option (see
          Development).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>The API, with the defaults that matter</h3>
        <p>
          <code>TableModule</code> from <code>&#64;openng/optimus-ui/table</code>; the module also exports the
          directives (<code>pSortableColumn</code>, <code>pSelectableRow</code>, …) and <code>SharedModule</code>. Read
          from the shipped component in Optimus UI 2.0.2 (<code>openng-optimus-ui-table.mjs</code>).
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Default</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>—</td>
                <td>
                  The array. A getter/setter pair, not a signal input: assigning a new array is what triggers a re-sort
                  and a re-filter.
                </td>
              </tr>
              <tr>
                <td><code>dataKey</code></td>
                <td>—</td>
                <td>
                  The field that identifies a row. Without it selection compares whole objects by deep equality and does
                  not survive the array being replaced.
                </td>
              </tr>
              <tr>
                <td><code>sortMode</code></td>
                <td><code>'single'</code></td>
                <td>
                  <code>'multiple'</code> lets several columns sort at once and keeps their order in
                  <code>multiSortMeta</code>.
                </td>
              </tr>
              <tr>
                <td><code>defaultSortOrder</code></td>
                <td><code>1</code></td>
                <td>The direction a column takes on its first click — ascending.</td>
              </tr>
              <tr>
                <td><code>resetPageOnSort</code></td>
                <td><code>true</code></td>
                <td>Sorting sends the reader back to page one, which is almost always right.</td>
              </tr>
              <tr>
                <td><code>selectionMode</code></td>
                <td>—</td>
                <td>
                  <code>'single' | 'multiple'</code>. Governs <em>row-click</em> selection only; a checkbox column works
                  without it.
                </td>
              </tr>
              <tr>
                <td><code>metaKeySelection</code></td>
                <td>
                  <strong><code>false</code></strong>
                </td>
                <td>
                  Plain clicks toggle selection. Set it true and selecting more than one row requires Ctrl or Cmd — a
                  discoverability cost with no affordance.
                </td>
              </tr>
              <tr>
                <td><code>selectionPageOnly</code></td>
                <td>—</td>
                <td>Scopes the header checkbox to the current page instead of the whole set.</td>
              </tr>
              <tr>
                <td><code>rowSelectable</code></td>
                <td>—</td>
                <td>
                  A predicate that vetoes selection per row. It does not disable the row's <code>tabindex</code>, so a
                  vetoed row is still focusable.
                </td>
              </tr>
              <tr>
                <td><code>paginator</code></td>
                <td>—</td>
                <td>
                  Renders a <code>p-paginator</code>. <code>paginatorPosition</code> defaults to <code>'bottom'</code>;
                  <code>'both'</code> renders two independent instances.
                </td>
              </tr>
              <tr>
                <td><code>rows</code>, <code>first</code></td>
                <td>—, <code>0</code></td>
                <td>Page size and offset. Both are two-way (<code>rowsChange</code>, <code>firstChange</code>).</td>
              </tr>
              <tr>
                <td><code>totalRecords</code></td>
                <td>
                  <strong><code>0</code></strong>
                </td>
                <td>
                  Only consulted in lazy mode — but it is what the paginator counts, so a lazy table that forgets it
                  renders no page links at all.
                </td>
              </tr>
              <tr>
                <td><code>alwaysShowPaginator</code></td>
                <td><code>true</code></td>
                <td>
                  The paginator stays visible for a single page of results. Turning it off is usually the kinder
                  default.
                </td>
              </tr>
              <tr>
                <td><code>showCurrentPageReport</code></td>
                <td>—</td>
                <td>
                  Shows the report string. Off by default, which is why so many tables hide how much data they have.
                </td>
              </tr>
              <tr>
                <td><code>currentPageReportTemplate</code></td>
                <td><code>'&#123;currentPage&#125; of &#123;totalPages&#125;'</code></td>
                <td>
                  Placeholders: <code>currentPage</code>, <code>totalPages</code>, <code>first</code>,
                  <code>last</code>, <code>rows</code>, <code>totalRecords</code>. See the i18n tab — this string is
                  yours to translate.
                </td>
              </tr>
              <tr>
                <td><code>stripedRows</code>, <code>showGridlines</code>, <code>rowHover</code></td>
                <td>—</td>
                <td>
                  Presentation flags on the root element. <code>rowHover</code> is implied by
                  <code>selectionMode</code>, so a checkbox-only table needs it set explicitly to get a hover
                  affordance.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>—</td>
                <td>
                  <code>'small' | 'large'</code>, five padding tokens each: the header and footer bands and the header,
                  body, and footer cells.
                </td>
              </tr>
              <tr>
                <td><code>scrollable</code>, <code>scrollHeight</code></td>
                <td>—</td>
                <td>
                  Sticky header inside a height-capped container. <code>'flex'</code> makes the container fill its
                  parent instead of taking a fixed height.
                </td>
              </tr>
              <tr>
                <td><code>tableStyle</code>, <code>tableStyleClass</code></td>
                <td>—</td>
                <td>
                  Land on the <code>&lt;table&gt;</code>; <code>style</code> and <code>styleClass</code> land on the
                  root wrapper. This is where <code>min-width</code> goes.
                </td>
              </tr>
              <tr>
                <td><code>responsiveLayout</code></td>
                <td><code>'scroll'</code></td>
                <td>
                  <strong>Back in Optimus</strong> (<code>:943</code>), <code>'stack'</code> included. Leave it on
                  <code>'scroll'</code> — see "The responsive question" below.
                </td>
              </tr>
              <tr>
                <td><code>breakpoint</code></td>
                <td><code>'960px'</code></td>
                <td>Only read by the deprecated stack layout.</td>
              </tr>
              <tr>
                <td><code>paginatorLocale</code></td>
                <td>—</td>
                <td>
                  Forwarded to the paginator's <code>locale</code>, which localizes the digits in the page links and the
                  rows-per-page options. Not the report string.
                </td>
              </tr>
              <tr>
                <td><code>rowTrackBy</code></td>
                <td>—</td>
                <td>The body's <code>ngForTrackBy</code>. Set it for large or frequently replaced arrays.</td>
              </tr>
              <tr>
                <td><code>customSort</code> + <code>(sortFunction)</code></td>
                <td>—</td>
                <td>
                  Take the comparison over — the only way to sort by anything other than the raw field value
                  (locale-aware strings, for instance).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Outputs worth wiring: <code>selectionChange</code>, <code>onRowSelect</code>, <code>onRowUnselect</code>,
          <code>onHeaderCheckboxToggle</code>, <code>onSort</code>, <code>onPage</code>, <code>onFilter</code>,
          <code>onLazyLoad</code>. Templates (as <code>#</code>-reference names; <code>pTemplate</code> also binds in
          Optimus): <code>caption</code>, <code>header</code>, <code>body</code>, <code>footer</code>,
          <code>summary</code>, <code>emptymessage</code>, <code>colgroup</code>, <code>loadingbody</code>,
          <code>paginatorleft</code>, <code>paginatorright</code>, plus icon slots.
        </p>

        <h3>Sorting: correct state on a control that does not exist</h3>
        <p>
          <code>pSortableColumn</code> is a directive on your header cell. It sets <code>role="columnheader"</code> as a
          static host attribute, makes the cell focusable with <code>tabindex="0"</code> while enabled, listens for
          click, <code>keydown.enter</code> and <code>keydown.space</code>, and binds <code>aria-sort</code> to a value
          it recomputes from the table's sort state — <code>'ascending'</code>, <code>'descending'</code> or
          <code>'none'</code>.
        </p>
        <p>
          That is the state half of the sortable-column pattern, done correctly. The missing half is the affordance: a
          focusable table cell is not a control. Nothing announces that Enter will do something, and the sort icon is
          decoration. APG's sortable-table example puts a real <code>&lt;button&gt;</code> inside the
          <code>&lt;th&gt;</code> for exactly this reason. You can do the same here — put the button inside the cell and
          leave <code>pSortableColumn</code> on the cell — but then two things are focusable, so
          <code>[pSortableColumnDisabled]</code> on the cell and a click handler on the button is the cleaner shape. At
          minimum, tell people the column is sortable in words, not only with an arrow.
        </p>
        <p class="src-note">
          Host metadata read from <code>openng-optimus-ui-table.mjs:4682</code>; the <code>aria-sort</code> value is computed in
          <code>updateSortState()</code> just above it. Verify it in your build by reading <code>aria-sort</code> on the
          focused header: it must flip when you press Enter.
        </p>

        <h3>Selection: three mechanisms, one missing attribute</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mechanism</th>
                <th>Markup</th>
                <th>What it gives you</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row click</td>
                <td><code>selectionMode</code> + <code>[pSelectableRow]</code></td>
                <td>
                  Click, and a keyboard model on the row: arrows move between rows, Home and End jump, Space and Enter
                  select, Ctrl/Cmd+A selects the page in multiple mode.
                </td>
              </tr>
              <tr>
                <td>Checkbox column</td>
                <td><code>p-tableCheckbox</code> + <code>p-tableHeaderCheckbox</code></td>
                <td>
                  An explicit, discoverable control per row and a select-all in the header. Independent of
                  <code>selectionMode</code>.
                </td>
              </tr>
              <tr>
                <td>Radio column</td>
                <td><code>p-tableRadioButton</code></td>
                <td>The single-selection equivalent, for when a row click would be ambiguous.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Neither the row-click nor the row directive sets <code>aria-selected</code>.</strong>
          <code>pSelectableRow</code>'s host bindings are the class, the roving <code>tabindex</code> and a
          <code>data-p-selectable-row</code>
          attribute — nothing else. Out of the box a selected row differs from an unselected one by Aura's tint alone;
          the kit adds a 4px <code>--primary-color-fg</code> bar on its start edge (<code>src/styles.scss</code>,
          gated in CONTRAST.MD "table &amp; paginator"), so the eye gets a shape as well as a hue (WCAG 1.4.1). For
          anyone moving through rows with the arrow keys it is still simply silence.
        </p>
        <p>
          The obvious fix is not a fix.
          <strong
            >Binding <code>[attr.aria-selected]</code> on the row changes nothing while the table's role is
            <code>table</code></strong
          >: the attribute is only supported on a row owned by a <code>grid</code> or a <code>treegrid</code>, and the
          accessibility tree drops it everywhere else. That leaves two honest routes, and the first one is the better
          default:
        </p>
        <ul>
          <li>
            <strong>A checkbox column.</strong> The state lives in a real control that carries it natively, it survives
            under the shipped <code>role="table"</code>, it is visible, and it is the only variant that tells a sighted
            mouse user what is going to happen before they click. Give every checkbox an <code>[ariaLabel]</code> naming
            the row.
          </li>
          <li>
            <strong><code>role="grid"</code> plus <code>[attr.aria-selected]</code>.</strong> Set the role through
            <code>[pt].table</code> and bind the attribute on the row; then the selected state is in the tree. The role
            is defensible here because the library already ships the row-level keyboard model a grid implies — but be
            aware that each sortable header is its own tab stop, which a strict grid would not have.
          </li>
        </ul>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Markup</th>
                <th>Accessibility-tree node</th>
              </tr>
            </thead>
            <tbody>
              @for (row of axRows; track row.markup) {
                <tr>
                  <td>{{ row.markup }}</td>
                  <td>{{ row.node }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ axNote }}</p>
        <pre class="code-block"><code>{{ selectionSnippet }}</code></pre>
        <p>
          Two more selection details that cost time when they are discovered late. The row click handler
          <strong>returns early</strong> when the click landed on an <code>INPUT</code>, <code>BUTTON</code> or
          <code>A</code> element, or on anything the library considers clickable — so an actions column does not select
          the row, by design. And <code>metaKeySelection</code> defaults to <code>false</code> in this version, which
          means plain clicks toggle; if you turn it on, multi-selection becomes a modifier-key secret with no visible
          affordance.
        </p>

        <h3>What the whole thing is in the accessibility tree</h3>
        <p>
          The outer frame is a plain table: <code>role="table"</code> on the table element and
          <code>role="rowgroup"</code> on each of the three groups, all static attributes in the component's template.
          That is the right default for a table nobody selects rows in, and it is the reason the selection story above
          needs a decision: a plain table has no concept of a selected row, so the state has to live either in a control
          inside the row or in a role that supports it. Do not reach for <code>role="grid"</code> for any other reason —
          it is a promise about the keyboard, and the only part of that promise the library keeps is the row-level
          movement on selectable rows.
        </p>
        <p>
          The naming gap is the one to close: the table element gets a generated <code>id</code> and no name. A
          <code>caption</code> template renders a band <em>outside</em> the table element, so it is not a
          <code>&lt;caption&gt;</code> and does not name the table. Use the pass-through API to put the name on the
          table itself:
        </p>
        <pre class="code-block"><code>{{ nameSnippet }}</code></pre>

        <h3>The empty state</h3>
        <p>
          With no <code>emptymessage</code> template the body renders zero rows and nothing else — a header with white
          space under it. The template is projected inside <code>&lt;tbody&gt;</code>, so it must be a
          <code>&lt;tr&gt;</code> with a <code>&lt;td&gt;</code>, and that cell needs a <code>colspan</code> covering
          every column or the message sits in the first one. If the emptiness is the result of a filter the reader just
          typed, wrap the message in a polite live region — the rows disappearing is not itself an announcement.
        </p>

        <h3>The responsive question</h3>
        <p>There are two answers in the box, and only one of them is a foundation.</p>
        <ul>
          <li>
            <strong>Scroll (the default).</strong> Give the table a <code>min-width</code> via
            <code>[tableStyle]</code> and let the container scroll horizontally. Rows stay rows, headers stay
            associated, and the accessibility tree is unchanged. Combine with <code>[scrollable]="true"</code> and a
            <code>scrollHeight</code> when the vertical axis is the problem — that makes the header sticky.
          </li>
          <li>
            <strong>Stack — shipped again, still wrong.</strong> <code>responsiveLayout="stack"</code> injects a media
            query that hides the header cells and reflows each row into label/value pairs; the hidden headers leave the
            accessibility tree, so every column loses the name that gave its values meaning. PrimeNG 22 had removed the
            input; Optimus restores it, deprecation and all. Do not reach for it.
          </li>
        </ul>
        <p class="src-note">
          Read from the Optimus 2.0.2 source: <code>responsiveLayout</code> defaults to <code>'scroll'</code>
          (<code>openng-optimus-ui-table.mjs:943</code>), and <code>'stack'</code> calls
          <code>createResponsiveStyle()</code> from <code>onInit</code> (<code>:1324-1325</code>), whose media query sets
          <code>display: none</code> on <code>thead &gt; tr &gt; th</code> (<code>:3007-3046</code>). If you need a card
          layout on small screens, build it as a real alternative view rather than as a table pretending to be one;
          <code>p-dataview</code> exists for that.
        </p>

        <h3>SSR</h3>
        <p>
          The table renders on the server: rows, cells, and the paginator are all in the static HTML, which is the
          opposite of the overlay components and a good reason to prefer a table over a drawer for content that must be
          crawlable. Two browser-only paths exist — the responsive stack layout creates its
          <code>&lt;style&gt;</code> element behind an <code>isPlatformBrowser</code> guard, and state persistence
          (<code>stateKey</code> / <code>stateStorage</code>) reads storage — so neither runs during prerender, and a
          table that depends on restored state will render its default shape in the static HTML.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>☐ A table is the right shape: records are compared across columns, not just listed.</li>
          <li>
            ☐ The table has an accessible name — a <code>caption</code> in words, and the name on the table element
            itself.
          </li>
          <li>☐ <code>dataKey</code> is set wherever there is selection or paging.</li>
          <li>
            ☐ If rows can be selected, the state reaches the accessibility tree — a checkbox column, or
            <code>role="grid"</code> together with <code>[attr.aria-selected]</code>. The kit's visual bar alone, and
            the attribute alone, both fail.
          </li>
          <li>
            ☐ Row checkboxes and the header checkbox have an explicit <code>[ariaLabel]</code> that names the row, bound
            from the translation layer.
          </li>
          <li>
            ☐ Sortable columns are announced as sortable in words, not only by an icon, and Enter on a focused header
            actually sorts.
          </li>
          <li>
            ☐ An <code>emptymessage</code> template exists, its cell has a <code>colspan</code>, and a filter-driven
            emptiness is announced.
          </li>
          <li>☐ Numbers are right-aligned in header and body alike; text is not.</li>
          <li>
            ☐ The narrow-viewport behavior is a scrolling container with a <code>min-width</code>, not shrinking
            columns.
          </li>
          <li>☐ <code>currentPageReportTemplate</code> is bound from the translation layer if the report is shown.</li>
          <li>
            ☐ Both themes were looked at, including a striped row and a selected row — each has its own background.
          </li>
          <li>
            ☐ Nothing in the table depends on a feature this guide draws a boundary around without that feature being
            verified separately.
          </li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) pinning the three things that rot first — the name, the sort state,
          and the selection attribute the library will not write for you:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Three families of strings, and they behave differently</h3>
        <p>
          A table's text comes from three places, and each has its own failure mode. Knowing which is which is most of
          the work.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Comes from</th>
                <th>Follows a language switch?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Column headers, cell content, the caption, the empty message</td>
                <td>Your template</td>
                <td>Yes, if you bind them from a <code>computed()</code> rather than a field read once</td>
              </tr>
              <tr>
                <td>Paginator button names (first / previous / next / last), page links, rows-per-page</td>
                <td>The library's translation config,read through method calls in the template</td>
                <td>Yes — the methods re-run on every change detection</td>
              </tr>
              <tr>
                <td>Row checkbox and header checkbox names</td>
                <td>The library's translation config,assigned once inside a subscription</td>
                <td><strong>No</strong> — see below</td>
              </tr>
              <tr>
                <td>The page report</td>
                <td>Your <code>currentPageReportTemplate</code></td>
                <td>Yes, if you bind it. The default is an English literal.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>The checkbox labels: broken twice over</h3>
        <p>
          <code>p-tableCheckbox</code>, <code>p-tableHeaderCheckbox</code> and <code>p-tableRadioButton</code> each fall
          back to a string from the translation config — but the assignment is
          <code>this.ariaLabel = this.ariaLabel || …</code> and it lives inside a subscription, not in a template
          binding. Three consequences, in order of how much they hurt:
        </p>
        <ul>
          <li>
            The label is <strong>absent until that subscription fires</strong>. A freshly rendered table's checkboxes
            have no fallback name at all.
          </li>
          <li>
            Once assigned it is <strong>frozen</strong>: the <code>||</code> guard means it never updates again, so it
            keeps describing the state the row was in when the subscription first ran.
          </li>
          <li>
            A later <code>setTranslation</code> — a language switch — <strong>cannot reach it</strong>, because nothing
            re-reads the config.
          </li>
        </ul>
        <p>
          And the defaults would be wrong even if the mechanism worked: they are state sentences ("Row Selected" / "Row
          Unselected"), attached to a checkbox that already announces its own checked state, and they do not name the
          row. <strong>Always pass <code>[ariaLabel]</code> explicitly</strong>, from your translation layer, naming the
          record: that is the only path that is correct at first paint, correct after a selection change, and correct
          after a language switch.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>The paginator vocabulary, and what this kit pushes</h3>
        <p>
          The paginator's button names come from the <code>aria</code> block of the library's translation config —
          <code>firstPageLabel</code>, <code>prevPageLabel</code>, <code>nextPageLabel</code>,
          <code>lastPageLabel</code>, <code>pageLabel</code>, <code>rowsPerPageLabel</code>,
          <code>jumpToPageDropdownLabel</code>. They ship in English and are read through method calls, so pushing new
          values with <code>setTranslation</code> updates them live.
        </p>
        <p>
          This kit pushes the <code>aria</code> keys its components actually read, in the page language, rather than
          translating the whole vocabulary — the list is <code>OPTIMUS_ARIA_KEYS</code> in
          <code>optimus-a11y.service.ts</code>, and <strong>all seven paginator keys are in it</strong>, so a kit
          table's paginator is already named in German, English and both Easy variants. A new key you need goes into
          that list and into the <code>optimus</code> translation files. Two mechanics to respect if you push your own:
          <code>setTranslation</code> merges one level deep only, so the <code>aria</code> block must be spread before
          it is extended, and the header checkbox happens to read <code>selectAll</code> / <code>unselectAll</code> —
          keys the kit also pushes — which is a coincidence and not a substitute for the explicit
          <code>[ariaLabel]</code> above.
        </p>

        <h3>The page report is not in the translation config at all</h3>
        <p>
          <code>currentPageReportTemplate</code> defaults to
          <code>'&#123;currentPage&#125; of &#123;totalPages&#125;'</code>. That "of" is an English word in a component
          input, not a translation key, and no amount of <code>setTranslation</code> will move it. Bind the template
          from your translation layer and keep the placeholders intact — they are replaced by plain string substitution,
          so a translator may reorder them but must not rename them.
        </p>
        <p>
          One more asymmetry in the same area: <code>paginatorLocale</code> localizes the <em>digits</em> in the page
          links and the rows-per-page options through <code>Intl.NumberFormat</code>, but the page report is built with
          plain string conversion, and the page links' <code>aria-label</code> uses the raw number. In a locale with
          non-Latin digits the visible page number and the announced one are written in different numeral systems.
        </p>

        <h3>Column width is a language problem</h3>
        <p>
          Header labels are the strings that grow most: a one-word English column head is routinely two or three words
          elsewhere, and a table sized from English wraps its headers in the next language or, worse, forces the whole
          table past the container. Set the table's <code>min-width</code> from the longest language you ship, keep
          column heads to nouns rather than sentences, and remember that the header cell has
          <code>text-align: start</code> — it inherits the writing direction, so nothing needs flipping by hand.
        </p>

        <h3>RTL</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aspect</th>
                <th>Behavior in a right-to-left document</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rtlRows; track row.aspect) {
                <tr>
                  <td>{{ row.aspect }}</td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ rtlNote }}</p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: rows and headers paint the
            style's <code>--surface-card</code>; the selected row carries the kit's 4px accent bar; rows and sort headers
            wear the one 2px ring inside their edge; the row, selection, bar and ring pairs are cited from CONTRAST.MD;
            the paginator keys are part of the kit's pushed aria set.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): the token and contrast
            tables now say which values are the Aura stock palette (identical in every style) and which follow
            the accent; the dark selected-row and sorted-header ratio is given per host surface instead of one
            reading; narrow-screen statement added to Design; the aria-string sync is located in
            <code>optimus-a11y.service.ts</code>; history newest first; agent doc trimmed.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014): three of v0.3's claims flip
            back. <code>responsiveLayout</code> exists again (default <code>'scroll'</code>, <code>:943</code>) and so
            does the deprecated <code>'stack'</code> mode with its header-cost; <code>pTemplate</code> binds again
            because the v21 <code>PrimeTemplate</code> content query survived the fork; and the checkbox/radio names are
            once more assigned inside the selection subscription (<code>:5982</code>, <code>:6167</code>) rather than in
            a live computed — absent at first paint, then frozen. Selectors were camelCase all along
            (<code>p-sortIcon</code>, <code>p-tableCheckbox</code>). Aura is back on 2.x tokens, so the geometry is
            uncompacted again (cell padding <code>0.75rem 1rem</code>) — the measured geometry table already carried
            those values. All line refs re-derived against the Optimus bundles.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-23 — Re-verified against PrimeNG 22.1. Two upstream removals recorded:
            <code>responsiveLayout</code> (the stack mode and its header-cost are history) and
            <code>pTemplate</code> binding (templates via <code>#</code>-reference names, demo markup migrated — the old
            per-view-collision advice inverted). The table checkbox/radio names now resolve live (<code
              >ariaLabel() || aria.selectRow</code
            >, :5504) instead of freezing in a subscription — still pass <code>[ariaLabel]</code>. Selectors lowercased
            (<code>p-sortIcon</code>, <code>p-tableCheckbox</code>). Aura 3.0 compacted the whole geometry (cell
            paddings ~0.75/1rem → 0.5/0.875rem); colors unchanged. Line refs re-derived against 22.1.2.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial guide, core scope with the data-grid extensions declared as a
            boundary: the harness contract between library and template; sorting state versus the missing control
            affordance; the three selection mechanisms, the <code>aria-selected</code> nobody sets and the fact that
            setting it changes nothing under <code>role="table"</code>; the checkbox labels that are assigned once
            inside a subscription; the paginator's translatable names against its untranslatable page report; measured
            Aura token and per-row-variant contrast chains in both themes; the deprecated stack layout and what it
            costs; and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .lead {
        max-width: 46rem;
        line-height: 1.6;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-4);
      }
      .scope-note {
        max-width: 46rem;
        margin: 0 0 var(--space-5);
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-left: 3px solid var(--primary-color-fg);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        font-size: var(--font-size-sm);
        line-height: 1.6;
        color: var(--text-color-secondary);
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
        grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
        gap: var(--space-5);
        margin-bottom: var(--space-4);
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
      .pg__aside {
        font-weight: 400;
        color: var(--text-color-secondary);
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
      .pg__field p-select {
        width: 100%;
      }
      .pg__preview {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .pg__preview-label,
      .pg__code-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .pg__stage {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-3);
        min-width: 0;
        padding: var(--space-4);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        overflow-x: auto;
      }
      .pg__hint {
        margin: 0;
        font-size: 0.78rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }
      @media (max-width: 860px) {
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
        display: block;
        padding: var(--space-4);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .row__tag {
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }

      .two {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-5);
      }
      .three {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-5);
      }
      .two__col {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-2);
        min-width: 0;
      }
      .two__col--wide {
        align-items: flex-start;
      }
      .two__col--wide > p-table,
      .two__col--wide > .filter-input {
        width: 100%;
      }
      @media (max-width: 1100px) {
        .three {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 860px) {
        .two {
          grid-template-columns: 1fr;
        }
      }

      .journal {
        list-style: none;
        padding-left: 0;
        margin: 0;
        font-size: 0.78rem;
      }
      .journal li {
        margin: 0.2rem 0;
        color: var(--text-color);
        overflow-wrap: anywhere;
      }
      .journal__verdict {
        margin-top: 0.45rem;
        font-weight: var(--font-weight-medium);
        color: var(--text-color);
      }

      .cell--num {
        text-align: right;
      }
      .cell--pick {
        width: 3rem;
      }
      .empty-cell {
        text-align: center;
        color: var(--text-color-secondary);
      }
      .filter-label {
        font-size: 0.85rem;
        font-weight: var(--font-weight-medium);
        color: var(--text-color);
      }
      .filter-input {
        max-width: 18rem;
      }
      .narrow {
        max-width: 24rem;
        overflow-x: auto;
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
      .table-wrap > table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      .table-wrap > table th,
      .table-wrap > table td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
        vertical-align: top;
      }
      .table-wrap > table th {
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
    `,
  ],
})
export class TableArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly copiedId = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer) clearTimeout(this.copyTimer);
    });
  }

  copy(id: string, text: string): void {
    if (!this.isBrowser || !navigator?.clipboard) return;
    void navigator.clipboard.writeText(text).then(() => {
      this.copiedId.set(id);
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copiedId.set(null), 1400);
    });
  }

  // ---------------------------------------------------------------- the data

  readonly birds: Bird[] = [
    { id: 1, name: 'House sparrow', family: 'Passeridae', wingspan: 24, status: 'Least concern' },
    { id: 2, name: 'Common swift', family: 'Apodidae', wingspan: 42, status: 'Least concern' },
    { id: 3, name: 'Barn owl', family: 'Tytonidae', wingspan: 90, status: 'Least concern' },
    { id: 4, name: 'Eurasian wren', family: 'Troglodytidae', wingspan: 15, status: 'Least concern' },
    { id: 5, name: 'White stork', family: 'Ciconiidae', wingspan: 215, status: 'Least concern' },
    { id: 6, name: 'Corn crake', family: 'Rallidae', wingspan: 53, status: 'Least concern' },
    { id: 7, name: 'Northern lapwing', family: 'Charadriidae', wingspan: 70, status: 'Near threatened' },
    { id: 8, name: 'Little owl', family: 'Strigidae', wingspan: 56, status: 'Least concern' },
  ];

  readonly fewBirds: Bird[] = this.birds.slice(0, 4);

  // ---------------------------------------------------------------- playground

  readonly selectionOptions = [
    { label: 'none', value: null },
    { label: 'single', value: 'single' },
    { label: 'multiple', value: 'multiple' },
  ];

  readonly sortModeOptions = [
    { label: 'single (default)', value: 'single' },
    { label: 'multiple', value: 'multiple' },
  ];

  readonly sizeOptions = [
    { label: 'normal (default)', value: undefined },
    { label: 'small', value: 'small' },
    { label: 'large', value: 'large' },
  ];

  readonly reportOptions = [
    { label: 'the shipped default', value: '{currentPage} of {totalPages}' },
    { label: 'a bound, translated one', value: 'Rows {first} to {last} of {totalRecords}' },
  ];

  readonly pgSelectionMode = signal<'single' | 'multiple' | null>('single');
  readonly pgSortMode = signal<'single' | 'multiple'>('single');
  readonly pgSize = signal<'small' | 'large' | undefined>(undefined);
  readonly pgCheckbox = signal(false);
  readonly pgStriped = signal(true);
  readonly pgGridlines = signal(false);
  readonly pgHover = signal(true);
  readonly pgPaginator = signal(false);
  readonly pgSelection = signal<Bird | Bird[] | null>(null);

  setSelectionMode(mode: 'single' | 'multiple' | null): void {
    this.pgSelectionMode.set(mode);
    this.pgSelection.set(mode === 'multiple' ? [] : null);
  }

  /**
   * The pass-through route is `pt.table`, because the table element is bound with
   * `[pBind]="ptm('table')"`. It carries the name always, and the grid role only
   * while rows are selectable — that is the only combination in which the row's
   * `aria-selected` is exposed at all.
   */
  readonly pgPt = computed(() => {
    const name = { 'aria-label': 'European birds, playground' };
    return this.pgSelectionMode() ? { table: { role: 'grid', ...name } } : { table: name };
  });

  isPgSelected(row: Bird): boolean {
    const sel = this.pgSelection();
    if (Array.isArray(sel)) return sel.some((b) => b.id === row.id);
    return !!sel && (sel as Bird).id === row.id;
  }

  readonly pgHint = computed(() => {
    const parts: string[] = [];
    const mode = this.pgSelectionMode();
    parts.push(
      mode
        ? `Rows are clickable (${mode}); arrows, Home, End, Space and Enter work once a row has focus.`
        : 'No row-click selection.',
    );
    if (this.pgCheckbox()) parts.push('The checkbox column works regardless of selectionMode.');
    if (!this.pgHover() && !mode)
      parts.push('No hover affordance: rowHover is off and selectionMode does not imply it.');
    if (this.pgPaginator()) parts.push('Striping is per rendered page, so the first row of each page is striped.');
    return parts.join(' ');
  });

  readonly pgCode = computed(() => {
    const lines = ['<p-table', '  [value]="rows()"', '  dataKey="id"', `  [tableStyle]="{ 'min-width': '26rem' }"`];
    if (this.pgSelectionMode()) {
      lines.push(`  selectionMode="${this.pgSelectionMode()}"`);
      lines.push('  [(selection)]="selection"');
      lines.push(`  [pt]="{ table: { role: 'grid', 'aria-label': labels().tableName } }"`);
    } else {
      lines.push(`  [pt]="{ table: { 'aria-label': labels().tableName } }"`);
    }
    if (this.pgSortMode() === 'multiple') lines.push('  sortMode="multiple"');
    if (this.pgSize()) lines.push(`  size="${this.pgSize()}"`);
    if (this.pgStriped()) lines.push('  [stripedRows]="true"');
    if (this.pgGridlines()) lines.push('  [showGridlines]="true"');
    if (this.pgHover()) lines.push('  [rowHover]="true"');
    if (this.pgPaginator()) {
      lines.push('  [paginator]="true" [rows]="4"');
      lines.push('  [showCurrentPageReport]="true"');
      lines.push('  [currentPageReportTemplate]="labels().pageReport">');
    } else {
      lines[lines.length - 1] = lines[lines.length - 1] + '>';
    }
    lines.push('  <ng-template #header>');
    lines.push('    <tr>');
    if (this.pgCheckbox()) {
      lines.push('      <th><p-tableHeaderCheckbox [ariaLabel]="labels().selectAll" /></th>');
    }
    lines.push('      <th pSortableColumn="name">{{ labels().species }} <p-sortIcon field="name" /></th>');
    lines.push(
      '      <th pSortableColumn="wingspan" class="num">{{ labels().wingspan }} <p-sortIcon field="wingspan" /></th>',
    );
    lines.push('    </tr>');
    lines.push('  </ng-template>');
    lines.push('');
    lines.push('  <ng-template #body let-row>');
    if (this.pgSelectionMode()) {
      lines.push('    <tr [pSelectableRow]="row"');
      lines.push('      [attr.aria-selected]="isSelected(row) ? true : null">');
    } else {
      lines.push('    <tr>');
    }
    if (this.pgCheckbox()) {
      lines.push('      <td><p-tableCheckbox [value]="row" [ariaLabel]="labels().select(row)" /></td>');
    }
    lines.push('      <td>{{ row.name }}</td>');
    lines.push('      <td class="num">{{ row.wingspan }}</td>');
    lines.push('    </tr>');
    lines.push('  </ng-template>');
    lines.push('</p-table>');
    return lines.join('\n');
  });

  // ------------------------------------------------------ selection instrument

  readonly bareSelection = signal<Bird | null>(null);
  readonly attrSelection = signal<Bird | null>(null);
  readonly gridSelection = signal<Bird | null>(null);

  private readonly empty: TableReadout = { role: '—', rows: [] };
  readonly bareReadout = signal<TableReadout>(this.empty);
  readonly attrReadout = signal<TableReadout>(this.empty);
  readonly gridReadout = signal<TableReadout>(this.empty);

  onBareSelect(row: Bird | null): void {
    this.bareSelection.set(row);
    this.scheduleReadout('ax-bare', this.bareReadout);
  }

  onAttrSelect(row: Bird | null): void {
    this.attrSelection.set(row);
    this.scheduleReadout('ax-attr', this.attrReadout);
  }

  onGridSelect(row: Bird | null): void {
    this.gridSelection.set(row);
    this.scheduleReadout('ax-grid', this.gridReadout);
  }

  private scheduleReadout(scope: string, target: { set: (v: TableReadout) => void }): void {
    if (!this.isBrowser) return;
    setTimeout(() => target.set(this.describeTable(scope)), 60);
  }

  /** Reads a rendered table back: its role, and what each row looks like and says. */
  private describeTable(scope: string): TableReadout {
    if (!this.isBrowser) return this.empty;
    const table = document.querySelector<HTMLElement>('.' + scope + ' table');
    const rows = Array.from(document.querySelectorAll<HTMLElement>('.' + scope + ' tbody > tr'));
    return {
      role: table?.getAttribute('role') ?? '(none)',
      rows: rows.map((tr, i) => {
        const attr = tr.getAttribute('aria-selected');
        return {
          row: 'row ' + (i + 1),
          visual: tr.classList.contains('p-datatable-row-selected') ? 'highlighted' : 'plain',
          aria: attr === null ? '(absent)' : attr,
        };
      }),
    };
  }

  // --------------------------------------------------------- sort instrument

  readonly sortReadout = signal<RowReadout[]>([]);

  refreshSortReadout(): void {
    if (!this.isBrowser) return;
    const cells = Array.from(document.querySelectorAll<HTMLElement>('.sort-demo thead th'));
    this.sortReadout.set(
      cells.map((th) => ({
        row: (th.textContent || '').trim() || 'column',
        visual: th.classList.contains('p-datatable-column-sorted') ? 'marked as sorted' : 'not marked',
        aria: th.getAttribute('aria-sort') ?? '(absent)',
      })),
    );
  }

  // --------------------------------------------------------------- empty state

  readonly emptyFilter = signal('');

  readonly filteredBirds = computed(() => {
    const q = this.emptyFilter().trim().toLowerCase();
    if (!q) return this.birds;
    return this.birds.filter((b) => b.name.toLowerCase().includes(q));
  });

  // ------------------------------------------------------------------ pager

  readonly reportTemplate = signal('{currentPage} of {totalPages}');

  /** The playground's own report string; a literal here, bound in real code. */
  readonly pgReport = '{first}-{last} of {totalRecords}';

  // ---------------------------------------------------------------- snippets

  readonly selectionSnippet = [
    '<!-- Route 1, and the default answer: a checkbox column. The state lives in a',
    '     real control, so it works under the shipped role="table", it is visible,',
    '     and it needs no promise about the keyboard. -->',
    '<ng-template #header>',
    '  <tr><th><p-tableHeaderCheckbox [ariaLabel]="labels().selectAll" /></th> … </tr>',
    '</ng-template>',
    '<ng-template #body let-row>',
    '  <tr>',
    '    <td><p-tableCheckbox [value]="row" [ariaLabel]="selectLabel(row)" /></td> …',
    '  </tr>',
    '</ng-template>',
    '',
    '<!-- Route 2: row selection that is actually announced. The role has to change',
    '     with it — aria-selected on a row is only supported inside a grid. -->',
    '<p-table [value]="rows()" dataKey="id" selectionMode="single" [(selection)]="selected"',
    `  [pt]="{ table: { role: 'grid', 'aria-label': labels().tableName } }">`,
    '  <ng-template #body let-row>',
    '    <tr [pSelectableRow]="row"',
    '      [attr.aria-selected]="isSelected(row) ? true : null">',
    '      <td>{{ row.name }}</td><td class="num">{{ row.wingspan }}</td>',
    '    </tr>',
    '  </ng-template>',
    '</p-table>',
  ].join('\n');

  readonly nameSnippet = [
    '<!-- The caption template renders a band OUTSIDE the table element, so it is',
    "     visible text but not the table's accessible name. Ship both: the words",
    '     people read, and the name assistive technology reads. -->',
    '<p-table [value]="rows()" dataKey="id"',
    `  [pt]="{ table: { 'aria-label': labels().tableName } }">`,
    '  <ng-template #caption>',
    '    <h2 class="table-caption">{{ labels().tableName }}</h2>',
    '  </ng-template>',
    '  …',
    '</p-table>',
  ].join('\n');

  readonly emptySnippet = [
    '<!-- Projected inside <tbody>: it must be a row, and the cell needs a colspan',
    '     covering every column or the message sits in the first one. -->',
    '<ng-template #emptymessage>',
    '  <tr>',
    '    <td [attr.colspan]="columns().length">',
    '      <span aria-live="polite">{{ labels().noMatches }}</span>',
    '    </td>',
    '  </tr>',
    '</ng-template>',
  ].join('\n');

  readonly pagerSnippet = [
    '<p-table [value]="rows()" dataKey="id"',
    '  [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 25, 50]"',
    '  [showCurrentPageReport]="true"',
    '  [currentPageReportTemplate]="labels().pageReport">',
    '  …',
    '</p-table>',
    '',
    '// The placeholders are substituted literally, so a translation may reorder',
    '// them but must not rename them. The shipped default is English prose.',
    'pageReport: this.i18n.t(\'birds.pageReport\'),  // "Zeile {first} bis {last} von {totalRecords}"',
  ].join('\n');

  readonly responsiveSnippet = [
    '<!-- A min-width on the TABLE, not a width on the container: the container',
    '     scrolls, the columns keep their meaning, the a11y tree is unchanged. -->',
    '<p-table [value]="rows()" dataKey="id"',
    `  [tableStyle]="{ 'min-width': '40rem' }">`,
    '  …',
    '</p-table>',
    '',
    '<!-- Vertical axis instead: a sticky header inside a capped container. -->',
    '<p-table [value]="rows()" dataKey="id"',
    '  [scrollable]="true" scrollHeight="24rem"',
    `  [tableStyle]="{ 'min-width': '40rem' }">`,
    '  …',
    '</p-table>',
  ].join('\n');

  readonly i18nSnippet = [
    '// One computed map, so a language switch re-renders every string.',
    'readonly labels = computed(() => ({',
    "  tableName: this.i18n.t('birds.tableName'),",
    "  species: this.i18n.t('birds.species'),",
    "  wingspan: this.i18n.t('birds.wingspan'),",
    "  selectAll: this.i18n.t('birds.selectAll'),",
    "  noMatches: this.i18n.t('birds.noMatches'),",
    "  pageReport: this.i18n.t('birds.pageReport'),",
    '}));',
    '',
    '// Name the ROW, not the state. The library fallback is assigned once inside',
    '// a subscription and never re-read, so it is stale in every language.',
    'selectLabel(row: Bird): string {',
    "  return this.i18n.t('birds.selectRow', { name: row.name });",
    '}',
  ].join('\n');

  readonly testSnippet = [
    "it('names the table, tracks sort state, and announces the selected row', async () => {",
    '  const fixture = TestBed.createComponent(BirdTableComponent);',
    '  fixture.autoDetectChanges();',
    '  await fixture.whenStable();',
    '',
    '  const el = fixture.nativeElement as HTMLElement;',
    "  const table = el.querySelector('table')!;",
    "  expect(table.getAttribute('aria-label')).toBeTruthy();",
    '',
    "  const head = el.querySelector('th[pSortableColumn]') as HTMLElement;",
    "  expect(head.getAttribute('aria-sort')).toBe('none');",
    '  head.click();',
    '  await fixture.whenStable();',
    "  expect(head.getAttribute('aria-sort')).toBe('ascending');",
    '',
    "  const row = el.querySelector('tbody tr') as HTMLElement;",
    '  row.click();',
    '  await fixture.whenStable();',
    "  // The class is the library's. The attribute is yours — and it only means",
    '  // anything because the table carries role="grid", so pin them together.',
    "  expect(table.getAttribute('role')).toBe('grid');",
    "  expect(row.getAttribute('aria-selected')).toBe('true');",
    '});',
  ].join('\n');

  // ------------------------------------------------------- measured reference
  // Aliases read from the Aura preset file. Surface rows are Aura's stock
  // slate/zinc palette, except the fills styles.scss re-points to the style's
  // --surface-card; primary-derived rows are the default sunset accent's ramp
  // from theme.service.ts and move with it.

  readonly tokenRows = [
    {
      varName: '--p-datatable-row-background',
      alias: '{content.background} — the kit re-points it to var(--surface-card)',
      light: '#ffffff',
      dark: "the style's card (werkbund #1d1d21)",
    },
    { varName: '--p-datatable-row-color', alias: '{content.color}', light: '#334155', dark: '#ffffff' },
    {
      varName: '--p-datatable-row-hover-background',
      alias: '{content.hover.background}',
      light: '#f1f5f9',
      dark: '#27272a',
    },
    {
      varName: '--p-datatable-row-striped-background',
      alias: '{surface.50} / {surface.950}',
      light: '#f8fafc',
      dark: '#09090b',
    },
    {
      varName: '--p-datatable-row-selected-background',
      alias: '{highlight.background}',
      light: '#fffff2',
      dark: 'color-mix(in srgb, #f5743f, transparent 84%)',
    },
    {
      varName: '--p-datatable-row-selected-color',
      alias: '{highlight.color}',
      light: '#8f0e00',
      dark: 'rgba(255,255,255,.87)',
    },
    {
      varName: '--p-datatable-header-cell-background',
      alias: '{content.background} — the kit re-points it to var(--surface-card)',
      light: '#ffffff',
      dark: "the style's card (werkbund #1d1d21)",
    },
    {
      varName: '--p-datatable-header-cell-selected-background / -color',
      alias: '{highlight.*} — the same pair as the row',
      light: '#fffff2 / #8f0e00',
      dark: 'the same color-mix / rgba(255,255,255,.87)',
    },
    {
      varName: '--p-datatable-border-color',
      alias: '{content.border.color} / {surface.800}',
      light: '#e2e8f0',
      dark: '#27272a',
    },
    {
      varName: '--p-datatable-body-cell-selected-border-color',
      alias: '{primary.100} / {primary.900}',
      light: '#ffffd8',
      dark: '#5c0000',
    },
    { varName: '--p-datatable-sort-icon-color', alias: '{text.muted.color}', light: '#64748b', dark: '#a1a1aa' },
    {
      varName: '--p-datatable-header-cell-focus-ring-*',
      alias: '{focus.ring.*}, offset a literal -1px — replaced by the kit ring',
      light: '2px solid --primary-color-fg, offset -2px',
      dark: '2px solid --primary-color-fg, offset -2px',
    },
    {
      varName: 'selected-row bar (a kit rule, no token)',
      alias: 'var(--primary-color-fg), 4px on the start edge',
      light: 'the accent foreground',
      dark: 'the accent foreground',
    },
    {
      varName: '--p-datatable-body-cell-padding',
      alias: 'a literal in the preset',
      light: '0.75rem 1rem',
      dark: 'identical',
    },
  ];

  readonly tokenNote =
    'Aliases from the Aura preset in @openng/optimus-ui-themes (the datatable and base modules). The text, striping, hover and border rows are the Aura stock palette (slate light, zinc dark); the header, row and footer fills take the style\'s own --surface-card (styles.scss, the block before the selected-row bar), because Aura\'s dark content.background (#18181b) is no style\'s card and a table on a card showed as a darker slab. The highlight, selected-border, and focus-ring rows derive from {primary.*}, which theme.service.ts builds from the chosen accent; the values shown are the default sunset accent. Two things follow from the aliases rather than from any rule: the sorted header cell and the selected row resolve to the same {highlight.*} pair, so they are one material and must be restyled together; and there is no striped-row text token, so a striped row keeps the ordinary row color on a different background. The dark selected background is not a flat color but a 16 % tint of the primary over the card — see the contrast note.';

  readonly contrastRows = [
    {
      pair: 'header cell and plain row text on the card (gated)',
      light: '10.35:1',
      dark: '13.13:1 to 16.80:1, by style',
      floor: '4.5:1',
    },
    { pair: 'cell text on a striped row', light: '9.9:1', dark: '19.9:1', floor: '4.5:1' },
    { pair: 'cell text on a hovered row', light: '13.35:1', dark: '14.89:1', floor: '4.5:1' },
    {
      pair: 'selected row text, and the sorted header (gated)',
      light: '9.34:1',
      dark: '7.54:1 to 9.13:1, by style',
      floor: '4.5:1',
    },
    {
      pair: 'the 4px selected-row bar on the tint / on a plain row (gated)',
      light: '5.14:1 / 5.18:1',
      dark: '4.13:1 to 5.07:1 / 5.80:1 to 7.42:1',
      floor: '3:1',
    },
    { pair: 'sort icon at rest on the header', light: '4.76:1', dark: '5.12:1 to 6.56:1, by style', floor: '3:1' },
    {
      pair: 'kit focus ring inside a plain / hovered / selected row (gated)',
      light: '5.18:1 / 4.73:1 / 5.14:1',
      dark: '5.80:1 to 7.42:1 / 6.58:1 / 4.13:1 to 5.07:1',
      floor: '3:1',
    },
  ];

  readonly contrastNote =
    'Default sunset accent, each pair against the surface that row variant actually paints. The rows marked gated are measured on every build in docs/generated/CONTRAST.MD: "table & paginator" (datatable.row.color on datatable.row.background; datatable.row.selected.color on its background, 6.59–20.38:1 across all accents; the selected-row bar, 3.48–17.85:1) and "focus ring" (kit focus ring, inset, on the rest, hover and selected fills, 3.48–17.85:1). The sort icon is {text.muted.color} on the card, the same values the gate measures as paginator.nav.button.color. Striped and hovered rows keep Aura\'s opaque tints and are not gated. In dark mode the selected row and the sorted header are a 16 % tint of the primary; since the kit paints the row itself --surface-card, the tint always lies over the style\'s card, so the ratio follows the style and the accent — no longer the surface behind the table.';

  readonly geometryRows = [
    {
      what: 'header and body cell padding',
      value: '12 x 16px (0.75rem 1rem)',
      origin: 'datatable.header.cell.padding / .body.cell.padding',
    },
    { what: 'the same cells at size="small"', value: '6 x 8px (0.375rem 0.5rem)', origin: 'the sm padding tokens' },
    { what: 'the same cells at size="large"', value: '16 x 20px (1rem 1.25rem)', origin: 'the lg padding tokens' },
    {
      what: 'cell borders',
      value: '1px on the bottom edge only, 0 on the other three',
      origin: 'border-width: 0 0 1px 0 in the base stylesheet',
    },
    {
      what: 'the table element',
      value: 'border-collapse: separate, border-spacing: 0, width: 100%',
      origin: '.p-datatable-table',
    },
    {
      what: 'the scroll container',
      value: 'overflow: auto, set inline; max-height from scrollHeight',
      origin: 'the component writes it as an inline style',
    },
    { what: 'sort icon', value: '14 x 14px (0.875rem)', origin: 'datatable.sort.icon.size' },
    { what: 'column title weight', value: '600', origin: 'datatable.column.title.font.weight' },
    {
      what: 'cell text alignment',
      value: 'start — logical, so it follows the writing direction',
      origin: 'text-align: start in the base stylesheet',
    },
  ];

  readonly geometryNote =
    'Computed style at a 1440 x 900 viewport. The scroll container is worth noting: the overflow is there without [scrollable], which is why a min-width on the table is all a wide table needs.';

  readonly focusRingNote =
    'Nothing at rest. Focused from the keyboard, a sortable header cell and a selectable row both draw the kit\'s one ring — 2px solid --primary-color-fg, the ring every focusable Optimus part wears — replacing Aura\'s 1px {primary.color} ring. It keeps Aura\'s placement, just inside the part (outline-offset: -2px, the kit\'s inset rule), which is the only place it can go: the rows and headers sit in a scrolling wrapper that would clip an outer ring, and a ring outside a cell would spill onto the neighboring row. Inside, it meets the row\'s own fill — plain, hovered or selected — and the gate measures it on all three ("focus ring", kit focus ring, inset: 3.48–17.85:1 across every style, mode and accent). The row-expansion toggle button takes the same ring outside itself.';

  readonly axRows = [
    { markup: 'the table element, as shipped', node: 'table, name "" — the generated id names nothing' },
    { markup: '[pt]="{ table: { \'aria-label\': … } }"', node: 'table, name "European birds by wingspan"' },
    { markup: 'thead / tbody / tfoot', node: 'rowgroup' },
    { markup: 'your <tr>, your <td>', node: 'row / cell, the cell named by its text' },
    { markup: '<th pSortableColumn>', node: 'columnheader, named by its text, carrying aria-sort' },
    { markup: 'the <p-sortIcon> svg', node: 'an unnamed image node — no aria-hidden is set' },
    { markup: 'a selected row, library defaults', node: 'row, focusable — nothing about selection' },
    {
      markup: 'the same row + [attr.aria-selected]',
      node: 'row, focusable — still nothing: the attribute is dropped under role="table"',
    },
    { markup: 'the same again, with role="grid" on the table', node: 'row, selected=true' },
    {
      markup: 'header cells hidden by the stack layout',
      node: 'role "none" — the column headers leave the tree; the cells stay cells',
    },
  ];

  readonly axNote =
    'Read from the browser accessibility tree, once per variant, with a row selected. The middle three rows are the whole selection argument in one place: the attribute is in the DOM and not in the tree, because aria-selected on a row is only supported inside a grid or a treegrid. The last row is the measured cost of the deprecated stack layout — display:none on the header cells removes them from the tree entirely, so the cells survive but lose the headers that gave them meaning.';

  readonly rtlRows = [
    {
      aspect: 'Cell and header alignment',
      note: 'Correct without intervention. The base stylesheet uses text-align: start, so both flip with the document direction; measured as start in a dir="rtl" document, rendering right-aligned.',
    },
    {
      aspect: 'Cell borders, as they ship',
      note: 'Safe. The only edge a cell draws is its bottom one, and a bottom width has no left or right to mirror.',
    },
    {
      aspect: 'Cell borders with showGridlines',
      note: 'Not safe, and this is the one place the component is worse in RTL than the overlay components. Every gridline rule sets the physical border-width shorthand, and seven of the eighteen set left and right differently, so nothing flips: measured in an RTL document the table loses its right-hand outer edge entirely, while the boundary beside the last column draws two 1px lines where the rest of the grid draws one. Restate the widths logically under your own class before shipping gridlines in a right-to-left language.',
    },
    { aspect: 'Padding', note: 'Symmetric (16px on both sides at the default size), so nothing to mirror.' },
    {
      aspect: 'The row-expansion toggle',
      note: 'The stylesheet ships an explicit :dir(rtl) rule that rotates its chevron 180 degrees — the one place the library mirrors something by hand.',
    },
    {
      aspect: 'Numeric columns',
      note: 'Yours to handle. A right-aligned number column in an LTR layout is class="num" in your template; nothing in the library knows which columns are numeric.',
    },
  ];

  readonly rtlNote =
    'Computed style and rendered box positions on the same cells with dir="rtl" on the document element, against the same cells in dir="ltr". What survives the flip is what is written logically or symmetrically — text-align: start, the bottom-edge border, the equal padding on both sides. What does not is the gridlines variant: the shipped stylesheet carries no border-inline declaration under any .p-datatable selector, and exactly one :dir(rtl) rule in the whole component, on the row-toggle chevron. Numeric alignment is yours in both directions; nothing in the library knows which columns are numbers.';
}
