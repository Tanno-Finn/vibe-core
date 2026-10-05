import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  PLATFORM_ID,
  signal,
  computed,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Optimus UI Imports
import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';

// Services - V2 MIGRATION CRITICAL
import { TranslationService } from '../../services/translation.service';

// Universal Highlighting System
import { HighlightDirective } from '../../directives/highlight.directive';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

// Container type definitions
export type ContainerType =
  | 'primary' // Main content sections - blue accent
  | 'secondary' // Supporting information - gray accent
  | 'success' // Positive actions/results - green accent
  | 'warning' // Alerts/cautions - orange accent
  | 'info' // Informational content - blue accent
  | 'definition' // Educational definitions - pink accent
  | 'demo' // Interactive demonstrations - amber accent
  | 'controls' // Control panels - teal accent
  | 'danger'; // Error/critical content - red accent

export type ContainerSize = 'small' | 'medium' | 'large' | 'full';

export interface ContainerConfig {
  type: ContainerType;
  title?: string;
  titleKey?: string; // For i18n
  icon?: string; // Optimus UI icon class
  size?: ContainerSize;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
  showFooter?: boolean;
  customHeaderSlot?: boolean; // Allow custom header content
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6; // HTML heading level (h1-h6)
}

/** Counter behind each instance's content id — ids must be unique per page. */
let nextContainerId = 0;

// Standardized icon mapping
const CONTAINER_ICONS = {
  primary: 'pi pi-home',
  secondary: 'pi pi-info-circle',
  success: 'pi pi-check-circle',
  warning: 'pi pi-exclamation-triangle',
  info: 'pi pi-info',
  definition: 'pi pi-book',
  demo: 'pi pi-play-circle',
  controls: 'pi pi-cog',
  danger: 'pi pi-exclamation-circle',
} as const;

// Color accent mapping to design tokens
const CONTAINER_COLORS = {
  primary: 'var(--primary-color)',
  secondary: 'var(--surface-border)',
  success: 'var(--green-500)',
  warning: 'var(--orange-500)',
  info: 'var(--blue-500)',
  definition: 'var(--p-pink-500)',
  demo: 'var(--yellow-500)',
  controls: 'var(--teal-500)',
  danger: 'var(--red-500)',
} as const;

@Component({
  selector: 'app-standard-container',
  standalone: true,
  imports: [ButtonModule, TooltipModule, HighlightDirective, CursorGlowDirective, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="standard-container" [class]="containerClasses" [style]="containerStyle" appCursorGlow>
      <!-- Header Section. When collapsible, the one control is the chevron
           <button aria-expanded> (disclosure pattern). Its ::after stretches over
           the whole header, so a click anywhere on the header still toggles, as
           before. The header itself carries no role, so interactive content in
           it (e.g. info-tooltip buttons in a custom header) stays reachable
           instead of being flattened into one big button; styles.scss lifts
           those above the stretched hit area. -->
      <div
        class="container-header"
        [class.clickable]="config.collapsible"
        [class.is-collapsed]="config.collapsible && !isExpanded()"
      >
        <!-- Custom Header Slot -->
        @if (config.customHeaderSlot) {
          <div class="header-content">
            <div class="header-slot">
              <ng-content select="[slot=header]"></ng-content>
            </div>
            @if (config.collapsible) {
              <div class="header-actions">
                <ng-container *ngTemplateOutlet="toggleButton"></ng-container>
              </div>
            }
          </div>
        }

        <!-- Standard Header -->
        @if (!config.customHeaderSlot) {
          <div class="header-content">
            <div class="header-main">
              @if (headerIcon) {
                <i [class]="headerIcon" class="header-icon" [attr.aria-hidden]="true"></i>
              }
              @if (headerTitle) {
                @switch (config.headingLevel || 3) {
                  @case (1) {
                    <h1 class="header-title" [class.signal-color]="true" [appHighlight]="headerTitle">
                      {{ headerTitle }}
                    </h1>
                  }
                  @case (2) {
                    <h2 class="header-title" [appHighlight]="headerTitle">{{ headerTitle }}</h2>
                  }
                  @case (3) {
                    <h3 class="header-title" [appHighlight]="headerTitle">{{ headerTitle }}</h3>
                  }
                  @case (4) {
                    <h4 class="header-title" [appHighlight]="headerTitle">{{ headerTitle }}</h4>
                  }
                  @case (5) {
                    <h5 class="header-title" [appHighlight]="headerTitle">{{ headerTitle }}</h5>
                  }
                  @case (6) {
                    <h6 class="header-title" [appHighlight]="headerTitle">{{ headerTitle }}</h6>
                  }
                }
              }
            </div>
            @if (config.collapsible) {
              <div class="header-actions">
                <ng-container *ngTemplateOutlet="toggleButton"></ng-container>
              </div>
            }
          </div>
        }
      </div>

      <ng-template #toggleButton>
        <button
          type="button"
          class="collapse-button"
          [class.expanded]="isExpanded()"
          [attr.aria-expanded]="isExpanded()"
          [attr.aria-controls]="contentId"
          [attr.aria-label]="toggleLabel"
          pTooltip="{{ translate(isExpanded() ? 'ui.collapse' : 'ui.expand') }}"
          tooltipPosition="left"
          (click)="toggleExpanded()"
        >
          <i class="pi pi-chevron-down" [class.rotated]="!isExpanded()" aria-hidden="true"></i>
        </button>
      </ng-template>

      <!-- Content Section -->
      <div
        class="container-content"
        [id]="contentId"
        [class.collapsed]="!isExpanded()"
        [attr.inert]="isExpanded() ? null : ''"
      >
        <div class="content-clip">
          <div class="content-inner">
            <ng-content></ng-content>
          </div>
        </div>
      </div>

      <!-- Footer Section -->
      @if (config.showFooter && isExpanded()) {
        <div class="container-footer" animate.enter="container-footer-enter">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .standard-container {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        margin-bottom: var(--space-4);
        transition: all var(--transition-duration);
        position: relative;
      }

      .standard-container.elevation-sm {
        box-shadow: var(--shadow-1);
      }

      .standard-container.elevation-md {
        box-shadow: var(--shadow-2);
      }

      .standard-container.elevation-lg {
        box-shadow: var(--shadow-3);
      }

      /* Size variants - all containers now use 100% width */
      .standard-container.size-small,
      .standard-container.size-medium,
      .standard-container.size-large,
      .standard-container.size-full {
        width: 100%;
        max-width: none;
      }

      /* Header */
      .container-header {
        padding: var(--space-2) var(--space-4);
        border-bottom: 1px solid var(--surface-border);
        position: relative;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        overflow: hidden;
      }

      .container-header.clickable {
        cursor: pointer;
        user-select: none;
      }

      .container-header.clickable:hover {
        background: var(--surface-hover);
      }

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }

      .header-slot {
        flex: 1;
        min-width: 0;
      }

      .header-main {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        flex: 1;
      }

      .header-icon {
        font-size: 1.25rem;
        color: var(--primary-color-fg);
        flex-shrink: 0;
      }

      .header-title {
        margin: 0;
        font-weight: 600;
        color: var(--text-color);
        line-height: 1.2;
      }

      /* Heading level specific styles */
      .header-title.signal-color {
        color: var(--primary-color-fg); /* h1 uses theme signal color */
      }

      /* Font sizes for different heading levels */
      h1.header-title {
        font-size: var(--font-size-xxl); /* 2rem */
      }

      h2.header-title {
        font-size: var(--font-size-xl); /* 1.5rem */
      }

      h3.header-title {
        font-size: var(--font-size-lg); /* 1.125rem - default */
      }

      h4.header-title {
        font-size: var(--font-size-base); /* 1rem */
      }

      h5.header-title {
        font-size: var(--font-size-sm); /* 0.875rem */
      }

      h6.header-title {
        font-size: var(--font-size-sm); /* 0.875rem */
        font-weight: 500;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .collapse-button {
        background: none;
        border: none;
        font: inherit;
        padding: var(--space-2);
        border-radius: var(--border-radius-sm);
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all var(--transition-duration);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .collapse-button:hover {
        background: var(--surface-hover);
        color: var(--primary-color-fg);
      }

      /* Stretched hit area: the whole header clicks this button. The pseudo
         element is positioned against .container-header (position: relative);
         the button itself must therefore stay position: static. */
      .container-header.clickable .collapse-button::after {
        content: '';
        position: absolute;
        inset: 0;
      }

      .collapse-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .collapse-button .pi-chevron-down {
        transition: transform var(--transition-duration);
        font-size: 0.875rem;
      }

      .collapse-button .pi-chevron-down.rotated {
        transform: rotate(-90deg);
      }

      /* Content. Expand/collapse animates the grid row between 1fr and 0fr
       (native CSS, no @angular/animations); the clip keeps the padded inner
       box from holding the row open. prefers-reduced-motion shortens the
       transition to 0.01ms through the global rule in styles.scss. */
      .container-content {
        display: grid;
        grid-template-rows: 1fr;
        opacity: 1;
        transition:
          grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1),
          opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .container-content.collapsed {
        grid-template-rows: 0fr;
        opacity: 0;
      }

      .content-clip {
        min-height: 0;
        overflow: hidden;
      }

      .container-footer-enter {
        animation: container-footer-fade 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes container-footer-fade {
        from {
          opacity: 0;
        }
      }

      .content-inner {
        padding: var(--space-5);
      }

      /* Note: first/last child margin resets for projected content
       removed (previously used ::ng-deep). Content-inner padding
       provides sufficient spacing. */

      /* Footer */
      .container-footer {
        padding: var(--space-4) var(--space-5);
        border-top: 1px solid var(--surface-border);
        background: var(--surface-50);
        overflow: hidden;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
      }

      /* Type-specific accent borders */
      .standard-container.type-primary {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--primary-color-fg);
      }

      .standard-container.type-secondary {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--surface-border);
      }

      .standard-container.type-success {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--green-500);
      }

      .standard-container.type-success .header-icon {
        color: var(--green-500);
      }

      .standard-container.type-warning {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--orange-500);
      }

      .standard-container.type-warning .header-icon {
        color: var(--orange-500);
      }

      .standard-container.type-info {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--blue-500);
      }

      .standard-container.type-info .header-icon {
        color: var(--blue-500);
      }

      .standard-container.type-definition {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--p-pink-500);
      }

      .standard-container.type-definition .header-icon {
        color: var(--p-pink-500);
      }

      .standard-container.type-demo {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--yellow-500);
      }

      .standard-container.type-demo .header-icon {
        color: var(--yellow-500);
      }

      .standard-container.type-controls {
        border-left-width: var(--border-width-accent);
        border-left-color: var(--teal-500);
      }

      .standard-container.type-controls .header-icon {
        color: var(--teal-500);
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .container-header {
          padding: var(--space-3) var(--space-4);
        }

        .content-inner {
          padding: var(--space-4);
        }

        .container-footer {
          padding: var(--space-3) var(--space-4);
        }

        .header-title {
          font-size: var(--font-size-base);
        }
      }

      @media (max-width: 480px) {
        .container-header {
          padding: var(--space-3);
        }

        .content-inner {
          padding: var(--space-3);
        }

        .container-footer {
          padding: var(--space-3);
        }

        .collapse-button {
          padding: var(--space-3);
          min-height: 44px;
          min-width: 44px;
        }

        .header-title {
          font-size: var(--font-size-sm);
        }
      }

      @media (max-width: 320px) {
        .header-content {
          flex-wrap: wrap;
        }

        .header-main {
          min-width: 0;
        }

        .header-title {
          word-break: break-word;
        }

        .content-inner {
          padding: var(--space-2);
        }
      }

      /* Print styles */
      @media print {
        .standard-container {
          box-shadow: none;
          border: 1px solid #000;
          break-inside: avoid;
        }

        .collapse-button {
          display: none;
        }

        .container-content {
          grid-template-rows: 1fr !important;
          opacity: 1 !important;
        }
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .standard-container {
          border: 2px solid;
        }

        .header-icon {
          font-weight: bold;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .standard-container,
        .collapse-button .pi-chevron-down {
          transition: none;
        }
      }
    `,
  ],
})
export class StandardContainerComponent implements OnInit {
  @Input() config: ContainerConfig = { type: 'secondary' };

  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private hostEl = inject(ElementRef<HTMLElement>);
  private route = inject(ActivatedRoute, { optional: true });
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  // State
  private expandedState = signal(true);

  /** Unique id so the toggle button can point at the region it controls (aria-controls). */
  readonly contentId = `standard-container-content-${++nextContainerId}`;

  constructor() {
    // CRITICAL: Subscribe to language changes to trigger Angular change detection
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  // Computed properties (only for signal dependencies)
  isExpanded = computed(() => this.expandedState());

  // Getters for config-dependent values (config is not a signal, so computed() won't react to changes)
  get headerIcon(): string {
    return this.config.icon || CONTAINER_ICONS[this.config.type];
  }

  get headerTitle(): string {
    if (this.config.titleKey) {
      return this.translate(this.config.titleKey);
    }
    return this.config.title || '';
  }

  get containerClasses(): string {
    const classes = [`type-${this.config.type}`, `size-${this.config.size || 'medium'}`];

    if (this.config.elevation && this.config.elevation !== 'none') {
      classes.push(`elevation-${this.config.elevation}`);
    }

    return classes.join(' ');
  }

  get containerStyle(): Record<string, string> {
    const accentColor = CONTAINER_COLORS[this.config.type];
    return {
      '--accent-color': accentColor,
    };
  }

  ngOnInit() {
    if (this.config.collapsible && this.config.initiallyExpanded !== undefined) {
      this.expandedState.set(this.config.initiallyExpanded);
    }

    // Force-expand when the URL fragment targets this section. Without this,
    // users arriving via e.g. `/impressum#data-protection` would land on a
    // collapsed header, browser auto-scroll would hit a 0-height target, and
    // the section they came to read would be hidden.
    if (this.config.collapsible && isPlatformBrowser(this.platformId)) {
      if (!this.route) {
        // ActivatedRoute is `optional` to keep specs running without provideRouter.
        // In a routed production app this branch should never fire — warn so a real
        // DI regression (component hosted outside router outlet) is visible.
        console.warn('[standard-container] URL-fragment auto-expand disabled: ActivatedRoute unavailable');
      } else {
        this.route.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
          const id = (this.hostEl.nativeElement as HTMLElement).id;
          if (fragment && id && fragment === id) {
            this.expandedState.set(true);
          }
        });
      }
    }
  }

  /** Accessible name of the toggle: stable ("show or hide: <title>"); the state is aria-expanded. */
  get toggleLabel(): string {
    const label = this.translate('ui.toggleSection');
    return this.headerTitle ? `${label}: ${this.headerTitle}` : label;
  }

  toggleExpanded() {
    if (this.config.collapsible) {
      this.expandedState.update((expanded) => !expanded);
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
