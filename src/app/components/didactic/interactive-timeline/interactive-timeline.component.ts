/**
 * InteractiveTimelineComponent
 *
 * A click-through timeline for embedding inside an article: a row of points
 * (horizontal on desktop, a vertical list on mobile), each opening a detail
 * card with title, description and a "why it matters" line. Auto-play walks
 * the points on a timer and pauses while the reader is clicking.
 *
 * Content-free by design: the caller passes a `config` with one entry per
 * point, each naming a `translationKeyPrefix` whose `.title`, `.description`
 * and `.significance` keys carry the text. The component itself only owns its
 * chrome strings (`interactiveTimeline.*`).
 *
 * The "timeline" here is a sequence, not necessarily years — the `year` field
 * is a free label, so a command sequence (init → add → commit → push) works
 * as well as a set of dates.
 *
 * SSR-safe: the auto-play timer only starts in the browser
 * (`isPlatformBrowser`), so the page prerenders without a pending interval.
 * Under `prefers-reduced-motion: reduce` auto-play starts switched off.
 */
import {
  Component,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  signal,
  computed,
  input,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TranslationService } from '../../../services/translation.service';
import { prefersReducedMotion } from '../../../utils/reduced-motion';

interface ResolvedTimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  significance: string;
  color: string;
}

/** One point on the timeline. */
export interface InteractiveTimelineEvent {
  /** Stable id — used for tracking and selection. */
  id: string;
  /** Short label under the point (a year, a step number, a command …). */
  year: string;
  /** CSS color for the point; use a design token, not a raw hex value. */
  color: string;
  /** i18n prefix — `<prefix>.title`, `.description` and `.significance` must exist. */
  translationKeyPrefix: string;
}

/** Configuration for one embedded timeline. */
export interface InteractiveTimelineConfig {
  events: InteractiveTimelineEvent[];
  /** Milliseconds between auto-play steps. */
  autoPlayDelay: number;
  /** Milliseconds of quiet after a click before auto-play resumes. */
  resumeDelay: number;
}

@Component({
  selector: 'app-interactive-timeline',
  standalone: true,
  imports: [],
  template: `
    <div class="timeline-embed">
      <!-- Instruction Banner -->
      <div class="instruction-banner">
        <span class="instruction-icon" aria-hidden="true">&#128070;</span>
        <span class="instruction-label">{{ translate('interactiveTimeline.instruction') }}</span>
      </div>

      <!-- Auto-Play Toggle -->
      <div class="autoplay-bar">
        <button
          class="autoplay-toggle"
          [class.active]="autoPlay()"
          (click)="toggleAutoPlay()"
          [attr.aria-pressed]="autoPlay()"
        >
          <span class="toggle-track">
            <span class="toggle-thumb"></span>
          </span>
          <span class="toggle-label">{{
            autoPlay() ? translate('interactiveTimeline.autoPlayOn') : translate('interactiveTimeline.autoPlayOff')
          }}</span>
        </button>
      </div>

      <!-- Horizontal Timeline (desktop) -->
      <div class="timeline-horizontal">
        <div class="timeline-track">
          <div class="timeline-line"></div>
          @for (event of events(); track event.id) {
            <button
              class="timeline-point"
              [class.active]="selectedEvent() === event.id"
              [style.--point-color]="event.color"
              (click)="onUserSelect(event.id)"
              [attr.aria-label]="event.year + ': ' + event.title"
              [attr.aria-pressed]="selectedEvent() === event.id"
            >
              <span class="point-dot"></span>
              <span class="point-year">{{ event.year }}</span>
              <span class="point-title">{{ event.title }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Vertical Timeline (mobile) -->
      <div class="timeline-vertical">
        @for (event of events(); track event.id) {
          <button
            class="timeline-row"
            [class.active]="selectedEvent() === event.id"
            [style.--point-color]="event.color"
            (click)="onUserSelect(event.id)"
            [attr.aria-pressed]="selectedEvent() === event.id"
          >
            <div class="row-marker">
              <span class="row-dot"></span>
              @if (!$last) {
                <span class="row-line"></span>
              }
            </div>
            <div class="row-content">
              <span class="row-year">{{ event.year }}</span>
              <span class="row-title">{{ event.title }}</span>
            </div>
          </button>
        }
      </div>

      <!-- Detail Card -->
      <div
        class="detail-card"
        [class.visible]="selectedEventData() !== null"
        [style.border-top-color]="selectedEventData()?.color || 'transparent'"
      >
        @if (selectedEventData(); as event) {
          <div class="detail-header">
            <span class="detail-year" [style.color]="event.color">{{ event.year }}</span>
            <h3 class="detail-title">{{ event.title }}</h3>
          </div>
          <p class="detail-description">{{ event.description }}</p>
          <div class="detail-significance">
            <strong>{{ translate('interactiveTimeline.significance') }}:</strong> {{ event.significance }}
          </div>
        }
      </div>

      <!-- Navigation Arrows -->
      @if (selectedEvent() !== null) {
        <div class="nav-arrows">
          <button class="nav-btn" [disabled]="!canGoPrev()" (click)="onUserPrev()">
            &larr; {{ translate('interactiveTimeline.back') }}
          </button>
          <span class="nav-position">{{ currentIndex() + 1 }} / {{ events().length }}</span>
          <button class="nav-btn" [disabled]="!canGoNext()" (click)="onUserNext()">
            {{ translate('interactiveTimeline.next') }} &rarr;
          </button>
        </div>
      }
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

      .timeline-embed {
        display: block;
      }

      /* ── Instruction Banner ── */
      .instruction-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-card));
        border: 1.5px solid color-mix(in srgb, var(--primary-color) 35%, transparent);
        border-radius: 10px;
        padding: 0.75rem 1.25rem;
        margin-bottom: 1rem;
        animation: bannerPulse 2.5s ease-in-out 1s 2;
      }

      @keyframes bannerPulse {
        0%,
        100% {
          border-color: color-mix(in srgb, var(--primary-color) 35%, transparent);
        }
        50% {
          border-color: var(--primary-color-fg);
          box-shadow: 0 0 8px color-mix(in srgb, var(--primary-color) 20%, transparent);
        }
      }

      .instruction-icon {
        font-size: 1.3rem;
        flex-shrink: 0;
      }

      .instruction-label {
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-color);
        line-height: 1.4;
      }

      /* ── Auto-Play Toggle ── */
      .autoplay-bar {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
      }

      .autoplay-toggle {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 20px;
        padding: 0.35rem 0.9rem;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        transition: all 0.2s;
      }

      .autoplay-toggle:hover {
        border-color: var(--primary-color-fg);
      }

      .autoplay-toggle.active {
        border-color: var(--primary-color-fg);
        color: var(--text-color);
      }

      .toggle-track {
        width: 32px;
        height: 18px;
        border-radius: 9px;
        background: var(--surface-border);
        position: relative;
        transition: background 0.2s;
      }

      .autoplay-toggle.active .toggle-track {
        background: var(--primary-color);
      }

      .toggle-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--surface-card);
        transition: transform 0.2s;
        box-shadow: 0 1px 2px color-mix(in srgb, var(--text-color) 20%, transparent);
      }

      .autoplay-toggle.active .toggle-thumb {
        transform: translateX(14px);
      }

      .toggle-label {
        font-weight: 500;
      }

      /* ── Horizontal Timeline (desktop) ── */
      .timeline-horizontal {
        display: block;
        margin-bottom: 1.5rem;
      }

      .timeline-track {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        position: relative;
        padding: 0 1rem;
      }

      .timeline-line {
        position: absolute;
        top: 14px;
        left: 2rem;
        right: 2rem;
        height: 3px;
        background: var(--surface-border);
        z-index: 0;
      }

      .timeline-point {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.4rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 1;
        font-family: inherit;
        transition: transform 0.2s;
      }

      .timeline-point:hover {
        transform: scale(1.1);
      }

      .timeline-point:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 4px;
        border-radius: 4px;
      }

      .point-dot {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--surface-card);
        border: 3px solid var(--point-color, var(--surface-400));
        transition: all 0.25s;
        box-shadow: 0 2px 6px color-mix(in srgb, var(--point-color, var(--text-color)) 20%, transparent);
        animation: dotHint 2s ease-in-out 0.8s 2;
      }

      @keyframes dotHint {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.15);
          box-shadow: 0 0 10px color-mix(in srgb, var(--point-color, var(--text-color)) 35%, transparent);
        }
      }

      .timeline-point:hover .point-dot {
        background: color-mix(in srgb, var(--point-color, var(--text-color)) 15%, var(--surface-card));
        box-shadow: 0 0 10px color-mix(in srgb, var(--point-color, var(--text-color)) 30%, transparent);
      }

      .timeline-point.active .point-dot {
        background: var(--point-color, var(--text-color));
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--point-color, var(--text-color)) 25%, transparent);
        animation: none;
      }

      .point-year {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-color);
      }

      .point-title {
        font-size: 0.72rem;
        color: var(--text-color-secondary);
        max-width: 100px;
        text-align: center;
        line-height: 1.3;
      }

      .timeline-point.active .point-year {
        color: var(--point-color, var(--text-color));
      }

      /* ── Vertical Timeline (mobile) ── */
      .timeline-vertical {
        display: none;
        flex-direction: column;
        margin-bottom: 1.5rem;
      }

      .timeline-row {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        text-align: left;
        font-family: inherit;
        transition: background 0.2s;
        border-radius: 8px;
      }

      .timeline-row:hover {
        background: color-mix(in srgb, var(--point-color, var(--text-color)) 8%, var(--surface-card));
      }

      .timeline-row:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .timeline-row.active {
        background: color-mix(in srgb, var(--point-color, var(--text-color)) 10%, var(--surface-card));
      }

      .row-marker {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 24px;
        padding-top: 0.15rem;
      }

      .row-dot {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--surface-card);
        border: 3px solid var(--point-color, var(--surface-400));
        transition: all 0.25s;
      }

      .timeline-row:hover .row-dot {
        box-shadow: 0 0 6px color-mix(in srgb, var(--point-color, var(--text-color)) 30%, transparent);
      }

      .timeline-row.active .row-dot {
        background: var(--point-color, var(--text-color));
      }

      .row-line {
        width: 2px;
        height: 20px;
        background: var(--surface-border);
        margin-top: 0.2rem;
      }

      .row-content {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }

      .row-year {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-color);
      }

      .timeline-row.active .row-year {
        color: var(--point-color, var(--text-color));
      }

      .row-title {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      /* ── Detail Card ── */
      .detail-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-top: 4px solid transparent;
        border-radius: 0 0 10px 10px;
        padding: 1.25rem;
        margin-bottom: 1rem;
        opacity: 0;
        transform: translateY(-6px);
        transition:
          opacity 0.25s ease,
          transform 0.25s ease;
      }

      .detail-card.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .detail-header {
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }

      .detail-year {
        font-size: 1.4rem;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }

      .detail-title {
        font-size: 1.1rem;
        margin: 0;
        font-weight: 600;
        color: var(--text-color);
      }

      .detail-description {
        margin: 0 0 0.75rem;
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--text-color);
      }

      .detail-significance {
        font-size: 0.9rem;
        line-height: 1.5;
        background: var(--surface-ground);
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        color: var(--text-color-secondary);
        border: 1px solid var(--surface-border);
      }

      .detail-significance strong {
        color: var(--text-color);
      }

      /* ── Navigation ── */
      .nav-arrows {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .nav-btn {
        padding: 0.4rem 0.9rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        color: var(--text-color);
        border-radius: var(--border-radius, 6px);
        cursor: pointer;
        font-size: 0.85rem;
        font-family: inherit;
        transition:
          background 0.15s,
          border-color 0.15s;
      }

      .nav-btn:hover:not(:disabled) {
        background: var(--surface-ground);
        border-color: var(--primary-color-fg);
      }

      .nav-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .nav-btn:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .nav-position {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        font-variant-numeric: tabular-nums;
      }

      /* ── Narrow widget ── */
      @container (max-width: 600px) {
        .timeline-horizontal {
          display: none;
        }
        .timeline-vertical {
          display: flex;
        }
        .detail-header {
          flex-direction: column;
          gap: 0.15rem;
        }
        .detail-year {
          font-size: 1.2rem;
        }
        .instruction-banner {
          padding: 0.6rem 1rem;
        }
        .instruction-label {
          font-size: 0.9rem;
        }
      }

      /* Print: the interactive chrome carries no meaning on paper; the point
       list stays as a linear sequence. */
      @media print {
        .instruction-banner,
        .autoplay-bar,
        .nav-arrows {
          display: none !important;
        }

        .point-dot,
        .row-dot,
        .instruction-banner {
          animation: none !important;
        }

        .timeline-horizontal {
          display: none !important;
        }

        .timeline-vertical {
          display: flex !important;
          margin-bottom: 1rem;
        }

        .timeline-row,
        .timeline-row:hover,
        .timeline-row.active {
          background: none;
          padding: 0.5rem 0;
          cursor: default;
        }

        /* Transient, reader-dependent — not part of the printed article. */
        .detail-card {
          display: none !important;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveTimelineComponent implements OnInit, OnDestroy {
  readonly config = input.required<InteractiveTimelineConfig>();

  private readonly translationService = inject(TranslationService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly selectedEvent = signal<string | null>(null);
  /** On by default, off when the visitor prefers reduced motion (A11Y-007):
   *  a timer-driven walk is motion they did not ask for. The toggle still
   *  lets them switch it on. */
  readonly autoPlay = signal(!(this.isBrowser && prefersReducedMotion()));

  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private resumeTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly events = computed<ResolvedTimelineEvent[]>(() =>
    this.config().events.map((e) => ({
      id: e.id,
      year: e.year,
      color: e.color,
      title: this.translate(e.translationKeyPrefix + '.title'),
      description: this.translate(e.translationKeyPrefix + '.description'),
      significance: this.translate(e.translationKeyPrefix + '.significance'),
    })),
  );

  readonly selectedEventData = computed(() => {
    const id = this.selectedEvent();
    return id ? (this.events().find((e) => e.id === id) ?? null) : null;
  });

  readonly currentIndex = computed(() => {
    const id = this.selectedEvent();
    return id ? this.events().findIndex((e) => e.id === id) : -1;
  });

  readonly canGoPrev = computed(() => this.currentIndex() > 0);
  readonly canGoNext = computed(() => {
    const idx = this.currentIndex();
    return idx >= 0 && idx < this.events().length - 1;
  });

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    this.clearResumeTimeout();
  }

  toggleAutoPlay(): void {
    if (this.autoPlay()) {
      this.autoPlay.set(false);
      this.stopAutoPlay();
      this.clearResumeTimeout();
    } else {
      this.autoPlay.set(true);
      this.startAutoPlay();
    }
  }

  onUserSelect(id: string): void {
    this.selectedEvent.set(this.selectedEvent() === id ? null : id);
    this.pauseForUser();
  }

  onUserPrev(): void {
    this.goPrev();
    this.pauseForUser();
  }

  onUserNext(): void {
    this.goNext();
    this.pauseForUser();
  }

  private goPrev(): void {
    const idx = this.currentIndex();
    const events = this.config().events;
    if (idx > 0) {
      this.selectedEvent.set(events[idx - 1].id);
    }
  }

  private goNext(): void {
    const idx = this.currentIndex();
    const events = this.config().events;
    if (idx < events.length - 1) {
      this.selectedEvent.set(events[idx + 1].id);
    }
  }

  /** Browser-only: an interval on the server keeps the prerender from settling. */
  private startAutoPlay(): void {
    this.stopAutoPlay();
    if (!this.isBrowser || !this.autoPlay()) return;

    const cfg = this.config();
    if (cfg.events.length === 0) return;

    if (this.selectedEvent() === null) {
      this.selectedEvent.set(cfg.events[0].id);
    }

    this.autoPlayInterval = setInterval(() => {
      const idx = this.currentIndex();
      const events = this.config().events;
      this.selectedEvent.set(idx < events.length - 1 ? events[idx + 1].id : events[0].id);
    }, cfg.autoPlayDelay);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval !== null) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private clearResumeTimeout(): void {
    if (this.resumeTimeout !== null) {
      clearTimeout(this.resumeTimeout);
      this.resumeTimeout = null;
    }
  }

  private pauseForUser(): void {
    if (!this.isBrowser || !this.autoPlay()) return;
    this.stopAutoPlay();
    this.clearResumeTimeout();
    this.resumeTimeout = setTimeout(() => {
      if (this.autoPlay()) {
        this.startAutoPlay();
      }
    }, this.config().resumeDelay);
  }
}
