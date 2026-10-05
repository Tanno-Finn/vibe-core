/**
 * IllustrationSourceComponent — DEV-ONLY source-of-truth for the illustration
 * @case visuals the committed static WebP thumbnails were made from. The kit no longer
 * ships the baker that screenshotted them (scripts/build-thumbnails.js and /dev/bake are
 * gone), so this markup is reference only and is swapped for a stub in prod — the
 * runtime <app-illustration> (illustration.component.ts) shows only the baked WebP.
 *
 * Kit note: this starter ships generic placeholder illustrations for the seed content
 * only — `sdmo` (example demo) and `seed-article-1` (seed article). Every other article
 * shows <app-thumbnail>'s fallback tile until its light + dark WebP are committed under
 * src/assets/images/thumbnails/ and its id is listed in BAKED_ILLUSTRATION.
 * (Selector app-illustration-source so it never clashes with the runtime component.)
 */
import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-illustration-source',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="illustration-host" [class]="'illustration-size-' + size" [attr.aria-hidden]="true">
      <div class="illustration-inner">
        @switch (stepId) {
          @case ('sdmo') {
            <!-- Example demo: an interactive "control panel" motif (dots + controls). -->
            <div
              style="width:100%;height:100%;box-sizing:border-box;padding:16px;background:linear-gradient(160deg,var(--surface-0),var(--surface-100));display:flex;flex-direction:column;gap:12px;position:relative;overflow:hidden"
            >
              <div
                style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,var(--primary-400),transparent 65%);opacity:.09"
              ></div>
              <div
                style="flex:1;display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(3,1fr);gap:8px;position:relative"
              >
                <div
                  style="border-radius:50%;background:var(--primary-400);box-shadow:0 0 6px 1px color-mix(in srgb,var(--primary-500) 45%,transparent)"
                ></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
                <div style="border-radius:50%;background:var(--green-400,#4ade80)"></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
                <div style="border-radius:50%;background:var(--primary-400)"></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
                <div style="border-radius:50%;background:var(--orange-400,#fb923c)"></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
                <div style="border-radius:50%;background:var(--green-400,#4ade80)"></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
                <div style="border-radius:50%;background:var(--primary-400)"></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
                <div style="border-radius:50%;background:var(--teal-400,#2dd4bf)"></div>
                <div style="border-radius:50%;background:var(--surface-300)"></div>
              </div>
              <div style="display:flex;align-items:center;gap:8px;position:relative">
                <div
                  style="width:22px;height:22px;border-radius:50%;background:var(--primary-500);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px color-mix(in srgb,var(--primary-500) 40%,transparent)"
                >
                  <div
                    style="width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:8px solid white;margin-left:2px"
                  ></div>
                </div>
                <div style="flex:1;height:8px;border-radius:4px;background:var(--surface-200);overflow:hidden">
                  <div
                    style="width:62%;height:100%;background:linear-gradient(90deg,var(--primary-300),var(--primary-500));border-radius:4px"
                  ></div>
                </div>
                <div
                  style="width:34px;height:16px;border-radius:8px;border:1.5px solid var(--surface-300);display:flex;align-items:center;justify-content:center;background:var(--surface-0)"
                >
                  <span style="font-size:7px;font-weight:800;color:var(--text-color-secondary);letter-spacing:.3px"
                    >RESET</span
                  >
                </div>
              </div>
            </div>
          }
          @case ('seed-article-1') {
            <!-- Seed article: a document motif (page with heading + text lines). -->
            <div
              style="width:100%;height:100%;box-sizing:border-box;padding:18px;background:linear-gradient(160deg,var(--surface-0),var(--surface-100));display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden"
            >
              <div
                style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 30%,var(--primary-300),transparent 60%);opacity:.08"
              ></div>
              <div
                style="width:150px;height:118px;background:var(--surface-0);border:1.5px solid var(--surface-200);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:7px;position:relative;box-shadow:0 6px 20px rgba(0,0,0,.1),0 2px 6px rgba(0,0,0,.06)"
              >
                <div
                  style="height:8px;width:70%;background:linear-gradient(90deg,var(--primary-400),var(--primary-300));border-radius:3px"
                ></div>
                <div style="height:3.5px;width:100%;background:var(--surface-200);border-radius:2px"></div>
                <div style="height:3.5px;width:92%;background:var(--surface-200);border-radius:2px"></div>
                <div style="height:3.5px;width:96%;background:var(--surface-200);border-radius:2px"></div>
                <div style="height:3.5px;width:60%;background:var(--surface-200);border-radius:2px"></div>
                <div
                  style="height:22px;width:100%;background:linear-gradient(135deg,var(--primary-50),var(--surface-50));border:1px solid var(--primary-200);border-radius:5px;margin-top:2px"
                ></div>
                <div style="height:3.5px;width:88%;background:var(--surface-200);border-radius:2px"></div>
                <div style="height:3.5px;width:74%;background:var(--surface-200);border-radius:2px"></div>
              </div>
            </div>
          }
          @default {
            <div class="illustration-fallback" aria-hidden="true"></div>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      /* Authored content uses absolute pixel layouts designed for 240x160.
       We render at native 240x160 inside .illustration-inner, then scale the inner
       to fit the host via transform. This keeps all SVG/text proportions intact
       at any host size. */
      /* Host-Element default display: block. Ohne das ist <app-illustration>
       inline (Angular-Default), width:100% / aspect-ratio greifen dann nicht
       sauber -> Schaubild rendert in Inline-Content-Size, transform-scale
       basiert auf falscher Container-Größe, sichtbar abgeschnitten. */
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
        width: 240px;
        height: 160px;
        transform-origin: top left;
        position: absolute;
        top: 0;
        left: 0;
      }
      .illustration-host .illustration-inner > * {
        width: 100%;
        height: 100%;
      }
      .illustration-host.illustration-size-sm {
        width: 120px;
        height: 80px;
      }
      .illustration-host.illustration-size-sm .illustration-inner {
        transform: scale(0.5);
      }
      .illustration-host.illustration-size-md {
        width: 200px;
        height: 134px;
      }
      .illustration-host.illustration-size-md .illustration-inner {
        transform: scale(0.8333);
      }
      .illustration-host.illustration-size-lg {
        width: 280px;
        height: 187px;
      }
      .illustration-host.illustration-size-lg .illustration-inner {
        transform: scale(1.1667);
      }
      /* Fluid + Cover: Inner-Box füllt die Host-Box exakt aus (kein transform-scale).
       Die frühere Variante transform: scale(calc(100cqw / 240)) war ungültiges
       CSS (length/number ergibt length, scale() will aber unitless) und wurde
       vom Parser stillschweigend verworfen → Inner rendert nativ 240x160 und
       overflowt jeden Host der nicht zufällig genau 240x160 ist, sichtbar als
       Right-Bottom-Clipping. Da Schaubild-Content durchgängig mit width:100%
       + height:100% + Flexbox arbeitet, passt er sich an die tatsächliche
       Host-Größe an. Pixel-Schriftgrößen (5–8px) bleiben absolut — bei den
       hier üblichen Host-Größen (~200–280px) nicht merklich. */
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
      .illustration-host.illustration-size-fluid .illustration-inner,
      .illustration-host.illustration-size-cover .illustration-inner {
        width: 100%;
        height: 100%;
        transform: none;
      }
      .illustration-fallback {
        width: 100%;
        height: 100%;
        background: var(--surface-100);
        border: 1px dashed var(--surface-border);
      }
    `,
  ],
})
export class IllustrationSourceComponent {
  @Input({ required: true }) stepId!: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'fluid' | 'cover' = 'md';
}
