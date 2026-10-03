/**
 * Table of Contents FAB Component
 *
 * Reusable floating action button that displays a table of contents overlay.
 * Supports scroll tracking, smooth navigation, and responsive design.
 * Can be used standalone or integrated into FAB Stack system.
 *
 * Default Behavior:
 * - Always visible (showAfterScroll = 0 by default)
 * - Set showAfterScroll > 0 to show only after scrolling
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
  ViewEncapsulation,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

import { PopoverModule, Popover } from '@openng/optimus-ui/popover';
import { TranslationService } from '../../services/translation.service';
import { FabRegistryService, FAB_PRIORITIES } from '../../services/fab-registry.service';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { scrollBehavior } from '../../utils/reduced-motion';

export interface TocItem {
  id: string;
  label: string;
  isActive?: boolean;
  isHighlight?: boolean;
  icon?: string;
  children?: TocItem[];
  /**
   * Fallback IDs used when `id` resolves to a hidden element (e.g. responsive
   * desktop/mobile DOM duplicates with different IDs). The first visible
   * candidate wins.
   */
  alternateIds?: string[];
}

@Component({
  selector: 'app-table-of-contents-fab',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [PopoverModule],
  template: `
    <!-- FAB Button (only when NOT using FAB Registry) -->
    @if (items.length > 0 && !hideButton) {
      <div class="toc-fab" [class.visible]="isVisible" [class.has-items]="items.length > 0">
        <button
          class="fab-button"
          (click)="togglePanel($event)"
          [attr.aria-label]="title"
          [attr.aria-expanded]="tocPanel?.overlayVisible ?? false"
          aria-haspopup="true"
          type="button"
        >
          <i class="pi pi-list"></i>
          <span class="fab-label">{{ title }}</span>
        </button>
      </div>
    }

    <!-- Popover Panel (always rendered for programmatic access) -->
    @if (items.length > 0) {
      <div>
        <!-- (onShow)/(onHide) only re-check this OnPush view so the FAB's
             aria-expanded (read from tocPanel.overlayVisible) follows the
             popover when it opens or closes outside a click on this button. -->
        <p-popover
          #tocPanel
          styleClass="toc-panel"
          [dismissable]="true"
          [autoZIndex]="true"
          [baseZIndex]="10000"
          (onShow)="cdr.markForCheck()"
          (onHide)="cdr.markForCheck()"
        >
          <div class="toc-content">
            <div class="toc-header">
              <h3 class="toc-title">{{ title }}</h3>
            </div>
            <nav class="toc-nav">
              <ul class="toc-list">
                @for (item of items; track item.id; let i = $index) {
                  <li class="toc-item" [class.has-children]="item.children?.length">
                    <a
                      [href]="'#' + item.id"
                      class="toc-link"
                      [class.active]="item.isActive"
                      [class.highlight]="item.isHighlight"
                      (click)="onItemClick(item, $event)"
                    >
                      @if (item.icon) {
                        <i [class]="item.icon" class="item-icon"></i>
                      }
                      @if (!item.icon) {
                        <span class="item-number">{{ i + 1 }}</span>
                      }
                      <span class="item-text">{{ item.label }}</span>
                    </a>
                    @if (item.children?.length) {
                      <ul class="toc-children">
                        @for (child of item.children; track child.id) {
                          <li class="toc-item toc-child">
                            <a
                              [href]="'#' + child.id"
                              class="toc-link"
                              [class.active]="child.isActive"
                              (click)="onItemClick(child, $event)"
                            >
                              @if (child.icon) {
                                <i [class]="child.icon" class="item-icon"></i>
                              }
                              <span class="item-text">{{ child.label }}</span>
                            </a>
                          </li>
                        }
                      </ul>
                    }
                  </li>
                }
              </ul>
            </nav>
          </div>
        </p-popover>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Relative positioning for stack container */
      app-table-of-contents-fab .toc-fab {
        position: relative;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        transform: translateX(100px); /* Slide in animation */
        pointer-events: auto; /* Enable clicks in FAB Stack */
      }

      app-table-of-contents-fab .toc-fab.visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(0); /* Slide in completed */
      }

      app-table-of-contents-fab .toc-fab.has-items {
        pointer-events: auto;
      }

      /* FAB Button — its own opaque surface (A11Y-004), same contract as
         app-fab-container: fill --surface-card, label --text-color, edge
         --fab-edge; the brand color stays on the icon. --surface-0 is reset
         to initial in the FAB scope (styles.scss), so it must not be read here. */
      app-table-of-contents-fab .fab-button {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-4);
        background: var(--surface-card);
        color: var(--primary-color-fg);
        border: 2px solid var(--fab-edge);
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-weight: 600;
        min-width: 50px;
      }

      app-table-of-contents-fab .fab-button:hover {
        background: var(--surface-hover);
        transform: scale(1.02);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      app-table-of-contents-fab .fab-button:focus-visible {
        outline: 3px solid var(--primary-color-fg);
        outline-offset: 3px;
      }

      app-table-of-contents-fab .fab-button i {
        font-size: 1.1rem;
      }

      app-table-of-contents-fab .fab-label {
        white-space: nowrap;
        color: var(--text-color);
      }

      /* Mobile - show only icon */
      @media (max-width: 768px) {
        app-table-of-contents-fab .fab-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          justify-content: center;
          padding: 0;
        }

        app-table-of-contents-fab .fab-label {
          display: none;
        }
      }

      /* Panel Styles */
      .toc-panel .p-popover {
        max-width: 350px;
        min-width: 280px;
        border-radius: 12px;
        border: 1px solid var(--surface-border);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      }

      .toc-content {
        padding: 0;
      }

      .toc-header {
        padding: var(--space-4);
        border-bottom: 1px solid var(--surface-border);
        background: var(--surface-50);
      }

      .toc-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .toc-nav {
        padding: var(--space-2);
      }

      .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 400px;
        overflow-y: auto;
      }

      .toc-item {
        margin-bottom: var(--space-1);
      }

      .toc-link {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-2-5) var(--space-3);
        color: var(--text-color-secondary);
        text-decoration: none;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .toc-link:hover {
        background: var(--surface-100);
        color: var(--text-color);
      }

      .toc-link.active {
        background: var(--primary-50);
        color: var(--primary-700);
        font-weight: 500;
      }

      .toc-link.highlight {
        border-left: 3px solid var(--orange-400);
        padding-left: calc(var(--space-3) - 3px);
      }

      .item-icon {
        color: var(--primary-500);
        font-size: 0.9rem;
      }

      .item-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background: var(--surface-200);
        color: var(--text-color-secondary);
        border-radius: 50%;
        font-size: 0.7rem;
        font-weight: 600;
        flex-shrink: 0;
      }

      .toc-link.active .item-number {
        background: var(--primary-500);
        color: white;
      }

      .item-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Children (nested items) */
      .toc-children {
        list-style: none;
        padding: 0 0 0 var(--space-4);
        margin: 0;
      }

      .toc-child .toc-link {
        font-size: 0.82rem;
        padding: var(--space-1-5) var(--space-3);
      }

      .toc-child .item-icon {
        font-size: 0.8rem;
      }

      .toc-item.has-children > .toc-link {
        font-weight: 600;
        font-size: 0.82rem;
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.03em;
        padding-bottom: var(--space-1);
      }

      .toc-item.has-children > .toc-link:hover {
        background: transparent;
      }

      .dark-theme .toc-header {
        background: var(--surface-200);
      }

      .dark-theme .toc-link:hover {
        background: var(--surface-600);
      }

      .dark-theme .toc-link.active {
        background: color-mix(in srgb, var(--primary-500) 20%, transparent);
        color: var(--primary-300);
      }

      /* Extra small screens - constrain popover width */
      @media (max-width: 480px) {
        .toc-panel .p-popover {
          max-width: calc(100vw - 48px);
          min-width: 200px;
        }
      }
    `,
  ],
})
export class TableOfContentsFabComponent implements OnInit, OnDestroy, OnChanges {
  @Input() items: TocItem[] = [];
  @Input() title: string = 'Table of Contents';
  @Input() showAfterScroll: number = 0; // Always visible by default
  @Input() hideButton: boolean = false; // Hide button when using FAB Registry
  @Input() tocId: string = 'toc'; // Unique ID for FAB registry

  @Output() itemClicked = new EventEmitter<TocItem>();

  @ViewChild('tocPanel') tocPanel?: Popover;

  isVisible = false;
  private fabId: string = '';
  private autoRegistered = false;

  private translationService = inject(TranslationService);
  private fabRegistry = inject(FabRegistryService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  protected cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // If showAfterScroll is 0, make visible immediately
    if (this.showAfterScroll === 0 && this.items.length > 0) {
      this.isVisible = true;
    }
    this.setupScrollTracking();
    this.updateFabRegistration();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update FAB registration when items change
    if (changes['items']) {
      this.updateFabRegistration();
    }
  }

  ngOnDestroy(): void {
    // Unregister from FAB Registry if we auto-registered
    if (this.autoRegistered && this.fabId) {
      this.fabRegistry.unregister(this.fabId);
    }
  }

  /**
   * Auto-register with FAB Registry when items are available
   */
  private updateFabRegistration(): void {
    this.fabId = `toc-${this.tocId}`;

    // If we should show and not explicitly managed by parent
    if (!this.hideButton && this.items.length > 0) {
      // Register if not already registered
      if (!this.fabRegistry.isRegistered(this.fabId)) {
        this.fabRegistry.register({
          id: this.fabId,
          priority: FAB_PRIORITIES.TABLE_OF_CONTENTS,
          icon: 'pi-list',
          labelKey: 'lessons.tableOfContents',
          color: 'default',
          onClick: () => this.open(),
          ariaHaspopup: 'true',
        });
        this.autoRegistered = true;
      }
    } else if (this.autoRegistered) {
      // Unregister if items became empty
      this.fabRegistry.unregister(this.fabId);
      this.autoRegistered = false;
    }
  }

  private setupScrollTracking(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    fromEvent(window, 'scroll')
      .pipe(throttleTime(16), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const scrollY = window.pageYOffset;

        // Update visibility if showAfterScroll is set
        if (this.showAfterScroll > 0) {
          this.isVisible = scrollY > this.showAfterScroll && this.items.length > 0;
          this.cdr.markForCheck();
        }

        // If panel is open, close it during scroll to prevent misalignment
        if (this.tocPanel && this.tocPanel.overlayVisible) {
          this.tocPanel.hide();
          // Restore focus to the FAB button after scroll-close
          const fabButton = document.querySelector('app-table-of-contents-fab .fab-button') as HTMLElement;
          fabButton?.focus();
        }
      });
  }

  togglePanel(event: Event): void {
    if (this.tocPanel) {
      this.tocPanel.toggle(event);
    }
  }

  /**
   * Open the panel programmatically (called by FAB Registry)
   * Finds the actual FAB button in the container and uses it as toggle target.
   * Uses setTimeout(0) to let the original FAB Container click event finish
   * propagation before opening — otherwise Optimus UI's dismissable handler
   * catches the still-bubbling click as an "outside click" and immediately closes.
   * browser-only: opened by a click on the FAB.
   */
  open(): void {
    if (this.tocPanel) {
      const tocButton = document.querySelector('.fab-container button .pi-list')?.closest('button');
      if (tocButton) {
        setTimeout(() => {
          this.tocPanel?.toggle(new MouseEvent('click'), tocButton as HTMLElement);
        });
      }
    }
  }

  onItemClick(item: TocItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Close panel first to avoid layout interference
    if (this.tocPanel) {
      this.tocPanel.hide();
    }

    // Emit event
    this.itemClicked.emit(item);

    // Scroll to element after panel hides
    requestAnimationFrame(() => {
      const element = this.resolveScrollTarget(item);
      if (element) {
        element.scrollIntoView({
          behavior: scrollBehavior(),
          block: 'start',
        });
      }
    });
  }

  /**
   * Find the actual scroll target for a ToC item. Prefers the first visible
   * candidate among `id` + `alternateIds`, falling back to the first existing
   * element. Visibility check uses `offsetParent` which returns null for
   * `display: none` ancestors — exactly the responsive desktop/mobile case
   * the timeline page hits.
   * browser-only: reached only from the entry click handler.
   */
  private resolveScrollTarget(item: TocItem): HTMLElement | null {
    const ids = [item.id, ...(item.alternateIds ?? [])];
    let firstExisting: HTMLElement | null = null;
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (!firstExisting) firstExisting = el;
      if (el.offsetParent !== null) return el;
    }
    return firstExisting;
  }
}
