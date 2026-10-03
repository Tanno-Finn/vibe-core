/**
 * ThumbnailComponent — Unified Pfad → Visual-Mapping.
 *
 * Consumer sagt "hier ist ein Pfad", Component findet das passende Visual:
 *   1. /articles/<slug>     → <app-illustration> stepId = slug
 *   2. /<demo-route>        → <app-illustration> wenn pageId im Registry,
 *                             sonst <app-content-visual-snippet> wenn qs-*
 *   3. /<section-path>      → <app-content-visual-snippet> mit section-type
 *   4. else                 → gestaltete Fallback-Kachel (Typ-Farbe + Icon)
 *
 * Ein Visual gilt nur, wenn es GEBACKEN ist (BAKED_ILLUSTRATION / BAKED_SNIPPET):
 * ein ungebackenes Ziel würde in <app-illustration>/<app-content-visual-snippet>
 * nur deren leeren Platzhalter zeigen — eine graue Box. Bis 2026-09-24 hat
 * pathToThumbnail jeden /articles/<slug> ungeprüft auf eine Illustration gemappt;
 * das Kit bäckt aber nur seed-article-1, also standen 15 von 17 Laufband-Kacheln
 * auf /home ohne Vorschau da. Jetzt fällt ein ungebackenes Ziel auf den Fallback.
 *
 * Vorgesehen für Consumer wie Suchtreffer, Activity-Log, Recent-Pages —
 * überall wo ein roher Pfad in eine Vorschau verwandelt werden muss.
 * /learn und /home brauchen das nicht (iterieren über typed Item-Listen
 * mit eingebettetem visualType/stepId).
 *
 * Maps sind hardgecodet weil ~30 Einträge total, low-frequency Changes.
 * Source of truth:
 *   - DEMO_ROUTE_TO_ILLUSTRATION: demos/index.json `path` + abgeglichen mit
 *     den im IllustrationComponent registrierten stepIds
 *   - DEMO_ROUTE_TO_SNIPPET / SECTION_PATH_TO_SNIPPET: home.component.ts
 *     QuickStartItems + ShowcaseItems (visualType-Felder)
 */
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
  ElementRef,
  booleanAttribute,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IllustrationComponent } from './illustration.component';
import { ContentVisualSnippetComponent } from './content-visual-snippet.component';
import { BAKED_ILLUSTRATION, BAKED_SNIPPET } from './baked-thumbnails.manifest';

// Demo-Route → schaubild stepId (Registry-matched). Nur geroutete Seiten:
// jeder Aufruf läuft mit dem kanonischen Pfad einer echten Route
// (app.routes.maps.spec.ts hält die Schlüssel gegen app.routes.ts). Demos ohne
// Schaubild-Pick fehlen bewusst — fallen auf SNIPPET/Icon.
export const DEMO_ROUTE_TO_ILLUSTRATION: Record<string, string> = {
  // Kit seed demo (stepId == pageId convention, demos/index.json).
  'example-demo': 'sdmo',
};

// Demo-Route → snippet type (für Demos ohne Schaubild aber mit /home-QuickStart).
// Das Kit liefert keine solche Demo aus; der Eintrag für eine eigene Demo gehört hierher.
export const DEMO_ROUTE_TO_SNIPPET: Record<string, string> = {};

// Section-Pfad → snippet type. Nur kanonische Routen — Redirect-Aliase
// (/ai-tools, /learning-paths, …) erreichen diese Funktion nie.
export const SECTION_PATH_TO_SNIPPET: Record<string, string> = {
  '/home': 'home',
  '/glossary': 'glossary',
  '/ai-timeline': 'timeline',
  '/learn': 'learningPaths',
  '/demos': 'demos',
  '/catalog': 'tools',
  '/roadmap': 'roadmap',
  '/sources': 'sources',
  '/news': 'news',
  '/impressum': 'impressum',
};

// Seiten-Kategorie (pageType-Input der Consumer) → Fallback-Icon.
const TYPE_ICON: Record<string, string> = {
  Artikel: 'pi pi-book',
  Demo: 'pi pi-bolt',
  'AI Tools': 'pi pi-wrench',
  'AI Resources': 'pi pi-folder-open',
  Glossar: 'pi pi-list',
  Timeline: 'pi pi-clock',
  Lernbereich: 'pi pi-graduation-cap',
  Achievements: 'pi pi-trophy',
  Einstellungen: 'pi pi-cog',
  Startseite: 'pi pi-home',
  System: 'pi pi-cog',
  Portal: 'pi pi-compass',
};

export type ThumbnailResolution =
  { kind: 'illustration'; stepId: string } | { kind: 'snippet'; snippetType: string } | null;

/** Pure mapping function. Exportiert für Tests + künftige Non-Render-Consumer
 *  (z.B. "hat dieser Pfad ein Visual?"-Checks ohne DOM). Liefert nur GEBACKENE
 *  Visuals; null heißt „kein Bild" → <app-thumbnail> zeigt die Fallback-Kachel. */
export function pathToThumbnail(path: string): ThumbnailResolution {
  const r = mapPathToVisual(path);
  if (r?.kind === 'illustration' && !BAKED_ILLUSTRATION.has(r.stepId)) return null;
  if (r?.kind === 'snippet' && !BAKED_SNIPPET.has(r.snippetType)) return null;
  return r;
}

/** Pfad → gewünschtes Visual, noch ohne Blick darauf, ob es gebacken ist. */
function mapPathToVisual(path: string): ThumbnailResolution {
  if (path.startsWith('/articles/')) {
    return { kind: 'illustration', stepId: path.slice(10) };
  }
  // Sub-Pages von Hub-Sektionen fallen auf den Section-Snippet zurück.
  // (Echte Demo-spezifische Schaubilder gibt's nicht im Registry —
  // der Section-Snippet ist daher die beste verfügbare Approximation.)
  if (path.startsWith('/demos/')) {
    return { kind: 'snippet', snippetType: 'demos' };
  }
  const route = path.startsWith('/') ? path.slice(1) : path;
  if (DEMO_ROUTE_TO_ILLUSTRATION[route]) {
    return { kind: 'illustration', stepId: DEMO_ROUTE_TO_ILLUSTRATION[route] };
  }
  if (DEMO_ROUTE_TO_SNIPPET[route]) {
    return { kind: 'snippet', snippetType: DEMO_ROUTE_TO_SNIPPET[route] };
  }
  if (SECTION_PATH_TO_SNIPPET[path]) {
    return { kind: 'snippet', snippetType: SECTION_PATH_TO_SNIPPET[path] };
  }
  return null;
}

@Component({
  selector: 'app-thumbnail',
  standalone: true,
  imports: [IllustrationComponent, ContentVisualSnippetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shouldRender()) {
      @if (illustrationStepId(); as id) {
        <app-illustration [stepId]="id" size="cover" />
      } @else if (snippetType(); as type) {
        <div class="thumb-center">
          <app-content-visual-snippet [type]="type" size="md" />
        </div>
      } @else {
        <!-- Gestaltete Fallback-Kachel: Typ-Farbe als Verlauf + Punktraster, Icon im
             Badge. Rein dekorativ (der Titel steht beim Consumer unter der Kachel). -->
        <div
          class="thumb-center thumb-fallback"
          [attr.data-type]="pageType"
          [style.--thumb-angle]="fallbackAngle()"
          aria-hidden="true"
        >
          <span class="thumb-fallback-badge"><i [class]="iconClass()"></i></span>
        </div>
      }
    } @else {
      <!-- Lazy placeholder: leichtes Shimmer-Skeleton bis die Kachel in Sicht
           kommt. Belegt dank :host aspect-ratio den exakt gleichen Platz → kein
           Layout-Shift, korrekte FLIP-Messung. -->
      <div class="thumb-skeleton" aria-hidden="true"></div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        aspect-ratio: 3 / 2;
        position: relative;
        overflow: hidden;
        background: var(--surface-100);
      }
      .thumb-center {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      /* Fallback-Kachel: Typ-Farbe (--thumb-hue) mit der Kartenfläche gemischt →
       blass im Light-, gedämpft dunkel im Dark-Theme, ohne eigene Dark-Regeln. */
      .thumb-fallback {
        --thumb-hue: var(--primary-color);
        background:
          radial-gradient(circle, color-mix(in srgb, var(--thumb-hue) 22%, transparent) 1px, transparent 1.5px) 0 0 /
            14px 14px,
          linear-gradient(
            var(--thumb-angle, 135deg),
            color-mix(in srgb, var(--thumb-hue) 22%, var(--surface-card)),
            color-mix(in srgb, var(--thumb-hue) 6%, var(--surface-card))
          );
      }
      .thumb-fallback-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 999px;
        background: var(--surface-card);
        border: 1px solid color-mix(in srgb, var(--thumb-hue) 35%, var(--surface-border));
        box-shadow: var(--shadow-sm);
        color: color-mix(in srgb, var(--thumb-hue) 80%, var(--text-color));
      }
      .thumb-fallback-badge i {
        font-size: 1.5rem;
      }
      /* Lazy-Skeleton: dezenter Shimmer, gleiche Box wie das echte Visual. */
      .thumb-skeleton {
        position: absolute;
        inset: 0;
        background: linear-gradient(100deg, var(--surface-100) 30%, var(--surface-200) 50%, var(--surface-100) 70%);
        background-size: 200% 100%;
        animation: thumb-shimmer 1.4s ease-in-out infinite;
      }
      @keyframes thumb-shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .thumb-skeleton {
          animation: none;
        }
      }
      /* Type-spezifische Fallback-Farbe — gleicht die type-tag-Palette. */
      .thumb-fallback[data-type='Artikel'] {
        --thumb-hue: var(--p-blue-500);
      }
      .thumb-fallback[data-type='Demo'] {
        --thumb-hue: var(--p-purple-500);
      }
      .thumb-fallback[data-type='AI Tools'],
      .thumb-fallback[data-type='AI Resources'] {
        --thumb-hue: var(--p-green-500);
      }
      .thumb-fallback[data-type='Lernbereich'] {
        --thumb-hue: var(--p-orange-500);
      }
      .thumb-fallback[data-type='Startseite'] {
        --thumb-hue: var(--p-yellow-500);
      }
      .thumb-fallback[data-type='Glossar'] {
        --thumb-hue: var(--p-cyan-500);
      }
      .thumb-fallback[data-type='Timeline'] {
        --thumb-hue: var(--p-indigo-500);
      }
    `,
  ],
})
export class ThumbnailComponent implements OnInit, OnDestroy {
  @Input({ required: true }) path!: string;
  /** Verwendung optional — nur für Fallback-Icon-Klassifizierung benutzt, wenn
   *  weder schaubild noch snippet matcht. Wert kommt aus helpers.php getPageType(). */
  @Input() pageType = '';

  /** Lazy-Mount: bis die Kachel (fast) in Sicht ist, nur ein Skeleton statt des
   *  schweren Schaubild-/Snippet-SVGs. Opt-in — Default false hält das bisherige
   *  Verhalten für alle übrigen Consumer (Stats, Roadmap, Gallery). */
  @Input({ transform: booleanAttribute }) lazy = false;
  /** IntersectionObserver-Root (z.B. die clippende Marquee-Reihe). null ⇒ Viewport. */
  @Input() lazyRoot: HTMLElement | null = null;
  /** Beim Verlassen wieder zum Skeleton entladen — für driftende Reihen, damit nie
   *  mehr als das sichtbare Fenster an schweren SVGs gemountet ist. Default: einmal
   *  gerendert bleibt gerendert (vertikales Grid-Scrollen → kein Churn). */
  @Input({ transform: booleanAttribute }) lazyUnmount = false;
  /** Vorlade-Puffer um den Root, damit eindriftende Kacheln rechtzeitig mounten. */
  @Input() lazyRootMargin = '150px';

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  /** Ob das echte Visual (statt Skeleton) gerendert wird. Signal → OnPush-tauglich. */
  readonly rendered = signal(false);
  private io: IntersectionObserver | null = null;

  /** Nicht-lazy ⇒ immer rendern. Lazy ⇒ nur wenn (jemals) in Sicht. */
  shouldRender(): boolean {
    return !this.lazy || this.rendered();
  }

  ngOnInit(): void {
    if (!this.lazy) {
      this.rendered.set(true);
      return;
    }
    // SSR / fehlender IO-Support: nicht hinter einem Skeleton verstecken.
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      this.rendered.set(true);
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            this.rendered.set(true);
            if (!this.lazyUnmount) {
              this.io?.disconnect();
              this.io = null;
            }
          } else if (this.lazyUnmount) {
            this.rendered.set(false);
          }
        }
      },
      { root: this.lazyRoot, rootMargin: this.lazyRootMargin },
    );
    this.io.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    this.io = null;
  }

  illustrationStepId(): string | null {
    const r = pathToThumbnail(this.path);
    return r?.kind === 'illustration' ? r.stepId : null;
  }
  snippetType(): string | null {
    const r = pathToThumbnail(this.path);
    return r?.kind === 'snippet' ? r.snippetType : null;
  }
  iconClass(): string {
    return TYPE_ICON[this.pageType] || 'pi pi-file';
  }
  /** Stabil aus dem Pfad abgeleiteter Verlaufswinkel, damit eine Reihe Fallback-
   *  Kacheln desselben Typs nicht wie Kopien voneinander aussieht. */
  fallbackAngle(): string {
    let h = 0;
    for (let i = 0; i < this.path.length; i++) h = (h * 31 + this.path.charCodeAt(i)) >>> 0;
    return `${100 + (h % 6) * 30}deg`;
  }
}
