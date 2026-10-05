import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="circular-progress-container">
      <div
        class="progress-ring"
        role="progressbar"
        [attr.aria-valuenow]="value"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="100"
        [attr.aria-label]="label || 'Progress: ' + value + ' percent'"
        tabindex="0"
        [style.width.px]="ringSizePx"
        [style.height.px]="ringSizePx"
        [style.background]="getConicGradient()"
        [style.box-shadow]="getBoxShadow()"
      >
        <div class="progress-inner">
          <div class="progress-content">
            <div class="percentage" aria-hidden="true">{{ value }}%</div>
            @if (label) {
              <div class="label" aria-hidden="true">{{ label }}</div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .circular-progress-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .progress-ring {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        position: relative;
        margin: 0 auto;
        transition:
          all 0.6s cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow 0.4s ease-out;
      }

      .progress-ring:hover {
        transform: scale(1.05);
      }

      .progress-inner {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background: var(--surface-card);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .progress-content {
        text-align: center;
        z-index: 10;
        position: relative;
      }

      .percentage {
        display: block;
        font-size: 1.8rem;
        font-weight: bold;
        font-family: var(--font-mono);
        line-height: 1;
        margin-bottom: 0.25rem;
        color: var(--text-color);
        animation: fadeInScale 0.8s ease-out;
      }

      .label {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        opacity: 0.8;
      }

      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* Focus Management */
      .progress-ring:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 4px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .progress-ring {
          width: 120px;
          height: 120px;
        }

        .percentage {
          font-size: 1.5rem;
        }
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        .progress-ring {
          transition: none;
        }

        .progress-ring:hover {
          transform: none;
        }

        .percentage {
          animation: none;
        }
      }
    `,
  ],
})
export class CircularProgressComponent {
  @Input() value: number = 0; // Progress value 0-100
  @Input() label: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  // Optional fixed color. When set, overrides the value-based interpolation;
  // when undefined (default), the ring color is interpolated from the value.
  @Input() color?: 'green' | 'blue' | 'orange' | 'pink';

  // Rendered ring diameter per size step (px).
  private readonly sizeMap: Record<'small' | 'medium' | 'large', number> = {
    small: 100,
    medium: 140,
    large: 180,
  };

  // Fixed colors for the `color` override, as rgb() so getBoxShadow's regex
  // can extract the channels for the glow.
  private readonly colorMap: Record<'green' | 'blue' | 'orange' | 'pink', string> = {
    green: 'rgb(34, 197, 94)',
    blue: 'rgb(59, 130, 246)',
    orange: 'rgb(249, 115, 22)',
    pink: 'rgb(236, 72, 153)',
  };

  get ringSizePx(): number {
    return this.sizeMap[this.size] ?? this.sizeMap.medium;
  }

  // Get conic gradient with color interpolation from red → orange → yellow → green
  getConicGradient(): string {
    const clampedValue = Math.max(0, Math.min(100, this.value));
    const angle = (clampedValue / 100) * 360;

    // Fixed color override if provided, otherwise interpolate from the value
    const activeColor = this.getActiveColor(clampedValue);
    const backgroundColor = 'var(--surface-100, #f5f5f5)';

    return `conic-gradient(from 0deg, ${activeColor} 0deg, ${activeColor} ${angle}deg, ${backgroundColor} ${angle}deg, ${backgroundColor} 360deg)`;
  }

  // Resolve the active ring color: explicit `color` override wins, otherwise
  // fall back to the value-based interpolation (the default behavior).
  private getActiveColor(value: number): string {
    return this.color ? this.colorMap[this.color] : this.getInterpolatedColor(value);
  }

  // Interpolate color from red (0%) → orange (33%) → yellow (66%) → green (100%)
  private getInterpolatedColor(value: number): string {
    // Define color stops with RGB values for smooth interpolation
    const colorStops = [
      { percent: 0, rgb: [239, 68, 68] }, // red
      { percent: 33, rgb: [249, 115, 22] }, // orange
      { percent: 66, rgb: [234, 179, 8] }, // yellow
      { percent: 100, rgb: [34, 197, 94] }, // green
    ];

    // Find the two color stops to interpolate between
    let lowerStop = colorStops[0];
    let upperStop = colorStops[1];

    for (let i = 0; i < colorStops.length - 1; i++) {
      if (value >= colorStops[i].percent && value <= colorStops[i + 1].percent) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }

    // If at exact color stop, return that color
    if (value === lowerStop.percent) {
      return `rgb(${lowerStop.rgb.join(', ')})`;
    }
    if (value === upperStop.percent) {
      return `rgb(${upperStop.rgb.join(', ')})`;
    }

    // Calculate interpolation factor
    const range = upperStop.percent - lowerStop.percent;
    const factor = (value - lowerStop.percent) / range;

    // Interpolate RGB values
    const r = Math.round(lowerStop.rgb[0] + (upperStop.rgb[0] - lowerStop.rgb[0]) * factor);
    const g = Math.round(lowerStop.rgb[1] + (upperStop.rgb[1] - lowerStop.rgb[1]) * factor);
    const b = Math.round(lowerStop.rgb[2] + (upperStop.rgb[2] - lowerStop.rgb[2]) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Get box shadow with progressive glow intensity based on progress
  getBoxShadow(): string {
    const clampedValue = Math.max(0, Math.min(100, this.value));

    // Match the ring's active color (override or interpolated) for the glow
    const currentColor = this.getActiveColor(clampedValue);

    // Convert RGB color to rgba for shadow (extract RGB values)
    const rgbMatch = currentColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return '0 4px 20px rgba(239, 68, 68, 0.3)';

    const [, r, g, b] = rgbMatch;

    // Calculate glow intensity based on progress (0.2 to 0.8)
    const minIntensity = 0.2;
    const maxIntensity = 0.8;
    const glowIntensity = minIntensity + (maxIntensity - minIntensity) * (clampedValue / 100);

    // Calculate blur radius based on progress (8px to 40px)
    const minBlur = 8;
    const maxBlur = 40;
    const blurRadius = minBlur + (maxBlur - minBlur) * (clampedValue / 100);

    // Calculate spread radius based on progress (0px to 8px)
    const minSpread = 0;
    const maxSpread = 8;
    const spreadRadius = minSpread + (maxSpread - minSpread) * (clampedValue / 100);

    // Create multi-layered glow effect
    const innerGlow = `0 0 ${Math.round(blurRadius * 0.5)}px ${Math.round(spreadRadius * 0.5)}px rgba(${r}, ${g}, ${b}, ${glowIntensity})`;
    const outerGlow = `0 4px ${Math.round(blurRadius)}px ${Math.round(spreadRadius)}px rgba(${r}, ${g}, ${b}, ${glowIntensity * 0.6})`;
    const ambientGlow = `0 0 ${Math.round(blurRadius * 1.5)}px rgba(${r}, ${g}, ${b}, ${glowIntensity * 0.3})`;

    return `${innerGlow}, ${outerGlow}, ${ambientGlow}`;
  }
}
