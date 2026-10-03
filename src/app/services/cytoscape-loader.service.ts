/**
 * CytoscapeLoaderService
 *
 * Promise-cached lazy loader for `cytoscape` + the `fcose` layout extension.
 * Browser-only (returns `null` under SSR). Resolves to the cytoscape default
 * export ready for `cytoscape({ container, elements, layout, style })`.
 *
 * Design: an internal design note.
 */
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** The cytoscape default-export call signature, narrowed to what we need. */
export type CytoscapeFactory = (options: Record<string, unknown>) => unknown;

@Injectable({ providedIn: 'root' })
export class CytoscapeLoaderService {
  private platformId = inject(PLATFORM_ID);
  private cachedPromise: Promise<CytoscapeFactory | null> | null = null;

  /**
   * Load cytoscape + register fcose once. Subsequent calls return the cached
   * promise — no duplicate network or evaluation cost. SSR returns null.
   */
  load(): Promise<CytoscapeFactory | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(null);
    }
    if (!this.cachedPromise) {
      this.cachedPromise = this.loadImpl();
    }
    return this.cachedPromise;
  }

  private async loadImpl(): Promise<CytoscapeFactory | null> {
    try {
      const [cytoscapeModule, fcoseModule] = await Promise.all([import('cytoscape'), import('cytoscape-fcose')]);
      const cytoscape = (cytoscapeModule as { default: CytoscapeFactory }).default;
      const fcose = (fcoseModule as { default: unknown }).default as (cy: unknown) => void;
      // Registering twice is harmless (cytoscape no-ops) but keep it simple
      (cytoscape as unknown as { use: (ext: unknown) => void }).use(fcose);
      return cytoscape;
    } catch (err) {
      console.warn('[CytoscapeLoader] failed to load cytoscape', err);
      return null;
    }
  }
}
