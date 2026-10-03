/**
 * PathResolverComponent
 *
 * Two parameters, one live answer: the reader picks the directory they are
 * standing in and types a path, and the widget resolves the second against the
 * first on every keystroke — absolute or relative, the resulting absolute path,
 * the walk that produced it, and where it lands in a small file tree (or that
 * it lands nowhere).
 *
 * It exists to make one sentence of the terminal article falsifiable rather
 * than merely stated: "/data/file.csv is something entirely different from
 * data/file.csv". Drop the leading slash and the same name lands elsewhere;
 * keep the path and move the working directory and it lands elsewhere again.
 *
 * Content-free by design: the caller passes a `config` with the tree, the
 * starting working directory, the starting input and the home directory. The
 * component owns only its own chrome strings (`pathResolver.*`); the tree's
 * names are file names and are deliberately NOT translated, matching the
 * article's own walkthrough, which keeps `project` / `data` / `src` in every
 * language variant.
 *
 * All arithmetic lives in `path-resolver.engine.ts` and is unit-tested there.
 *
 * SSR-safe: no timers and no browser globals, and both parameters start at
 * their configured defaults — an embedding page prerenders showing the default
 * resolution.
 */
import { Component, ChangeDetectionStrategy, computed, linkedSignal, input, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { TranslationService } from '../../../services/translation.service';

import { annotateTree, directoryPaths, resolveIn, type PathNode, type ResolveStep } from './path-resolver.engine';

/** Configuration for one embedded resolver. */
export interface PathResolverConfig {
  /** The demo file tree. Its root node stands for '/'; its name is not shown. */
  tree: PathNode;
  /** Working directory the widget starts in — an absolute path inside `tree`. */
  defaultWorkingDirectory: string;
  /** What the path field starts with. */
  defaultInput: string;
  /** Absolute path that `~` expands to. */
  homeDirectory: string;
}

/** Deterministic instance counter — a random id would differ between the
 *  server render and the hydrated one. */
let instanceCounter = 0;

@Component({
  selector: 'app-path-resolver',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="resolver">
      <!-- The two parameters -->
      <div class="controls">
        <div class="control">
          <label [attr.for]="cwdId">{{ translate('pathResolver.label.workingDirectory') }}</label>
          <!-- BOTH bindings are needed and neither is redundant: [attr.selected]
               below is what the prerendered HTML carries (a property binding
               never serializes), while [value] here is what actually moves an
               already-rendered select — after a reset the browser ignores a
               changed selected ATTRIBUTE. Deleting either breaks one of the two. -->
          <select
            [attr.id]="cwdId"
            class="field"
            [value]="workingDirectory()"
            (change)="onWorkingDirectoryChange($event)"
          >
            @for (dir of directories(); track dir) {
              <!-- attr, not property: a property binding sets the DOM only, so the
                   prerendered markup would show the first option while the verdict
                   below already spoke about the configured one. -->
              <option [value]="dir" [attr.selected]="dir === workingDirectory() ? '' : null">{{ dir }}</option>
            }
          </select>
        </div>

        <div class="control">
          <label [attr.for]="inputId">{{ translate('pathResolver.label.path') }}</label>
          <input
            [attr.id]="inputId"
            class="field"
            type="text"
            autocomplete="off"
            spellcheck="false"
            [attr.placeholder]="translate('pathResolver.label.placeholder')"
            [value]="pathInput()"
            (input)="onPathInput($event)"
            (change)="commitPathInput()"
          />
        </div>

        <button type="button" class="reset-btn" (click)="reset()">
          {{ translate('pathResolver.action.reset') }}
        </button>
      </div>

      <!-- The answer as one spoken sentence. Deliberately fed by the SETTLED
           path (see announcedResolution), not by every keystroke: the visible
           panels below update per character, but re-announcing a whole absolute
           path on top of the screen reader's own character echo would bury it. -->
      <p class="sr-only" aria-live="polite">{{ summary() }}</p>

      <div class="verdict">
        <div class="verdict-row">
          <span class="badge">{{ kindLabel() }}</span>
          <span class="kind-hint">{{ kindHint() }}</span>
        </div>
        <div class="verdict-row">
          <span class="verdict-label">{{ translate('pathResolver.result.landsAt') }}</span>
          <code class="absolute">{{ resolution().absolute }}</code>
        </div>
        <div class="verdict-row">
          <span class="target" [class.found]="isFound()" [class.missing]="!isFound()">
            <i
              class="pi"
              [class.pi-check-circle]="isFound()"
              [class.pi-times-circle]="!isFound()"
              aria-hidden="true"
            ></i>
            {{ targetLabel() }}
          </span>
        </div>
      </div>

      <!-- The walk that produced it -->
      <div class="trace-section">
        <h4>{{ translate('pathResolver.trace.title') }}</h4>
        <ol class="trace">
          @for (step of resolution().steps; track $index) {
            <li>
              <code class="step-segment">{{ step.segment }}</code>
              <span class="step-action">{{ stepLabel(step) }}</span>
              <code class="step-path">{{ step.path }}</code>
            </li>
          }
        </ol>
      </div>

      <!-- The tree, with the two marked rows -->
      <div class="tree-section">
        <h4>{{ translate('pathResolver.tree.title') }}</h4>
        <div class="tree-scroll">
          <ul class="tree">
            <ng-container [ngTemplateOutlet]="nodeTpl" [ngTemplateOutletContext]="{ $implicit: treeView() }" />
          </ul>
        </div>
      </div>

      <ng-template #nodeTpl let-node>
        <li>
          <span
            class="node"
            [class.is-here]="node.path === workingDirectory()"
            [class.is-target]="isTargetRow(node.path)"
          >
            <i
              class="pi"
              [class.pi-folder]="node.type === 'dir'"
              [class.pi-file]="node.type === 'file'"
              aria-hidden="true"
            ></i>
            <code class="node-name">{{ node.name }}</code>
            @if (node.path === workingDirectory()) {
              <span class="marker marker-here">
                <i class="pi pi-map-marker" aria-hidden="true"></i>{{ translate('pathResolver.tree.here') }}
              </span>
            }
            @if (isTargetRow(node.path)) {
              <span class="marker marker-target">
                <i class="pi pi-arrow-right" aria-hidden="true"></i>{{ translate('pathResolver.tree.target') }}
              </span>
            }
          </span>
          @if (node.children.length > 0) {
            <ul>
              @for (child of node.children; track child.path) {
                <ng-container [ngTemplateOutlet]="nodeTpl" [ngTemplateOutletContext]="{ $implicit: child }" />
              }
            </ul>
          }
        </li>
      </ng-template>
    </div>
  `,
  styles: [
    `
      /* A query container: the @container rules below read the width of the
       column this widget sits in (article, demo frame, card), not the window. */
      :host {
        display: block;
        container-type: inline-size;
      }

      .resolver {
        display: block;
      }

      /* -- Controls -- */
      .controls {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 0.75rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1.25rem;
      }

      .control {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        flex: 1 1 14rem;
        min-width: 0;
      }

      .control label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .field {
        width: 100%;
        padding: 0.5rem 0.65rem;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: var(--text-color);
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius, 6px);
      }

      /* Aura zeroes the form-control focus ring, and these are plain HTML
         controls the kit's family rules do not reach — so each draws its own. */
      .field:focus-visible,
      .reset-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .reset-btn {
        flex: 0 0 auto;
        min-height: 2.4rem;
        padding: 0.5rem 1rem;
        font-family: inherit;
        font-size: 0.85rem;
        color: var(--primary-color-fg);
        background: var(--surface-card);
        border: 1px solid var(--primary-color-fg);
        border-radius: var(--border-radius, 6px);
        cursor: pointer;
      }

      .reset-btn:hover {
        background: var(--surface-ground);
      }

      /* -- Verdict -- */
      .verdict {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        border-radius: 0 8px 8px 0;
        padding: 1rem 1.25rem;
        margin-bottom: 1.25rem;
      }

      .verdict-row {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 0.5rem;
        min-width: 0;
      }

      .badge {
        padding: 0.15rem 0.5rem;
        background: var(--primary-color);
        color: var(--primary-color-text);
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      .kind-hint,
      .verdict-label {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      .absolute {
        font-family: var(--font-mono);
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        overflow-wrap: anywhere;
      }

      /* The hue is doubled by an icon and by the label text, never carried alone.
         Measured in docs/generated/CONTRAST.MD (SC 1.4.3): --semantic-green-fg on
         --surface-card 5.02:1 light / 10.42:1 dark, --semantic-red-fg 6.47:1 / 7.71:1. */
      .target {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.9rem;
        font-weight: 600;
      }

      .target.found {
        color: var(--semantic-green-fg);
      }

      .target.missing {
        color: var(--semantic-red-fg);
      }

      /* -- Trace -- */
      .trace-section,
      .tree-section {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1.25rem;
      }

      .trace-section h4,
      .tree-section h4 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        color: var(--text-color);
      }

      .trace {
        margin: 0;
        padding-left: 1.5rem;
      }

      /* Deliberately NOT display:flex — that would drop list-item and with it
         the step numbers, which are half of what makes a trace readable. The
         children are inline and wrap on their own. */
      .trace li {
        font-size: 0.85rem;
        line-height: 1.6;
        color: var(--text-color);
      }

      .trace li > * + * {
        margin-left: 0.5rem;
      }

      .step-segment {
        font-family: var(--font-mono);
        font-weight: 600;
        overflow-wrap: anywhere;
      }

      .step-action {
        color: var(--text-color-secondary);
      }

      .step-path {
        font-family: var(--font-mono);
        color: var(--text-color-secondary);
        overflow-wrap: anywhere;
      }

      /* -- Tree -- */
      .tree-scroll {
        overflow-x: auto;
      }

      .tree,
      .tree ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .tree ul {
        padding-left: 1.25rem;
        border-left: 1px solid var(--surface-border);
        margin-left: 0.5rem;
      }

      .tree li {
        padding: 0.1rem 0;
      }

      .node {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        border: 1px solid transparent;
        white-space: nowrap;
        font-size: 0.85rem;
        color: var(--text-color);
      }

      /* Both marked rows also carry a text marker, so the outline is a second
         signal rather than the only one. */
      .node.is-here {
        border-color: var(--surface-border);
        background: var(--surface-ground);
      }

      .node.is-target {
        border-color: var(--primary-color-fg);
      }

      .node-name {
        font-family: var(--font-mono);
      }

      .marker {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.72rem;
        font-family: inherit;
        color: var(--text-color-secondary);
      }

      .marker-target {
        color: var(--primary-color-fg);
      }

      /* -- Narrow widget -- */
      @container (max-width: 560px) {
        .controls {
          flex-direction: column;
          align-items: stretch;
          padding: 1rem;
        }

        .reset-btn {
          width: 100%;
        }

        .trace-section,
        .tree-section {
          padding: 1rem;
        }
      }

      /* Print: the controls are a screen affordance, but the resolution they
         produced, the trace and the marked tree all still carry the argument. */
      @media print {
        .reset-btn {
          display: none !important;
        }

        .verdict,
        .trace-section,
        .tree-section {
          break-inside: avoid;
        }

        .node.is-here,
        .node.is-target {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathResolverComponent {
  readonly config = input.required<PathResolverConfig>();

  private readonly translationService = inject(TranslationService);

  /** Stable ids so several resolvers on one page keep distinct label targets. */
  private readonly instance = ++instanceCounter;
  readonly cwdId = `path-resolver-cwd-${this.instance}`;
  readonly inputId = `path-resolver-input-${this.instance}`;

  /**
   * The two parameters. `linkedSignal` rather than a plain signal so a new
   * `config` reinstates its own defaults instead of stranding the widget on
   * the previous one's working directory.
   */
  readonly workingDirectory = linkedSignal({
    source: () => this.config(),
    computation: (config: PathResolverConfig) => config.defaultWorkingDirectory,
  });
  readonly pathInput = linkedSignal({
    source: () => this.config(),
    computation: (config: PathResolverConfig) => config.defaultInput,
  });

  /**
   * The path as last SETTLED — committed on `change` (blur or Enter) rather
   * than on every `input`. Only the live region reads it. Everything visible
   * reads `pathInput` and keeps updating per keystroke; a screen reader gets
   * one announcement per finished path instead of one per character.
   */
  private readonly settledInput = linkedSignal({
    source: () => this.config(),
    computation: (config: PathResolverConfig) => config.defaultInput,
  });

  /** Every directory in the tree, derived — never a second hand-kept list. */
  readonly directories = computed(() => directoryPaths(this.config().tree));

  readonly treeView = computed(() => annotateTree(this.config().tree));

  readonly resolution = computed(() =>
    resolveIn(this.config().tree, this.pathInput(), this.workingDirectory(), this.config().homeDirectory),
  );

  readonly isFound = computed(() => this.resolution().target !== 'missing');

  readonly kindLabel = computed(() => this.translate(`pathResolver.kind.${this.resolution().kind}`));
  readonly kindHint = computed(() => this.translate(`pathResolver.hint.${this.resolution().kind}`));
  readonly targetLabel = computed(() => this.translate(`pathResolver.target.${this.resolution().target}`));

  /**
   * The resolution the live region speaks about: the settled path, but the
   * CURRENT working directory — picking from a select is a discrete act that
   * settles immediately, so it should be announced at once.
   */
  private readonly announcedResolution = computed(() =>
    resolveIn(this.config().tree, this.settledInput(), this.workingDirectory(), this.config().homeDirectory),
  );

  /**
   * The one sentence the live region announces. Screen-reader users get the
   * verdict as prose; the panels below are the same facts laid out.
   */
  readonly summary = computed(() => {
    const announced = this.announcedResolution();
    return this.translate('pathResolver.summary')
      .replaceAll('{{kind}}', this.translate(`pathResolver.kind.${announced.kind}`))
      .replaceAll('{{absolute}}', announced.absolute)
      .replaceAll('{{target}}', this.translate(`pathResolver.target.${announced.target}`));
  });

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /** True only when something was actually found there — a missing path has no row. */
  isTargetRow(path: string): boolean {
    return this.isFound() && path === this.resolution().absolute;
  }

  stepLabel(step: ResolveStep): string {
    return this.translate(`pathResolver.trace.${step.action}`);
  }

  onWorkingDirectoryChange(event: Event): void {
    this.workingDirectory.set((event.target as HTMLSelectElement).value);
  }

  onPathInput(event: Event): void {
    this.pathInput.set((event.target as HTMLInputElement).value);
  }

  /** `change` on a text field means blur or Enter — the path has settled. */
  commitPathInput(): void {
    this.settledInput.set(this.pathInput());
  }

  /** Back to the configured starting point — both parameters, in one press. */
  reset(): void {
    const config = this.config();
    this.workingDirectory.set(config.defaultWorkingDirectory);
    this.pathInput.set(config.defaultInput);
    // A press is a settled act; announce the restored state immediately.
    this.settledInput.set(config.defaultInput);
  }
}
