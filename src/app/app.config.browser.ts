import { ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';

// Browser-only config: hydration providers (incl. withIncrementalHydration)
// leben nun in appConfig (shared), damit der Server Main-Content fuer @defer
// (hydrate on ...) emittiert. Diese Datei bleibt als Extension-Point falls
// spaeter browser-only Provider hinzukommen.
export const appBrowserConfig: ApplicationConfig = appConfig;
