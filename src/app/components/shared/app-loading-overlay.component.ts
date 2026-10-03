/**
 * App Loading Overlay Component
 *
 * Simple fullscreen blur overlay with Optimus UI loading spinner.
 * Minimal, subtle design that doesn't interfere with user experience.
 *
 * Features:
 * - Fullscreen blur backdrop
 * - Clean Optimus UI spinner
 * - Smooth fade animations
 * - Minimal visual footprint
 */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ProgressSpinnerModule } from '@openng/optimus-ui/progressspinner';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="loading-overlay"
      [class.visible]="isVisible"
      [attr.aria-hidden]="!isVisible"
      role="status"
      [attr.aria-label]="loadingMessage"
    >
      <!-- The stroke color comes from the global .p-progressspinner rule in
           styles.scss: --primary-color-fg, which ThemeService writes per mode
           and the contrast gate measures (CONTRAST.MD, "progress spinner"). -->
      <p-progressspinner
        strokeWidth="3"
        animationDuration="1s"
        [ariaLabel]="loadingMessage"
        [style]="{ width: '60px', height: '60px' }"
      >
      </p-progressspinner>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 300ms ease-out,
          visibility 300ms ease-out;
      }

      .loading-overlay.visible {
        opacity: 1;
        visibility: visible;
        transition:
          opacity 300ms ease-in,
          visibility 300ms ease-in;
      }

      /* Dark mode overlay */
      :host-context(.dark-theme) .loading-overlay {
        background: rgba(0, 0, 0, 0.6);
      }

      /* Optimus UI Spinner size set via [style] binding on the component */
    `,
  ],
})
export class AppLoadingOverlayComponent {
  @Input() isVisible: boolean = false;
  @Input() loadingMessage: string = '';
  // The spinner color used to be pinned here to the palette's LIGHT
  // primaryColor in both modes (coral #a8124e on the dark overlay). It now
  // follows --primary-color-fg through styles.scss, dark-mode aware like every
  // other accent foreground.
}
