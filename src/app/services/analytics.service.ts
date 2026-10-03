/**
 * AnalyticsService — vibecore kit stub.
 *
 * The full portal ships a GDPR-compliant, cookieless analytics client that
 * posts anonymous signals to a PHP backend. That backend (and its client) was
 * intentionally excluded from the open-source kit export. This no-op stub keeps
 * the consent UI and bootstrap wiring compiling and running without emitting
 * any telemetry. Wire it to your own endpoint (see environment.analyticsEndpoint)
 * to enable analytics.
 */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  /**
   * True only when an analytics endpoint is configured. While it is false there
   * is nothing to consent to, so the cookie banner hides its analytics toggle
   * rather than asking for a permission that would change nothing (PRIV-003:
   * off by default, and no pretend choice either).
   */
  readonly isConfigured: boolean = environment.analyticsEndpoint.trim() !== '';

  /** Called once during app bootstrap. No-op in the kit. */
  initialize(): void {
    /* no-op — no analytics backend in the kit */
  }

  /** Records the user's analytics-consent decision. No-op in the kit. */
  trackConsentDecision(_consented: boolean): void {
    /* no-op — no analytics backend in the kit */
  }
}
