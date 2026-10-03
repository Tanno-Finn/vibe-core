/**
 * Glossary Popover Component
 *
 * Reusable component for displaying glossary term definitions.
 * Works with the HighlightingService for consistent popover behavior.
 */
import {
  Component,
  inject,
  computed,
  signal,
  effect,
  ViewEncapsulation,
  HostListener,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  Injector,
  afterNextRender,
} from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

// Optimus UI
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';

// Services
import { TranslationService } from '../../services/translation.service';
import { HighlightingService } from '../../services/highlighting.service';
import { LanguageUrlService } from '../../services/language-url.service';
import { SITE_CONFIG } from '../../../config/site';

@Component({
  selector: 'app-glossary-popover',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ButtonModule, DialogModule],
  template: `
    <!-- Desktop: Overlay Popover -->
    @if (currentPopover() && !isMobile()) {
      <div
        class="debug-popover"
        role="dialog"
        [attr.aria-label]="currentPopover()!.term"
        [style.left.px]="clampedPosition().x"
        [style.top.px]="clampedPosition().showAbove ? null : clampedPosition().y"
        [style.bottom.px]="clampedPosition().showAbove ? clampedPosition().bottomVal : null"
        [style.max-height.px]="clampedPosition().maxHeight"
        (click)="$event.stopPropagation()"
        (keydown.enter)="$event.stopPropagation()"
      >
        <div class="popover-content">
          <button
            pButton
            type="button"
            (click)="closePopover()"
            class="p-button-text p-button-sm close-btn"
            [attr.aria-label]="
              translationService.translate('common.close') +
              ' ' +
              currentPopover()!.term +
              ' ' +
              translationService.translate('glossary.popover.definition')
            "
          >
            <i class="pi pi-times" pButtonIcon aria-hidden="true"></i>
          </button>
          <strong>{{ currentPopover()!.term }}</strong>
          <div class="definition">{{ currentPopover()!.definition }}</div>
          @if (glossaryOn) {
            <hr />
            <p-button
              [label]="translationService.translate('glossary.popover.goToGlossary')"
              icon="pi pi-arrow-right"
              iconPos="right"
              (click)="goToGlossary()"
              class="glossar-button"
              severity="primary"
              [style]="{ width: '100%' }"
              [attr.aria-label]="
                translationService.translate('glossary.popover.goToGlossary') +
                ' ' +
                translationService.translate('common.for') +
                ' ' +
                currentPopover()!.term
              "
            >
            </p-button>
          }
        </div>
      </div>
    }

    <!-- Mobile: Dialog -->
    @if (currentPopover() && isMobile()) {
      <p-dialog
        [visible]="dialogVisible()"
        (visibleChange)="dialogVisible.set($event)"
        [header]="currentPopover()!.term"
        [modal]="true"
        [closable]="true"
        [dismissableMask]="true"
        [closeOnEscape]="true"
        [draggable]="false"
        [resizable]="false"
        [style]="{ width: '90vw', maxWidth: '500px' }"
        [closeAriaLabel]="translationService.translate('ui.close')"
        (onHide)="closePopover()"
      >
        <div class="dialog-definition">{{ currentPopover()!.definition }}</div>
        <ng-template #footer>
          <p-button
            [label]="translationService.translate('ui.close')"
            severity="secondary"
            [text]="true"
            (click)="closePopover()"
          >
          </p-button>
          @if (glossaryOn) {
            <p-button
              [label]="translationService.translate('glossary.popover.goToGlossary')"
              icon="pi pi-arrow-right"
              iconPos="right"
              (click)="goToGlossary()"
              class="glossar-button-mobile"
              severity="primary"
              [attr.aria-label]="
                translationService.translate('glossary.popover.goToGlossary') +
                ' ' +
                translationService.translate('common.for') +
                ' ' +
                currentPopover()!.term
              "
            >
            </p-button>
          }
        </ng-template>
      </p-dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-glossary-popover .debug-popover {
        position: fixed;
        z-index: 100000;
        background: var(--surface-card);
        border: 2px solid var(--primary-500);
        border-radius: var(--border-radius);
        box-shadow:
          0 8px 32px rgba(0, 0, 0, 0.12),
          0 2px 8px rgba(0, 0, 0, 0.08);
        padding: 1rem;
        max-width: 400px;
        min-height: 200px;
        overflow-y: auto;
        font-family: var(--font-family);
        animation: fadeIn 0.2s ease-out;
        pointer-events: auto;
      }

      app-glossary-popover .debug-popover strong {
        color: var(--primary-color-icon-fg);
        font-size: 1.1rem;
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      app-glossary-popover .close-btn {
        position: absolute !important;
        top: 0.5rem;
        right: 0.5rem;
        color: var(--text-color-secondary) !important;
        width: 2.75rem !important;
        height: 2.75rem !important;
        min-width: 2.75rem !important;
        padding: 0 !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      app-glossary-popover .close-btn:hover {
        color: var(--text-color) !important;
        background: var(--surface-hover) !important;
      }

      app-glossary-popover .definition {
        margin: 1rem 0;
        line-height: 1.5;
        padding-right: 2rem; /* Space for close button */
      }

      app-glossary-popover hr {
        border: none;
        border-top: 1px solid var(--surface-border);
        margin: 1rem 0;
      }

      app-glossary-popover .popover-content .glossar-button {
        width: 100%;
      }

      app-glossary-popover .glossar-button-mobile {
        width: 100%;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-5px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        app-glossary-popover .debug-popover {
          animation: none;
        }
      }

      /* Dialog styles for mobile */
      app-glossary-popover .dialog-definition {
        line-height: 1.6;
        font-size: 1rem;
        color: var(--text-color);
        padding: 0.75rem 1.5rem; /* Vertical padding halved, horizontal stays the same */
        max-height: 60vh;
        overflow-y: auto;
        overflow-x: hidden;
        word-wrap: break-word;

        /* Custom scrollbar for better mobile experience */
        scrollbar-width: thin;
        scrollbar-color: var(--primary-200) var(--surface-100);
      }

      app-glossary-popover .dialog-definition::-webkit-scrollbar {
        width: 8px;
      }

      app-glossary-popover .dialog-definition::-webkit-scrollbar-track {
        background: var(--surface-100);
        border-radius: 4px;
      }

      app-glossary-popover .dialog-definition::-webkit-scrollbar-thumb {
        background: var(--primary-200);
        border-radius: 4px;
      }

      app-glossary-popover .dialog-definition::-webkit-scrollbar-thumb:hover {
        background: var(--primary-300);
      }

      app-glossary-popover .p-dialog {
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
        overflow: hidden !important; /* Prevent content from extending beyond rounded corners */
        border-radius: var(--border-radius) !important;
      }

      app-glossary-popover .p-dialog-content {
        padding: 0 !important; /* Remove default padding to use our custom padding */
      }

      app-glossary-popover .p-dialog-header {
        background: var(--primary-50);
        border-bottom: 2px solid var(--primary-200);
        padding: 1rem 1.5rem !important; /* Vertical padding reduced, horizontal matches content */
      }

      app-glossary-popover .p-dialog-header .p-dialog-title {
        color: var(--primary-color-icon-fg);
        font-weight: 600;
        font-size: 1.2rem;
        margin: 0 !important; /* Ensure no extra margin */
        padding: 0 !important; /* Ensure no extra padding */
      }

      app-glossary-popover .p-dialog-header-icons {
        margin: 0 !important;
        padding: 0 !important;
      }

      app-glossary-popover .p-dialog-footer {
        padding: 1rem 1.5rem !important;
        border-bottom-left-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
        overflow: hidden;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }

      app-glossary-popover .p-dialog-footer .glossar-button-mobile {
        flex: 1;
      }

      @media (max-width: 768px) {
        app-glossary-popover .p-dialog {
          margin: 1rem !important;
          width: calc(100vw - 2rem) !important;
        }
      }
    `,
  ],
})
export class GlossaryPopoverComponent implements OnDestroy {
  public translationService = inject(TranslationService);
  private highlightingService = inject(HighlightingService);
  private languageUrlService = inject(LanguageUrlService);
  private router = inject(Router);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private injector = inject(Injector);
  /** The "go to glossary" link only while the glossary page exists (site.json `features`); the definition always shows. */
  readonly glossaryOn = inject(SITE_CONFIG).isRouteOn('glossary');

  currentPopover = computed(() => this.highlightingService.currentPopover$());
  public dialogVisible = signal(false);
  public isMobile = signal(false);

  /** WCAG 2.1.2: Track trigger element for focus return */
  private triggerRef: HTMLElement | null = null;

  /** Clamp popover position to stay within viewport */
  clampedPosition = computed(() => {
    const popover = this.currentPopover();
    if (!popover) return { x: 0, y: 0, showAbove: false, bottomVal: 0, maxHeight: 300 };

    const POPOVER_WIDTH = 400;
    const MARGIN = 12;
    const MIN_HEIGHT = 200; // Guaranteed minimum height

    const { termTop } = popover.position;
    let { x } = popover.position;
    const termBottom = popover.position.y; // y = rect.bottom + 5 (below term)

    if (typeof window === 'undefined') {
      return { x, y: termBottom, showAbove: false, bottomVal: 0, maxHeight: MIN_HEIGHT };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Clamp horizontal: keep popover within viewport
    const maxX = vw - Math.min(POPOVER_WIDTH, vw - MARGIN * 2) - MARGIN;
    x = Math.max(MARGIN, Math.min(x, maxX));

    // Available space below and above the term
    const spaceBelow = vh - termBottom - MARGIN;
    const spaceAbove = termTop - MARGIN;

    if (spaceBelow >= MIN_HEIGHT) {
      // Enough space below — show normally
      return { x, y: termBottom, showAbove: false, bottomVal: 0, maxHeight: spaceBelow };
    } else if (spaceAbove >= MIN_HEIGHT) {
      // Enough space above — pin bottom of popover just above the term
      return { x, y: 0, showAbove: true, bottomVal: vh - termTop + 8, maxHeight: spaceAbove };
    } else {
      // Neither side has MIN_HEIGHT — pick bigger side and pin to viewport edge
      if (spaceAbove >= spaceBelow) {
        // Show above: pin top edge to MARGIN
        // top = vh - bottomVal - MIN_HEIGHT = MARGIN → bottomVal = vh - MIN_HEIGHT - MARGIN
        return { x, y: 0, showAbove: true, bottomVal: vh - MIN_HEIGHT - MARGIN, maxHeight: MIN_HEIGHT };
      } else {
        // Show below: pin bottom edge to vh - MARGIN
        // y + MIN_HEIGHT = vh - MARGIN → y = vh - MARGIN - MIN_HEIGHT
        return { x, y: vh - MARGIN - MIN_HEIGHT, showAbove: false, bottomVal: 0, maxHeight: MIN_HEIGHT };
      }
    }
  });

  /** Arrow property so add/removeEventListener see the same reference. */
  private handleResize = (): void => {
    this.checkIfMobile();
  };

  constructor() {
    // Check if mobile on initialization and window resize
    this.checkIfMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }

    // Update dialog visibility when popover changes + track trigger for focus return
    effect(() => {
      const popover = this.currentPopover();
      if (popover) {
        // Save trigger reference for focus return (WCAG 2.1.2)
        this.triggerRef = typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null;
        if (this.isMobile()) {
          this.dialogVisible.set(true);
        } else {
          // Desktop: the popover is rendered at the end of the page, so its
          // buttons would sit at the far end of the tab order. Move focus to
          // its close button once it is rendered (the mobile p-dialog does
          // this itself). preventScroll: a scroll would close it again.
          afterNextRender(
            () => {
              this.host.nativeElement
                .querySelector<HTMLElement>('.debug-popover .close-btn')
                ?.focus({ preventScroll: true });
            },
            { injector: this.injector },
          );
        }
      } else {
        this.dialogVisible.set(false);
      }
    });

    // Close popover when language changes
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.closePopover();
    });

    // Close popover when page/route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.closePopover();
      });
  }

  ngOnDestroy(): void {
    // The component mounts on nearly every page, so an unremoved resize
    // listener would retain one destroyed instance per navigation.
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  private checkIfMobile(): void {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.innerWidth <= 768);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.currentPopover()) {
      this.closePopover();
    }
  }

  /** Escape closes the desktop popover and hands focus back to its term (the
   *  mobile p-dialog has its own closeOnEscape). */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.currentPopover() && !this.isMobile()) {
      this.closePopover();
    }
  }

  closePopover(): void {
    this.dialogVisible.set(false);
    this.highlightingService.hidePopover();
    // WCAG 2.1.2: Return focus to trigger element
    this.triggerRef?.focus();
    this.triggerRef = null;
  }

  // browser-only: click handler.
  goToGlossary(): void {
    const term = this.currentPopover()?.term;
    if (term) {
      // Navigate to glossary with EXACT: prefix for precise filtering
      const exactSearch = `EXACT:${term}`;
      const lang = this.languageUrlService.currentUrlLang;
      window.location.href = `/${lang}/glossary?search=${encodeURIComponent(exactSearch)}`;
    }
  }
}
