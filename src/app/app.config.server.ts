import { mergeApplicationConfig, ApplicationConfig, inject } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { APP_BASE_HREF } from '@angular/common';
import { INITIAL_CONFIG } from '@angular/platform-server';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ALL_LANG_CODES } from '../config/seo-languages.config';

/**
 * Derives APP_BASE_HREF from the URL currently being rendered (INITIAL_CONFIG).
 * Required so the router strips the language prefix correctly for each prerendered route.
 * Example: rendering /de/home → base href /de/ → router matches "home" route.
 */
function resolveServerBaseHref(): string {
  const config = inject(INITIAL_CONFIG, { optional: true }) as { url?: string } | null;
  if (config?.url) {
    try {
      const pathname = new URL(config.url).pathname;
      for (const code of ALL_LANG_CODES) {
        if (pathname === `/${code}` || pathname.startsWith(`/${code}/`)) {
          return `/${code}/`;
        }
      }
    } catch {
      // Malformed URL — fall through to default
    }
  }
  return '/';
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: APP_BASE_HREF, useFactory: resolveServerBaseHref },
  ],
};

export const appServerConfig = mergeApplicationConfig(appConfig, serverConfig);
