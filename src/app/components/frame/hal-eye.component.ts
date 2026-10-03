/**
 * HAL 9000 eye — the omnibar easter egg. Decorative and hidden from screen
 * readers; shown for 20 seconds after "HAL 9000" is entered, then faded out
 * over 3 seconds. The shell calls `trigger()`.
 */
import { ChangeDetectionStrategy, Component, DestroyRef, ViewEncapsulation, inject, signal } from '@angular/core';

@Component({
  selector: 'app-hal-eye',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- HAL 9000 Eye - decorative element, hidden from screen readers -->
    @if (halEyeVisible()) {
      <div class="hal-eye-container" [class.fading-out]="halEyeFading()" aria-hidden="true" role="presentation">
        <div class="hal-eye"></div>
      </div>
    }
  `,
  styles: [
    `
      app-hal-eye {
        display: contents;
      }

      app-root .hal-eye-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        left: 50%;
        top: 32px;
        transform: translateX(-50%);
        z-index: 1100;
        pointer-events: none;
        opacity: 1;
        transition: opacity 3s ease-out;
      }

      app-root .hal-eye-container.fading-out {
        opacity: 0;
      }

      app-root .hal-eye {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ff6666 0%, #ff0000 30%, #cc0000 60%, #660000 100%);
        box-shadow:
          0 0 20px rgba(255, 0, 0, 0.8),
          0 0 40px rgba(255, 0, 0, 0.5),
          inset 0 0 10px rgba(0, 0, 0, 0.5),
          inset 2px 2px 5px rgba(255, 255, 255, 0.2);
        animation: hal-pulse 2s ease-in-out infinite;
        position: relative;
        overflow: hidden;
      }

      app-root .hal-eye::before {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        background: radial-gradient(circle, #ff9999 0%, #ff6666 40%, transparent 70%);
        top: 25%;
        left: 25%;
        border-radius: 50%;
        animation: hal-inner-glow 2s ease-in-out infinite;
      }

      app-root .hal-eye::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: #ffffff;
        top: 30%;
        left: 30%;
        border-radius: 50%;
        opacity: 0.8;
      }

      @keyframes hal-pulse {
        0%,
        100% {
          box-shadow:
            0 0 20px rgba(255, 0, 0, 0.8),
            0 0 40px rgba(255, 0, 0, 0.5),
            inset 0 0 10px rgba(0, 0, 0, 0.5),
            inset 2px 2px 5px rgba(255, 255, 255, 0.2);
        }
        50% {
          box-shadow:
            0 0 30px rgba(255, 0, 0, 1),
            0 0 60px rgba(255, 0, 0, 0.7),
            inset 0 0 15px rgba(0, 0, 0, 0.5),
            inset 2px 2px 5px rgba(255, 255, 255, 0.3);
        }
      }

      @keyframes hal-inner-glow {
        0%,
        100% {
          opacity: 0.6;
          transform: scale(1);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.1);
        }
      }

      /* Title sizing — keep these tweaks across the tier transitions */
      @media (max-width: 850px) {
        app-root .hal-eye {
          width: 30px;
          height: 30px;
        }

        app-root .hal-eye::before {
          width: 8px;
          height: 8px;
        }

        app-root .hal-eye::after {
          width: 4px;
          height: 4px;
        }
      }

      /* Reduced Motion: HAL Eye (WCAG 2.3.3) */
      @media (prefers-reduced-motion: reduce) {
        app-root .hal-eye {
          animation: none;
        }
        app-root .hal-eye::before {
          animation: none;
        }
        app-root .hal-eye-container {
          transition: none;
        }
      }
    `,
  ],
})
export class HalEyeComponent {
  // HAL Eye visibility and fade state
  protected readonly halEyeVisible = signal(false);
  protected readonly halEyeFading = signal(false);
  private halEyeTimeout: ReturnType<typeof setTimeout> | null = null;
  private halEyeShownThisSession = false; // Track if eye was shown in this session

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.halEyeTimeout) {
        clearTimeout(this.halEyeTimeout);
      }
    });
  }

  /**
   * Handle HAL 9000 trigger from navigation dropdown
   * Always show eye when HAL 9000 is entered, regardless of achievement status
   */
  trigger(): void {
    // Reset session flag to allow showing eye again
    this.halEyeShownThisSession = false;

    // Show the eye
    this.halEyeVisible.set(true);
    this.halEyeFading.set(false);

    // Clear any existing timeout
    if (this.halEyeTimeout) {
      clearTimeout(this.halEyeTimeout);
    }

    // After 20 seconds, start fade-out
    this.halEyeTimeout = setTimeout(() => {
      this.halEyeFading.set(true);

      // After 3 seconds of fade-out animation, hide completely
      setTimeout(() => {
        this.halEyeVisible.set(false);
        // Mark as shown again
        this.halEyeShownThisSession = true;
      }, 3000);
    }, 20000);
  }
}
