import { bootstrapApplication } from '@angular/platform-browser';
import { appBrowserConfig } from './app/app.config.browser';
import { AppComponent } from './app/app.component';
import './app/shared/optimus-prebundle';

// Change detection (provideZoneChangeDetection) is configured in the shared
// appConfig, so the browser and the prerender renderer run the same scheduler.
// The console is deliberately left untouched in production: hydration (NG05xx)
// and runtime warnings must stay visible — they are how drift gets noticed.
bootstrapApplication(AppComponent, appBrowserConfig).catch((err) => {
  if (typeof console !== 'undefined') {
    console.error(err);
  }
});
