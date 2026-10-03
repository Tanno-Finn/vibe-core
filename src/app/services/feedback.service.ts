import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslationService } from './translation.service';
import { ThemeService } from './theme.service';
import { environment } from '../../environments/environment';

/**
 * Feedback types the endpoint accepts (a user-facing category maps onto one)
 */
export type FeedbackType = 'positive' | 'negative' | 'idea' | 'bug';

/**
 * User-facing feedback categories
 */
export type FeedbackCategory = 'general' | 'bug' | 'feature' | 'content' | 'praise' | 'accessibility';

/**
 * Metadata collected automatically with each feedback
 */
export interface FeedbackMetadata {
  pageUrl: string;
  pageTitle: string;
  language: string;
  theme: string;
  viewport: {
    width: number;
    height: number;
  };
  browser: string;
  timestamp: string;
  category?: string;
  rating?: number;
}

/**
 * Data structure for feedback submission
 */
export interface FeedbackData {
  type: FeedbackType;
  message?: string;
  email?: string;
  screenshot?: string;
  category?: FeedbackCategory;
  rating?: number;
}

/**
 * API request payload
 */
interface FeedbackPayload {
  type: FeedbackType;
  message?: string;
  email?: string;
  screenshot?: string;
  metadata: FeedbackMetadata;
  honeypot: string;
}

/**
 * Service for handling user feedback submissions.
 * Sends detailed feedback with an optional screenshot.
 * Includes spam protection and automatic metadata collection.
 */
/**
 * The endpoint contract (docs/how-to/add-a-backend.md) answers `{ "success": true }`.
 * A 2xx with anything else — `false`, a missing field, an HTML error page parsed
 * as JSON — is a failed submission, not a sent one: never show the success toast for it.
 */
function requireSuccess(response: { success?: unknown } | null): true {
  if (response?.success !== true) {
    console.error('Feedback API answered without success:', response);
    throw new Error('feedback.error.rejected');
  }
  return true;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);

  // API endpoint. Configured via environment.feedback.endpoint; an empty value
  // means "no backend" — the feedback FAB is not registered in that case (see
  // AppComponent), so no request is ever made in the default kit. Point the
  // environment field at your own URL to enable it. Request contract:
  // docs/how-to/add-a-backend.md ("Feedback endpoint").
  private readonly API_URL = environment.feedback?.endpoint ?? '';

  /**
   * Collect metadata about the current page and environment
   */
  collectMetadata(): FeedbackMetadata {
    const isBrowser = isPlatformBrowser(this.platformId);
    return {
      pageUrl: this.router.url,
      pageTitle: isBrowser ? document.title : '',
      language: this.translationService.currentLanguage,
      theme: this.themeService.mode(),
      viewport: {
        width: isBrowser ? window.innerWidth : 0,
        height: isBrowser ? window.innerHeight : 0,
      },
      browser: isBrowser ? this.getBrowserInfo() : 'SSR',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get browser and OS information from user agent
   * browser-only: its only caller checks isPlatformBrowser first.
   */
  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (ua.includes('Firefox')) {
      browser = 'Firefox';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
    } else if (ua.includes('Chrome')) {
      browser = 'Chrome';
    } else if (ua.includes('Safari')) {
      browser = 'Safari';
    }

    // Detect OS
    if (ua.includes('Windows')) {
      os = 'Windows';
    } else if (ua.includes('Mac')) {
      os = 'macOS';
    } else if (ua.includes('Linux')) {
      os = 'Linux';
    } else if (ua.includes('Android')) {
      os = 'Android';
    } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
      os = 'iOS';
    }

    return `${browser} / ${os}`;
  }

  /**
   * Map user-facing category to API-compatible FeedbackType
   */
  mapCategoryToType(category: FeedbackCategory): FeedbackType {
    const mapping: Record<FeedbackCategory, FeedbackType> = {
      general: 'idea',
      bug: 'bug',
      feature: 'idea',
      content: 'negative',
      praise: 'positive',
      accessibility: 'bug',
    };
    return mapping[category] ?? 'idea';
  }

  /**
   * Send detailed feedback with message and optional email/screenshot
   */
  sendFeedback(data: FeedbackData): Observable<boolean> {
    if (!this.API_URL) {
      return throwError(() => new Error('feedback.error.network'));
    }

    const metadata = this.collectMetadata();

    // Embed category/rating in metadata for backend
    if (data.category) {
      metadata.category = data.category;
    }
    if (data.rating && data.rating > 0) {
      metadata.rating = data.rating;
    }

    const payload: FeedbackPayload = {
      type: data.type,
      message: data.message,
      email: data.email,
      screenshot: data.screenshot,
      metadata,
      honeypot: '',
    };

    return this.http.post<{ success?: unknown }>(this.API_URL, payload).pipe(
      catchError(this.handleError),
      map((response) => requireSuccess(response)),
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Feedback API error:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      body: error.error,
    });

    let errorMessage = 'feedback.error.unknown';

    if (error.status === 429) {
      errorMessage = 'feedback.error.rateLimit';
    } else if (error.status >= 500) {
      errorMessage = 'feedback.error.server';
    } else if (error.status === 0) {
      errorMessage = 'feedback.error.network';
    }

    return throwError(() => new Error(errorMessage));
  }
}
