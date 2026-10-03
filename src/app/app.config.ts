import {
  ApplicationConfig,
  ErrorHandler,
  Injectable,
  Injector,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { provideRouter, withPreloading, withInMemoryScrolling } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

import { routes } from './app.routes';
import { OptimizedPreloadingStrategy } from './utils/preloading-strategy';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';
import { ToastService } from './services/toast.service';
import { USER_DATA_PROVIDERS } from './models/user-data-provider';
import { UserProgressService } from './services/user-progress.service';
import { PlaygroundSettingsService } from './services/playground-settings.service';
import { HighlightingService } from './services/highlighting.service';
import { PrivacyConsentService } from './services/privacy-consent.service';
import { NotificationService } from './services/notification.service';
import { CatalogStateService } from './pages/catalog/catalog-state.service';
import { ALL_LANG_CODES } from '../config/seo-languages.config';
import { translateOr } from './utils/translate-or';

/**
 * Global error handler catches unhandled Angular exceptions so a single
 * component crash cannot take down the whole app with a white screen.
 * Logs to console with a [Global] tag and shows a user-visible toast.
 *
 * ChunkLoadError gets a dedicated message + reload action: this happens
 * when the user has stale HTML referencing chunk hashes that no longer
 * exist on the server (typical right after a deployment, or during the
 * moment a host swaps the old files for the new ones). A reload pulls fresh HTML +
 * matching chunks and resolves the error.
 *
 * Uses lazy Injector lookup for ToastService and TranslationService to avoid
 * circular DI (ErrorHandler is instantiated before most services). The toast
 * texts come from the `errors.app` strings; translateOr() falls back to English
 * when the translations are not loaded yet.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private injector = inject(Injector);

  handleError(error: unknown): void {
    console.error('[Global]', error);
    try {
      const toast = this.injector.get(ToastService);
      const t = (key: string, fallback: string) => translateOr(this.injector, key, fallback);
      if (isChunkLoadError(error)) {
        toast.showError(
          t('errors.app.newVersionTitle', 'New version available'),
          t('errors.app.newVersionDetail', 'The site has been updated. Please reload the page once.'),
          {
            duration: 0,
            action: {
              label: t('errors.app.reload', 'Reload'),
              command: () => this.injector.get(DOCUMENT).defaultView?.location.reload(),
            },
          },
        );
        return;
      }
      toast.showError(t('errors.app.unexpected', 'An unexpected error occurred.'));
    } catch {
      // ToastService not yet available during bootstrap — console.error above is sufficient
    }
  }
}

function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const e = error as { name?: string; message?: string };
  if (e.name === 'ChunkLoadError') return true;
  const msg = e.message || '';
  return /Loading chunk \S+ failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(
    msg,
  );
}

/**
 * Detect language prefix from the current URL path and return it as
 * APP_BASE_HREF. This lets Angular Router strip the prefix automatically
 * so all existing routerLinks work without any template changes.
 */
function resolveBaseHref(): string {
  if (typeof window === 'undefined') return '/'; // K2-Fix: SSR-Safe
  const path = window.location.pathname;
  for (const code of ALL_LANG_CODES) {
    if (path === `/${code}` || path.startsWith(`/${code}/`)) {
      // /de without trailing slash → /de/ (Angular requires trailing slash)
      if (path === `/${code}`) {
        window.history.replaceState({}, '', `/${code}/`);
      }
      return `/${code}/`;
    }
  }
  return '/'; // No prefix found → inline redirect script will handle it
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone-based change detection for the browser AND the prerender renderer.
    // It lives here, in the shared config, so both platforms run the same
    // scheduler: a zoneless prerender next to a zoned browser renders and
    // hydrates against different timing. Every component is OnPush now (lint
    // enforces it), so going zoneless is possible but a separate, tested change:
    // zone.js still drives the checks Optimus UI and a few timer callbacks expect.
    provideZoneChangeDetection(),
    // Client hydration for the prerendered pages (about 60 routes across the
    // language prefixes, from scripts/generate-prerender-routes.js). Incremental
    // hydration is off: under dev SSR (/de/sources, not prerendered) it blocked
    // the content-bundle fetch. Lazy rendering in /sources uses @defer (on
    // viewport) without a hydrate trigger.
    // The large content bundles stay out of the TransferState cache, or every
    // prerendered page would carry megabytes of serialized JSON. The regex has no
    // $ (URLs carry ?v=... query params) and no leading / (some URLs are relative,
    // "assets/..." rather than "/assets/..."). compiled-glossary is excluded too
    // (about 1 MB per language).
    // The i18n bundles DO go through the cache since they were split (core ~120 KB
    // per language plus the page's own chunks, scripts/build-i18n-bundles.ts):
    // the page's strings are embedded once in its HTML, so hydration no longer
    // downloads them a second time before the first route can activate.
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        filter: (req) => !/assets\/(data\/content|data\/core\/glossary\/compiled-glossary)\.[\w-]+\.json/.test(req.url),
      }),
      withNoIncrementalHydration(),
    ),
    // anchorScrolling lets `routerLink="/foo" fragment="bar"` actually scroll
    // to the element with id="bar" after navigation. Without it the fragment
    // sits in the URL but nothing happens.
    provideRouter(
      routes,
      withPreloading(OptimizedPreloadingStrategy),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: APP_BASE_HREF, useFactory: resolveBaseHref },
    provideOptimus({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.dark-theme',
          cssLayer: false, // Disable CSS layers to avoid conflicts
        },
      },
      ripple: true,
      inputVariant: 'outlined',
    }),
    // User-data export/import providers — each domain service owns its slice.
    // Order is informational; UserDataService applies privacy last regardless.
    { provide: USER_DATA_PROVIDERS, useExisting: UserProgressService, multi: true },
    { provide: USER_DATA_PROVIDERS, useExisting: HighlightingService, multi: true },
    { provide: USER_DATA_PROVIDERS, useExisting: PlaygroundSettingsService, multi: true },
    { provide: USER_DATA_PROVIDERS, useExisting: PrivacyConsentService, multi: true },
    // Notification read-state (lastSeenAt + readIds), so a backup carries it.
    // Which keys survive a deploy is decided by utils/storage-keys.ts, not here.
    { provide: USER_DATA_PROVIDERS, useExisting: NotificationService, multi: true },
    // Catalog favorites and comparison list — stored since the catalog
    // existed, carried by the export/import since it became a service.
    { provide: USER_DATA_PROVIDERS, useExisting: CatalogStateService, multi: true },
  ],
};
