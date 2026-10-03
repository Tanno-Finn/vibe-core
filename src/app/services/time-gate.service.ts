/**
 * TimeGateService
 * Provides server-authoritative time for timed-release content.
 *
 * In production: Fetches server time once at app start, computes offset.
 * In development: Uses client time directly (no API call).
 * Fallback: If server unreachable, uses client time (degraded mode).
 */
import { Injectable, NgZone, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimeGateService {
  /** Offset in milliseconds: serverTime - clientTime */
  private offsetMs = 0;
  private initialized = false;
  private ngZone = inject(NgZone);

  /**
   * Initialize the service by fetching server time.
   * Should be called once at app startup.
   * In dev mode or if no endpoint configured, uses client time.
   *
   * Retry strategy: Try once, wait 2s, try once more. On failure, fall
   * back to client time per ADR-0015 ("Degraded-Mode"). The retry
   * eliminates transient-network false fallbacks that could otherwise
   * unlock or hide timed-release content incorrectly.
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const endpoint = environment.timeGateEndpoint;
    if (!endpoint) {
      this.initialized = true;
      return;
    }

    // Run outside Angular zone — server time fetching is invisible to Angular
    // rendering and must not block hydration stability (fetch + 2s retry timeout
    // would keep zone unstable for up to 8 seconds).
    this.ngZone.runOutsideAngular(() => {
      this.fetchAndSetOffset(endpoint);
    });
  }

  /**
   * Fetch server time with retry, running outside Angular zone.
   */
  private async fetchAndSetOffset(endpoint: string): Promise<void> {
    let offset = await this.fetchOffset(endpoint);
    if (offset === null) {
      // Wait 2s then retry once before giving up
      await new Promise((resolve) => setTimeout(resolve, 2000));
      offset = await this.fetchOffset(endpoint);
    }

    if (offset !== null) {
      this.offsetMs = offset;
    } else {
      console.warn(
        'TimeGateService: Server time unreachable after retry, falling back to client time (degraded mode).',
      );
    }

    this.initialized = true;
  }

  /**
   * Fetch server time once and compute offset.
   * Returns null on any failure (timeout, non-2xx, parse error).
   */
  private async fetchOffset(endpoint: string): Promise<number | null> {
    try {
      const clientBefore = Date.now();
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(3000) });
      const clientAfter = Date.now();

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const serverTimeMs = data.timestamp * 1000;
      const clientMidpoint = (clientBefore + clientAfter) / 2;
      return serverTimeMs - clientMidpoint;
    } catch {
      return null;
    }
  }

  /** Returns the corrected current time (server-authoritative). */
  now(): Date {
    return new Date(Date.now() + this.offsetMs);
  }

  /**
   * Check if a given publish date has been reached.
   * @param publishDate ISO date string (e.g. '2026-04-13') or undefined
   * @returns true if no publishDate set, or if current time >= publishDate
   */
  isPublished(publishDate?: string): boolean {
    if (!publishDate) return true;
    // Date-only ('YYYY-MM-DD') ⇒ local midnight. Full ISO timestamps
    // (e.g. '2026-05-31T18:00:00Z') are honored as-is for finer-grained
    // scheduling such as a Sunday-evening demo drop.
    const releaseDate = new Date(publishDate.includes('T') ? publishDate : publishDate + 'T00:00:00');
    return this.now() >= releaseDate;
  }

  /**
   * Check if a given ISO 8601 timestamp has been reached. Sibling to
   * `isPublished` for callers that already carry a full timestamp instead
   * of a plain date (notifications use `publishedAt: "2026-05-13T00:00:00Z"`).
   * Unparseable input is treated as "no gate" (returns true) — fail-open so
   * a corrupt entry stays visible rather than silently vanishing.
   */
  isPublishedAt(timestamp?: string): boolean {
    if (!timestamp) return true;
    const releaseDate = new Date(timestamp);
    if (Number.isNaN(releaseDate.getTime())) return true;
    return this.now() >= releaseDate;
  }
}
