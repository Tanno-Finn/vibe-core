/**
 * HttpRequestFlowComponent
 *
 * An animated SVG diagram of a single HTTP round trip: browser → DNS →
 * TCP/TLS → request → server → response, and back. Play walks the six stages
 * on a timer, highlighting each box and the connection leading into it, while
 * a caption below names the current stage.
 *
 * The diagram geometry is fixed — the six boxes and their labels are the
 * subject, not a parameter — so the component owns its SVG labels and its
 * controls (`httpRequestFlow.*`). What the caller supplies through `config` is
 * the walkthrough text: one `labelKey`/`descriptionKey` pair per stage plus a
 * `translationPrefix` for the framing intro and "why this matters" boxes, so
 * the same diagram can be narrated differently in different articles.
 *
 * SSR-safe: the auto-advance timer is browser-only (`isPlatformBrowser`) and
 * starts on a click, so an embedding page prerenders with the diagram in its
 * resting state.
 */
import {
  Component,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  signal,
  computed,
  input,
  inject,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TranslationService } from '../../../services/translation.service';

/** One narrated stage of the round trip. Six stages match the six SVG boxes. */
export interface HttpRequestFlowStage {
  /** Stable id — used for tracking. */
  id: string;
  /** i18n key for the stage caption's title. */
  labelKey: string;
  /** i18n key for the stage caption's description. */
  descriptionKey: string;
}

/** Configuration for one embedded diagram. */
export interface HttpRequestFlowConfig {
  /** The narration, in diagram order — one entry per SVG box (six). */
  stages: HttpRequestFlowStage[];
  /** Milliseconds between auto-advance steps. */
  autoAdvanceDelay: number;
  /**
   * i18n prefix for the framing boxes: `<prefix>.intro.title`,
   * `.intro.description`, `.edu.title` and `.edu.description` must exist.
   */
  translationPrefix: string;
  /** Overrides the SVG viewBox; the built-in geometry is drawn for the default. */
  svgViewBox?: string;
}

const DEFAULT_VIEW_BOX = '0 0 800 400';

@Component({
  selector: 'app-http-request-flow',
  standalone: true,
  imports: [],
  template: `
    <div class="flow">
      <!-- Framing: what the reader is about to watch -->
      <div class="intro-box">
        <strong>{{ translate(config().translationPrefix + '.intro.title') }}</strong>
        <p>{{ translate(config().translationPrefix + '.intro.description') }}</p>
      </div>

      <!-- Controls -->
      <div class="controls">
        <button class="ctrl-btn" (click)="toggleAnimation()" [class.playing]="isPlaying()">
          {{ isPlaying() ? translate('httpRequestFlow.controls.pause') : translate('httpRequestFlow.controls.play') }}
        </button>
        <button class="ctrl-btn" (click)="reset()">{{ translate('httpRequestFlow.controls.reset') }}</button>
      </div>

      <!-- Diagram -->
      <div class="svg-container">
        <svg
          [attr.viewBox]="viewBox()"
          xmlns="http://www.w3.org/2000/svg"
          class="flow-svg"
          role="img"
          [attr.aria-label]="translate(config().translationPrefix + '.intro.title')"
        >
          <defs>
            <marker id="hrf-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--surface-400)" />
            </marker>
            <marker id="hrf-arrow-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--primary-color)" />
            </marker>
          </defs>

          <!-- Stage 1: browser / client -->
          <g [class.active]="activeStage() >= 1" class="stage">
            <rect x="15" y="80" width="105" height="80" rx="8" class="box client-box" />
            <text x="67" y="115" class="label">{{ translate('httpRequestFlow.svg.browser') }}</text>
            <text x="67" y="135" class="sublabel">{{ translate('httpRequestFlow.svg.enterUrl') }}</text>
            <text x="67" y="68" class="heading">{{ translate('httpRequestFlow.svg.client') }}</text>
          </g>

          <!-- 1 → 2 -->
          <line
            x1="128"
            y1="120"
            x2="185"
            y2="120"
            [class.flow-active]="activeStage() >= 2"
            class="conn"
            [attr.marker-end]="activeStage() >= 2 ? 'url(#hrf-arrow-active)' : 'url(#hrf-arrow)'"
          />

          <!-- Stage 2: DNS -->
          <g [class.active]="activeStage() >= 2" class="stage">
            <rect x="193" y="90" width="95" height="60" rx="8" class="box dns-box" />
            <text x="240" y="116" class="label">{{ translate('httpRequestFlow.svg.dns') }}</text>
            <text x="240" y="132" class="sublabel">{{ translate('httpRequestFlow.svg.toIp') }}</text>
            <text x="240" y="78" class="heading">{{ translate('httpRequestFlow.svg.resolution') }}</text>
          </g>

          <!-- 2 → 3 -->
          <line
            x1="296"
            y1="120"
            x2="353"
            y2="120"
            [class.flow-active]="activeStage() >= 3"
            class="conn"
            [attr.marker-end]="activeStage() >= 3 ? 'url(#hrf-arrow-active)' : 'url(#hrf-arrow)'"
          />

          <!-- Stage 3: TCP/TLS -->
          <g [class.active]="activeStage() >= 3" class="stage">
            <rect x="361" y="90" width="95" height="60" rx="8" class="box tls-box" />
            <text x="408" y="116" class="label">{{ translate('httpRequestFlow.svg.tcpTls') }}</text>
            <text x="408" y="132" class="sublabel">{{ translate('httpRequestFlow.svg.handshake') }}</text>
            <text x="408" y="78" class="heading">{{ translate('httpRequestFlow.svg.connection') }}</text>
          </g>

          <!-- 3 → 4 -->
          <line
            x1="464"
            y1="120"
            x2="521"
            y2="120"
            [class.flow-active]="activeStage() >= 4"
            class="conn"
            [attr.marker-end]="activeStage() >= 4 ? 'url(#hrf-arrow-active)' : 'url(#hrf-arrow)'"
          />

          <!-- Stage 4: the request itself -->
          <g [class.active]="activeStage() >= 4" class="stage">
            <rect x="529" y="80" width="115" height="80" rx="8" class="box request-box" />
            <text x="586" y="112" class="label">{{ translate('httpRequestFlow.svg.getApi') }}</text>
            <text x="586" y="132" class="sublabel">{{ translate('httpRequestFlow.svg.headers') }}</text>
            <text x="586" y="68" class="heading">{{ translate('httpRequestFlow.svg.request') }}</text>
          </g>

          <!-- 4 → 5 -->
          <line
            x1="652"
            y1="120"
            x2="709"
            y2="120"
            [class.flow-active]="activeStage() >= 5"
            class="conn"
            [attr.marker-end]="activeStage() >= 5 ? 'url(#hrf-arrow-active)' : 'url(#hrf-arrow)'"
          />

          <!-- Stage 5: server -->
          <g [class.active]="activeStage() >= 5" class="stage">
            <rect x="717" y="85" width="70" height="70" rx="8" class="box server-box" />
            <text x="752" y="128" class="label server-icon">&#x2699;</text>
            <text x="752" y="73" class="heading">{{ translate('httpRequestFlow.svg.server') }}</text>
          </g>

          <!-- 5 → 6 -->
          <path
            d="M752,160 L752,285 L668,285"
            [class.flow-active]="activeStage() >= 6"
            class="conn"
            fill="none"
            [attr.marker-end]="activeStage() >= 6 ? 'url(#hrf-arrow-active)' : 'url(#hrf-arrow)'"
          />

          <!-- Stage 6: response -->
          <g [class.active]="activeStage() >= 6" class="stage">
            <rect x="395" y="260" width="267" height="50" rx="8" class="box response-box" />
            <text x="528" y="282" class="label">{{ translate('httpRequestFlow.svg.statusOk') }}</text>
            <text x="528" y="298" class="sublabel">{{ translate('httpRequestFlow.svg.jsonData') }}</text>
            <text x="528" y="250" class="heading">{{ translate('httpRequestFlow.svg.response') }}</text>
          </g>

          <!-- 6 → back to the browser -->
          <path
            d="M395,285 L67,285 L67,164"
            [class.flow-active]="activeStage() >= 6"
            class="conn"
            fill="none"
            [attr.marker-end]="activeStage() >= 6 ? 'url(#hrf-arrow-active)' : 'url(#hrf-arrow)'"
          />
          <text x="231" y="275" class="edge-text" [class.edge-active]="activeStage() >= 6">
            {{ translate('httpRequestFlow.svg.returnLabel') }}
          </text>
        </svg>
      </div>

      <!-- Stage caption -->
      <div class="stage-info" [class.info-visible]="activeStage() > 0" aria-live="polite">
        <div class="stage-step">{{ stageStepText() }}</div>
        <strong>{{ stageTitle() }}</strong>
        <p>{{ stageDescription() }}</p>
      </div>

      <!-- Framing: why this matters -->
      <div class="edu-box">
        <strong>{{ translate(config().translationPrefix + '.edu.title') }}</strong>
        <p>{{ translate(config().translationPrefix + '.edu.description') }}</p>
      </div>
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

      .flow {
        display: block;
      }

      /* ── Framing boxes ── */
      .intro-box,
      .edu-box {
        background: var(--surface-card);
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
        border-radius: 0 8px 8px 0;
        border: 1px solid var(--surface-border);
      }

      .intro-box {
        border-left: 4px solid var(--semantic-blue-fg);
      }
      .edu-box {
        border-left: 4px solid var(--semantic-green-fg);
      }

      .intro-box strong,
      .edu-box strong {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      .intro-box p,
      .edu-box p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }

      /* ── Controls ── */
      .controls {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }

      .ctrl-btn {
        padding: 0.5rem 1rem;
        border: 2px solid var(--surface-border);
        border-radius: var(--border-radius, 6px);
        background: var(--surface-card);
        color: var(--text-color);
        font-size: 0.85rem;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition:
          border-color 0.15s,
          background 0.15s;
      }

      .ctrl-btn:hover {
        border-color: var(--primary-color-fg);
      }

      .ctrl-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .ctrl-btn.playing {
        border-color: var(--semantic-green-fg);
        background: color-mix(in srgb, var(--semantic-green-fg) 8%, var(--surface-card));
      }

      /* ── Diagram ── */
      .svg-container {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        overflow-x: auto;
      }

      .flow-svg {
        width: 100%;
        height: auto;
        min-width: 600px;
      }

      .box {
        fill: var(--surface-ground);
        stroke: var(--surface-border);
        stroke-width: 2;
        transition:
          stroke 0.4s ease,
          stroke-width 0.4s ease;
      }

      .label {
        text-anchor: middle;
        font-size: 12px;
        font-weight: 600;
        fill: var(--text-color);
      }

      .sublabel {
        text-anchor: middle;
        font-size: 10px;
        fill: var(--text-color-secondary);
      }

      .heading {
        text-anchor: middle;
        font-size: 10px;
        font-weight: 700;
        fill: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .server-icon {
        font-size: 24px;
        fill: var(--primary-color);
      }

      /* One color per station, so the caption and the box agree at a glance. */
      .client-box {
        fill: color-mix(in srgb, var(--semantic-blue-fg) 8%, var(--surface-ground));
      }
      .dns-box {
        fill: color-mix(in srgb, var(--semantic-cyan-fg) 8%, var(--surface-ground));
      }
      .tls-box {
        fill: color-mix(in srgb, var(--semantic-pink-fg) 8%, var(--surface-ground));
      }
      .request-box {
        fill: color-mix(in srgb, var(--semantic-orange-fg) 8%, var(--surface-ground));
      }
      .server-box {
        fill: color-mix(in srgb, var(--primary-color) 8%, var(--surface-ground));
      }
      .response-box {
        fill: color-mix(in srgb, var(--semantic-green-fg) 8%, var(--surface-ground));
      }

      .stage.active .client-box {
        stroke: var(--semantic-blue-fg);
        stroke-width: 2.5;
      }
      .stage.active .dns-box {
        stroke: var(--semantic-cyan-fg);
        stroke-width: 2.5;
      }
      .stage.active .tls-box {
        stroke: var(--semantic-pink-fg);
        stroke-width: 2.5;
      }
      .stage.active .request-box {
        stroke: var(--semantic-orange-fg);
        stroke-width: 2.5;
      }
      .stage.active .server-box {
        stroke: var(--primary-color);
        stroke-width: 2.5;
      }
      .stage.active .response-box {
        stroke: var(--semantic-green-fg);
        stroke-width: 2.5;
      }

      /* ── Connections ── */
      .conn {
        stroke: var(--surface-border);
        stroke-width: 2;
        transition:
          stroke 0.3s,
          stroke-width 0.3s;
      }

      .conn.flow-active {
        stroke: var(--primary-color);
        stroke-width: 2.5;
        stroke-dasharray: 8 4;
        animation: hrfFlow 0.8s linear infinite;
      }

      @keyframes hrfFlow {
        to {
          stroke-dashoffset: -24;
        }
      }

      .edge-text {
        text-anchor: middle;
        font-size: 10px;
        font-weight: 600;
        fill: var(--text-color-secondary);
        transition: fill 0.3s;
      }

      .edge-text.edge-active {
        fill: var(--primary-color);
      }

      /* ── Stage caption ──
       The resting state is marked by a dashed border and a slightly recessed
       background, never by dimming the text: opacity would drop the caption
       below the 4.5:1 contrast floor. */
      .stage-info {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
        transition:
          background 0.3s,
          border-color 0.3s;
      }

      .stage-info:not(.info-visible) {
        background: color-mix(in srgb, var(--surface-card) 70%, var(--surface-ground));
        border-style: dashed;
      }

      .stage-step {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--primary-color-fg);
        margin-bottom: 0.5rem;
      }

      .stage-info strong {
        display: block;
        margin-bottom: 0.25rem;
        color: var(--text-color);
      }

      .stage-info p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-color);
      }

      @container (max-width: 480px) {
        .svg-container {
          padding: 0.5rem;
        }
      }

      /* Print: the controls and the transient caption carry no meaning on paper.
       Every station is drawn in its active state, so the printed diagram shows
       the complete round trip at once. */
      @media print {
        .controls,
        .stage-info {
          display: none !important;
        }

        .stage .box {
          stroke-width: 2.5;
        }
        .stage .client-box {
          stroke: var(--semantic-blue-fg);
        }
        .stage .dns-box {
          stroke: var(--semantic-cyan-fg);
        }
        .stage .tls-box {
          stroke: var(--semantic-pink-fg);
        }
        .stage .request-box {
          stroke: var(--semantic-orange-fg);
        }
        .stage .server-box {
          stroke: var(--primary-color);
        }
        .stage .response-box {
          stroke: var(--semantic-green-fg);
        }

        .conn {
          stroke: var(--primary-color);
          stroke-width: 2.5;
          stroke-dasharray: none;
          animation: none !important;
        }

        .edge-text {
          fill: var(--primary-color);
        }

        .svg-container {
          break-inside: avoid;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .edu-box {
          break-inside: avoid;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpRequestFlowComponent implements OnDestroy {
  readonly config = input.required<HttpRequestFlowConfig>();

  private readonly translationService = inject(TranslationService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly isPlaying = signal(false);
  readonly activeStage = signal(0);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly viewBox = computed(() => this.config().svgViewBox ?? DEFAULT_VIEW_BOX);
  readonly totalStages = computed(() => this.config().stages.length);

  readonly stageStepText = computed(() =>
    this.translate('httpRequestFlow.stage.step')
      .replace('{{current}}', this.activeStage().toString())
      .replace('{{total}}', this.totalStages().toString()),
  );

  readonly stageTitle = computed(() => {
    const stage = this.currentStage();
    return stage ? this.translate(stage.labelKey) : this.translate('httpRequestFlow.stage.titleDefault');
  });

  readonly stageDescription = computed(() => {
    const stage = this.currentStage();
    return stage ? this.translate(stage.descriptionKey) : this.translate('httpRequestFlow.stage.descDefault');
  });

  private readonly currentStage = computed(() => {
    const idx = this.activeStage() - 1;
    const stages = this.config().stages;
    return idx >= 0 && idx < stages.length ? stages[idx] : null;
  });

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

  toggleAnimation(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    this.isPlaying.set(true);
    if (this.activeStage() === 0 || this.activeStage() >= this.totalStages()) {
      this.activeStage.set(1);
    }
    this.startAutoAdvance();
  }

  pause(): void {
    this.isPlaying.set(false);
    this.stopAutoAdvance();
  }

  reset(): void {
    this.isPlaying.set(false);
    this.activeStage.set(0);
    this.stopAutoAdvance();
  }

  /** Browser-only: an interval on the server keeps the prerender from settling. */
  private startAutoAdvance(): void {
    this.stopAutoAdvance();
    if (!this.isBrowser) return;

    this.intervalId = setInterval(() => {
      const stage = this.activeStage();
      if (stage < this.totalStages()) {
        this.activeStage.set(stage + 1);
      } else {
        this.pause();
      }
    }, this.config().autoAdvanceDelay);
  }

  private stopAutoAdvance(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
