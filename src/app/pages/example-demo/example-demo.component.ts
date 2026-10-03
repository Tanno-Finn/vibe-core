/**
 * Example demo (/example-demo) — the demo that documents itself.
 *
 * This page is deliberately content-free ("fachfrei"): its interactive core is
 * pure geometry (colored dots reacting to controls), because its actual subject
 * is the STRUCTURE of a good interactive demo. Every section both demonstrates
 * a building block and explains it, so downstream kit users can copy this file
 * as the blueprint for their own demos:
 *
 *   1. Page header (app-page-header, single h1)
 *   2. Intro callout (app-example-box) — "this is a placeholder demo"
 *   3. Interactive core: canvas + controls row (slider, select, start/pause,
 *      reset) with the kit's a11y conventions — aria-labels, sr-only live
 *      region, forced-colors text fallback, prefers-reduced-motion respected
 *   4. "How a demo is built" explainer (Controls → Visualization → Observe →
 *      Understand)
 *   5. A checkpoint (app-checkpoint) about the demo structure itself
 *   6. Takeaways (app-takeaways-list) + "build your own" pointers
 *
 * SSR-safe: all canvas/rAF/matchMedia access is behind isPlatformBrowser.
 * Zoneless-safe: OnPush + signals; canvas redraws are driven by ONE effect
 * that tracks every visual signal and schedules a deduplicated rAF redraw.
 */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Optimus UI
import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectModule } from '@openng/optimus-ui/select';
import { SliderModule } from '@openng/optimus-ui/slider';

// Services
import { TranslationService } from '../../services/translation.service';

// Kit components
import { ArticleComponent } from '../../components/shared/article.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { StandardContainerComponent } from '../../components/shared/standard-container.component';
import { ExampleBoxComponent } from '../../components/shared/example-box.component';
import { CheckpointComponent } from '../../components/shared/checkpoint.component';
import { TakeawaysListComponent } from '../../components/shared/takeaways-list.component';
import { InfoTooltipComponent } from '../../components/shared/info-tooltip.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { DemoRelatedRefsComponent } from '../../components/shared/demo-related-refs.component';

/** The four placeholder layouts the "pattern" select offers. */
type Pattern = 'scatter' | 'ring' | 'grid' | 'wave';

const PATTERNS: readonly Pattern[] = ['scatter', 'ring', 'grid', 'wave'];

const DEFAULT_POINT_COUNT = 60;
const MIN_POINTS = 10;
const MAX_POINTS = 200;
const DEFAULT_PATTERN: Pattern = 'scatter';

/** Deterministic PRNG (mulberry32) so "scatter" looks identical after Reset. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Dot {
  x: number; // base position, data space [0,1]
  y: number;
  phase: number; // per-dot animation phase offset
  group: 0 | 1; // color group (visual variety only — no meaning, on purpose)
}

@Component({
  selector: 'app-example-demo',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    SelectModule,
    SliderModule,
    ArticleComponent,
    PageHeaderComponent,
    StandardContainerComponent,
    ExampleBoxComponent,
    CheckpointComponent,
    TakeawaysListComponent,
    InfoTooltipComponent,
    FabStackComponent,
    SimpleEasyLanguageFabComponent,
    DemoRelatedRefsComponent,
  ],
  template: `
    <app-article width="page" [transparentBackground]="true">
      <!-- 1 · Page header: every demo starts with exactly one h1 + subtitle -->
      <app-page-header titleKey="exampleDemo.title" subtitleKey="exampleDemo.subtitle" />

      <!-- 2 · Intro callout: tell the visitor what this page is (a blueprint) -->
      <app-example-box type="info" titleKey="exampleDemo.intro.title" contentKey="exampleDemo.intro.text" />

      <!-- 3 · Interactive core: canvas + controls row -->
      <app-standard-container
        id="demo"
        [config]="{
          titleKey: 'exampleDemo.demo.title',
          type: 'demo',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          headingLevel: 2,
        }"
      >
        <p class="demo-lead">{{ translate('exampleDemo.demo.lead') }}</p>

        <div class="demo-layout">
          <!-- Visualization: pure geometry, no domain content -->
          <div class="stage">
            <canvas
              #canvas
              class="demo-canvas"
              role="img"
              [attr.aria-label]="translate('exampleDemo.demo.canvasAria')"
            ></canvas>

            <!-- Forced-colors fallback: canvas pixels can't honor system
                 colors, so high-contrast mode gets a text summary instead
                 (hidden in normal rendering, see styles). Silenced while the
                 animation runs to avoid a live-region flood (WCAG 4.1.3). -->
            <p class="canvas-forced-colors-note" [attr.aria-live]="running() ? 'off' : 'polite'">
              {{ canvasSummary() }}
            </p>
          </div>

          <!-- Controls: one slider, one select, start/pause + reset -->
          <div class="controls-panel">
            <label class="control-field" for="exd-points">
              <span class="control-label">
                {{ translate('exampleDemo.controls.points') }}: <strong>{{ pointCount() }}</strong>
                <app-info-tooltip
                  [text]="translate('exampleDemo.tooltip.points')"
                  [forLabel]="translate('exampleDemo.controls.points')"
                  [moreInfoLabel]="translate('exampleDemo.tooltip.moreInfo')"
                />
              </span>
              <p-slider
                id="exd-points"
                [min]="MIN_POINTS"
                [max]="MAX_POINTS"
                [step]="5"
                [ngModel]="pointCount()"
                (onChange)="onPointsSlide($event)"
                (ngModelChange)="onPointsSlide($event)"
                [ariaLabel]="pointsAria()"
              />
            </label>

            <div class="control-field">
              <!-- The id sits on the TEXT, not on the row. An accessible name is
                   computed from the whole subtree of the referenced element, so with
                   the id on the row the tooltip trigger's own aria-label folded into
                   the select's name: "Muster Mehr Informationen: Muster". -->
              <span class="control-label">
                <span id="exd-pattern-label">{{ translate('exampleDemo.controls.pattern') }}</span>
                <app-info-tooltip
                  [text]="translate('exampleDemo.tooltip.pattern')"
                  [forLabel]="translate('exampleDemo.controls.pattern')"
                  [moreInfoLabel]="translate('exampleDemo.tooltip.moreInfo')"
                />
              </span>
              <!-- [ariaLabelledBy] (the Input), not [attr.aria-labelledby]: p-select's
                   focusable element is a <span role="combobox"> inside the host, so a host
                   attribute is ignored and the current value gets announced as the name. -->
              <p-select
                [options]="patternOptions()"
                optionLabel="label"
                optionValue="value"
                [ngModel]="pattern()"
                (ngModelChange)="setPattern($event)"
                [ariaLabelledBy]="'exd-pattern-label'"
                [style]="{ width: '100%' }"
              />
            </div>

            <!-- Mobile-full-width buttons via the global btn-mobile-full class -->
            <div class="control-buttons">
              <p-button
                [label]="running() ? translate('exampleDemo.controls.pause') : translate('exampleDemo.controls.start')"
                [icon]="running() ? 'pi pi-pause' : 'pi pi-play'"
                styleClass="btn-mobile-full"
                [disabled]="reducedMotion()"
                (onClick)="toggleRun()"
              />
              <p-button
                [label]="translate('exampleDemo.controls.reset')"
                icon="pi pi-refresh"
                severity="secondary"
                [outlined]="true"
                styleClass="btn-mobile-full"
                (onClick)="reset()"
              />
            </div>

            @if (reducedMotion()) {
              <p class="motion-note">{{ translate('exampleDemo.controls.reducedMotion') }}</p>
            }

            <!-- Live region: announces discrete state changes to screen
                 readers (never per animation frame). -->
            <p class="sr-only" aria-live="polite" aria-atomic="true">{{ statusMessage() }}</p>
          </div>
        </div>
      </app-standard-container>

      <!-- 4 · Explainer: the four building blocks every demo shares -->
      <app-standard-container
        id="structure"
        [config]="{
          titleKey: 'exampleDemo.structure.title',
          type: 'info',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'sm',
          headingLevel: 2,
        }"
      >
        <p class="structure-intro">{{ translate('exampleDemo.structure.intro') }}</p>

        <h3 class="structure-step">
          <span class="step-badge" aria-hidden="true">1</span>{{ translate('exampleDemo.structure.controls.title') }}
        </h3>
        <p>{{ translate('exampleDemo.structure.controls.text') }}</p>

        <h3 class="structure-step">
          <span class="step-badge" aria-hidden="true">2</span>{{ translate('exampleDemo.structure.viz.title') }}
        </h3>
        <p>{{ translate('exampleDemo.structure.viz.text') }}</p>

        <h3 class="structure-step">
          <span class="step-badge" aria-hidden="true">3</span>{{ translate('exampleDemo.structure.observe.title') }}
        </h3>
        <p>{{ translate('exampleDemo.structure.observe.text') }}</p>

        <h3 class="structure-step">
          <span class="step-badge" aria-hidden="true">4</span>{{ translate('exampleDemo.structure.understand.title') }}
        </h3>
        <p>{{ translate('exampleDemo.structure.understand.text') }}</p>
      </app-standard-container>

      <!-- 5 · Checkpoint: a persisted self-check about the structure itself -->
      <app-checkpoint
        checkpointId="structure"
        storageKey="example-demo-checkpoints"
        titleKey="exampleDemo.checkpoint.title"
        [headingLevel]="2"
        [items]="[{ textKey: 'exampleDemo.checkpoint.item1' }]"
      />

      <!-- 6 · Takeaways + "build your own" close -->
      <app-standard-container
        id="takeaways"
        [config]="{
          titleKey: 'exampleDemo.takeaways.title',
          type: 'success',
          elevation: 'sm',
          headingLevel: 2,
        }"
      >
        <app-takeaways-list [text]="translate('exampleDemo.takeaways.text')" />
      </app-standard-container>

      <app-standard-container
        id="build-your-own"
        [config]="{
          titleKey: 'exampleDemo.build.title',
          type: 'primary',
          elevation: 'sm',
          headingLevel: 2,
        }"
      >
        <p>{{ translate('exampleDemo.build.text') }}</p>
        <ul class="build-links">
          <li><code>/dev/design</code> — {{ translate('exampleDemo.build.designWorkshop') }}</li>
          <li><code>/new-component</code> — {{ translate('exampleDemo.build.newComponent') }}</li>
        </ul>
      </app-standard-container>

      <!-- 7 · Related content — the demo-side mount of app-related-refs,
           fed by the registry entry's related block (mirrors LessonTemplate). -->
      <app-demo-related demoId="seed-demo" />

      <app-fab-stack>
        <app-simple-easy-language-fab contentId="example-demo" contentType="demo" [alwaysShow]="true" />
      </app-fab-stack>
    </app-article>
  `,
  styles: [
    `
      .demo-lead {
        margin: 0 0 var(--space-3, 1rem);
        color: var(--text-color-secondary);
        line-height: 1.55;
      }

      /* Widget pattern: the host is the size container, the layout switches on
       the width actually available to it — a viewport query lies as soon as
       the page is mounted in a narrower column. */
      :host {
        display: block;
        container-type: inline-size;
      }
      .demo-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-4, 1.25rem);
        align-items: start;
      }
      @container (min-width: 700px) {
        .demo-layout {
          grid-template-columns: minmax(0, 1.3fr) minmax(15rem, 1fr);
        }
      }

      .stage {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .demo-canvas {
        width: 100%;
        aspect-ratio: 1 / 1;
        display: block;
        background: var(--surface-section, var(--surface-ground));
        border: 1px solid var(--surface-border);
        border-radius: 14px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
      }

      /* Forced-colors fallback note — invisible in normal rendering, surfaced
       as text when the OS forces its own palette (canvas can't follow it). */
      .canvas-forced-colors-note {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
      }
      @media (forced-colors: active) {
        .canvas-forced-colors-note {
          position: static;
          width: auto;
          height: auto;
          margin: 0.25rem 0 0;
          padding: 0.5rem 0.75rem;
          overflow: visible;
          clip: auto;
          white-space: normal;
          border: 1px solid CanvasText;
          border-radius: 8px;
          font-size: 0.85rem;
        }
      }

      .controls-panel {
        display: flex;
        flex-direction: column;
        gap: var(--space-3, 1rem);
        padding: var(--space-3, 1rem);
        background: var(--surface-section, var(--surface-ground));
        border: 1px solid var(--surface-border);
        border-radius: 14px;
      }

      .control-field {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
      }
      .control-label {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.9rem;
        color: var(--text-color);
      }
      .control-label strong {
        font-variant-numeric: tabular-nums;
      }
      .control-field p-slider {
        width: 100%;
      }

      .control-buttons {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }
      .control-buttons > p-button {
        flex: 1 1 8rem;
      }

      .motion-note {
        margin: 0;
        font-size: 0.82rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      .structure-intro {
        color: var(--text-color-secondary);
        line-height: 1.55;
      }
      .structure-step {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: var(--space-3, 1rem) 0 0.35rem;
        font-size: 1.05rem;
      }
      .step-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        flex: 0 0 auto;
        border-radius: 999px;
        background: var(--primary-500, #f59e0b);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 800;
      }

      .build-links {
        margin: 0.5rem 0 0;
        padding-left: 1.25rem;
        line-height: 1.7;
      }
      .build-links code {
        background: var(--surface-section, var(--surface-ground));
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        padding: 0.1rem 0.4rem;
        font-size: 0.85em;
      }

      @media (prefers-reduced-motion: reduce) {
        :host * {
          transition: none !important;
          animation: none !important;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleDemoComponent {
  private readonly translationService = inject(TranslationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly MIN_POINTS = MIN_POINTS;
  protected readonly MAX_POINTS = MAX_POINTS;

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  // ── State (signals; zoneless-safe) ──
  protected readonly pointCount = signal(DEFAULT_POINT_COUNT);
  protected readonly pattern = signal<Pattern>(DEFAULT_PATTERN);
  protected readonly running = signal(false);
  /** Discrete-event live-region message (never updated per animation frame). */
  protected readonly statusMessage = signal('');

  /** Honor prefers-reduced-motion: the drift animation is disabled, the demo
   *  stays fully usable through the (static) controls. Read once at init.
   *  Signal, not plain field — it is set after first render and the template
   *  must react under zoneless/OnPush change detection. */
  protected readonly reducedMotion = signal(false);

  // ── Rendering ──
  private ctx: CanvasRenderingContext2D | null = null;
  private cssSize = 320; // css px, square
  private dpr = 1;
  private rafId: number | null = null;
  private drawScheduled = false;
  private time = 0; // animation clock (seconds-ish)
  /** Theme colors, re-read from CSS custom properties on every full redraw. */
  private colA = '#f59e0b';
  private colB = '#1d4ed8';

  /** Dots derived deterministically from count + pattern (Reset reproduces). */
  private readonly dots = computed<Dot[]>(() => {
    const n = this.pointCount();
    const pattern = this.pattern();
    const rnd = mulberry32(42);
    const dots: Dot[] = [];
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0;
      let x = 0.5,
        y = 0.5;
      switch (pattern) {
        case 'scatter': {
          x = 0.06 + rnd() * 0.88;
          y = 0.06 + rnd() * 0.88;
          break;
        }
        case 'ring': {
          const a = t * Math.PI * 2;
          x = 0.5 + Math.cos(a) * 0.36;
          y = 0.5 + Math.sin(a) * 0.36;
          break;
        }
        case 'grid': {
          const cols = Math.ceil(Math.sqrt(n));
          const rows = Math.ceil(n / cols);
          x = cols > 1 ? 0.1 + ((i % cols) / (cols - 1)) * 0.8 : 0.5;
          y = rows > 1 ? 0.1 + (Math.floor(i / cols) / (rows - 1)) * 0.8 : 0.5;
          break;
        }
        case 'wave': {
          x = 0.06 + t * 0.88;
          y = 0.5 + Math.sin(t * Math.PI * 4) * 0.28;
          break;
        }
      }
      dots.push({ x, y, phase: rnd() * Math.PI * 2, group: i % 2 === 0 ? 0 : 1 });
    }
    return dots;
  });

  constructor() {
    // ONE reactive redraw pipeline: track every signal the canvas shows and
    // schedule a deduplicated rAF redraw (robust against forgotten calls).
    effect(() => {
      this.dots(); // tracks pointCount + pattern
      this.scheduleDraw();
    });

    afterNextRender(() => this.setupCanvas());
    this.destroyRef.onDestroy(() => this.stopLoop());
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // ── Derived view state (computed, so the zoneless template tracks it) ──
  protected patternOptions(): { label: string; value: Pattern }[] {
    return PATTERNS.map((p) => ({
      value: p,
      label: this.translate('exampleDemo.controls.patterns.' + p),
    }));
  }

  protected readonly pointsAria = computed(() =>
    this.translate('exampleDemo.controls.pointsAria').replace('{n}', String(this.pointCount())),
  );

  /** Text summary of the canvas for forced-colors / high-contrast users. */
  protected readonly canvasSummary = computed(() =>
    this.translate('exampleDemo.demo.summary')
      .replace('{n}', String(this.pointCount()))
      .replace('{pattern}', this.translate('exampleDemo.controls.patterns.' + this.pattern()))
      .replace('{state}', this.translate(this.running() ? 'exampleDemo.status.running' : 'exampleDemo.status.paused')),
  );

  // ── User actions ──
  protected onPointsSlide(ev: { value?: number } | number): void {
    const v = typeof ev === 'number' ? ev : (ev?.value ?? this.pointCount());
    const clamped = Math.min(MAX_POINTS, Math.max(MIN_POINTS, Math.round(v)));
    if (clamped === this.pointCount()) return;
    this.pointCount.set(clamped);
    this.statusMessage.set(this.translate('exampleDemo.status.points').replace('{n}', String(clamped)));
  }

  protected setPattern(p: Pattern): void {
    if (p === this.pattern()) return;
    this.pattern.set(p);
    this.statusMessage.set(
      this.translate('exampleDemo.status.pattern').replace(
        '{pattern}',
        this.translate('exampleDemo.controls.patterns.' + p),
      ),
    );
  }

  protected toggleRun(): void {
    if (this.reducedMotion()) return;
    if (this.running()) {
      this.running.set(false);
      this.stopLoop();
      this.statusMessage.set(this.translate('exampleDemo.status.paused'));
    } else {
      this.running.set(true);
      this.startLoop();
      this.statusMessage.set(this.translate('exampleDemo.status.running'));
    }
  }

  /** Reset restores the initial state of ALL controls (kit convention: the
   *  reset button says what it resets — here, the whole demo). */
  protected reset(): void {
    this.running.set(false);
    this.stopLoop();
    this.time = 0;
    this.pointCount.set(DEFAULT_POINT_COUNT);
    this.pattern.set(DEFAULT_PATTERN);
    this.statusMessage.set(this.translate('exampleDemo.status.reset'));
    this.scheduleDraw();
  }

  // ── Canvas setup / drawing (browser-only) ──
  private setupCanvas(): void {
    if (!this.isBrowser) return;
    if (typeof window.matchMedia === 'function') {
      this.reducedMotion.set(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    const canvas = this.canvasRef().nativeElement;
    this.ctx = canvas.getContext('2d');
    const ro = new ResizeObserver(() => this.resizeCanvas());
    ro.observe(canvas);
    this.destroyRef.onDestroy(() => ro.disconnect());
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    if (!this.isBrowser || !this.ctx) return;
    const canvas = this.canvasRef().nativeElement;
    const size = Math.max(1, Math.round(canvas.clientWidth));
    this.cssSize = size;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * this.dpr);
    canvas.height = Math.round(size * this.dpr);
    this.draw();
  }

  private readThemeColors(): void {
    const cs = getComputedStyle(this.canvasRef().nativeElement);
    const pick = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
    this.colA = pick('--primary-500', '#f59e0b');
    this.colB = pick('--semantic-blue-fg', '#1d4ed8');
  }

  /** Throttle redraws to one per animation frame. */
  private scheduleDraw(): void {
    if (!this.isBrowser || this.drawScheduled) return;
    this.drawScheduled = true;
    requestAnimationFrame(() => {
      this.drawScheduled = false;
      this.draw();
    });
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    this.readThemeColors();
    const S = this.cssSize * this.dpr;
    if (S <= 0) return;
    ctx.clearRect(0, 0, S, S);

    const amp = 0.018; // gentle drift amplitude (data space)
    const t = this.time;
    const radius = Math.max(2.5, 0.011 * S);

    for (const d of this.dots()) {
      // When paused (or reduced motion), t is frozen → static layout.
      const x = (d.x + Math.sin(t * 1.3 + d.phase) * amp) * S;
      const y = (d.y + Math.cos(t * 1.1 + d.phase) * amp) * S;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = d.group === 0 ? this.colA : this.colB;
      ctx.globalAlpha = 0.9;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── Animation loop ──
  private startLoop(): void {
    if (!this.isBrowser || this.rafId !== null) return;
    let last = performance.now();
    const tick = (now: number) => {
      this.time += (now - last) / 1000;
      last = now;
      this.draw();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.rafId !== null && this.isBrowser) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
}
