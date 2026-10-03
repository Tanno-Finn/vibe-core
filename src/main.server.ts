import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appServerConfig } from './app/app.config.server';
import './app/shared/optimus-prebundle';

// Context must be forwarded so Angular's platformRef (NG0401 fix) reaches bootstrapApplication
export default function bootstrap(context: BootstrapContext) {
  return bootstrapApplication(AppComponent, appServerConfig, context);
}
