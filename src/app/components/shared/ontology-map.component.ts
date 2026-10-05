/**
 * OntologyMapComponent
 *
 * Force-directed graph of portal content (Article, Glossary, Timeline,
 * Source) and their related-edges. Two modes:
 *
 *   - **Subgraph** (default): pass `focusType` + `focusId` (+ optional `hops`)
 *     and the component renders a focus-centered neighborhood.
 *   - **Full graph**: pass `fullGraph=true` (+ optional `typeFilter`) and the
 *     component renders the entire ontology, filtered by node type.
 *
 * Cytoscape.js + fcose layout, lazy-loaded via CytoscapeLoaderService — the
 * library bundle never touches the initial chunk. SSR-safe: under prerender
 * the component emits a static placeholder and skips cytoscape entirely.
 *
 * Label visibility (Obsidian-style):
 *   - Full-graph: labels are HIDDEN by default. Hover a node → that node
 *     and its 1-hop neighbors light up + show labels. Search matches show
 *     labels too.
 *   - Subgraph: focus + direct neighbors keep labels permanently. Hover
 *     adds emphasis. Outer nodes (2-hop) are unlabeled dots.
 *
 * Design: an internal design note (
 * with D.6/D.7/D.8 — Obsidian-style labels, free-text filter, perf).
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of, takeUntil } from 'rxjs';
import { OntologyService } from '../../services/ontology.service';
import { RelatedRefsService } from '../../services/related-refs.service';
import { CytoscapeLoaderService } from '../../services/cytoscape-loader.service';
import { TranslationService } from '../../services/translation.service';
import {
  OntologyEdge,
  OntologyNodeRef,
  OntologyNodeType,
  ONTOLOGY_NODE_TYPES,
  nodeKey,
} from '../../services/ontology.types';
import { NodeDisplayInfo } from '../../services/related-refs.types';
import { scrollBehavior } from '../../utils/reduced-motion';

interface RenderableNode {
  ref: OntologyNodeRef;
  title: string;
  key: string;
}

interface RenderableEdge {
  source: string;
  target: string;
}

/** Phase I.7a: Pro-Knoten Zeile für die Tabellen-Ansicht. */
interface TableRow {
  key: string;
  title: string;
  type: OntologyNodeType;
  connectionCount: number;
  topNeighbors: { key: string; title: string; type: OntologyNodeType }[];
  extraNeighborCount: number;
}

/**
 * Type color mapping — kept in JS so cytoscape can use it directly and the
 * legend stays in sync. Keys match OntologyNodeType.
 */
const TYPE_COLOURS: Record<OntologyNodeType, string> = {
  article: '#f59e0b', // primary amber
  demo: '#22c55e', // green-500
  glossary: '#ec4899', // pink-500
  timeline: '#3b82f6', // blue-500
  source: '#10b981', // emerald-500
};

/**
 * Klassifiziert eine Edge nach Cluster-Zugehörigkeit (Phase I.37).
 *
 * - Intra-Cluster (gleicher Type an Source und Target): klasse-spezifischer
 *   Suffix `cluster-${type}` damit CSS die Edge in Type-Farbe rendern kann.
 * - Inter-Cluster: neutrale Klasse, edge bleibt grau.
 * - Wenn `useTypeClusters` false ist (Subgraph-Modus / Preset-Layout):
 *   immer 'inter-cluster' — Compound-Hierarchie existiert nicht, also
 *   keine sinnvolle intra/inter-Unterscheidung.
 *
 * Source/Target IDs haben Format '<type>:<id>'. Extrahiert lokal, keine
 * Service-Dependencies, deterministisch → einfach testbar.
 */
export function classifyOntologyEdge(source: string, target: string, useTypeClusters: boolean): string {
  if (!useTypeClusters) return 'inter-cluster';
  const sourceType = source.split(':', 1)[0];
  const targetType = target.split(':', 1)[0];
  return sourceType === targetType ? `intra-cluster cluster-${sourceType}` : 'inter-cluster';
}

/** Cytoscape instance type — narrowed to the surface we use. */
type CyInstance = {
  destroy: () => void;
  resize: () => void;
  on: (evt: string, selOrHandler: string | ((e: CyEvent) => void), handler?: (e: CyEvent) => void) => void;
  $: (selector: string) => CyCollection;
  nodes: (selector?: string) => CyCollection;
  elements: (selector?: string) => CyCollection;
  batch: (fn: () => void) => void;
  fit?: () => void;
  zoom?: () => number;
  pan?: () => { x: number; y: number };
  animate?: (props: Record<string, unknown>, opts?: Record<string, unknown>) => void;
};

type CyEvent = { target: CyNode };
type CyNode = {
  id: () => string;
  data: (k?: string) => string;
  neighborhood: () => CyCollection;
  closedNeighborhood: () => CyCollection;
  addClass: (c: string) => void;
  removeClass: (c: string) => void;
  hasClass?: (c: string) => boolean;
};
type CyCollection = {
  addClass: (c: string) => void;
  removeClass: (c: string) => void;
  forEach?: (fn: (el: CyNode) => void) => void;
};

// Extended cytoscape node/collection shapes used by the pin/circle animation
// code below (scratch storage, per-node animation, geometry queries). Kept
// separate from the minimal CyNode/CyCollection above to avoid rippling into
// the hover-handling code that only needs the smaller surface.
type CyAnimNode = {
  scratch: (key: string, value?: unknown) => unknown;
  position: () => { x: number; y: number };
  stop: () => void;
  animate: (props: Record<string, unknown>, opts?: Record<string, unknown>) => void;
  hasClass: (c: string) => boolean;
  neighborhood: (selector?: string) => CyAnimCollection;
  data: (k?: string) => string;
  length?: number;
};
type CyAnimCollection = {
  removeStyle: (property: string) => void;
  nodes: (selector?: string) => CyAnimCollection;
  forEach: (fn: (n: CyAnimNode) => void) => void;
  toArray: () => CyAnimNode[];
  filter: (fn: (n: CyAnimNode) => boolean) => CyAnimCollection;
};

@Component({
  selector: 'app-ontology-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="ontology-map-root"
      [class.is-table]="showTable"
      [class.is-loading]="isLoading"
      role="region"
      [attr.aria-label]="ariaSummary()"
    >
      <!-- Phase I.12 (2026-05-14): Stats + Legende + Toggle in EINER Zeile.
           User-Wunsch: Knoten/Verbindungen-Counter sollen gleiche Zeile wie
           Legende (Artikel/Glossar/Timeline) und Tabellen-Toggle. -->
      <div class="ontology-map-toolbar">
        <div class="ontology-map-legend-inline" role="group" [attr.aria-label]="t('conceptMap.map.legendLabel')">
          @for (t of typesInView; track t) {
            <span class="ontology-map-legend-item" [attr.data-type]="t">
              <span class="ontology-map-legend-dot" [style.background]="colourFor(t)" aria-hidden="true"></span>
              <span>{{ labelFor(t) }}</span>
            </span>
          }
        </div>
        <!-- Phase I.34 (2026-05-15): Stats wandern aus der Toolbar als
             Overlay top-left ins Canvas (siehe .ontology-map-canvas-wrap
             unten). Toolbar hat dadurch nur noch Legende links und Actions
             rechts — weniger visueller Lärm über dem Graph. -->
        @if (focusKey) {
          <div class="ontology-map-stats" aria-live="polite">
            <span
              >{{ t('conceptMap.map.focus') }}: <code>{{ focusType }}/{{ focusId }}</code></span
            >
          </div>
        }
        <div class="ontology-map-actions">
          <button type="button" class="ontology-map-toggle" [attr.aria-pressed]="showTable" (click)="toggleTable()">
            <i class="pi" [ngClass]="showTable ? 'pi-sitemap' : 'pi-list'" aria-hidden="true"></i>
            <span>{{ showTable ? t('conceptMap.map.toggleGraph') : t('conceptMap.map.toggleTable') }}</span>
          </button>
          @if (showFullMapLink && focusKey) {
            <a
              class="ontology-map-toggle ontology-map-full-link"
              [routerLink]="['/concept-map']"
              [queryParams]="{ focus: focusKey }"
              (click)="fullMapClicked.emit()"
            >
              <i class="pi pi-external-link" aria-hidden="true"></i>
              <span>{{ t('conceptMap.dialog.openFullMap') }}</span>
            </a>
          }
        </div>
      </div>

      <!-- Phase I.17 (2026-05-14): Legacy-Legende vollständig entfernt.
           Inline-Version oben in der Toolbar ist die einzige. -->

      <!-- Canvas (Cytoscape mount) gewrappt damit Overlays (Stats top-left)
           absolut über dem Canvas positioniert werden können ohne Cytoscapes
           inneren DOM zu stören. Cytoscape mounted nur in das #canvas-Div,
           der Wrap drumherum bleibt unangetastet.
           Phase I.34 (2026-05-15) — Stats-Overlay top-left. -->
      <div class="ontology-map-canvas-wrap" [hidden]="showTable">
        <div
          #canvas
          class="ontology-map-canvas"
          role="img"
          [attr.aria-label]="canvasAriaLabel()"
          [attr.aria-hidden]="showTable ? 'true' : null"
        ></div>
        <!-- No tabindex on the canvas: it offers no keyboard interaction
             (Cytoscape pans/zooms by pointer only), so a focus stop here was
             a dead end. The keyboard path through the map is the Table
             toggle above, which the role="img" label points to. -->
        <div class="ontology-map-canvas-stats" aria-live="polite">
          <span>{{ nodes.length }} {{ t('conceptMap.map.nodes') }}</span>
          <span aria-hidden="true" class="sep">·</span>
          <span>{{ edges.length }} {{ t('conceptMap.map.edges') }}</span>
        </div>
        <!-- Phase I.34 (2026-05-15): Slot für Page-spezifische Overlays
             oben rechts im Canvas (z.B. Detach-Button auf der Concept-Map-
             Page). Die Page projiziert hier rein via div mit Attribut
             canvas-overlay-top-right. Anker innerhalb des Canvas-Wraps
             damit das Overlay korrekt über dem Cytoscape-Mount positioniert
             ist (nicht über der Toolbar darüber). -->
        <div class="ontology-map-canvas-slot-tr">
          <ng-content select="[canvas-overlay-top-right]"></ng-content>
        </div>

        <!-- Phase I.36 (2026-05-15): Loading-Spinner ins Canvas-Wrap
             gezogen damit top:50% tatsächlich Canvas-Mitte trifft.
             Vorher war der Skeleton Sibling der Toolbar; 50% landete in
             der oberen Hälfte des Canvas weil die Toolbar-Höhe mitgerechnet
             wurde. Jetzt ist er Child des Wraps und positioniert relativ
             zum Canvas-Rechteck. -->
        @if (isLoading && !showTable) {
          <div class="ontology-map-skeleton" role="status" aria-live="polite">
            <div class="skeleton-pill">
              <i class="pi pi-spin pi-spinner" aria-hidden="true"></i>
              <span>{{ t('conceptMap.map.loading') }}</span>
            </div>
          </div>
        }
      </div>
      <!-- Camera diagnostics overlay. Off by default — flip [showCameraReadout]
           to true when re-tuning the camera defaults. Polling + style stay
           in the component so re-enabling is just a one-flag flip. -->
      @if (!showTable && showCameraReadout) {
        <div class="ontology-map-camera-readout" aria-hidden="true">
          @if (cameraInfo) {
            <div><span>zoom</span> {{ cameraInfo.zoom.toFixed(3) }}</div>
            <div><span>pan</span> {{ cameraInfo.pan.x.toFixed(1) }}, {{ cameraInfo.pan.y.toFixed(1) }}</div>
            <div>
              <span>view</span> x [{{ cameraInfo.view.x1.toFixed(0) }}..{{ cameraInfo.view.x2.toFixed(0) }}] · y [{{
                cameraInfo.view.y1.toFixed(0)
              }}..{{ cameraInfo.view.y2.toFixed(0) }}]
            </div>
            <div>
              <span>bbox</span> {{ cameraInfo.bbox.w.toFixed(0) }} × {{ cameraInfo.bbox.h.toFixed(0) }} · center
              {{ cameraInfo.bbox.cx.toFixed(1) }}, {{ cameraInfo.bbox.cy.toFixed(1) }}
            </div>
          } @else {
            <div>{{ t('conceptMap.map.cameraReadoutInit') }}</div>
          }
        </div>
      }

      <!-- ARIA live region for search-result count updates -->
      <div class="visually-hidden" aria-live="polite">{{ searchAriaLive() }}</div>

      <!-- Skeleton überlebt nur als Empty-Stub: tatsächlich ins
           .ontology-map-canvas-wrap migriert (Phase I.36, s.o.) für
           deterministische Zentrierung. -->

      <!-- Empty -->
      @if (!isLoading && nodes.length === 0) {
        <div class="ontology-map-empty">
          <i class="pi pi-info-circle" aria-hidden="true"></i>
          <span>{{ t('conceptMap.map.empty') }}</span>
        </div>
      }

      <!-- Phase I.7a (2026-05-14): Tabelle umgebaut auf Nodes-Liste. Eine
           Zeile pro Knoten. Spalten: Titel, Type-Badge, #-Connections, Top-3-Nachbarn.
           Sortiert default: connection-count desc (wichtigste Hubs oben).
           Search-Filter (I.7b) wirkt über tableRows() (filtert in-place).
           Click auf Titel pinnt (I.5) und triggert nodeFixed-Event. -->
      @if (showTable && tableRows().length > 0) {
        <div class="ontology-map-table-wrap">
          <table class="ontology-map-table" role="table">
            <thead>
              <tr>
                <th scope="col" class="col-title">{{ t('conceptMap.map.tableHeadNode') }}</th>
                <th scope="col" class="col-type">{{ t('conceptMap.map.tableHeadType') }}</th>
                <th scope="col" class="col-count">{{ t('conceptMap.map.tableHeadConnections') }}</th>
                <th scope="col" class="col-neighbors">{{ t('conceptMap.map.tableHeadNeighbors') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (row of tableRows(); track row.key) {
                <tr [class.is-pinned]="row.key === fixedNodeKey" [attr.data-row-key]="row.key">
                  <td>
                    <button
                      type="button"
                      class="ontology-map-table-node"
                      [class.is-pinned]="row.key === fixedNodeKey"
                      (click)="onTableNodeClick(row.key)"
                    >
                      {{ row.title }}
                    </button>
                  </td>
                  <td>
                    <span class="ontology-map-type-tag" [style.background]="colourFor(row.type)">
                      {{ labelFor(row.type) }}
                    </span>
                  </td>
                  <td class="col-count">{{ row.connectionCount }}</td>
                  <td class="col-neighbors">
                    @for (n of row.topNeighbors; track n.key) {
                      <button
                        type="button"
                        class="ontology-map-neighbor-chip"
                        [style.--chip-color]="colourFor(n.type)"
                        [attr.aria-label]="t('conceptMap.map.openNeighbor') + ': ' + n.title"
                        (click)="onTableNodeClick(n.key); $event.stopPropagation()"
                      >
                        {{ n.title }}
                      </button>
                    }
                    @if (row.extraNeighborCount > 0) {
                      <span class="ontology-map-neighbor-more">+{{ row.extraNeighborCount }}</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
      @if (showTable && tableRows().length === 0 && nodes.length > 0) {
        <div class="ontology-map-empty">
          <i class="pi pi-search" aria-hidden="true"></i>
          <span>{{ t('conceptMap.map.tableEmpty') }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ontology-map-root {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        min-height: 360px;
      }
      .ontology-map-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        flex-wrap: wrap;
      }
      .ontology-map-stats {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      .ontology-map-stats code {
        padding: 0 0.4rem;
        background: var(--surface-ground);
        border-radius: 3px;
        font-size: 0.78rem;
      }
      .ontology-map-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.35rem 0.7rem;
        font: inherit;
        font-size: 0.8rem;
        font-weight: 600;
        background: var(--surface-card);
        color: var(--text-color);
        border: 1px solid var(--surface-border);
        border-radius: 4px;
        cursor: pointer;
        transition:
          background 0.15s ease,
          border-color 0.15s ease;
      }
      .ontology-map-toggle:hover {
        background: var(--surface-hover);
        border-color: var(--primary-color);
      }
      .ontology-map-toggle:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .ontology-map-toggle[aria-pressed='true'] {
        background: var(--primary-color);
        color: var(--primary-color-text);
        border-color: var(--primary-color);
      }
      .ontology-map-actions {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        flex-wrap: wrap;
      }
      .ontology-map-full-link {
        text-decoration: none;
      }

      .ontology-map-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1.1rem;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }
      /* Phase I.26 (2026-05-14): Inline-Legende als geschlossene Pill-Group.
       Vorher: einzelne dots+labels frei flottierend in der Toolbar — wirkte
       wie noise. Jetzt: gebündelte Chips mit Type-Färbung als Hintergrund-
       Hauch, klare Pill-Form, gleiche Höhe wie Toolbar-Buttons. */
      .ontology-map-legend-inline {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        flex: 0 1 auto;
        align-items: center;
      }
      .ontology-map-legend-inline .ontology-map-legend-item {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.22rem 0.6rem 0.22rem 0.5rem;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--text-color);
        background: color-mix(in srgb, var(--p-amber-500) 8%, var(--surface-section));
        border: 1px solid var(--surface-border);
        border-radius: 999px;
        white-space: nowrap;
      }
      .ontology-map-legend-inline .ontology-map-legend-item[data-type='article'] {
        background: color-mix(in srgb, #f59e0b 12%, var(--surface-section));
        border-color: color-mix(in srgb, #f59e0b 35%, var(--surface-border));
      }
      .ontology-map-legend-inline .ontology-map-legend-item[data-type='demo'] {
        background: color-mix(in srgb, #22c55e 12%, var(--surface-section));
        border-color: color-mix(in srgb, #22c55e 35%, var(--surface-border));
      }
      .ontology-map-legend-inline .ontology-map-legend-item[data-type='glossary'] {
        background: color-mix(in srgb, #ec4899 12%, var(--surface-section));
        border-color: color-mix(in srgb, #ec4899 35%, var(--surface-border));
      }
      .ontology-map-legend-inline .ontology-map-legend-item[data-type='timeline'] {
        background: color-mix(in srgb, #3b82f6 12%, var(--surface-section));
        border-color: color-mix(in srgb, #3b82f6 35%, var(--surface-border));
      }
      .ontology-map-legend-inline .ontology-map-legend-item[data-type='source'] {
        background: color-mix(in srgb, #10b981 12%, var(--surface-section));
        border-color: color-mix(in srgb, #10b981 35%, var(--surface-border));
      }
      .ontology-map-legend-item {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
      }
      .ontology-map-legend-dot {
        display: inline-block;
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 999px;
        box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 12%, transparent);
      }

      /* Phase I.34 (2026-05-15): Wrap um Canvas damit Overlays (Stats etc.)
       absolut über dem Canvas positioniert werden können — Cytoscape rendert
       nur in das #canvas-Div selbst, der Wrap bleibt frei. */
      .ontology-map-canvas-wrap {
        position: relative;
        width: 100%;
      }
      .ontology-map-canvas-wrap[hidden] {
        display: none;
      }
      .ontology-map-canvas {
        width: 100%;
        /* Height = width / 1.35 (matches node-bbox aspect ~1.34:1) but clamped
         to a sane min/max. Without aspect-matching, Cytoscape's uniform
         fit() leaves visible letterbox bands top/bottom inside a square
         container. The CSS function keeps the camera tight around the
         four cluster clouds across viewport sizes. */
        height: min(max(420px, calc(100vw * 0.6 / 1.35)), 720px);
        /* Phase I.37 (2026-05-15): Multi-Stop Radial mit Type-Color-Wolken.
         Ein primärer warmer Center-Glow (primary-color 18% Mix) plus vier
         off-center Sub-Radials in den Type-Farben — sehr blass, sehr groß,
         überlappend, fest in den Ecken positioniert (entsprechen grob den
         fcose-Cluster-Schwerpunkten der vier Default-Typen: article TL,
         glossary TR, timeline BR, demo BL). Pure CSS, GPU-composite,
         null Per-Frame-Cost. Erzeugt Tiefe + visuell die Cluster-Inseln
         als farbige Atmosphäre. */
        background:
        /* Sub-Radials für Type-Cluster (top layer, sehr blass) */
          radial-gradient(circle 50% at 25% 30%, color-mix(in srgb, #f59e0b 14%, transparent) 0%, transparent 60%),
          radial-gradient(circle 50% at 78% 28%, color-mix(in srgb, #ec4899 12%, transparent) 0%, transparent 60%),
          radial-gradient(circle 45% at 22% 75%, color-mix(in srgb, #22c55e 12%, transparent) 0%, transparent 55%),
          radial-gradient(circle 48% at 78% 72%, color-mix(in srgb, #3b82f6 12%, transparent) 0%, transparent 60%),
          /* Basis: warmer Center-Glow + dunklerer Rand */
          radial-gradient(
              ellipse 80% 80% at center,
              color-mix(in srgb, var(--surface-ground) 82%, var(--primary-color) 18%) 0%,
              var(--surface-ground) 45%,
              color-mix(in srgb, var(--surface-ground) 86%, #000 14%) 100%
            );
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius-md);
        overflow: hidden;
        position: relative;
      }
      /* Stats-Overlay top-left im Canvas — diskret, blurred Backdrop, klickt
       durch (pointer-events: none) damit Cytoscape-Interaktionen nicht
       blockiert werden. */
      .ontology-map-canvas-stats {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 10;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.3rem 0.7rem;
        font-size: 0.78rem;
        font-weight: 500;
        color: var(--text-color-secondary);
        background: color-mix(in srgb, var(--surface-card) 75%, transparent);
        border: 1px solid color-mix(in srgb, var(--surface-border) 70%, transparent);
        border-radius: 6px;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        pointer-events: none;
      }
      .ontology-map-canvas-stats .sep {
        opacity: 0.5;
      }
      /* Phase I.37 (2026-05-15): Mobile-Anpassung. Auf schmalen Canvases
       würden Stats-Pill (links) + Detach-Button (rechts) im Slot-TR
       sonst kollidieren. Stats kompakter rendern, "Verbindungen"-Label
       weglassen (nur Counter), Padding reduzieren. */
      @media (max-width: 540px) {
        .ontology-map-canvas-stats {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          gap: 0.3rem;
          top: 6px;
          left: 6px;
        }
        .ontology-map-canvas-slot-tr {
          top: 6px;
          right: 6px;
        }
      }
      /* Slot für Page-spezifische Overlays oben rechts (z.B. Detach-Button).
       Position absolute mit auto-size auf den Inhalt — der Slot ist nur
       so groß wie der Button, der Rest des Canvas bleibt durch das
       Auto-Sizing klickbar (kein pointer-events-Trick nötig, der hatte
       die Button-Klickbarkeit verhindert). */
      .ontology-map-canvas-slot-tr {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
      }
      .ontology-map-camera-readout {
        position: fixed;
        top: 80px;
        right: 16px;
        z-index: 9999;
        padding: 12px 16px;
        font-family: ui-monospace, 'Cascadia Mono', 'Source Code Pro', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #fff;
        background: rgba(20, 20, 24, 0.95);
        border: 2px solid #f59e0b;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        pointer-events: none;
        min-width: 340px;
      }
      .ontology-map-camera-readout span {
        display: inline-block;
        width: 56px;
        color: #f59e0b;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.72rem;
        font-weight: 800;
      }

      /* Phase I.38 (2026-05-15): Spinner-Positionierung robustifiziert.
       Vorher: top:50% + translate(-50%,-50%) auf inline-flex Skeleton —
       die Translation hängt von der Skeleton-Eigenbreite ab, die wiederum
       erst gemessen werden kann nachdem Font geladen ist. Race-Condition
       in einigen Browsern → off-center.
       Jetzt: Outer-Container (.ontology-map-skeleton) fills den ganzen
       Wrap via inset:0, Flex zentriert das innere Pill (.skeleton-pill).
       Funktioniert unabhängig von Pill-Größe oder Font-Loading-Timing. */
      .ontology-map-skeleton {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        z-index: 100;
      }
      .ontology-map-skeleton .skeleton-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 999px;
        color: var(--text-color-secondary);
        font-size: 0.85rem;
      }

      .ontology-map-empty {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1.5rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      .ontology-map-table-wrap {
        max-height: 60vh;
        overflow: auto;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius-md);
      }
      .ontology-map-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.88rem;
      }
      .ontology-map-table th,
      .ontology-map-table td {
        padding: 0.55rem 0.85rem;
        text-align: left;
        border-bottom: 1px solid var(--surface-border);
      }
      .ontology-map-table thead th {
        position: sticky;
        top: 0;
        background: var(--surface-card);
        font-weight: 600;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
        z-index: 1;
      }
      .ontology-map-table-node {
        font: inherit;
        background: none;
        border: 0;
        padding: 0;
        color: var(--primary-color-fg);
        cursor: pointer;
        text-align: left;
      }
      .ontology-map-table-node:hover {
        text-decoration: underline;
      }
      .ontology-map-table-node:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .ontology-map-type-tag {
        display: inline-block;
        padding: 0.1rem 0.55rem;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: #fff;
        border-radius: 999px;
      }
      /* Phase I.7a — Tabelle neu: Nodes-Liste */
      .ontology-map-table .col-type {
        width: 110px;
      }
      .ontology-map-table .col-count {
        width: 80px;
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .ontology-map-table .col-neighbors {
        max-width: 360px;
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
        align-items: center;
      }
      .ontology-map-table tr.is-pinned td {
        background: color-mix(in srgb, var(--primary-color) 8%, transparent);
      }
      .ontology-map-table-node.is-pinned {
        color: var(--primary-color);
        font-weight: 700;
      }
      .ontology-map-neighbor-chip {
        display: inline-flex;
        align-items: center;
        padding: 0.1rem 0.55rem;
        font: inherit;
        font-size: 0.75rem;
        background: color-mix(in srgb, var(--chip-color, var(--surface-hover)) 18%, transparent);
        color: var(--text-color);
        border: 1px solid color-mix(in srgb, var(--chip-color, var(--surface-border)) 45%, transparent);
        border-radius: 999px;
        cursor: pointer;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ontology-map-neighbor-chip:hover {
        background: color-mix(in srgb, var(--chip-color, var(--surface-hover)) 30%, transparent);
      }
      .ontology-map-neighbor-chip:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .ontology-map-neighbor-more {
        font-size: 0.72rem;
        color: var(--text-color-secondary);
        padding: 0.05rem 0.3rem;
      }

      @media (prefers-reduced-motion: reduce) {
        .ontology-map-toggle {
          transition: none;
        }
      }
      @media print {
        .ontology-map-root {
          display: none;
        }
      }

      /* Visually hidden — content available to screen readers only */
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  ],
})
export class OntologyMapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() focusType?: OntologyNodeType;
  @Input() focusId?: string;
  /** 1-hop default; 2 is the supported maximum. */
  @Input() hops: 1 | 2 = 1;
  /** When true, ignore focus inputs and render the full graph. */
  @Input() fullGraph = false;
  /** Optional type filter for full-graph mode. */
  @Input() typeFilter: OntologyNodeType[] | null = null;
  /** When true, clicks on nodes navigate via router; otherwise only emit. */
  @Input() navigateOnClick = true;
  /** Free-text filter — matches against node title (case-insensitive substring).
      Matching nodes get a `.matched` class (highlighted + labeled); non-matching
      nodes get a `.dim` class. Empty string disables filtering. */
  @Input() searchTerm: string = '';
  /** When true AND a focus is set, render a "Volle Wissenskarte öffnen" link
      next to the Tabelle toggle. Used by the in-dialog mount. */
  @Input() showFullMapLink: boolean = false;
  /** Diagnostic overlay (zoom/pan/view/bbox) for re-tuning the preset
      camera defaults. Off by default; flip to true when iterating. */
  @Input() showCameraReadout: boolean = false;
  /** Phase I.3: key (format '<type>:<id>') des aktuell „gepinnten" Knotens.
      Wenn gesetzt, bekommt dieser Knoten persistent Ring+Label. Parent-Component
      managed den Pin via (nodeFixed)-Event. */
  @Input() fixedNodeKey: string | null = null;
  /** Whether to animate neighbors into a circle when a node is pinned. */
  @Input() enableCircularLayout = true;

  @Output() nodeSelected = new EventEmitter<OntologyNodeRef>();
  @Output() fullMapClicked = new EventEmitter<void>();
  /** Phase I.3: emit when user clicks a node OR unpins. Bei Click auf den
      bereits gepinnten Knoten = unpin → null. Sonst = pin → der neue Ref.
      Wird vom Split-View-Host beobachtet, der den Detail-Pane rendert. */
  @Output() nodeFixed = new EventEmitter<OntologyNodeRef | null>();

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;

  private ontology = inject(OntologyService);
  private relatedRefs = inject(RelatedRefsService);
  private loader = inject(CytoscapeLoaderService);
  private translation = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  /** Emits on each rebuild() to cancel the previous rebuild's in-flight loads. */
  private readonly rebuildCancel$ = new Subject<void>();
  private resizeObserver: ResizeObserver | null = null;
  // Public for the camera-readout template binding (debug); otherwise treated
  // as private — don't reach in from outside.
  cyInstance: CyInstance | null = null;
  private currentSig = '';
  private lastSearchSig = '';

  nodes: RenderableNode[] = [];
  edges: RenderableEdge[] = [];
  displayByKey = new Map<string, NodeDisplayInfo>();
  typesInView: OntologyNodeType[] = [];
  showTable = false;
  isLoading = true;
  private matchCount = 0;
  /** Phase I.7a: pre-computed adjacency — pro Node-Key die Liste der verbundenen
      Node-Keys. Wird in rebuild() nach edge-resolve berechnet. */
  private adjacency = new Map<string, string[]>();

  /** Pre-computed fcose positions, loaded once via OntologyService. When set
      AND fullGraph is true, the layout is `preset` instead of running fcose
      live — ~700ms blocking layout becomes ~0ms instant placement. Null
      until the HTTP response lands; falls back to live fcose for the first
      mount in that race window. */
  private precomputedPositions: Map<string, { x: number; y: number }> | null = null;

  /** Diagnostics readout for the camera (pan/zoom/visible extent + element
      bbox). Updated on every Cytoscape pan/zoom event; null while the
      graph isn't mounted. Rendered as a small overlay in the canvas. */
  cameraInfo: {
    zoom: number;
    pan: { x: number; y: number };
    view: { x1: number; y1: number; x2: number; y2: number };
    bbox: { x1: number; y1: number; x2: number; y2: number; w: number; h: number; cx: number; cy: number };
  } | null = null;

  get focusKey(): string | null {
    return this.focusType && this.focusId ? this.focusType + ':' + this.focusId : null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const sig = JSON.stringify({
      focus: this.focusKey,
      hops: this.hops,
      full: this.fullGraph,
      filter: this.typeFilter ?? null,
    });
    if (sig !== this.currentSig) {
      this.currentSig = sig;
      this.rebuild();
      return;
    }
    // Search-term changes don't require a rebuild — just re-apply classes.
    if (this.searchTerm !== this.lastSearchSig) {
      this.lastSearchSig = this.searchTerm;
      this.applySearchClasses();
    }
    // Phase I.3: fixedNodeKey-Change — Pin-Class umschreiben ohne Layout-Run.
    if (changes['fixedNodeKey'] || changes['enableCircularLayout']) {
      this.applyPinClass();
    }
  }

  private cameraPoll: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Camera diagnostics seed — guarantees the readout shows SOMETHING from
    // the very first paint even if renderCy hasn't run yet (e.g. SSR, or
    // before the cytoscape lazy-load completes).
    this.cameraInfo = {
      zoom: 0,
      pan: { x: 0, y: 0 },
      view: { x1: 0, y1: 0, x2: 0, y2: 0 },
      bbox: { x1: 0, y1: 0, x2: 0, y2: 0, w: 0, h: 0, cx: 0, cy: 0 },
    };
    // Robust camera readout: poll the cy instance every 250ms. Cheaper than
    // listening for every render-frame event and avoids the Cytoscape ↔
    // Angular zone hassle entirely.
    if (isPlatformBrowser(this.platformId)) {
      this.cameraPoll = setInterval(() => this.refreshCameraInfo(), 250);
    }
    // Pre-load the fcose positions file. Cached via shareReplay in the service,
    // so subsequent map mounts in the same session reuse the same Map without
    // re-fetching. If the file is missing (404 or pre-script-run), positions
    // stays null and renderCy falls back to running fcose live.
    this.ontology
      .getPositions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((p) => {
        this.precomputedPositions = p;
      });
  }

  private refreshCameraInfo(): void {
    const cy = this.cyInstance as unknown as {
      zoom: () => number;
      pan: () => { x: number; y: number };
      extent: () => { x1: number; y1: number; x2: number; y2: number };
      nodes: () => { boundingBox: () => { x1: number; y1: number; x2: number; y2: number; w: number; h: number } };
    } | null;
    if (!cy) return;
    try {
      const ext = cy.extent();
      const bb = cy.nodes().boundingBox();
      this.cameraInfo = {
        zoom: cy.zoom(),
        pan: cy.pan(),
        view: { x1: ext.x1, y1: ext.y1, x2: ext.x2, y2: ext.y2 },
        bbox: {
          x1: bb.x1,
          y1: bb.y1,
          x2: bb.x2,
          y2: bb.y2,
          w: bb.w,
          h: bb.h,
          cx: (bb.x1 + bb.x2) / 2,
          cy: (bb.y1 + bb.y2) / 2,
        },
      };
      this.cdr.markForCheck();
    } catch {
      // cy might be mid-tear-down; next tick will retry
    }
  }

  ngOnDestroy(): void {
    if (this.cameraPoll) {
      clearInterval(this.cameraPoll);
      this.cameraPoll = null;
    }
    this.disposeCy();
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
    this.cdr.markForCheck();
    if (!this.showTable && this.cyInstance) {
      // Defer to next tick — the canvas just became visible. Phase I.22
      // (2026-05-14): nach resize() auch fit() aufrufen damit der Graph
      // wieder alle Knoten sichtbar zeigt. Ohne fit ist die Kamera noch
      // auf dem zuletzt-zentrierten Pin (via applyPinClass-Animation),
      // sodass beim Toggle-zurueck der User wieder reingezoomt landet
      // statt mit voller Uebersicht.
      setTimeout(() => {
        if (!this.cyInstance) return;
        const cyAny = this.cyInstance as unknown as {
          resize?: () => void;
          fit?: (eles?: unknown, padding?: number) => void;
          zoom?: (z: number) => void;
          pan?: (p: { x: number; y: number }) => void;
        };
        if (cyAny.resize) cyAny.resize();
        if (cyAny.fit) {
          cyAny.fit(undefined, 25);
        }
      }, 0);
    }
    // Phase I.5: beim Wechsel in die Tabellen-Ansicht ohne Pin → erstes Item
    // pinnen (Top-Hub nach connection-count). User-Wunsch: Detail-Pane soll
    // in der Tabelle nie leer sein. navigateOnClick=false ist Voraussetzung
    // (sonst wäre auto-pin = ungewollte Navigation).
    if (this.showTable && !this.navigateOnClick && !this.fixedNodeKey) {
      const rows = this.tableRows();
      if (rows.length > 0) {
        const first = rows[0];
        const t = this.typeOf(first.key);
        const id = first.key.slice(t.length + 1);
        this.nodeFixed.emit({ type: t, id });
      }
    }
  }

  t(key: string): string {
    return this.translation.translate(key);
  }

  ariaSummary(): string {
    const n = this.nodes.length;
    const e = this.edges.length;
    if (n === 0) return this.t('conceptMap.map.ariaEmpty');
    const base = this.t('conceptMap.map.ariaSummary').replace('{{count}}', String(n)).replace('{{edges}}', String(e));
    const focus = this.focusKey
      ? ' ' +
        this.t('conceptMap.map.ariaSummaryFocus')
          .replace('{{type}}', this.focusType ?? '')
          .replace('{{id}}', this.focusId ?? '')
      : '';
    return `${base}${focus} ${this.t('conceptMap.map.ariaSummaryTableHint')}`;
  }

  canvasAriaLabel(): string {
    // Same body as ariaSummary — the role="img" canvas needs a self-contained
    // description because screen readers ignore its inner content.
    return this.ariaSummary();
  }

  /** Live-region text announced when search results change. */
  searchAriaLive(): string {
    const term = (this.searchTerm || '').trim();
    if (term.length === 0 || this.nodes.length === 0) return '';
    return this.t('conceptMap.map.searchResultLive')
      .replace('{{count}}', String(this.matchCount))
      .replace('{{total}}', String(this.nodes.length));
  }

  colourFor(t: OntologyNodeType): string {
    return TYPE_COLOURS[t];
  }

  labelFor(t: OntologyNodeType): string {
    return this.t('conceptMap.map.type.' + t);
  }

  titleFor(key: string): string {
    const info = this.displayByKey.get(key);
    return info?.title ?? key.split(':').slice(1).join(':');
  }

  typeOf(key: string): OntologyNodeType {
    return key.split(':', 1)[0] as OntologyNodeType;
  }

  onTableNodeClick(key: string): void {
    if (key.startsWith('cluster:')) return;
    const t = this.typeOf(key);
    const id = key.slice(t.length + 1);
    const ref: OntologyNodeRef = { type: t, id };
    if (this.navigateOnClick) {
      this.emitNode(ref);
      return;
    }
    // Phase I.5: Tabelle pinnt analog zum Graph-Click (Toggle bei Re-Click).
    const cyKey = nodeKey(ref);
    const isAlreadyPinned = this.fixedNodeKey === cyKey;
    this.nodeFixed.emit(isAlreadyPinned ? null : ref);
    this.nodeSelected.emit(ref);
  }

  /** Phase I.7a: berechnet Tabellen-Zeilen aus this.nodes + adjacency.
      Sortiert nach connection-count desc. Filter durch this.searchTerm (I.7b). */
  tableRows(): TableRow[] {
    if (this.nodes.length === 0) return [];
    const term = (this.searchTerm || '').trim().toLowerCase();
    const rows: TableRow[] = [];
    for (const n of this.nodes) {
      const neighborKeys = this.adjacency.get(n.key) ?? [];
      if (term.length > 0 && !n.title.toLowerCase().includes(term)) continue;
      const topNeighbors = neighborKeys.slice(0, 3).map((k) => ({
        key: k,
        title: this.titleFor(k),
        type: this.typeOf(k),
      }));
      rows.push({
        key: n.key,
        title: n.title,
        type: n.ref.type,
        connectionCount: neighborKeys.length,
        topNeighbors,
        extraNeighborCount: Math.max(0, neighborKeys.length - 3),
      });
    }
    rows.sort((a, b) => b.connectionCount - a.connectionCount);
    return rows;
  }

  private rebuild(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.rebuildCancel$.next();

    const source$ = this.fullGraph
      ? this.ontology.getAll(this.typeFilter)
      : this.focusType && this.focusId
        ? this.ontology.getSubgraph({ type: this.focusType, id: this.focusId }, this.hops)
        : of({ nodes: [] as OntologyNodeRef[], edges: [] as OntologyEdge[] });

    source$.pipe(takeUntil(this.rebuildCancel$), takeUntilDestroyed(this.destroyRef)).subscribe((sub) => {
      // Nodes of a feature site.json switches off (glossary, timeline, …) are not drawn.
      const allNodes: OntologyNodeRef[] = (sub.nodes ?? []).filter((r) => this.relatedRefs.isTypeOn(r.type));
      const allEdges: OntologyEdge[] = (sub.edges ?? []).filter(
        (e) => this.relatedRefs.isTypeOn(e.a.type) && this.relatedRefs.isTypeOn(e.b.type),
      );

      this.relatedRefs
        .resolveDisplay(allNodes)
        .pipe(takeUntil(this.rebuildCancel$), takeUntilDestroyed(this.destroyRef))
        .subscribe((displayMap) => {
          this.displayByKey = displayMap;
          this.nodes = allNodes.map((r) => ({
            ref: r,
            title: displayMap.get(nodeKey(r))?.title ?? r.id,
            key: nodeKey(r),
          }));
          this.edges = allEdges.map((e) => ({
            source: nodeKey(e.a),
            target: nodeKey(e.b),
          }));
          // Phase I.7a: adjacency-list bauen für O(1)-Nachbar-Lookup in Tabelle.
          this.adjacency = new Map();
          for (const e of this.edges) {
            if (!this.adjacency.has(e.source)) this.adjacency.set(e.source, []);
            if (!this.adjacency.has(e.target)) this.adjacency.set(e.target, []);
            this.adjacency.get(e.source)!.push(e.target);
            this.adjacency.get(e.target)!.push(e.source);
          }
          this.typesInView = ONTOLOGY_NODE_TYPES.filter((t) => this.nodes.some((n) => n.ref.type === t));
          this.isLoading = false;
          this.cdr.markForCheck();
          this.renderCy();
        });
    });
  }

  private async renderCy(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.showTable) return; // canvas not visible — defer
    if (this.nodes.length === 0) {
      this.disposeCy();
      return;
    }

    const cytoscape = await this.loader.load();
    if (!cytoscape) return;
    if (!this.canvasRef?.nativeElement) return;

    this.disposeCy();

    const isLarge = this.nodes.length > 200;
    const focusKey = this.focusKey;
    const focusNeighbors = new Set<string>();
    if (focusKey) {
      for (const e of this.edges) {
        if (e.source === focusKey) focusNeighbors.add(e.target);
        if (e.target === focusKey) focusNeighbors.add(e.source);
      }
    }

    // Phase I.2 (2026-05-14): TYPE-Clustering via Compound-Nodes für fullGraph.
    // Jeder Node bekommt einen unsichtbaren Parent pro Typ ('cluster:article',
    // 'cluster:glossary', ...). fcose zieht Children eines Parents zusammen
    // → Type-Inseln entstehen. Compound-Parents werden via CSS unsichtbar gemacht.
    // Subgraph-Modus nutzt KEIN Compound — würde Focus-Node aus der Mitte ziehen.
    // Preset-Modus (pre-computed positions) nutzt auch KEIN Compound — die
    // Compound-Parents haben ein eigenes bbox-Padding (30 px) das das overall
    // graph-bbox asymmetrisch verschiebt und cy.fit() off-center wirken lässt.
    const useTypeClusters = this.fullGraph && !this.precomputedPositions;

    // Phase I.35 (2026-05-15): Degree pro Node berechnen, damit der Node-Style
    // via mapData('degree', ...) Hubs größer rendert als Blätter. Berechnung
    // einmalig beim Render — zero Per-Frame-Cost.
    const degreeMap = new Map<string, number>();
    for (const e of this.edges) {
      degreeMap.set(e.source, (degreeMap.get(e.source) || 0) + 1);
      degreeMap.set(e.target, (degreeMap.get(e.target) || 0) + 1);
    }

    const clusterParentNodes = useTypeClusters
      ? this.typesInView.map((t) => ({
          group: 'nodes' as const,
          data: { id: 'cluster:' + t, label: '', type: 'cluster' },
          classes: 'cluster-parent',
          selectable: false,
          grabbable: false,
        }))
      : [];

    const cy = (cytoscape as unknown as (opts: Record<string, unknown>) => unknown)({
      container: this.canvasRef.nativeElement,
      elements: [
        ...clusterParentNodes,
        ...this.nodes.map((n) => {
          const classes: string[] = [];
          if (focusKey && n.key === focusKey) classes.push('focus');
          else if (focusNeighbors.has(n.key)) classes.push('focus-neighbor');
          const data: Record<string, string | number> = {
            id: n.key,
            label: n.title,
            type: n.ref.type,
            // Phase I.35: degree für mapData()-Size-Skalierung. Cap bei 30 —
            // Tokens-artige Hubs haben 40+, aber > 30 → size cap.
            degree: Math.min(degreeMap.get(n.key) ?? 0, 30),
          };
          if (useTypeClusters) data['parent'] = 'cluster:' + n.ref.type;
          return {
            group: 'nodes' as const,
            data,
            classes: classes.join(' '),
          };
        }),
        ...this.edges.map((e) => {
          // Klassifikation extrahiert in classifyOntologyEdge() (top of file)
          // — testbar, deterministisch. Siehe ontology-map.component.spec für
          // Coverage der intra/inter + cluster-${type}-Logik.
          const cls = classifyOntologyEdge(e.source, e.target, useTypeClusters);
          return {
            group: 'edges' as const,
            data: { id: e.source + '__' + e.target, source: e.source, target: e.target },
            classes: cls,
          };
        }),
      ],
      style: this.buildStyles(),
      layout: this.buildLayoutOptions(isLarge, this.fullGraph ? this.precomputedPositions : null),
      // Phase I.30 (2026-05-14): wheelSensitivity 0.75 → 2.0 (User: "muss viel
      // schneller gehen"). Cytoscape-Default ist 1.0; >1.0 ist über-default-fast.
      // Bei 2.0 erreicht ein normaler Mausrad-Tick ~doppelt so viel Zoom-Delta.
      wheelSensitivity: 2.0,
      // Phase I.20 (2026-05-14): minZoom 0.2 → 0.05 damit cy.fit() bei
      // schmalen Containern (Mobile, Tablet, Article-Footer-Mount) nicht
      // auf 0.2 geclampt wird. Vorher: bei viewport=400px-Breite wäre der
      // berechnete fit-zoom ~0.18, durch Clamp auf 0.2 wurden Knoten am
      // Rand abgeschnitten ("Bruchteil der Knoten sichtbar"). 0.05 erlaubt
      // 20× rauszoomen — sehr robust für jede Container-Größe.
      minZoom: 0.05,
      maxZoom: 3,
      // Performance flags — note: hideEdgesOnViewport intentionally OFF,
      // user found the brief edge-disappearance during zoom/pan jarring.
      // Phase I.15 REDO² (2026-05-14): textureOnViewport von 'isLarge' auf
      // 'false' zurueck. Mit isLarge=true (501 Knoten) cached Cytoscape die
      // gesamte Szene als Bitmap. Hover-Class-Updates kommen NICHT in die
      // Cache — die Faded-Versionen der Nodes/Labels bleiben sichtbar
      // während die Hover-Layer drüber gemalt wird. Visuell wirkt das als
      // ob die hovered Nodes/Labels transparent sind (sind sie nicht — die
      // Cache der gefadeten Version durchscheint). Performance: 501 Nodes
      // + 3557 Edges sind in der Praxis OK ohne Textur-Cache, Cytoscape
      // re-rendert in <16ms pro Frame.
      textureOnViewport: false,
      motionBlur: false,
      // Phase I.15 (2026-05-14): pixelRatio:'auto' rendert auf physical pixels
      // statt 1:1 CSS-px (default war 1 → Browser streckt 2x, Text unscharf).
      // Performance bei 501 Knoten ok.
      pixelRatio: 'auto',
      autoungrabify: isLarge, // disable drag on heavy graphs
    }) as CyInstance;

    // Click → navigate (if navigateOnClick) OR pin/unpin (if not).
    // cluster-parent kann nicht getroffen werden (events:'no'), aber zur
    // Sicherheit filtern wir nochmal.
    cy.on('tap', 'node', (evt) => {
      const id = evt.target.id();
      if (id.startsWith('cluster:')) return;
      const t = this.typeOf(id);
      const nid = id.slice(t.length + 1);
      const ref: OntologyNodeRef = { type: t, id: nid };
      if (this.navigateOnClick) {
        this.emitNode(ref);
        return;
      }
      // Phase I.3: Pin-Toggle. Click auf bereits gepinnten Node = unpin.
      const isAlreadyPinned = this.fixedNodeKey === id;
      this.nodeFixed.emit(isAlreadyPinned ? null : ref);
      this.nodeSelected.emit(ref); // emit beides — Parents können beides handeln
    });

    // Phase I.31 (2026-05-15): Fix for Optimus UI overlays not closing.
    // Cytoscape swallows mousedown/touchstart events on the canvas to handle
    // panning and zooming. This prevents Optimus UI's DocumentListener from
    // firing, so p-autoComplete and p-multiSelect stay open when clicking the graph.
    // Dispatching a synthetic event to the document triggers the close logic.
    cy.on('tapstart', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.dispatchEvent(new Event('mousedown', { bubbles: true }));
      document.dispatchEvent(new Event('touchstart', { bubbles: true }));
    });

    // Hover → highlight node + 1-hop neighbors, dim everything else
    // (Obsidian-style focus+context. We batch the class mutations so the
    // renderer applies them in a single repaint.)
    // Phase I.14 (2026-05-14): I.9 Auto-Zoom revertiert. User: "wenn ich
    // hovere springt der ganze graph das darf nicht sein". Kein cy.animate
    // mehr, nur Class-Mutation für Visual-Highlight.
    //
    // Phase I.15 (2026-05-14, REDO): Cytoscape rendert font-size in MODEL units
    // → bei zoom=0.5 ist 'font-size: 14' effektiv nur 7px screen-Pixel. Daher
    // wurde der initial-Hover-Label-Fix als unscharf wahrgenommen — eigentlich
    // war's zu klein, nicht unscharf. Lösung: zoom-kompensierte inline-font-size
    // beim Hover anwenden (font-size = max(14, 14 / zoom)) → Label rendert immer
    // mit mind. 14 effektiven Bildschirm-Pixeln. Neighbor-Labels bekommen ein
    // dezenteres 12er-Niveau damit Center optisch dominiert.
    const computeHoverFontPx = (basePx: number): number => {
      const cyAny = cy as { zoom?: () => number };
      const z = (cyAny.zoom && cyAny.zoom()) || 1;
      return Math.max(basePx, Math.round(basePx / Math.max(0.25, z)));
    };
    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      if (node.id && node.id().startsWith && node.id().startsWith('cluster:')) return;

      const centerFont = computeHoverFontPx(14);
      const targetCol = (cy as unknown as { $: (s: string) => CyCollection }).$('node[id = "' + node.id() + '"]');

      if (this.fixedNodeKey) {
        // Phase I.33 (2026-05-15): Single-Neighbor-Hover im Pin-Modus.
        // Im Pin-Modus sind alle Nachbar-Labels via .pinned-neighbor
        // sichtbar aber gedimmt (text-opacity 0.65, text-background-opacity
        // 0.70). Auf Hover eines einzelnen Nachbarn fügen wir .hovered +
        // .hovered-center hinzu:
        // — .hovered hebt text-opacity zurück auf 1
        // — .hovered-center macht ihn größer + bold + opaker Background
        // → der gehoverte Knoten springt klar ins Auge ohne dass alle
        //   anderen Labels gleichzeitig konkurrieren.
        //
        // Skip wenn es der gepinnte Knoten selbst ist — der hat schon
        // .pinned (großer Ring + Label) und unsere inline-font-size
        // würde die zoom-kompensierte Font aus applyPinClass überschreiben.
        if (node.id() === this.fixedNodeKey) return;
        cy.batch(() => {
          (targetCol as unknown as { addClass: (c: string) => void }).addClass('hovered');
          (targetCol as unknown as { addClass: (c: string) => void }).addClass('hovered-center');
          (targetCol as unknown as { style: (p: string, v: string) => void }).style('font-size', centerFont + 'px');
        });
        return;
      }

      const neighborhood = node.closedNeighborhood();
      const neighborFont = computeHoverFontPx(11);
      const neighborOnly = (neighborhood as unknown as { difference: (sel: string) => CyCollection }).difference(
        'node[id = "' + node.id() + '"]',
      );

      cy.batch(() => {
        neighborhood.addClass('hovered');
        (targetCol as unknown as { addClass: (c: string) => void }).addClass('hovered-center');
        (targetCol as unknown as { style: (p: string, v: string) => void }).style('font-size', centerFont + 'px');
        (neighborOnly as unknown as { style: (p: string, v: string) => void }).style('font-size', neighborFont + 'px');
      });
    });
    cy.on('mouseout', 'node', (evt) => {
      const node = evt.target;
      if (node.id && node.id().startsWith && node.id().startsWith('cluster:')) return;

      if (this.fixedNodeKey) {
        // Symmetrisch zum mouseover: pinned-Knoten überspringen (sein inline
        // font-size aus applyPinClass darf nicht entfernt werden), sonst
        // beide Hover-Klassen + inline font-size zurücknehmen.
        if (node.id() === this.fixedNodeKey) return;
        const targetCol = (cy as unknown as { $: (s: string) => CyCollection }).$('node[id = "' + node.id() + '"]');
        cy.batch(() => {
          (targetCol as unknown as { removeClass: (c: string) => void }).removeClass('hovered');
          (targetCol as unknown as { removeClass: (c: string) => void }).removeClass('hovered-center');
          (targetCol as unknown as { removeStyle: (p: string) => void }).removeStyle('font-size');
        });
        return;
      }

      const neighborhood = node.closedNeighborhood();
      cy.batch(() => {
        neighborhood.removeClass('hovered');
        neighborhood.removeClass('hovered-center');
        (neighborhood as unknown as { removeStyle: (p: string) => void }).removeStyle('font-size');
        (neighborhood as unknown as { removeStyle: (p: string) => void }).removeStyle('label');
      });
    });

    // Phase I.15 (2026-05-14, REDO): wenn User während eines aktiven Hovers
    // wheel-zoomt, muss die zoom-kompensierte font-size live mitgehen, sonst
    // springt das Label während des Zooms in die Render-Skalierung.
    (cy as unknown as { on: (evt: string, fn: () => void) => void }).on('zoom', () => {
      const hovered = (cy as unknown as { nodes: (sel: string) => CyCollection }).nodes('.hovered');
      const center = (cy as unknown as { nodes: (sel: string) => CyCollection }).nodes('.hovered-center');
      const centerArr = center as unknown as { length?: number };
      if (!centerArr.length) return;
      const centerFont = computeHoverFontPx(14);
      const neighborFont = computeHoverFontPx(11);
      cy.batch(() => {
        (hovered as unknown as { style: (p: string, v: string) => void }).style('font-size', neighborFont + 'px');
        (center as unknown as { style: (p: string, v: string) => void }).style('font-size', centerFont + 'px');
      });
    });

    // Phase I.20 (2026-05-14): expliziter cy.fit() nach Layout-Done als
    // Sicherheitsnetz. fcose's eingebauter `fit: true` kann in seltenen
    // Race-Bedingungen (Container-Resize während Layout-Computation oder
    // delayed Subgraph-Mount) das Fit-Result überschreiben oder mit dem
    // alten Container-Rect rechnen. Re-fit nach layoutstop garantiert
    // dass ALLE Elements im sichtbaren Bereich enden.
    //
    // Preset-Layout: use auto-fit to ensure the graph centers dynamically
    // across all viewports and screens, rather than pinning to static values.
    (cy as unknown as { on: (evt: string, fn: () => void) => void }).on('layoutstop', () => {
      const cyAny = cy as unknown as {
        fit?: (eles?: unknown, padding?: number) => void;
        zoom?: (z: number) => void;
        pan?: (p: { x: number; y: number }) => void;
      };
      if (cyAny.fit) {
        cyAny.fit(undefined, 25);
      }
    });

    this.cyInstance = cy;

    // Listen to container resizes to keep the graph centered
    if (typeof ResizeObserver !== 'undefined' && this.canvasRef?.nativeElement) {
      let resizeTimeout: ReturnType<typeof setTimeout>;
      this.resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (!this.cyInstance) return;
          const cyAny = this.cyInstance as unknown as {
            resize?: () => void;
            fit?: (e?: unknown, p?: number) => void;
            center?: (eles: unknown) => void;
            $: (sel: string) => { length: number };
          };
          if (cyAny.resize) cyAny.resize();

          if (!this.fixedNodeKey && cyAny.fit) {
            cyAny.fit(undefined, 25);
          } else if (this.fixedNodeKey && cyAny.center) {
            const target = cyAny.$('node[id = "' + this.fixedNodeKey + '"]');
            if (target && target.length > 0) {
              cyAny.center(target);
            }
          }
        }, 150);
      });
      this.resizeObserver.observe(this.canvasRef.nativeElement);
    }

    // Camera diagnostics: set a placeholder synchronously so the readout
    // shows SOMETHING immediately, then refine after Cytoscape has had a
    // chance to compute its real extent.
    this.cameraInfo = {
      zoom: 1,
      pan: { x: 0, y: 0 },
      view: { x1: 0, y1: 0, x2: 0, y2: 0 },
      bbox: { x1: 0, y1: 0, x2: 0, y2: 0, w: 0, h: 0, cx: 0, cy: 0 },
    };
    this.cdr.markForCheck();

    // Cytoscape fires pan/zoom outside Angular's zone — without ngZone.run,
    // cdr.markForCheck won't trigger view update for OnPush. detectChanges
    // is the simpler hammer here since we're already running in render code.
    const updateCamera = () => {
      try {
        const cyAny = cy as unknown as {
          zoom: () => number;
          pan: () => { x: number; y: number };
          extent: () => { x1: number; y1: number; x2: number; y2: number; w: number; h: number };
          nodes: (sel?: string) => {
            boundingBox: () => { x1: number; y1: number; x2: number; y2: number; w: number; h: number };
          };
        };
        const ext = cyAny.extent();
        const bb = cyAny.nodes().boundingBox();
        this.ngZone.run(() => {
          this.cameraInfo = {
            zoom: cyAny.zoom(),
            pan: cyAny.pan(),
            view: { x1: ext.x1, y1: ext.y1, x2: ext.x2, y2: ext.y2 },
            bbox: {
              x1: bb.x1,
              y1: bb.y1,
              x2: bb.x2,
              y2: bb.y2,
              w: bb.w,
              h: bb.h,
              cx: (bb.x1 + bb.x2) / 2,
              cy: (bb.y1 + bb.y2) / 2,
            },
          };
          this.cdr.detectChanges();
        });
      } catch (e) {
        console.warn('[ontology-map] camera readout error', e);
      }
    };
    (cy as unknown as { on: (evt: string, fn: () => void) => void }).on('pan zoom', updateCamera);
    (cy as unknown as { on: (evt: string, fn: () => void) => void }).on('layoutstop', () => {
      updateCamera();
      // Phase I.32 (2026-05-15): Store original positions for circular animation
      const cyNodes = (cy as unknown as { nodes: () => CyAnimCollection }).nodes();
      if (cyNodes && typeof cyNodes.forEach === 'function') {
        cyNodes.forEach((n: CyAnimNode) => {
          if (!n.scratch('isCircled')) {
            n.scratch('originalPos', { ...n.position() });
          }
        });
      }
      // Phase I.37 (2026-05-15): One-Shot Reveal entfernt — 500-Node
      // Opacity-Animations können mit späteren Pin-Animationen Race-
      // Conditions auslösen. fcose's eigene Layout-Animation
      // (animationDuration 500ms) ist sowieso ein netter Reveal.
    });
    // Force an initial readout right after the layout settles. We hit it
    // multiple times because preset-layout doesn't always emit pan/zoom
    // events and `extent()` returns garbage during the first frame.
    [100, 400, 1000].forEach((delay) =>
      setTimeout(() => {
        if (this.cyInstance !== cy) return; // a newer cy replaced this one
        updateCamera();
      }, delay),
    );

    // Apply current search filter if any
    this.applySearchClasses();
    // Phase I.3: pin-class anwenden (Initial-Bind nach Render).
    this.applyPinClass();
  }

  /** Phase I.4: liest die aktuelle Theme-Klasse vom body. Wird einmal beim
      Render-Pass gecaptured (Theme-Switch erzwingt einen renderCy()-Re-Run). */
  private isDarkTheme(): boolean {
    if (!isPlatformBrowser(this.platformId)) return true; // SSR default
    return document.body.classList.contains('dark-theme') || document.documentElement.classList.contains('dark-theme');
  }

  /** Phase I.3: setzt/löscht `.pinned` auf dem aktuell fixedNodeKey-Knoten. */
  private applyPinClass(): void {
    const cy = this.cyInstance;
    if (!cy) return;
    // Phase I.21 (2026-05-14): Pinned-Node prominenter — zoom-kompensiertes
    // font-size inline plus Pan zum Pinned-Knoten damit der User sofort sieht
    // wo er ist (besonders relevant wenn der Pin via Rail-Click aus dem
    // Detail-Pane kommt — der User hat sonst keinen visuellen Hinweis wo
    // der neu-gepinnte Knoten im Graphen sitzt).
    cy.batch(() => {
      const allNodes = (cy as unknown as { nodes: (sel: string) => CyCollection }).nodes('.pinned');
      allNodes.removeClass('pinned');
      (allNodes as unknown as { removeStyle: (p: string) => void }).removeStyle('font-size');
      // Pin-Highlight: 1-hop neighborhood (nodes + connecting edges) gets a
      // dedicated `.pinned-neighbor` class that persists even when the mouse
      // moves away. Separate from `.hovered` so the hover handlers don't
      // wipe it on mouseout.
      const cyTyped = cy as unknown as {
        nodes: (sel?: string) => CyCollection;
        edges: (sel?: string) => CyCollection;
        $: (s: string) => CyCollection;
      };

      // UX Fix: Whenever a pin is applied or removed, we forcefully clear all
      // hover states. Since hover is disabled while a node is pinned, we must
      // ensure no lingering hover classes remain from the click action itself.
      const allN = cyTyped.nodes();
      allN.removeClass('hovered');
      allN.removeClass('hovered-center');
      (allN as unknown as { removeStyle: (p: string) => void }).removeStyle('label');
      // We clear font-size; the pinned nodes will get theirs explicitly re-applied below.
      (allN as unknown as { removeStyle: (p: string) => void }).removeStyle('font-size');
      cyTyped.edges('.hovered').removeClass('hovered');

      const prevNeighbors = cyTyped.nodes('.pinned-neighbor');
      prevNeighbors.removeClass('pinned-neighbor');
      (prevNeighbors as unknown as { removeStyle: (p: string) => void }).removeStyle('font-size');
      cyTyped.edges('.pinned-neighbor').removeClass('pinned-neighbor');
      if (this.fixedNodeKey) {
        const target = cyTyped.$('node[id = "' + this.fixedNodeKey + '"]');
        (target as unknown as { addClass: (c: string) => void }).addClass('pinned');
        const neighborhood = (target as unknown as { closedNeighborhood: () => CyCollection }).closedNeighborhood();
        (neighborhood as unknown as { addClass: (c: string) => void }).addClass('pinned-neighbor');
        // Note: the font-size will be dynamically updated again later based on the
        // animation's targetZoom. This is just a fallback for the static state.
        const cyAny = cy as { zoom?: () => number };
        const z = (cyAny.zoom && cyAny.zoom()) || 1;
        const fontPx = Math.max(14, Math.round(14 / Math.max(0.25, z)));
        (target as unknown as { style: (p: string, v: string) => void }).style('font-size', fontPx + 'px');
      }
    });
    // Phase I.32: Restore any previously circled nodes
    if (this.cyInstance) {
      const cyNodes = (this.cyInstance as unknown as { nodes: () => CyAnimCollection }).nodes();
      if (cyNodes && typeof cyNodes.forEach === 'function') {
        cyNodes.forEach((n: CyAnimNode) => {
          if (!n.scratch('originalPos') && !n.scratch('isCircled')) {
            n.scratch('originalPos', { ...n.position() });
          }
          if (n.scratch('isCircled')) {
            const orig = n.scratch('originalPos') as Record<string, unknown> | undefined;
            if (orig) {
              n.stop();
              n.animate({ position: orig }, { duration: 350, easing: 'ease-out', queue: false });
            }
            n.scratch('isCircled', false);
          }
        });
      }
    }

    if (!this.fixedNodeKey && this.cyInstance) {
      const cyAny = this.cyInstance as unknown as {
        animate?: (props: Record<string, unknown>, opts?: Record<string, unknown>) => void;
        stop: () => void;
      };
      if (typeof cyAny.animate === 'function') {
        cyAny.stop();
        cyAny.animate({ fit: { padding: 50 } }, { duration: 500, easing: 'ease-in-out', queue: false });
      }
    }

    // Phase I.21: zentriere/animiere zur Pinned-Position damit der User
    // visuell folgen kann wenn ein Pin von extern kommt (Rail-Click).
    if (this.fixedNodeKey && this.cyInstance) {
      const cyAny = this.cyInstance as unknown as {
        animate: (props: Record<string, unknown>, opts?: Record<string, unknown>) => void;
        zoom: () => number;
        stop: () => void;
        $: (s: string) => CyAnimNode;
      };
      const target = cyAny.$('node[id = "' + this.fixedNodeKey + '"]');
      if (target && (target.length ?? 0) > 0 && typeof cyAny.animate === 'function') {
        let targetZoom = typeof cyAny.zoom === 'function' ? cyAny.zoom() : 1;
        let R = 0;
        let neighborsCount = 0;
        let neighbors: CyAnimCollection | null = null;
        let cyW = 800;
        let cyH = 600;

        const cyAnyCast = cyAny as unknown as { width?: () => number; height?: () => number };
        if (typeof cyAnyCast.width === 'function') {
          cyW = cyAnyCast.width();
          cyH = cyAnyCast.height!();
        }

        if (typeof target.neighborhood === 'function') {
          neighbors = target.neighborhood('node').filter((n: CyAnimNode) => !n.hasClass('cluster-parent'));
          if (typeof neighbors.toArray === 'function') {
            neighborsCount = neighbors.toArray().length;

            if (neighborsCount > 0) {
              const cp = (target.scratch('originalPos') as { x: number; y: number }) || target.position();
              let maxDist = 0;
              neighbors.toArray().forEach((n: CyAnimNode) => {
                const p = (n.scratch('originalPos') as { x: number; y: number }) || n.position();
                const d = Math.hypot(p.x - cp.x, p.y - cp.y);
                if (d > maxDist) maxDist = d;
              });

              // The user requested that nodes are not pushed further out than the original bounding box.
              // So R is capped at maxDist. But we keep a sensible minimum.
              R = Math.max(80, Math.min(maxDist, neighborsCount * 25));

              // We want the target in the center. The farthest node is `maxDist` away.
              // To fit `maxDist` + padding within the viewport from the center:
              const pad = 120; // Padding for labels
              const requiredZoomX = cyW / 2 / (maxDist + pad);
              const requiredZoomY = cyH / 2 / (maxDist + pad);
              const requiredZoom = Math.min(requiredZoomX, requiredZoomY);

              // Cap the zoom so it doesn't zoom in uncomfortably close
              targetZoom = Math.min(requiredZoom, 1.2);
            }
          }
        }

        // Apply zoom-compensated font sizes based on the *target* zoom
        // so that after camera animation, the labels are readable.
        // We use 16px for target and 14px for neighbors to make them "schön groß lesbar".
        const targetFontPx = Math.max(16, Math.round(16 / Math.max(0.05, targetZoom)));
        const neighborFontPx = Math.max(14, Math.round(14 / Math.max(0.05, targetZoom)));

        (target as unknown as { style: (p: string, v: string) => void }).style('font-size', targetFontPx + 'px');
        if (neighborsCount > 0 && neighbors) {
          (neighbors as unknown as { style: (p: string, v: string) => void }).style('font-size', neighborFontPx + 'px');
        }

        const cpFinal = (target.scratch('originalPos') as { x: number; y: number }) || target.position();
        const panX = cyW / 2 - cpFinal.x * targetZoom;
        const panY = cyH / 2 - cpFinal.y * targetZoom;

        cyAny.stop();
        cyAny.animate(
          { pan: { x: panX, y: panY }, zoom: targetZoom },
          { duration: 350, easing: 'ease-in-out', queue: false },
        );

        // Phase I.32: Animate neighbors into a circle
        // Phase I.37 (2026-05-15): Stagger-Delay revertiert. User-Feedback:
        // hat die kreisrunde Anordnung visuell gebrochen. Möglicherweise
        // delay + queue:false in Cytoscape race-condition mit dem stop().
        // Zurück zu all-at-once — robuster, sieht schon gut aus.
        if (this.enableCircularLayout && R > 0 && neighborsCount > 0 && neighbors) {
          const nArr = neighbors.toArray();
          const N = nArr.length;
          const cp = (target.scratch('originalPos') as { x: number; y: number }) || target.position();
          nArr.forEach((n: CyAnimNode, i: number) => {
            const angle = (i / N) * 2 * Math.PI;
            const nx = cp.x + R * Math.cos(angle);
            const ny = cp.y + R * Math.sin(angle);
            n.scratch('isCircled', true);
            n.stop();
            n.animate({ position: { x: nx, y: ny } }, { duration: 350, easing: 'ease-out', queue: false });
          });
        }
      }
    }
    // Phase I.21: wenn Tabellen-Ansicht aktiv ist, scroll zur pinned-Row
    // damit der User auch in der Tabellen-Sicht den aktuellen Pin sieht
    // (kommt vom Rail-Click oder Suggestion-Select).
    if (this.fixedNodeKey && this.showTable && isPlatformBrowser(this.platformId)) {
      // setTimeout damit Angular's CD den is-pinned Class-Bind erst rendert,
      // dann scrollen wir zur sichtbaren Position.
      setTimeout(() => {
        const safeKey = this.fixedNodeKey?.replace(/"/g, '\\"');
        if (!safeKey) return;
        const row = document.querySelector('tr[data-row-key="' + safeKey + '"]');
        if (row && (row as HTMLElement).scrollIntoView) {
          (row as HTMLElement).scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
        }
      }, 50);
    }
  }

  /** Apply `.matched` / `.dim` classes based on current `searchTerm`. */
  private applySearchClasses(): void {
    const cy = this.cyInstance;
    if (!cy) return;
    const term = (this.searchTerm || '').trim().toLowerCase();
    let count = 0;
    cy.batch(() => {
      const allNodes = cy.nodes();
      allNodes.removeClass('matched');
      allNodes.removeClass('dim');
      if (term.length === 0) {
        this.matchCount = 0;
        return;
      }
      if (allNodes.forEach) {
        allNodes.forEach((n: CyNode) => {
          const label = (n.data('label') || '').toLowerCase();
          if (label.includes(term)) {
            n.addClass('matched');
            count++;
          } else {
            n.addClass('dim');
          }
        });
      }
      this.matchCount = count;
    });
    this.cdr.markForCheck();
  }

  private buildStyles(): unknown[] {
    return [
      // Compound-Parents für Type-Clustering — unsichtbar (User-Wunsch 2026-05-14
      // "die boxen brauchts gar nicht"). Layout-Effekt bleibt (fcose nutzt die
      // Compound-Hierarchie für Positionierung), Visual ist nur die Type-Color
      // der Children + Edge-Differenzierung (intra-cluster sichtbar, inter-cluster
      // blass) — Inseln-Eindruck entsteht daraus, nicht aus expliziten Zonen.
      {
        selector: 'node.cluster-parent',
        style: {
          'background-opacity': 0,
          'background-color': '#000000',
          'border-width': 0,
          'border-opacity': 0,
          'border-color': '#000000',
          shape: 'rectangle',
          'overlay-opacity': 0,
          'underlay-opacity': 0,
          label: '',
          padding: 30,
          'compound-sizing-wrt-labels': 'exclude',
          events: 'no',
        },
      },
      {
        selector: 'node',
        style: {
          'background-color': (n: { data: (k: string) => string }) =>
            TYPE_COLOURS[n.data('type') as OntologyNodeType] ?? '#888',
          // Labels OFF by default
          label: '',
          'font-size': 10,
          'font-family': 'Inter, system-ui, sans-serif',
          // Phase I.4 (2026-05-14): theme-aware label colors. Dark-theme bekommt
          // hellen Text + dunkles Outline, Light-theme umgekehrt. isDarkTheme
          // wird einmal beim Render gecaptured (Theme-Switch braucht ohnehin
          // einen Re-Render der Karte).
          color: this.isDarkTheme() ? '#f1f5f9' : '#1f2937',
          'text-outline-color': this.isDarkTheme() ? '#0f172a' : '#ffffff',
          'text-outline-width': 2.5,
          'text-valign': 'bottom',
          'text-margin-y': 4,
          'text-wrap': 'wrap',
          'text-max-width': 110,
          // Phase I.36 (2026-05-15): Aggressivere Size-by-Degree-Range.
          // Vorherige 8-14 war zu wenig sichtbar (Δ nur 6 Pixel über alle
          // Degree). Jetzt 6-18: Blatt-Knoten (degree 0-1) sind 6-6.8px,
          // Hubs (degree 15+) ab 12px aufwärts bis 18px. Die Spread macht
          // Hubs sofort identifizierbar. mapData bleibt statischer Mapper,
          // keine Per-Frame-Costs.
          width: 'mapData(degree, 0, 30, 6, 18)' as unknown as number,
          height: 'mapData(degree, 0, 30, 6, 18)' as unknown as number,
          'border-width': 0.5,
          'border-color': 'rgba(255,255,255,0.4)',
          // Type-tinted, slightly translucent so density doesn't read as a solid blob
          opacity: 0.72,
          'z-index': (n: { position: (p: string) => number }) => Math.round(10000 - n.position('y')),
          'z-index-compare': 'manual',
        },
      },
      // Focus + Focus-Neighbors: labels permanently visible
      {
        selector: 'node.focus, node.focus-neighbor',
        style: {
          label: 'data(label)',
          opacity: 1,
        },
      },
      {
        selector: 'node.focus',
        style: {
          width: 24,
          height: 24,
          'border-width': 3,
          'border-color': '#0f172a',
          'font-weight': 700,
          'font-size': 13,
          'z-index': (n: { position: (p: string) => number }) => Math.round(20000 - n.position('y')),
        },
      },
      {
        selector: 'node.focus-neighbor',
        style: {
          width: 14,
          height: 14,
          'border-width': 1.2,
          'font-size': 10,
          'z-index': (n: { position: (p: string) => number }) => Math.round(15000 - n.position('y')),
        },
      },
      // Hovered node — Phase I.15 REDO (2026-05-14):
      // (1) Vorherige Iteration setzte font-size:14 — das wirkt aber unlesbar
      //     weil Cytoscape font-size in MODEL units rendert und bei zoom=0.5
      //     auf 7 effektive Bildschirm-Pixel schrumpft. Daher: zoom-kompensierte
      //     inline-font-size im mouseover-handler (s.o.).
      // (2) `.hovered` gilt für alle 1-hop-Neighbors (nicht nur center). Damit
      //     der direkt-gehoverte Knoten optisch dominiert, gibt es zusätzlich
      //     `.hovered-center` (s.u.) das nur auf den Center angewandt wird.
      {
        // Pin-Highlight: 1-hop neighborhood of the pinned node. Same look as
        // `.hovered` but driven by pin-state — persists when the mouse moves
        // away. The pinned node itself also gets this class (closedNeighborhood
        // includes the center) but `node.pinned` has higher z-index and
        // overrides border/size.
        selector: 'node.hovered, node.pinned-neighbor',
        style: {
          label: 'data(label)',
          width: 14,
          height: 14,
          'border-width': 1.5,
          'border-color': '#f59e0b',
          'font-weight': 600,
          // font-size wird per Inline-Style im mouseover-handler überschrieben
          // (zoom-kompensiert). 11 ist der Fallback wenn der Handler nicht
          // greift; auch der "Ruhe-Wert" zwischen Hover-Events.
          'font-size': 11,
          'text-opacity': 1,
          color: this.isDarkTheme() ? '#ffffff' : '#0f172a',
          'text-outline-color': this.isDarkTheme() ? '#0f172a' : '#ffffff',
          'text-outline-width': 2,
          'text-background-color': this.isDarkTheme() ? '#1e293b' : '#ffffff',
          'text-background-opacity': 0.9,
          'text-background-padding': '4',
          'text-background-shape': 'round-rectangle',
          'text-border-color': this.isDarkTheme() ? '#475569' : '#cbd5e1',
          'text-border-width': 1,
          'text-border-opacity': 0.8,
          'text-max-width': 220,
          opacity: 1,
          'z-index': (n: { position: (p: string) => number }) => Math.round(30000 - n.position('y')),
          'z-index-compare': 'manual',
        },
      },
      // Phase I.33 (2026-05-15): Pin-Mode Label-Density-Fix.
      // Vorgeschichte: Erster Versuch entfernte `label` aus der joint-Regel
      // komplett — Nachbar-Labels verschwanden, die "leere" Mitte wurde
      // perzeptiv als "viel zu weit verteilt" wahrgenommen (obwohl die
      // Knoten-Positionen identisch blieben). Aktueller Ansatz:
      // (1) Pinned-Nachbar-Labels bleiben sichtbar — keine wahrgenommene
      //     Spread-Regression (Labels füllen den Raum visuell aus)
      // (2) Aber 35% Text-Opacity → individuelle Labels überlappen weniger
      //     stark, der gepinnte Knoten dominiert klar
      // (3) Auf Hover → `.hovered`-Regel weiter unten setzt Opacity zurück
      //     auf 1.0 → der gehoverte Nachbar springt sofort ins Auge
      {
        selector: 'node.pinned-neighbor',
        style: {
          // 0.65 statt 0.35 — bei 0.35 wirkten Labels "ausgegraut".
          // 0.65 ist dim-aber-klar-lesbar, der gepinnte Knoten (1.0)
          // dominiert weiterhin.
          'text-opacity': 0.65,
          'text-background-opacity': 0.7,
        },
      },
      // Wenn `.hovered` aktiv (free-hover-Modus, oder im Pin-Modus für den
      // einzelnen gehoverten Nachbar via mouseover-Handler), volle Opacity
      // — übersteuert die `.pinned-neighbor`-Dimmung darüber.
      {
        selector: 'node.hovered',
        style: {
          'text-opacity': 1,
          'text-background-opacity': 0.9,
        },
      },
      // Center des Hovers: prominenter als die Nachbarn (`.hovered-center`
      // wird zusätzlich zu `.hovered` auf den direkt-gehoverten Knoten gesetzt,
      // s. mouseover-Handler). Größer + dickerer Border + bold + opaker
      // Background damit das Center-Label visuell dominiert.
      {
        selector: 'node.hovered.hovered-center',
        style: {
          width: 22,
          height: 22,
          'border-width': 2.5,
          'font-weight': 700,
          // font-size wird per Inline-Style im mouseover-handler überschrieben
          // (zoom-kompensiert). 14 ist der Fallback.
          'font-size': 14,
          'text-background-opacity': 0.98,
          'text-background-padding': '6',
          'text-outline-width': 3,
          'z-index': (n: { position: (p: string) => number }) => Math.round(40000 - n.position('y')),
        },
      },
      // Phase I.3 (2026-05-14): Pinned-Node (Split-View Active-State).
      // Phase I.21 (2026-05-14): Visuell deutlich aufgewertet — pinned Knoten
      // muss klar als "der ist's gerade" erkennbar sein, besonders wenn er
      // via Rail-Click aus dem Detail-Pane gesetzt wurde. Großer Ring +
      // Label-Background + High z-index. font-size wird via Inline-Style
      // im applyPinClass-Handler zoom-kompensiert.
      {
        selector: 'node.pinned',
        style: {
          label: 'data(label)',
          width: 26,
          height: 26,
          'border-width': 4,
          'border-color': '#f59e0b',
          'border-opacity': 1,
          // Phase I.35 (2026-05-15): Amber-Glow um den Pinned-Knoten —
          // Cytoscape-natives shadow-rendering, nur EIN Knoten betroffen,
          // keine messbare Perf-Last. Verstärkt visuell "der ist's".
          'shadow-blur': 24,
          'shadow-color': '#f59e0b',
          'shadow-opacity': 0.7,
          'shadow-offset-x': 0,
          'shadow-offset-y': 0,
          'font-weight': 700,
          // font-size wird per Inline-Style im applyPinClass-Handler
          // überschrieben (zoom-kompensiert). 14 ist der Fallback.
          'font-size': 14,
          'text-opacity': 1,
          color: this.isDarkTheme() ? '#ffffff' : '#0f172a',
          'text-outline-color': this.isDarkTheme() ? '#0f172a' : '#ffffff',
          'text-outline-width': 3,
          'text-background-color': this.isDarkTheme() ? '#1e293b' : '#ffffff',
          'text-background-opacity': 0.98,
          'text-background-padding': '6',
          'text-background-shape': 'round-rectangle',
          'text-border-color': '#f59e0b',
          'text-border-width': 1.5,
          'text-border-opacity': 1,
          'text-max-width': 220,
          opacity: 1,
          'z-index': (n: { position: (p: string) => number }) => Math.round(50000 - n.position('y')),
          'z-index-compare': 'manual',
        },
      },
      // Search match — slightly larger, amber-ringed, labeled
      {
        selector: 'node.matched',
        style: {
          label: 'data(label)',
          width: 18,
          height: 18,
          'border-width': 2.5,
          'border-color': '#f59e0b',
          'font-weight': 700,
          opacity: 1,
          'z-index': (n: { position: (p: string) => number }) => Math.round(25000 - n.position('y')),
        },
      },
      // Search dim — heavy fade so matches pop
      {
        selector: 'node.dim',
        style: {
          opacity: 0.1,
        },
      },
      // Faded — non-neighborhood during hover. Phase I.8: 0.06 -> 0.12,
      // gerade noch sichtbar als Kontext, aber dezent genug damit der
      // hovered-Cluster optisch dominiert.
      {
        selector: 'node.faded',
        style: {
          opacity: 0.12,
          label: '',
        },
      },
      {
        selector: 'edge',
        style: {
          width: 0.7,
          'line-color': '#94a3b8',
          'curve-style': 'haystack',
          // Phase I.37 (2026-05-15): haystack-radius 0 → 8. Gibt den
          // Edges einen sanften organischen Bogen statt strikt gerade
          // Linien. haystack ist der billigste Curve-Style in Cytoscape,
          // der Radius ist nur ein Render-Parameter — keine zusätzliche
          // Geometrie-Berechnung.
          'haystack-radius': 8,
          'target-arrow-shape': 'none',
          'source-arrow-shape': 'none',
          opacity: 0.18,
          'z-index': 5,
          'z-index-compare': 'manual',
        },
      },
      // Phase I.2 (2026-05-14): intra-cluster edges (gleicher Typ beider Endpunkte)
      // werden sichtbarer gerendert, inter-cluster edges sehr blass — Typ-Inseln
      // werden visuell dominant statt durch Edge-Spaghetti zugedeckt.
      // Phase I.37 (2026-05-15): Opacity-Bump (0.35 → 0.45) damit die
      // Cluster-Struktur deutlicher lesbar wird.
      {
        selector: 'edge.intra-cluster',
        style: {
          opacity: 0.45,
          width: 0.9,
        },
      },
      // Phase I.37 (2026-05-15): Type-spezifische Edge-Färbung. Jede
      // intra-cluster Edge bekommt ihre Type-Farbe (statt neutralem Grau).
      // Reine statische Selektoren → zero Per-Frame-Cost. Jeder Cluster
      // erhält einen farbigen Edge-Dunst → Inseln werden visuell viel
      // klarer auseinanderhaltbar.
      {
        selector: 'edge.cluster-article',
        style: { 'line-color': '#f59e0b' },
      },
      {
        selector: 'edge.cluster-demo',
        style: { 'line-color': '#22c55e' },
      },
      {
        selector: 'edge.cluster-glossary',
        style: { 'line-color': '#ec4899' },
      },
      {
        selector: 'edge.cluster-timeline',
        style: { 'line-color': '#3b82f6' },
      },
      {
        selector: 'edge.cluster-source',
        style: { 'line-color': '#10b981' },
      },
      {
        selector: 'edge.inter-cluster',
        style: {
          opacity: 0.08,
          width: 0.5,
        },
      },
      // Edges touching focus → emphasized
      {
        selector:
          'edge[source = "' +
          (this.focusKey || '__no_focus__') +
          '"], edge[target = "' +
          (this.focusKey || '__no_focus__') +
          '"]',
        style: {
          'line-color': '#475569',
          width: 1.4,
          opacity: 0.7,
        },
      },
      {
        selector: 'edge.hovered, edge.pinned-neighbor',
        style: {
          'line-color': '#f59e0b',
          width: 1.8,
          opacity: 1,
          // Phase I.35 (2026-05-15): Amber-Glow auch entlang der Edges zum
          // Pinned-Knoten. Bei ~30-50 pinned-neighbor-Edges noch im
          // GPU-Budget. Verstärkt das "alles strahlt zum Pin"-Gefühl.
          'shadow-blur': 10,
          'shadow-color': '#f59e0b',
          'shadow-opacity': 0.5,
          'z-index': 25,
          'z-index-compare': 'manual',
        },
      },
      {
        selector: 'edge.dim',
        style: {
          opacity: 0.05,
        },
      },
      {
        selector: 'edge.faded',
        style: {
          opacity: 0.03,
        },
      },
    ];
  }

  private buildLayoutOptions(
    isLarge: boolean,
    positions: Map<string, { x: number; y: number }> | null = null,
  ): Record<string, unknown> {
    // Pre-computed `preset` layout — instant placement, no fcose run. The
    // positions Map is keyed by '<type>:<id>'; cluster-parent compound nodes
    // are absent and get auto-positioned around their children (Cytoscape
    // computes a bounding-box parent automatically). Filtered subgraphs
    // simply skip the absent positions — Cytoscape places those nodes at
    // (0,0), which only happens for newly-added nodes between layout runs.
    if (positions && positions.size > 0) {
      return {
        name: 'preset',
        positions: (node: { id: () => string }) => {
          const p = positions.get(node.id());
          return p ?? { x: 0, y: 0 };
        },
        // Let cytoscape natively fit the precomputed layout
        fit: true,
        padding: 25,
        animate: false,
      };
    }

    const reduced =
      isPlatformBrowser(this.platformId) &&
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Phase I.1b (2026-05-14): 'proof'+4000-iter ist Offline-Quality, blockt
    // Main-Thread ~20-30s bei 600 Nodes. 'default'+2500 = fcose-Default,
    // ~700ms blockierend. Spread-Parameter (nodeRepulsion, idealEdgeLength)
    // bleiben aggressiv — die kosten keine extra Compute-Zeit.
    // Phase I.2 (2026-05-14): Type-Clustering wird in renderCy() via
    // Compound-Nodes umgesetzt (unsichtbare Parent-Nodes pro Typ). fcose
    // erkennt Compounds automatisch und gruppiert Children. Keine Layout-
    // Parameter-Änderung nötig.
    return {
      name: 'fcose',
      quality: this.fullGraph ? 'default' : isLarge ? 'draft' : 'default',
      animate: !reduced && !isLarge,
      animationDuration: 500,
      randomize: true,
      // Phase I.20 (2026-05-14): mehr Spread + weniger Padding damit der Graph
      // den Canvas-Bereich besser ausnutzt. Aktuelle Initial-Geometrie hat
      // den Graph in vertikal-orientierter Bbox 897×1030 (taller than wide),
      // beim Fit in den 830×600 Container war's vertikal limitiert →
      // horizontal nur 54% des Containers genutzt. Höhere nodeRepulsion +
      // niedrigere gravity zieht Knoten weiter horizontal auseinander.
      nodeRepulsion: this.fullGraph ? 35000 : 7000,
      idealEdgeLength: this.fullGraph ? 200 : 130,
      edgeElasticity: 0.35,
      gravity: this.fullGraph ? 0.05 : 0.3,
      gravityRange: 4.5,
      tile: false,
      packComponents: true,
      fit: true,
      // Phase I.20 (2026-05-14): padding 40 → 5 damit beim final-fit der
      // Graph näher an die Canvas-Ränder rückt und mehr sichtbare Fläche
      // nutzt.
      padding: 5,
      nodeSeparation: 90,
      numIter: this.fullGraph ? 2500 : isLarge ? 1500 : 2500,
    };
  }

  private disposeCy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.cyInstance) {
      try {
        this.cyInstance.destroy();
      } catch {
        /* ignore */
      }
      this.cyInstance = null;
    }
  }

  private emitNode(ref: OntologyNodeRef): void {
    this.nodeSelected.emit(ref);
    if (!this.navigateOnClick) return;
    const info = this.displayByKey.get(nodeKey(ref));
    if (!info?.route) return;
    this.router.navigate(info.route, {
      queryParams: info.queryParams,
      fragment: info.fragment,
    });
  }
}
