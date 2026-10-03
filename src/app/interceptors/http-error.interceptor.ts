import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { TimeoutError, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

import { ToastService } from '../services/toast.service';
import { translateOr } from '../utils/translate-or';

/**
 * Global HTTP error interceptor.
 *
 * Provides:
 *  - 10s timeout per request attempt (resets on retry)
 *  - 1 retry on 5xx server errors (with short backoff)
 *  - Error-Toast via ToastService for unrecoverable errors
 *
 * Interaction with the language fallback chains:
 *  - Content bundles (assets/data/content.<lang>.json): UnifiedContentService
 *    walks [requested -> base language -> de -> en].
 *  - i18n core bundles (assets/i18n/i18n.<lang>.json): TranslationLoaderService
 *    retries once, then falls back to the key-source language, then to an empty core.
 *  - i18n chunks (assets/i18n/chunks/<lang>/<id>.json): retried once, then the
 *    TranslationService walks the locale fallback chain.
 *  The interceptor still retries 5xx ONCE at the HTTP layer (benign - it just
 *  reduces transient failures), then passes the error through normally so the
 *  service's catchError can trigger the next step of its chain.
 *  However we SUPPRESS the user-visible toast for these URLs, because a
 *  language fallback is not a user-facing error condition. The match ignores a
 *  leading slash: the loaders request relative URLs ('assets/i18n/...').
 *
 * The toast texts are the `errors.http` strings. TranslationService is looked
 * up lazily, only when a toast is shown: it loads its own data over HttpClient,
 * so injecting it here eagerly would be circular.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const injector = inject(Injector);

  const isContentBundle = isFallbackBundleUrl(req.url);

  return next(req).pipe(
    timeout(10000),
    retry({
      count: 1,
      delay: (error) => {
        // Only retry on 5xx server errors. Pass everything else through immediately.
        if (error instanceof HttpErrorResponse && error.status >= 500 && error.status < 600) {
          return timer(500);
        }
        return throwError(() => error);
      },
    }),
    catchError((error) => {
      if (!isContentBundle) {
        showErrorToast(toastService, injector, error);
      }
      return throwError(() => error);
    }),
  );
};

/** URL prefixes whose failures a service-level language fallback chain handles. */
const FALLBACK_BUNDLE_PATHS = ['assets/data/content.', 'assets/i18n/i18n.', 'assets/i18n/chunks/'];

/** True for a content/i18n bundle URL, relative ('assets/...') or absolute ('/assets/...', 'https://host/assets/...'). */
export function isFallbackBundleUrl(url: string): boolean {
  return FALLBACK_BUNDLE_PATHS.some((path) => url.startsWith(path) || url.includes('/' + path));
}

function showErrorToast(toastService: ToastService, injector: Injector, error: unknown): void {
  const t = (key: string, fallback: string) => translateOr(injector, key, fallback);
  if (error instanceof TimeoutError) {
    toastService.showError(
      t('errors.http.timeoutTitle', 'Request timed out'),
      t('errors.http.timeoutDetail', 'The server did not answer in time. Please try again.'),
    );
    return;
  }

  if (error instanceof HttpErrorResponse) {
    // Status 0 usually means network/CORS failure
    if (error.status === 0) {
      toastService.showError(
        t('errors.http.offlineTitle', 'Connection error'),
        t('errors.http.offlineDetail', 'No connection to the server. Please check your internet connection.'),
      );
      return;
    }

    if (error.status >= 500) {
      toastService.showError(
        t('errors.http.serverTitle', 'Server error'),
        t('errors.http.serverDetail', 'The server reported an error ({status}). Please try again later.').replace(
          '{status}',
          String(error.status),
        ),
      );
      return;
    }

    if (error.status >= 400) {
      // 4xx errors are mostly expected (404 for missing resources etc.)
      // Only surface them silently in the console.
      console.warn('[HttpErrorInterceptor] Client error:', error.status, error.url);
      return;
    }
  }

  // Unknown error shape - keep silent to avoid spamming the user.
  console.warn('[HttpErrorInterceptor] Unknown error:', error);
}
