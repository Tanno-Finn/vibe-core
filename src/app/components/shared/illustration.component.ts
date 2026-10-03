/**
 * IllustrationComponent — runtime thumbnail renderer (thin).
 *
 * Renders ONLY the static baked WebP for a stepId (accent-independent; light/dark
 * switched purely by the .dark-theme class → SSR-safe, only the active variant is
 * fetched). The heavy live HTML/SVG @case markup is NOT here — it lives in the
 * dev-only IllustrationSourceComponent (illustration-source.component.ts), which the
 * baker renders. So this component (and the prod bundle) stays tiny.
 *
 * <app-thumbnail> only hands out baked stepIds (pathToThumbnail checks BAKED_ILLUSTRATION)
 * and shows its designed fallback tile for everything else, so the grey placeholder here is
 * only a safety net for a direct caller. Add a thumbnail: put `<id>.webp` and
 * `<id>.dark.webp` under src/assets/images/thumbnails/ and list the id in
 * BAKED_ILLUSTRATION; scripts/validate-thumbnails.js fails the prod build if a listed
 * file is missing. No baker ships with the kit (scripts/build-thumbnails.js was removed).
 */
import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { BAKED_ILLUSTRATION, THUMBS_VERSION } from './baked-thumbnails.manifest';

@Component({
  selector: 'app-illustration',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="illustration-host" [class]="'illustration-size-' + size" [attr.aria-hidden]="true">
      <div class="illustration-inner">
        @if (hasBaked()) {
          <div
            class="illustration-baked sb-light"
            role="img"
            [style.background-image]="'url(' + bakedUrl(false) + ')'"
          ></div>
          <div
            class="illustration-baked sb-dark"
            aria-hidden="true"
            [style.background-image]="'url(' + bakedUrl(true) + ')'"
          ></div>
        } @else {
          <div class="illustration-placeholder" aria-hidden="true"></div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .illustration-host {
        position: relative;
        overflow: hidden;
        border-radius: 6px;
        display: inline-block;
        vertical-align: top;
      }
      .illustration-host .illustration-inner {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      /* Baked-thumbnail layers: fill the inner box, theme-switched by .dark-theme
       (pure CSS -> SSR-safe; only the displayed variant's image is fetched). */
      .illustration-baked {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .illustration-baked.sb-dark {
        display: none;
      }
      .dark-theme .illustration-baked.sb-light {
        display: none;
      }
      .dark-theme .illustration-baked.sb-dark {
        display: block;
      }
      .illustration-placeholder {
        position: absolute;
        inset: 0;
        background: var(--surface-100);
      }
      /* Host sizes — the baked image is background-size:cover so it fills any of them. */
      .illustration-host.illustration-size-sm {
        width: 120px;
        height: 80px;
      }
      .illustration-host.illustration-size-md {
        width: 200px;
        height: 134px;
      }
      .illustration-host.illustration-size-lg {
        width: 280px;
        height: 187px;
      }
      .illustration-host.illustration-size-fluid {
        display: block;
        width: 100%;
        max-width: 240px;
        aspect-ratio: 3 / 2;
      }
      .illustration-host.illustration-size-cover {
        display: block;
        width: 100%;
        aspect-ratio: 3 / 2;
        border-radius: 0;
      }
    `,
  ],
})
export class IllustrationComponent {
  @Input({ required: true }) stepId!: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'fluid' | 'cover' = 'md';

  /** Accent-independent: render the baked WebP whenever one exists for this stepId. */
  hasBaked(): boolean {
    return BAKED_ILLUSTRATION.has(this.stepId);
  }
  bakedUrl(dark: boolean): string {
    return `/assets/images/thumbnails/${this.stepId}${dark ? '.dark' : ''}.webp?v=${THUMBS_VERSION}`;
  }
}
