import {
  Component,
  ChangeDetectionStrategy,
  Input,
  signal,
  computed,
  ElementRef,
  inject,
  HostListener,
  ViewChild,
} from '@angular/core';

/**
 * Accessible info "i" popover — the **canonical, reusable** disclosure tooltip
 * for demos and didactic pages. (Piloted on the DBSCAN demo; rolled out from
 * here. Usage rules + a11y checklist: `src/assets/design-system/info-tooltip.md`.)
 *
 * Pattern: **Info-Popover (Disclosure)** on a small "i" trigger. It opens on
 * **click or focus** (never hover-only), closes on **ESC** and **outside click**,
 * and is **non-modal** (no focus trap, no backdrop — the rest of the page stays
 * usable). It holds a short, title-less blurb: 1–2 sentences saying what the
 * control does plus at most one domain nugget. **Nothing more** — if a term
 * needs depth, explain it in the surrounding body text, not in the bubble.
 * (The former "Mehr im Glossar →" link was removed — it didn't work well.)
 *
 * WCAG 2.1 AA:
 *  - **Keyboard reachable** — the trigger is a real `<button>` in the tab order.
 *  - **Not hover-only (SC 1.4.13)** — opens on focus too; the bubble is hoverable
 *    (a short close-delay lets the pointer travel into it without it vanishing).
 *  - **Dismissible with ESC (SC 1.4.13)** — Escape closes without moving focus.
 *  - **Programmatic association** — the bubble has `role="tooltip"` + a stable id;
 *    the trigger points at it via `aria-describedby` so the description is
 *    announced together with the labeled control.
 *  - **Accessible name** — the trigger carries an `aria-label`
 *    ("More information: <label>") so it is not an unlabeled icon button.
 *  - **Visible focus ring** — `:focus-visible` outline in the primary color.
 *  - **Contrast** — themed surface/border/text tokens only (no hard-coded
 *    colors), so both themes stay AA.
 *  - **prefers-reduced-motion / forced-colors** — handled in styles.
 *
 * Localization: all text is passed in already-translated (`text`, `forLabel`,
 * `moreInfoLabel`) — the component hard-codes no copy.
 *
 * Usage:
 * ```html
 * <label>
 *   eps (Radius)
 *   <app-info-tooltip
 *     [text]="t('...eps.help')"
 *     [forLabel]="t('...eps')"
 *     [moreInfoLabel]="t('...moreInfo')" />
 * </label>
 * ```
 */
let _infoTooltipUid = 0;

@Component({
  selector: 'app-info-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="info-tt" (mouseenter)="open()" (mouseleave)="scheduleClose()">
      <button
        #trigger
        type="button"
        class="info-tt__btn"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-expanded]="visible()"
        [attr.aria-describedby]="visible() ? tipId : null"
        (focus)="onFocus()"
        (blur)="scheduleClose()"
        (click)="toggle($event)"
      >
        <span aria-hidden="true">i</span>
      </button>
      @if (visible()) {
        <span
          [id]="tipId"
          role="tooltip"
          class="info-tt__bubble"
          [class.info-tt--above]="effectivePlacement() === 'above'"
          [style.top.px]="posTop()"
          [style.left.px]="posLeft()"
          [style.transform]="bubbleTransform()"
          [style.--arrow-x.px]="arrowX()"
          (mouseenter)="open()"
          (mouseleave)="scheduleClose()"
        >
          <span class="info-tt__text">{{ text }}</span>
        </span>
      }
    </span>
  `,
  styles: [
    `
      .info-tt {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
        line-height: 1;
        /* The trigger glyph and the popover live inside whatever label hosts the
           tooltip — often an uppercased, letter-spaced control label (e.g. a
           demo's .*-metric-label). text-transform / letter-spacing inherit down
           the DOM tree (position:fixed repositions the bubble but does NOT stop
           inheritance), which would render the "i" as "I" and the bubble copy in
           ALL CAPS. Reset both so the popover is always normal sentence-case
           body text, whatever the host label's casing. */
        text-transform: none;
        letter-spacing: normal;
      }
      .info-tt__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.05rem;
        height: 1.05rem;
        margin-inline-start: 0.3rem;
        padding: 0;
        border-radius: 50%;
        border: 1px solid var(--surface-border);
        background: var(--surface-card, var(--surface-ground));
        color: var(--text-color-secondary);
        font-size: 0.72rem;
        font-weight: 700;
        font-style: italic;
        font-family: Georgia, 'Times New Roman', serif;
        cursor: help;
        transition:
          background 0.15s ease,
          color 0.15s ease,
          border-color 0.15s ease;
      }
      .info-tt__btn:hover,
      .info-tt__btn[aria-expanded='true'] {
        background: var(--primary-color);
        color: var(--primary-color-text);
        border-color: var(--primary-color);
      }
      /* Visible, high-contrast focus ring for keyboard users. */
      .info-tt__btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      /* position: fixed so the bubble escapes any ancestor's overflow:hidden
         (e.g. the collapsible standard-container's .container-content). Its
         top/left are computed from the trigger's viewport rect in JS, and the
         viewport clamp below then keeps it fully on-screen. */
      .info-tt__bubble {
        position: fixed;
        z-index: 1000;
        width: max-content;
        max-width: min(260px, 80vw);
        padding: 0.5rem 0.7rem;
        border-radius: 8px;
        background: var(--surface-overlay, var(--surface-card));
        color: var(--text-color);
        border: 1px solid var(--surface-border);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
        font-size: 0.78rem;
        font-weight: 400;
        font-style: normal;
        line-height: 1.4;
        white-space: normal;
        text-align: start;
        /* opacity-only fade: a transform-based keyframe would override the
           JS-driven [style.transform] (centering + nudge + above-flip). */
        animation: info-tt-in 0.12s ease;
      }
      @keyframes info-tt-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .info-tt__text {
        display: block;
      }
      /* little arrow — anchored to the trigger center (--arrow-x), so it keeps
         pointing at the "i" even when the bubble is nudged off-center near an
         edge. Default is the bubble center. */
      .info-tt__bubble::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: var(--arrow-x, 50%);
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-bottom-color: var(--surface-border);
      }
      .info-tt__bubble.info-tt--above::before {
        bottom: auto;
        top: 100%;
        border-bottom-color: transparent;
        border-top-color: var(--surface-border);
      }
      @media (prefers-reduced-motion: reduce) {
        .info-tt__btn {
          transition: none;
        }
        .info-tt__bubble {
          animation: none;
        }
      }
      @media (forced-colors: active) {
        .info-tt__btn {
          border: 1px solid ButtonText;
          background: ButtonFace;
          color: ButtonText;
        }
        .info-tt__btn:hover,
        .info-tt__btn[aria-expanded='true'] {
          background: Highlight;
          color: HighlightText;
        }
        .info-tt__bubble {
          border: 1px solid CanvasText;
        }
      }
    `,
  ],
})
export class InfoTooltipComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** The explanatory text shown in the bubble (already translated). */
  @Input({ required: true }) text = '';
  /** Plain label of the control this describes — folded into the trigger's accessible name. */
  @Input() forLabel = '';
  /** Preferred placement; auto-flips to the opposite edge if it would clip. */
  @Input() placement: 'above' | 'below' = 'below';
  /** Optional override for the trigger's aria-label prefix (already translated). */
  @Input() moreInfoLabel = 'More information';

  readonly tipId = `info-tt-${++_infoTooltipUid}`;
  /** Click-/keyboard-pinned open (persists until ESC, outside click, or re-toggle). */
  private readonly pinned = signal(false);
  /** Soft hover/focus reveal (auto-closes when the pointer/focus leaves). */
  private readonly hovering = signal(false);
  /** The bubble is shown when either source is active. */
  readonly visible = computed(() => this.pinned() || this.hovering());
  readonly effectivePlacement = signal<'above' | 'below'>('below');
  /** horizontal pixel nudge applied so the bubble never clips the viewport. */
  private readonly nudgeX = signal(0);
  /** arrow x-position within the bubble (so it keeps pointing at the trigger). */
  readonly arrowX = signal<number | null>(null);
  /** Fixed-position coordinates (viewport px), computed from the trigger rect. */
  readonly posTop = signal<number | null>(null);
  readonly posLeft = signal<number | null>(null);
  /** full transform string: horizontal centering + edge-nudge, plus the upward
   *  shift when the bubble is flipped above the trigger (position:fixed top is
   *  the trigger's top edge in that case). */
  readonly bubbleTransform = computed(() => {
    const tx = `calc(-50% + ${this.nudgeX()}px)`;
    return this.effectivePlacement() === 'above' ? `translate(${tx}, -100%)` : `translateX(${tx})`;
  });
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('trigger') trigger?: ElementRef<HTMLButtonElement>;

  readonly ariaLabel = computed(() => (this.forLabel ? `${this.moreInfoLabel}: ${this.forLabel}` : this.moreInfoLabel));

  /** Soft reveal on hover/focus (auto-closes on leave). Keyboard users get the
   *  bubble on focus; pointer hover gets it too (SC 1.4.13 hoverable). */
  open(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
    this.prepare();
    this.hovering.set(true);
  }

  private prepare(): void {
    this.effectivePlacement.set(this.placement);
    this.nudgeX.set(0);
    this.arrowX.set(null);
    // Place it at the trigger synchronously (the trigger is already in the DOM)
    // so there is no first-frame flash at (0,0). Then refine once the bubble's
    // own size is known. `@if (visible())` renders on the next CD pass, so a
    // microtask is too early — wait for the next frame (browser-only; SSR no-op).
    this.positionFromTrigger();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => this.adjustPlacement());
    }
  }

  /** Set the fixed top/left from the trigger's viewport rect (centered under it). */
  private positionFromTrigger(): void {
    if (typeof window === 'undefined') return;
    const t = this.trigger?.nativeElement;
    if (!t) return;
    const tr = t.getBoundingClientRect();
    this.posLeft.set(Math.round(tr.left + tr.width / 2));
    this.posTop.set(Math.round(this.effectivePlacement() === 'above' ? tr.top - 8 : tr.bottom + 8));
  }

  /** Keep an open bubble glued to its trigger when the page scrolls or resizes. */
  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (!this.visible()) return;
    this.positionFromTrigger();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => this.adjustPlacement());
    }
  }

  onFocus(): void {
    this.open();
  }

  /**
   * Flip vertically and clamp horizontally so the fixed-position bubble stays on
   * screen and keeps pointing at its trigger. Cheap; runs on open and on
   * scroll/resize (no-op on SSR — no `window`).
   */
  private adjustPlacement(): void {
    if (typeof window === 'undefined') return;
    const bubble = this.host.nativeElement.querySelector('.info-tt__bubble') as HTMLElement | null;
    const trigger = this.trigger?.nativeElement;
    if (!bubble || !trigger) return;
    const r = bubble.getBoundingClientRect();
    const tr = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const M = 8; // viewport margin

    // vertical flip if the preferred side would clip and the other side fits.
    let place = this.placement;
    if (place === 'below' && tr.bottom + 8 + r.height > vh - M && tr.top - 8 - r.height > M) {
      place = 'above';
    } else if (place === 'above' && tr.top - 8 - r.height < M && tr.bottom + 8 + r.height < vh - M) {
      place = 'below';
    }
    this.effectivePlacement.set(place);
    this.posLeft.set(Math.round(tr.left + tr.width / 2));
    this.posTop.set(Math.round(place === 'above' ? tr.top - 8 : tr.bottom + 8));

    // horizontal nudge so the bubble (centered on the trigger) stays on-screen.
    const centerX = tr.left + tr.width / 2;
    const left = centerX - r.width / 2;
    let nudge = 0;
    if (left < M) nudge = M - left;
    else if (left + r.width > vw - M) nudge = vw - M - (left + r.width);
    this.nudgeX.set(Math.round(nudge));

    // re-anchor the arrow to the trigger center relative to the nudged bubble.
    if (nudge !== 0) {
      const bubbleLeft = centerX - r.width / 2 + nudge;
      const ax = centerX - bubbleLeft;
      this.arrowX.set(Math.max(10, Math.min(r.width - 10, Math.round(ax))));
    } else {
      this.arrowX.set(null); // centered → CSS default (50%)
    }
  }

  /** End the soft hover/focus reveal after a short delay so the pointer can
   *  travel into the bubble (SC 1.4.13 hoverable). Does NOT close a pinned bubble. */
  scheduleClose(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.hovering.set(false), 140);
  }

  /** Click pins the bubble open (or closes it if already pinned). Independent of
   *  the hover/focus soft-reveal, so a hover that just opened it is not toggled
   *  straight back closed by the same click. */
  toggle(ev: Event): void {
    ev.preventDefault();
    if (this.pinned()) {
      this.pinned.set(false);
      this.hovering.set(false);
    } else {
      this.prepare();
      this.pinned.set(true);
    }
  }

  /** ESC dismisses without moving focus (SC 1.4.13 "dismissible"). */
  @HostListener('keydown.escape', ['$event'])
  onEscape(ev: Event): void {
    if (this.visible()) {
      ev.stopPropagation();
      this.pinned.set(false);
      this.hovering.set(false);
    }
  }

  /** Click elsewhere closes an open (click-pinned) bubble. */
  @HostListener('document:pointerdown', ['$event'])
  onDocPointerDown(ev: Event): void {
    if (!this.visible()) return;
    if (!this.host.nativeElement.contains(ev.target as Node)) {
      this.pinned.set(false);
      this.hovering.set(false);
    }
  }
}
