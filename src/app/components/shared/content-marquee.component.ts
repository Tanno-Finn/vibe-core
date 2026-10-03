/**
 * ContentMarqueeComponent — Driftendes, „drehbares" Band aller freigeschalteten Inhalte.
 *
 * Zwei gegenläufige Reihen aus Bild-+-Titel-Kacheln driften zügig und
 * durchgehend. Drei Interaktionen:
 *   1. Hover/Fokus → verlangsamt FLIESSEND auf ein langsames Kriechen (bleibt
 *      lebendig, leichter zu treffen), beschleunigt beim Wegfahren weich zurück.
 *   2. Maus drücken + ziehen (auf Kachel oder Lane) → die Reihe folgt dem Finger
 *      wie ein Drehrad; man kann sie in beide Richtungen anschubsen.
 *   3. Loslassen → der Schwung (Fling) wird übernommen und nähert sich dann
 *      langsam wieder der natürlichen Drift-Richtung und -Geschwindigkeit an.
 *
 * Klick vs. Drag: nur ein echter Klick (Bewegung < Schwelle) navigiert; ein Zieh-
 * Gesten unterdrückt den Link-Klick.
 *
 * Quelle = NUR FREIGESCHALTETER Content — konsistent in dev UND prod (NICHT vom
 * „simulate prod"-Toggle abhängig, damit das Band immer das echte Live-Set spiegelt):
 *   - Artikel : ArticlesService.getAll() ∩ isVisibleInProd
 *               → draft + publishDate + Lernpfad-Cascade-Gate
 *   - Demos   : DemosService.getAllDemos() ∩ isPublished  (publishDate-Gate)
 *   isVisibleInProd/isPublished prüfen rein die Release-Regeln (kein isDevMode-
 *   Shortcut) → ein Demo/Artikel, dessen publishDate noch nicht erreicht ist, ODER
 *   ein Artikel in einem noch nicht freigeschalteten Lernpfad, bleibt überall draußen.
 *
 * Mischung: Demos (die wenigen interaktiven) werden in ihrer natürlichen Dichte
 * GLEICHMÄSSIG unter die Artikel geblendet (immer präsent + verteilt), beide
 * Gruppen pro Mount frisch durchgemischt → jeder /home-Besuch wirkt anders, aber
 * die Demos verschwinden nie. Reihen-Split = Hälften (nicht gerade/ungerade),
 * damit die gleichmäßig verteilten Demos in BEIDE Reihen fallen.
 *
 * Maximieren (Voll-Grid): der Maximieren-Button morpht die zwei Lauf-Reihen in ein
 * dichtes Grid ALLER freigeschalteten Kacheln (zusätzlich die öffentlichen Sektions-
 * Seiten aus extendedRoutes, Pattern der /dev/content-gallery). Übergang = FLIP-Morph
 * (sichtbare Band-Kacheln gleiten an ihren Grid-Platz, Rest blendet gestaffelt ein).
 *
 * Visuals: kanonisches <app-thumbnail [path]>, hier LAZY (IntersectionObserver):
 * off-screen nur ein Skeleton, das schwere Schaubild-/Snippet-SVG mountet erst kurz
 * vorm Sichtbarwerden — driftende Reihen entladen es beim Verlassen wieder. Hält die
 * Zahl gleichzeitig gerenderter (teurer, gefilterter) SVGs auf das sichtbare Fenster
 * klein → /home bleibt flüssig. Jede Demo-/Artikel-Kachel hat eine Vorschau: ohne
 * gebackenes Bild zeigt <app-thumbnail> die gestaltete Fallback-Kachel (Typ-Farbe +
 * Icon), nie eine leere Box (content-marquee.previews.spec.ts hält das fest).
 *
 * Layout: Box wie die übrigen /home-Panels (kein Full-Bleed). Links/rechts
 * blendet eine Mask-Gradient die Kacheln weich ein/aus.
 *
 * Bewegungs-Mechanik (rein im Browser, requestAnimationFrame): Der Track enthält
 * die Kacheln ZWEIMAL. Pro Reihe gibt es eine Geschwindigkeit `vel` (px/s) und
 * einen fortlaufenden `shift`; angewandt wird `translateX(-(shift mod w))` mit
 * w = Breite EINER Kopie — da beide Kopien identisch sind, ist der Modulo-Sprung
 * unsichtbar → nahtloser Endlos-Lauf. `vel` interpoliert pro Frame weich Richtung
 * Ziel (Basis-Drift, 0 bei Hover, oder der Fling-Schwung nach dem Loslassen).
 *
 * Performance & SSR: rein dekorativ, NUR im Browser gemountet. transform wird
 * direkt aufs DOM geschrieben (kein CD-Churn pro Frame).
 *
 * A11y (WCAG 2.1 AA):
 *   - Pause/Play-Button (WCAG 2.2.2 „Pause, Stop, Hide"): explizite, tastatur-
 *     bedienbare In-Page-Steuerung, die die Auto-Drift komplett anhält. Steht im
 *     Tab-Order VOR den vielen Kacheln, damit man stoppen kann, bevor man sich
 *     durchtabbt. (Reduced-Motion allein genügt NICHT — das ist OS-Ebene.)
 *   - Tastatur-Fokus friert das Band komplett ein (kein Kriechen unter dem
 *     Fokus-Ring) und holt die fokussierte Kachel aktiv ins sichtbare Fenster
 *     (`scrollAnchorIntoView`, WCAG 2.4.7/2.4.11). Erkennung via `:focus-visible`,
 *     damit Maus-Fokus/Drag unberührt bleiben. Während Tastatur-Fokus wird die
 *     dekorative Rand-Maske abgeschaltet, sodass der Ring nie ausgeblendet wird.
 *   - Eine Reihe real (fokussierbar), die zweite Loop-Kopie (`aria-hidden`,
 *     `tabindex=-1`) → keine Doppel-Ansage / doppelte Tab-Stops.
 *   - `prefers-reduced-motion` (inkl. Laufzeit-Umschaltung via matchMedia-Listener)
 *     lässt Drift + Drag gar nicht erst anlaufen und macht das Band manuell
 *     scrollbar (native Scroll → nativer Focus-into-view). Kein translate-Hover-Lift.
 */
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  ElementRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  afterNextRender,
  Injector,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ThumbnailComponent, pathToThumbnail } from './thumbnail.component';
import { TranslationService } from '../../services/translation.service';
import { ArticlesService } from '../../services/articles.service';
import { DemosService } from '../../services/demos.service';
import { extendedRoutes } from '../../app.routes';
import { SITE_CONFIG } from '../../../config/site';

interface MarqueeTile {
  titleKey: string;
  /** routerLink + <app-thumbnail> input, mit führendem Slash. */
  path: string;
  /** Typ für die Fallback-Kachel (Farbe + Icon), wenn kein gebackenes Bild existiert. */
  pageType: string;
}

@Component({
  selector: 'app-content-marquee',
  standalone: true,
  imports: [RouterModule, ThumbnailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (isBrowser && tiles().length) {
      <section
        class="cmq"
        [class.cmq--kbfocus]="kbFocusWithin()"
        [class.cmq--expanded]="expanded()"
        [attr.aria-label]="ariaLabel()"
        (mouseenter)="hovered.set(true)"
        (mouseleave)="hovered.set(false)"
        (focusin)="onFocusIn($event)"
        (focusout)="onFocusOut($event)"
      >
        @if (title()) {
          <h2 class="cmq-title">{{ title() }}</h2>
        }

        <!-- Steuerung oben rechts. Pause/Play (WCAG 2.2.2) nur bei laufender Drift
             (kein Reduced-Motion, nicht expandiert). Maximieren/Minimieren immer:
             schaltet zwischen den zwei Lauf-Reihen und dem Voll-Grid aller Inhalte.
             Beide stehen im Tab-Order VOR den Kacheln. -->
        <div class="cmq-controls">
          @if (!reducedMotion() && !expanded() && !staticMode()) {
            <button
              type="button"
              class="cmq-toggle"
              (click)="togglePaused()"
              [attr.aria-label]="paused() ? t('home.marquee.play') : t('home.marquee.pause')"
            >
              <i class="pi" [class.pi-play]="paused()" [class.pi-pause]="!paused()" aria-hidden="true"></i>
            </button>
          }
          <button
            type="button"
            class="cmq-toggle"
            (click)="toggleExpanded()"
            [disabled]="transitioning()"
            [attr.aria-expanded]="expanded()"
            [attr.aria-controls]="contentId"
            [attr.aria-label]="expanded() ? t('home.marquee.collapse') : t('home.marquee.expand')"
          >
            <i
              class="pi"
              [class.pi-window-maximize]="!expanded()"
              [class.pi-window-minimize]="expanded()"
              aria-hidden="true"
            ></i>
          </button>
        </div>

        <!-- Statusansage für Screenreader (WCAG 4.1.3) beim Umschalten. -->
        <p class="cmq-sr-only" role="status" aria-live="polite">{{ liveMsg() }}</p>

        <div class="cmq-content" [attr.id]="contentId">
          @if (expanded()) {
            <!-- Voll-Grid: alle freigeschalteten Inhalts-Kacheln des Portals
               (Sektionsseiten + released Demos + released Artikel). Lazy-gerendert. -->
            <ul class="cmq-grid">
              @for (tile of allTiles(); track tile.path) {
                <li>
                  <a
                    class="cmq-tile cmq-tile--grid"
                    [routerLink]="tile.path"
                    [attr.aria-label]="t(tile.titleKey)"
                    [attr.data-cmq-path]="tile.path"
                    draggable="false"
                  >
                    <app-thumbnail [path]="tile.path" [pageType]="tile.pageType" lazy [lazyRootMargin]="'500px'" />
                    <span class="cmq-tile-title">{{ t(tile.titleKey) }}</span>
                  </a>
                </li>
              }
            </ul>
          } @else if (staticMode()) {
            <!-- Wenig Content (< 3 Kacheln): statische, zentrierte Reihe statt
               Endlos-Band — ein Marquee, das dieselben ein, zwei Seed-Kacheln
               zyklisch wiederholt, wirkt kaputt. Jede Kachel genau einmal. -->
            <ul class="cmq-static">
              @for (tile of tiles(); track tile.path) {
                <li>
                  <a
                    class="cmq-tile"
                    [routerLink]="tile.path"
                    [attr.aria-label]="t(tile.titleKey)"
                    [attr.data-cmq-path]="tile.path"
                  >
                    <app-thumbnail [path]="tile.path" [pageType]="tile.pageType" />
                    <span class="cmq-tile-title">{{ t(tile.titleKey) }}</span>
                  </a>
                </li>
              }
            </ul>
          } @else {
            <!-- Reihe 1 (driftet nach links) — reale, fokussierbare Links -->
            <div
              class="cmq-row"
              #row0
              [class.cmq-row--dragging]="dragging() === 0"
              (pointerdown)="onPointerDown(0, $event)"
              (dragstart)="$event.preventDefault()"
            >
              <div class="cmq-track" data-cmq-row="0">
                <ul class="cmq-group">
                  @for (tile of rowA(); track $index) {
                    <li class="cmq-cell">
                      <a
                        class="cmq-tile"
                        [routerLink]="tile.path"
                        [attr.aria-label]="t(tile.titleKey)"
                        [attr.data-cmq-path]="tile.path"
                        draggable="false"
                      >
                        <app-thumbnail
                          [path]="tile.path"
                          [pageType]="tile.pageType"
                          lazy
                          [lazyRoot]="row0"
                          lazyUnmount
                          [lazyRootMargin]="'0px 320px'"
                        />
                        <span class="cmq-tile-title">{{ t(tile.titleKey) }}</span>
                      </a>
                    </li>
                  }
                </ul>
                <!-- Loop-Kopie: nur fürs nahtlose Weiterwandern, für AT/Keyboard inert -->
                <ul class="cmq-group" aria-hidden="true">
                  @for (tile of rowA(); track $index) {
                    <li class="cmq-cell">
                      <a class="cmq-tile" [routerLink]="tile.path" tabindex="-1" draggable="false">
                        <app-thumbnail
                          [path]="tile.path"
                          [pageType]="tile.pageType"
                          lazy
                          [lazyRoot]="row0"
                          lazyUnmount
                          [lazyRootMargin]="'0px 320px'"
                        />
                        <span class="cmq-tile-title">{{ t(tile.titleKey) }}</span>
                      </a>
                    </li>
                  }
                </ul>
              </div>
            </div>

            <!-- Reihe 2 (driftet nach rechts) -->
            <div
              class="cmq-row"
              #row1
              [class.cmq-row--dragging]="dragging() === 1"
              (pointerdown)="onPointerDown(1, $event)"
              (dragstart)="$event.preventDefault()"
            >
              <div class="cmq-track" data-cmq-row="1">
                <ul class="cmq-group">
                  @for (tile of rowB(); track $index) {
                    <li class="cmq-cell">
                      <a
                        class="cmq-tile"
                        [routerLink]="tile.path"
                        [attr.aria-label]="t(tile.titleKey)"
                        [attr.data-cmq-path]="tile.path"
                        draggable="false"
                      >
                        <app-thumbnail
                          [path]="tile.path"
                          [pageType]="tile.pageType"
                          lazy
                          [lazyRoot]="row1"
                          lazyUnmount
                          [lazyRootMargin]="'0px 320px'"
                        />
                        <span class="cmq-tile-title">{{ t(tile.titleKey) }}</span>
                      </a>
                    </li>
                  }
                </ul>
                <ul class="cmq-group" aria-hidden="true">
                  @for (tile of rowB(); track $index) {
                    <li class="cmq-cell">
                      <a class="cmq-tile" [routerLink]="tile.path" tabindex="-1" draggable="false">
                        <app-thumbnail
                          [path]="tile.path"
                          [pageType]="tile.pageType"
                          lazy
                          [lazyRoot]="row1"
                          lazyUnmount
                          [lazyRootMargin]="'0px 320px'"
                        />
                        <span class="cmq-tile-title">{{ t(tile.titleKey) }}</span>
                      </a>
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: [
    `
      /* Box wie die übrigen /home-Panels — gleiche Breite, kein Full-Bleed.
       position: relative als Anker für die absolut platzierte Pause-/Play-Steuerung. */
      app-content-marquee .cmq {
        position: relative;
        margin: 1.5rem 0 2.5rem 0;
        padding: 1.75rem 0 2rem;
        border-radius: 1.25rem;
        background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-section) 100%);
        border: 1px solid var(--surface-border);
        overflow: hidden;
      }

      app-content-marquee .cmq-title {
        font-size: 1.5rem;
        font-weight: 800;
        text-align: center;
        color: var(--text-color);
        /* Symmetrisches Seiten-Padding hält den zentrierten Titel von der oben rechts
         verankerten Pause-/Play-Steuerung frei (relevant auf schmalen Screens). */
        margin: 0 0 1.5rem 0;
        padding: 0 3.5rem;
        letter-spacing: -0.01em;
      }

      /* Steuerung (Pause/Play + Maximieren) — oben rechts im Container verankert,
       fluchtend mit der Mask-Kante (9%). Absolut platziert → kein vertikaler Block
       zwischen Titel und Kacheln; die Überschrift steht direkt über den Kacheln.
       Die zwei Buttons sitzen als rechtsbündige Flex-Reihe nebeneinander, der
       Maximieren-Button bleibt der äußerste (Ecke). */
      app-content-marquee .cmq-controls {
        position: absolute;
        top: 1.25rem;
        right: 9%;
        z-index: 1;
        display: flex;
        gap: 0.5rem;
      }
      app-content-marquee .cmq-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        color: var(--text-color);
        cursor: pointer;
        transition:
          border-color 0.18s ease,
          box-shadow 0.18s ease,
          background 0.18s ease;
      }
      app-content-marquee .cmq-toggle:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
      }
      app-content-marquee .cmq-toggle:focus-visible {
        outline: 3px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      app-content-marquee .cmq-toggle[disabled] {
        opacity: 0.55;
        cursor: default;
        pointer-events: none;
      }

      /* Screenreader-only Statusansage (visuell versteckt, für AT lesbar). */
      app-content-marquee .cmq-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        overflow: hidden;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        white-space: nowrap;
      }
      app-content-marquee .cmq-toggle i {
        font-size: 1.05rem;
        line-height: 1;
      }

      /* Solange Tastatur-Fokus im Band liegt: Rand-Maske abschalten, damit eine
       fokussierte Kachel (inkl. Fokus-Ring) am Rand nie ausgeblendet wird. */
      app-content-marquee .cmq--kbfocus .cmq-row {
        -webkit-mask-image: none;
        mask-image: none;
      }

      /* Jede Reihe clippt ihren überbreiten Track UND blendet die Kacheln an den
       Rändern weich ein/aus (Mask-Gradient). touch-action: pan-y lässt vertikales
       Seiten-Scrollen zu, während wir horizontale Drag-Gesten selbst behandeln. */
      app-content-marquee .cmq-row {
        overflow: hidden;
        cursor: grab;
        touch-action: pan-y;
        -webkit-mask-image: linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%);
        mask-image: linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%);
      }
      app-content-marquee .cmq-row--dragging {
        cursor: grabbing;
      }
      app-content-marquee .cmq-row + .cmq-row {
        margin-top: 0.85rem;
      }

      /* Track = zwei identische Gruppen flush nebeneinander. transform wird per
       requestAnimationFrame gesetzt — daher KEINE CSS-Transition. */
      app-content-marquee .cmq-track {
        display: flex;
        width: max-content;
        will-change: transform;
      }

      app-content-marquee .cmq-group {
        display: flex;
        margin: 0;
        padding: 0;
        list-style: none;
        flex: 0 0 auto;
      }
      /* Gleich großes margin-right an JEDER Kachel (statt gap), damit beide Kopien
       exakt gleich breit sind → Modulo der Kopienbreite geht pixelgenau auf. */
      app-content-marquee .cmq-cell {
        flex: 0 0 auto;
        margin-right: 0.85rem;
      }

      app-content-marquee .cmq-tile {
        display: flex;
        flex-direction: column;
        width: 210px;
        border: 1px solid var(--surface-border);
        border-radius: 0.6rem;
        overflow: hidden;
        background: var(--surface-card);
        text-decoration: none;
        color: inherit;
        /* Kein translate-Lift (Portal-Regel): nur Border/Shadow. */
        transition:
          border-color 0.18s ease,
          box-shadow 0.18s ease;
      }
      app-content-marquee .cmq-tile:hover {
        border-color: var(--p-amber-400, #fbbf24);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
      }
      app-content-marquee .cmq-tile:focus-visible {
        outline: 3px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      /* WICHTIG: Während des Ziehens KEIN pointer-events:none auf die Kacheln —
       das würde mitten in der Geste das pointerup-Ziel ändern, sodass der Browser
       den click auf die Lane statt auf den <a> feuert → Navigation tot. Drag und
       Klick-Unterdrückung laufen rein über JS (suppressClick). */
      app-content-marquee .cmq-tile,
      app-content-marquee .cmq-tile * {
        user-select: none;
        -webkit-user-drag: none;
      }
      app-content-marquee .cmq-tile app-thumbnail {
        width: 100%;
        pointer-events: none; /* Bilder nicht selbst greifbar — Drag geht an die Lane */
      }

      app-content-marquee .cmq-tile-title {
        font-size: 0.78rem;
        line-height: 1.25;
        font-weight: 600;
        color: var(--text-color);
        padding: 0.5rem 0.6rem 0.6rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Statische Reihe (Seed-Zustand, < 3 Inhalte): zentriert, jede Kachel
       einmal, kein Drift — Breite/Optik wie die Band-Kacheln. */
      app-content-marquee .cmq-static {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.85rem;
        list-style: none;
        margin: 0;
        padding: 0 9%;
      }
      app-content-marquee .cmq-static > li {
        display: flex;
      }

      /* Expandiert: dichtes Voll-Grid aller Inhalts-Kacheln statt der zwei Lauf-
       Reihen (Pattern der /dev/content-gallery). Innen an der Mask-Kante (9%)
       ausgerichtet, damit es mit Titel + Steuerung fluchtet. */
      app-content-marquee .cmq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 0.6rem;
        list-style: none;
        margin: 0;
        padding: 0 9%;
      }
      app-content-marquee .cmq-grid > li {
        display: flex;
      }
      /* Im Grid bestimmt die Spaltenbreite die Kachelbreite — feste 210px aufheben.
       will-change hält den FLIP-Morph (transform/opacity) GPU-glatt. */
      app-content-marquee .cmq-tile--grid {
        width: 100%;
        will-change: transform, opacity;
      }

      /* Tablet: etwas schmalere Spalten, weniger Seiten-Inset. */
      @media (max-width: 900px) {
        app-content-marquee .cmq-grid {
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          padding: 0 4%;
        }
      }
      @media (max-width: 768px) {
        /* NUR die Reihen-Kacheln verschmälern — Grid-Kacheln müssen ihre 1fr-Zelle
         füllen (sonst gewinnt diese späte Regel über .cmq-tile--grid). */
        app-content-marquee .cmq-row .cmq-tile {
          width: 160px;
        }
        /* Auf schmalen Screens würde der zentrierte Titel (je nach Sprache) unter den
         oben rechts verankerten Button laufen → Titel-TEXT per top-padding unter die
         Button-Zeile setzen (Button-Unterkante ~3.75rem ab Sektion-Oberkante).
         Seiten-Padding klein, weil der Button die Zeile nicht mehr teilt. */
        app-content-marquee .cmq-title {
          font-size: 1.25rem;
          padding: 2.5rem 1rem 0;
        }
        app-content-marquee .cmq-grid {
          grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
          gap: 0.5rem;
          padding: 0 0.75rem;
        }
      }
      /* Sehr schmal: zwei feste Spalten, Controls näher an die Ecke. Titel bleibt
       (vom 768er-Breakpoint) unter der Button-Zeile. */
      @media (max-width: 420px) {
        app-content-marquee .cmq-controls {
          right: 3%;
        }
        app-content-marquee .cmq-title {
          padding: 2.5rem 0.75rem 0;
        }
        app-content-marquee .cmq-grid {
          grid-template-columns: repeat(2, 1fr);
          padding: 0 0.6rem;
        }
      }

      /* Reduced motion: keine Drift/Drag. transform aus, Band manuell scrollbar,
       Loop-Kopie ausgeblendet (sonst doppelte Kacheln). */
      @media (prefers-reduced-motion: reduce) {
        app-content-marquee .cmq-row {
          overflow-x: auto;
          cursor: auto;
        }
        app-content-marquee .cmq-track {
          transform: none !important;
        }
        app-content-marquee .cmq-track .cmq-group[aria-hidden='true'] {
          display: none;
        }
      }
    `,
  ],
})
export class ContentMarqueeComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private articlesService = inject(ArticlesService);
  private demosService = inject(DemosService);
  private hostRef = inject(ElementRef<HTMLElement>);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  /** Feature switches (site.json): pages and demos of a switched-off feature get no tile. */
  private site = inject(SITE_CONFIG);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Grundtempo (px/s) bei voller Fahrt — ~eine Kachelbreite (~224px) in ~1,5 s. */
  private static readonly BASE_PX_PER_S = 150;
  /** Beim Hovern verlangsamt das Band auf dieses Vielfache des Grundtempos
   *  (langsames Kriechen statt Stillstand) — bleibt sichtbar lebendig, der
   *  eigentliche Klick friert die Kachel per pointerdown ohnehin kurz ein. */
  private static readonly HOVER_SLOW_FACTOR = 0.18;
  /** Zeitkonstante (ms) fürs flotte Bremsen/Anfahren (Hover, Startup). */
  private static readonly RAMP_FAST_MS = 260;
  /** Zeitkonstante (ms) fürs langsame Zurückgleiten nach einem Fling. */
  private static readonly RAMP_SLOW_MS = 750;
  /** Dauer (ms), in der ein Fling Vorrang vor dem Hover-Stopp hat. */
  private static readonly GRACE_MS = 1100;
  /** Fling-Geschwindigkeit deckeln (px/s), sonst „Teleport". */
  private static readonly MAX_FLING = 3500;
  /** Erst ab dieser Bewegung (px) gilt es als Drag (sonst Klick). Etwas
   *  großzügig, damit ein Klick auf eine noch driftende Kachel nicht als
   *  Drag missverstanden wird. */
  private static readonly DRAG_THRESHOLD = 10;
  /** dt-Deckel (ms) — verhindert Sprung nach Tab-Wechsel/Throttling. */
  private static readonly MAX_DT_MS = 50;

  private readonly rawTiles = signal<MarqueeTile[]>([]);
  private readonly lang = computed(() => this.translationService.currentLanguage$());

  /** Hover/Fokus → fließend bis Stillstand. */
  readonly hovered = signal(false);
  /** Aktuell gezogene Reihe (0/1) oder null — Signal, da im Template gelesen. */
  readonly dragging = signal<number | null>(null);
  /** Vom User über den Button explizit pausiert (WCAG 2.2.2) → harter Stopp. */
  readonly paused = signal(false);
  /** Maximiert: statt der zwei Lauf-Reihen das Voll-Grid aller Inhalte zeigen. */
  readonly expanded = signal(false);
  /** Während der Morph-Animation: Button kurz sperren (kein Doppel-Trigger). */
  readonly transitioning = signal(false);
  /** Screenreader-Statusansage beim Umschalten (aria-live). */
  readonly liveMsg = signal('');
  /** Stabile id für aria-controls (Button → Inhalts-Region). */
  readonly contentId = 'cmq-content';
  /** Tastatur-Fokus (`:focus-visible`) liegt im Band → komplett einfrieren. */
  readonly kbFocusWithin = signal(false);
  /** Spiegelt `prefers-reduced-motion` (inkl. Laufzeit-Änderung) — steuert
   *  Button-Sichtbarkeit + ob die rAF-Drift überhaupt läuft. */
  readonly reducedMotion = signal(false);
  private rmMq: MediaQueryList | null = null;
  private rmListener: (() => void) | null = null;

  // rAF-State (kein Signal — pro Frame, nicht im Template).
  private rafId: number | null = null;
  private lastTs: number | null = null;
  private tracks: HTMLElement[] = [];
  private groupW: number[] = [0, 0];
  private shift: number[] = [0, 0];
  private vel: number[] = [0, 0]; // px/s, startet 0 → fährt weich auf Basis hoch
  private graceUntil: number[] = [0, 0]; // rAF-Zeitstempel, bis Fling Vorrang hat

  // Drag-State
  private dragStartX = 0;
  private dragStartShift = 0;
  private draggedFar = false;
  private ptrLastX = 0;
  private ptrLastT = 0;
  private ptrVel = 0; // geglättete Zeiger-Geschwindigkeit (px/s)
  private onWinMove: ((e: PointerEvent) => void) | null = null;
  private onWinUp: ((e: PointerEvent) => void) | null = null;
  /** Nach einem echten Zug den nächsten Klick schlucken (sonst navigiert das
   *  Spinnen). Wird bei JEDEM pointerdown zurückgesetzt → frisst nie einen
   *  echten Klick einer neuen Geste. Capture-Listener am Host wertet es aus. */
  private suppressClick = false;
  private clickCapture: ((e: Event) => void) | null = null;

  /** Optionaler Sektions-Titel (i18n-Key 'home.marquee.title'). */
  readonly title = computed(() => {
    this.lang();
    return this.t('home.marquee.title');
  });
  readonly ariaLabel = computed(() => {
    this.lang();
    return this.t('home.marquee.ariaLabel');
  });

  /** Alle freigeschalteten Demos/Artikel. Nicht nach pathToThumbnail filtern: das
   *  liefert nur für gebackene Bilder ein Ergebnis, und ein Artikel ohne gebackenes Bild ist
   *  trotzdem Inhalt — er bekommt die Fallback-Kachel statt aus dem Band zu fallen. */
  readonly tiles = computed(() => this.rawTiles());
  /** Unter 3 echten Inhalten (typisch: frischer Seed-Zustand des Kits) läuft
   *  kein Endlos-Band — die Kacheln stehen statisch, jede genau einmal. */
  readonly staticMode = computed(() => this.tiles().length > 0 && this.tiles().length < 3);
  /** Aufteilung in zwei Reihen per HÄLFTEN (nicht gerade/ungerade): die im Blend
   *  gleichmäßig verteilten Demos sitzen sonst alle auf geraden Indizes → nur in
   *  Reihe A. Hälften geben beiden Reihen ihren Anteil verteilter Demos. */
  readonly rowA = computed(() => {
    const t = this.tiles();
    return this.fillRow(t.slice(0, Math.ceil(t.length / 2)));
  });
  readonly rowB = computed(() => {
    const t = this.tiles();
    return this.fillRow(t.slice(Math.ceil(t.length / 2)));
  });

  /** Endlos-Band braucht eine Gruppe, die breiter ist als der Container — sonst
   *  entstehen bei wenigen Kacheln Lücken/Flackern (die Modulo-Schleife wickelt eine
   *  zu schmale Gruppe sichtbar um). Bei wenig Seed-Content werden die vorhandenen
   *  Kacheln daher zyklisch wiederholt, bis die Reihe genug Kacheln (~Container-Breite
   *  bei 210px/Kachel) füllt. Bei viel Content (Reihe schon lang) ist das ein No-op.
   *  Template trackt per $index → wiederholte gleiche Pfade sind erlaubt. */
  private static readonly MIN_TILES_PER_ROW = 8;
  private fillRow(list: MarqueeTile[]): MarqueeTile[] {
    if (!list.length) return list;
    if (list.length >= ContentMarqueeComponent.MIN_TILES_PER_ROW) return list;
    const out: MarqueeTile[] = [];
    for (let i = 0; out.length < ContentMarqueeComponent.MIN_TILES_PER_ROW; i++) {
      out.push(list[i % list.length]);
    }
    return out;
  }

  /** Öffentliche Sektions-Seiten (Glossar, Timeline, Tools, …) — aus der Routen-
   *  Tabelle, analog zur /dev/content-gallery. Nur nicht-dev, nicht-hidden,
   *  showByDefault-Seiten mit gebackenem Visual (Einstellungen, Feedback & Co. sind
   *  Werkzeug, kein Inhalt, und bleiben draußen). Wird im Voll-Grid den Demos/Artikeln
   *  vorangestellt. Statisch (kein Signal) — die Routen ändern sich zur Laufzeit nicht. */
  readonly pageTiles: MarqueeTile[] = extendedRoutes
    .filter(
      (r) =>
        !!r.path &&
        !r.path.includes(':') &&
        !r.redirectTo &&
        !r.hidden &&
        !r.devOnly &&
        !!r.titleKey &&
        r.showByDefault === true &&
        (r.group === 'knowledge' || r.group === 'portal') &&
        this.site.isRouteOn(r.path, r.group),
    )
    .map((r) => ({ titleKey: r.titleKey!, path: '/' + r.path, pageType: 'Portal' }))
    .filter((t) => pathToThumbnail(t.path) !== null);

  /** Voll-Grid-Quelle (maximiert): Sektionsseiten + alle freigeschalteten Demos/
   *  Artikel (= dieselbe prod-gegatete Menge wie das Band, nur ungeteilt). */
  readonly allTiles = computed<MarqueeTile[]>(() => [...this.pageTiles, ...this.tiles()]);

  ngOnInit(): void {
    if (!this.isBrowser) return; // im Prerender bleibt das Band leer

    // Capture-Phase, damit wir VOR routerLink den Klick neutralisieren können,
    // falls die vorangegangene Geste ein Zug war. WICHTIG: nur Klicks auf echte
    // Kachel-Links schlucken — sonst würde ein stehengebliebenes suppressClick
    // (Drag ohne Folge-Klick) den nächsten Klick auf den Pause-Button fressen.
    const cap = (e: Event) => {
      if (!this.suppressClick) return;
      if ((e.target as Element | null)?.closest?.('a.cmq-tile')) {
        e.preventDefault();
        e.stopPropagation();
        this.suppressClick = false;
      }
    };
    this.clickCapture = cap;
    (this.hostRef.nativeElement as HTMLElement).addEventListener('click', cap, true);

    // Reduced-Motion in ein Signal spiegeln UND auf Laufzeit-Umschaltung reagieren
    // (OS-Einstellung kann sich ändern, ohne dass die Seite neu lädt).
    if (typeof matchMedia === 'function') {
      const mq = matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion.set(mq.matches);
      const onChange = () => {
        this.reducedMotion.set(mq.matches);
        if (mq.matches) {
          // jetzt statisch + nativ scrollbar (CSS) → rAF anhalten
          if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
            this.lastTs = null;
          }
        } else {
          this.startDrift();
        }
      };
      mq.addEventListener('change', onChange);
      this.rmMq = mq;
      this.rmListener = onChange;
    }

    // takeUntilDestroyed: forkJoin selbst completet (beide Quellen sind
    // gecachte HTTP-Streams), aber ein später Abschluss nach dem Unmount
    // würde über startDrift() eine rAF-Schleife auf der zerstörten
    // Instanz neu starten — die ngOnDestroy schon abgeräumt hat.
    forkJoin({
      demos: this.demosService.getAllDemos(),
      articles: this.articlesService.getAll(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ demos, articles }) => {
        // Nur FREIGESCHALTETER Content — konsistent in dev UND prod (nicht vom
        // „simulate prod"-Toggle abhängig). isPublished/isVisibleInProd prüfen
        // rein die Release-Regeln: Demo-publishDate, Artikel-publishDate UND die
        // Lernpfad-Cascade — ein Artikel in einem noch nicht released
        // Lernpfad bleibt also draußen. So spiegelt das Band exakt das Live-Set.
        const demoTiles: MarqueeTile[] = this.shuffle(
          demos
            .filter((d) => this.demosService.isPublished(d) && this.site.isFeatureOn('demos'))
            .map((d) => ({ titleKey: d.titleKey, path: '/' + d.path, pageType: 'Demo' })),
        );
        const articleTiles: MarqueeTile[] = this.shuffle(
          articles
            .filter((a) => this.articlesService.isVisibleInProd(a))
            .map((a) => ({ titleKey: a.titleKey, path: '/' + a.path, pageType: 'Artikel' })),
        );
        // Blend statt „Demos zuerst": Demos gleichmäßig unter die Artikel mischen
        // (immer präsent + verteilt), beide Gruppen je Mount frisch → jeder Besuch
        // wirkt anders. Rein dekorativ + client-only → kein SSR/Hydration-Problem.
        this.rawTiles.set(this.blend(demoTiles, articleTiles));
        this.startDrift();
      });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.detachWindowListeners();
    if (this.clickCapture) {
      (this.hostRef.nativeElement as HTMLElement).removeEventListener('click', this.clickCapture, true);
    }
    if (this.rmMq && this.rmListener) {
      this.rmMq.removeEventListener('change', this.rmListener);
    }
  }

  private startDrift(): void {
    if (this.rafId !== null || !this.tiles().length) return;
    if (this.staticMode()) {
      return; // Seed-Zustand: statische Reihe, kein Band → kein rAF-Loop
    }
    if (this.reducedMotion()) {
      return; // reduced motion: statisch + manuell scrollbar (CSS)
    }
    this.rafId = requestAnimationFrame(this.frame);
  }

  /** Basis-Drift-Geschwindigkeit je Reihe (Reihe 0 links = +, Reihe 1 rechts = −). */
  private baseVel(i: number): number {
    return (i === 0 ? 1 : -1) * ContentMarqueeComponent.BASE_PX_PER_S;
  }

  /** Arrow-Property, damit `this` in requestAnimationFrame stimmt. */
  private frame = (ts: number): void => {
    // (Re-)acquire the track elements. We cache them for the modulo math, but
    // must re-query whenever the cached refs become detached: under SSR
    // hydration Angular can swap out the rendered marquee subtree shortly AFTER
    // we first cached it (the client re-renders the `@if(isBrowser)` content),
    // leaving us animating orphaned nodes while the visible ones sit frozen at
    // transform:none. Validating isConnected each frame is O(1); the
    // querySelector only runs until a live pair is locked in (then never again).
    if (!this.tracks.length || !this.tracks[0].isConnected) {
      const host = this.hostRef.nativeElement as HTMLElement;
      const els = Array.from(host.querySelectorAll('.cmq-track')) as HTMLElement[];
      let locked = false;
      if (els.length >= 2) {
        const widths = els.map((el) => {
          const g = el.querySelector('.cmq-group') as HTMLElement | null;
          return g ? g.offsetWidth : 0;
        });
        if (widths.every((w) => w > 0)) {
          this.tracks = els;
          this.groupW = widths;
          locked = true;
        }
      }
      if (!locked) this.tracks = []; // not ready (or stale) — retry next frame
    }

    const dt = this.lastTs === null ? 0 : Math.min(ContentMarqueeComponent.MAX_DT_MS, ts - this.lastTs);
    this.lastTs = ts;

    const drag = this.dragging();
    // Harter Stopp: User-Pause (Button) ODER Tastatur-Fokus im Band. Hat Vorrang
    // vor Drift/Grace/Hover — das Band kommt fließend (RAMP_FAST) zum Stillstand.
    const frozen = this.paused() || this.kbFocusWithin();
    for (let i = 0; i < this.tracks.length; i++) {
      const w = this.groupW[i];
      if (w <= 0) continue;

      if (drag === i) {
        // Wird direkt vom Zeiger gesteuert (onPointerMove setzt shift).
      } else {
        // Während der Grace-Phase hat der Fling Vorrang vor dem Hover-Stopp.
        const inGrace = !frozen && ts < this.graceUntil[i];
        const target = frozen
          ? 0
          : inGrace
            ? this.baseVel(i)
            : this.baseVel(i) * (this.hovered() ? ContentMarqueeComponent.HOVER_SLOW_FACTOR : 1);
        const rampMs = inGrace ? ContentMarqueeComponent.RAMP_SLOW_MS : ContentMarqueeComponent.RAMP_FAST_MS;
        const ramp = dt > 0 ? Math.min(1, dt / rampMs) : 0;
        this.vel[i] += (target - this.vel[i]) * ramp;
        this.shift[i] = (this.shift[i] + this.vel[i] * (dt / 1000)) % w;
      }
      const m = ((this.shift[i] % w) + w) % w; // [0, w)
      this.tracks[i].style.transform = `translateX(${-m}px)`;
    }

    this.rafId = requestAnimationFrame(this.frame);
  };

  // ---- Drag („Drehrad") -----------------------------------------------------

  // browser-only: pointer event handler.
  onPointerDown(i: number, ev: PointerEvent): void {
    // Nur primärer Button/Zeiger, und nur wenn die Drift überhaupt läuft.
    if (this.rafId === null || !ev.isPrimary || ev.button !== 0) return;
    if (this.groupW[i] <= 0) return;

    this.suppressClick = false; // neue Geste → evtl. stale Flag löschen
    this.dragging.set(i);
    this.dragStartX = ev.clientX;
    this.dragStartShift = this.shift[i];
    this.draggedFar = false;
    this.vel[i] = 0; // Drift anhalten, solange gegriffen wird
    this.ptrLastX = ev.clientX;
    this.ptrLastT = ev.timeStamp;
    this.ptrVel = 0;

    // Bewegung/Loslassen global verfolgen, auch außerhalb der Lane.
    const move = (e: PointerEvent) => this.onPointerMove(i, e);
    const up = (e: PointerEvent) => this.onPointerUp(i, e);
    this.onWinMove = move;
    this.onWinUp = up;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  private onPointerMove(i: number, ev: PointerEvent): void {
    if (this.dragging() !== i) return;
    const dx = ev.clientX - this.dragStartX;
    if (Math.abs(dx) > ContentMarqueeComponent.DRAG_THRESHOLD) this.draggedFar = true;

    // shift folgt dem Finger: transform = -(shift mod w); +dx (rechts) ⇒ shift −dx.
    this.shift[i] = this.dragStartShift - dx;

    // Zeiger-Geschwindigkeit (geglättet) für den Fling beim Loslassen.
    const dtp = ev.timeStamp - this.ptrLastT;
    if (dtp > 0) {
      const inst = ((ev.clientX - this.ptrLastX) / dtp) * 1000; // px/s
      this.ptrVel = this.ptrVel * 0.6 + inst * 0.4;
      this.ptrLastX = ev.clientX;
      this.ptrLastT = ev.timeStamp;
    }
  }

  private onPointerUp(i: number, _ev: PointerEvent): void {
    if (this.dragging() !== i) return;
    this.dragging.set(null);
    this.detachWindowListeners();

    // Fling: Zeiger-Schwung in shift-Geschwindigkeit übersetzen (−, s. onPointerMove)
    // und deckeln. Danach gleitet vel langsam zur Basis-Drift zurück (Grace).
    const max = ContentMarqueeComponent.MAX_FLING;
    this.vel[i] = Math.max(-max, Math.min(max, -this.ptrVel));
    this.graceUntil[i] = (this.lastTs ?? 0) + ContentMarqueeComponent.GRACE_MS;

    // War es ein echter Zug (nicht nur Klick)? Dann den folgenden Link-Klick
    // neutralisieren (Host-Capture-Listener), damit das Spinnen nicht aus
    // Versehen navigiert. Erzeugt der Zug gar keinen Klick, bleibt das Flag
    // gesetzt, wird aber beim nächsten pointerdown wieder gelöscht — so kann
    // es nie einen echten Klick einer späteren Geste fressen.
    if (this.draggedFar) this.suppressClick = true;
  }

  // browser-only: the listeners only exist after onPointerDown attached them.
  private detachWindowListeners(): void {
    if (this.onWinMove) window.removeEventListener('pointermove', this.onWinMove);
    if (this.onWinUp) {
      window.removeEventListener('pointerup', this.onWinUp);
      window.removeEventListener('pointercancel', this.onWinUp);
    }
    this.onWinMove = null;
    this.onWinUp = null;
  }

  // ---- A11y: Pause-Button + Tastatur-Freeze ---------------------------------

  /** WCAG 2.2.2: Auto-Drift an/aus. `frame()` liest `paused()` → harter Stopp. */
  togglePaused(): void {
    this.paused.update((p) => !p);
  }

  /** Maximieren/Minimieren mit FLIP-Morph: die gerade sichtbaren Band-Kacheln
   *  gleiten aus ihrer Reihen-Position an ihren Grid-Platz, alle übrigen Grid-
   *  Kacheln blenden gestaffelt + leicht aufsteigend ein (Expand). Beim Minimieren
   *  faded das Grid elegant aus, danach kommen die Reihen sanft zurück.
   *  `prefers-reduced-motion` (oder fehlende WAAPI) ⇒ harter Wechsel. Während der
   *  Animation ist der Button gesperrt (kein Doppel-Trigger / kein Mess-Chaos). */
  toggleExpanded(): void {
    if (this.transitioning()) return;
    const willExpand = !this.expanded();
    this.announce(willExpand);

    if (this.reducedMotion() || !this.supportsWaapi()) {
      this.applyExpandedState(willExpand);
      return;
    }

    if (willExpand) {
      // First: Rects der sichtbaren ECHTEN Reihen-Kacheln (nicht die aria-hidden
      // Loop-Kopie) VOR dem DOM-Wechsel einfangen.
      const firstRects = this.captureVisibleTileRects('.cmq-row .cmq-group:not([aria-hidden="true"]) a.cmq-tile');
      this.transitioning.set(true);
      this.applyExpandedState(true);
      afterNextRender(() => this.playMorphExpand(firstRects), { injector: this.injector });
    } else {
      this.transitioning.set(true);
      this.playCollapse();
    }
  }

  /** Reiner Zustandswechsel ohne Animation: Grid ⇄ Reihen + Drift-Loop steuern.
   *  Im Grid gibt es keine `.cmq-track`-Reihen → rAF anhalten (sonst querySelectet
   *  `frame()` ins Leere); beim Zurück Track-Refs verwerfen → `frame()` greift neu. */
  private applyExpandedState(expanded: boolean): void {
    this.expanded.set(expanded);
    if (expanded) {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
        this.lastTs = null;
      }
    } else {
      this.tracks = [];
      this.startDrift();
    }
  }

  private announce(willExpand: boolean): void {
    this.liveMsg.set(this.t(willExpand ? 'home.marquee.announceExpanded' : 'home.marquee.announceCollapsed'));
  }

  private supportsWaapi(): boolean {
    return this.isBrowser && typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
  }

  /** Bounding-Rects aller per Selector gefundenen, im Viewport sichtbaren Kacheln,
   *  indexiert nach `data-cmq-path`. Basis fürs FLIP-Inverse. */
  // browser-only: part of the expand animation, started by a click.
  private captureVisibleTileRects(selector: string): Map<string, DOMRect> {
    const host = this.hostRef.nativeElement as HTMLElement;
    const map = new Map<string, DOMRect>();
    const vw = window.innerWidth,
      vh = window.innerHeight;
    host.querySelectorAll(selector).forEach((el) => {
      const path = el.getAttribute('data-cmq-path');
      if (!path || map.has(path)) return;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > 0 && r.left < vw && r.bottom > 0 && r.top < vh) {
        map.set(path, r);
      }
    });
    return map;
  }

  /** FLIP-Play: Grid-Kacheln, die eben noch im Band sichtbar waren, gleiten aus
   *  ihrer alten (First-)Position an den neuen Grid-Platz; alle übrigen blenden
   *  gestaffelt + leicht aufsteigend ein. */
  private playMorphExpand(firstRects: Map<string, DOMRect>): void {
    const host = this.hostRef.nativeElement as HTMLElement;
    const gridTiles = Array.from(host.querySelectorAll('.cmq-grid a.cmq-tile')) as HTMLElement[];
    const anims: Animation[] = [];
    let stagger = 0;
    for (const el of gridTiles) {
      const path = el.getAttribute('data-cmq-path') || '';
      const first = firstRects.get(path);
      const last = el.getBoundingClientRect();
      if (first && last.width > 0) {
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        const sy = first.height / last.height;
        anims.push(
          el.animate(
            [
              { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
              { transform: 'translate(0, 0) scale(1, 1)' },
            ],
            { duration: 520, easing: 'cubic-bezier(.22,.61,.36,1)' },
          ),
        );
      } else {
        const delay = Math.min(stagger * 12, 380);
        stagger++;
        anims.push(
          el.animate(
            [
              { transform: 'translateY(12px) scale(.94)', opacity: 0 },
              { transform: 'translateY(0) scale(1)', opacity: 1 },
            ],
            { duration: 360, delay, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'backwards' },
          ),
        );
      }
    }
    this.afterAnimations(anims);
  }

  /** Grid elegant ausblenden (fade + minimal scale-down), danach zurück zu den
   *  Reihen, die sanft einblenden. */
  private playCollapse(): void {
    const host = this.hostRef.nativeElement as HTMLElement;
    const grid = host.querySelector('.cmq-grid') as HTMLElement | null;
    const finish = () => {
      this.applyExpandedState(false);
      afterNextRender(
        () => {
          const rows = Array.from(host.querySelectorAll('.cmq-row')) as HTMLElement[];
          const anims = rows.map((r) =>
            r.animate(
              [
                { opacity: 0, transform: 'translateY(-6px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              { duration: 260, easing: 'ease-out' },
            ),
          );
          this.afterAnimations(anims);
        },
        { injector: this.injector },
      );
    };
    if (!grid) {
      finish();
      return;
    }
    const out = grid.animate(
      [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(.985)' },
      ],
      { duration: 240, easing: 'ease-in', fill: 'forwards' },
    );
    out.onfinish = finish;
    out.oncancel = finish;
  }

  /** `transitioning` erst freigeben, wenn alle Teil-Animationen fertig (oder
   *  abgebrochen) sind. */
  private afterAnimations(anims: Animation[]): void {
    if (!anims.length) {
      this.transitioning.set(false);
      return;
    }
    Promise.allSettled(anims.map((a) => a.finished)).then(() => this.transitioning.set(false));
  }

  /** Fokus ins Band: leichte Verlangsamung (Hover-Pfad). Liegt ein ECHTER
   *  Tastatur-Fokus (`:focus-visible`) vor, friert das Band komplett ein und die
   *  fokussierte Kachel wird ins sichtbare Fenster geholt. */
  onFocusIn(_ev: FocusEvent): void {
    this.hovered.set(true);
    this.updateKbFocus();
  }

  /** Verlässt der Fokus das Band ganz → alles freigeben. Wandert er nur intern
   *  (Kachel→Kachel/Button), neu auswerten. */
  onFocusOut(ev: FocusEvent): void {
    const next = ev.relatedTarget as Node | null;
    const host = this.hostRef.nativeElement as HTMLElement;
    if (!next || !host.contains(next)) {
      this.hovered.set(false);
      this.kbFocusWithin.set(false);
    } else {
      this.updateKbFocus();
    }
  }

  /** Spiegelt, ob gerade ein `:focus-visible`-Element (Tastatur) im Band liegt,
   *  und zieht dessen Kachel in den sichtbaren Bereich. Maus-Fokus matcht
   *  `:focus-visible` NICHT → Drag/Drift bleiben unberührt. */
  private updateKbFocus(): void {
    const host = this.hostRef.nativeElement as HTMLElement;
    let fv: Element | null = null;
    try {
      fv = host.querySelector(':focus-visible');
    } catch {
      fv = host.querySelector(':focus');
    }
    this.kbFocusWithin.set(!!fv);
    const a = fv?.closest('a.cmq-tile') as HTMLElement | null;
    if (a) this.scrollAnchorIntoView(a);
  }

  /** Bringt eine (per Tastatur) fokussierte Kachel ins sichtbare Fenster, indem
   *  der `shift` der jeweiligen Reihe so angepasst wird, dass die ECHTE Kachel
   *  (nicht die aria-hidden-Kopie) im Viewport liegt. Geklemmt auf [0, w), damit
   *  am linken Rand keine Lücke entsteht (nur eine Kopie liegt links). */
  private scrollAnchorIntoView(a: HTMLElement): void {
    if (this.reducedMotion()) return; // dann nativer Scroll → Browser erledigt das
    const trackEl = a.closest('.cmq-track') as HTMLElement | null;
    const rowEl = a.closest('.cmq-row') as HTMLElement | null;
    if (!trackEl || !rowEl) return;
    const i = trackEl.getAttribute('data-cmq-row') === '1' ? 1 : 0;
    const w = this.groupW[i];
    const track = this.tracks[i];
    if (!track || w <= 0) return;

    const pad = 14; // etwas Luft zur (im kbfocus-Modus ohnehin aus) Maskenkante
    const rowRect = rowEl.getBoundingClientRect();
    const aRect = a.getBoundingClientRect();
    let delta = 0; // px, um die Kachel nach RECHTS zu schieben
    if (aRect.left < rowRect.left + pad) {
      delta = rowRect.left + pad - aRect.left;
    } else if (aRect.right > rowRect.right - pad) {
      delta = rowRect.right - pad - aRect.right; // negativ → nach links
    }
    if (delta === 0) return; // schon bequem sichtbar → kein Sprung

    const curM = ((this.shift[i] % w) + w) % w;
    let newM = curM - delta; // Inhalt nach rechts ⇒ kleineres m
    newM = Math.max(0, Math.min(w - 1, newM)); // in einer Kopie bleiben → keine Lücke
    this.shift[i] = newM;
    this.vel[i] = 0; // an Ort und Stelle einfrieren
    track.style.transform = `translateX(${-newM}px)`;
  }

  /** Fisher-Yates In-Place-Shuffle. Pro Mount aufgerufen, damit das Band bei
   *  jedem Besuch eine andere Mischung/Startkachel zeigt. */
  private shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /** Blendet `demos` in ihrer natürlichen Dichte (D/total) GLEICHMÄSSIG unter die
   *  `articles` — eine Demo etwa alle (total/D) Kacheln. So sind die wenigen
   *  interaktiven Demos in jedem Fenster des Bands präsent statt zu verklumpen
   *  oder (bei reinem Shuffle) mal ganz zu fehlen. Beide Listen kommen bereits
   *  durchmischt rein → Auswahl/Reihenfolge variiert pro Mount. */
  private blend(demos: MarqueeTile[], articles: MarqueeTile[]): MarqueeTile[] {
    const D = demos.length,
      A = articles.length,
      total = D + A;
    if (!D) return articles;
    if (!A) return demos;
    const targetDemoShare = D / total;
    const out: MarqueeTile[] = [];
    let di = 0,
      ai = 0;
    for (let k = 0; k < total; k++) {
      const demoShareSoFar = di / (k || 1);
      if (di < D && (ai >= A || demoShareSoFar < targetDemoShare)) {
        out.push(demos[di++]);
      } else {
        out.push(articles[ai++]);
      }
    }
    return out;
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
