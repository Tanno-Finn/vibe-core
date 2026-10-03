/**
 * ContentVisualSnippetComponent — runtime snippet renderer (thin).
 *
 * Renders ONLY the static baked WebP for a snippet type (accent-independent; light/dark
 * via the .dark-theme class). The heavy live HTML @case markup lives in the dev-only
 * ContentVisualSnippetSourceComponent (content-visual-snippet-source.component.ts), which
 * the baker renders — so this component (and the prod bundle) stays tiny. The baked image
 * already includes the vs-container frame, so when baked the live chrome is stripped.
 *
 * Add/change a snippet: put `snip__<type>.webp` and `snip__<type>.dark.webp` under
 * src/assets/images/thumbnails/ and list the type in BAKED_SNIPPET. No baker ships with
 * the kit (scripts/build-thumbnails.js was removed); an unbaked type never reaches this
 * component through <app-thumbnail>, which shows its fallback tile instead.
 */
import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { BAKED_SNIPPET, THUMBS_VERSION } from './baked-thumbnails.manifest';

@Component({
  selector: 'app-content-visual-snippet',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="vs-container" [class]="'vs-size-' + size" [class.vs-baked-host]="hasBaked()" [attr.aria-hidden]="true">
      @if (hasBaked()) {
        <div class="vs-baked sb-light" role="img" [style.background-image]="'url(' + bakedUrl(false) + ')'"></div>
        <div class="vs-baked sb-dark" aria-hidden="true" [style.background-image]="'url(' + bakedUrl(true) + ')'"></div>
      } @else {
        <div class="vs-placeholder" aria-hidden="true"></div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .vs-container {
        width: 160px;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius-lg, 12px);
        background: var(--surface-ground);
        padding: 0.5rem;
      }
      .vs-size-sm {
        width: 100px;
        height: 90px;
        transform: scale(0.625);
        transform-origin: center;
      }
      .vs-size-lg {
        width: 200px;
        height: 180px;
        transform: scale(1.25);
        transform-origin: center;
      }
      /* Baked WebP already contains the vs-container frame, so strip the live chrome. */
      .vs-container.vs-baked-host {
        position: relative;
        border: none;
        background: none;
        padding: 0;
        overflow: hidden;
      }
      .vs-baked {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
      .vs-baked.sb-dark {
        display: none;
      }
      .dark-theme .vs-baked.sb-light {
        display: none;
      }
      .dark-theme .vs-baked.sb-dark {
        display: block;
      }
      .vs-placeholder {
        width: 100%;
        height: 100%;
        background: var(--surface-100);
        border-radius: inherit;
      }
    `,
  ],
})
export class ContentVisualSnippetComponent {
  @Input() type = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /** Accent-independent: render the baked WebP whenever one exists for this type. */
  hasBaked(): boolean {
    return BAKED_SNIPPET.has(this.type);
  }
  bakedUrl(dark: boolean): string {
    return `/assets/images/thumbnails/snip__${this.type}${dark ? '.dark' : ''}.webp?v=${THUMBS_VERSION}`;
  }
}
