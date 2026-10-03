/**
 * Test-only providers. Never imported by app code.
 *
 * A bare `TestBed.configureTestingModule({})` still resolves the root-provided
 * HttpClient, whose FetchBackend hands relative URLs ('assets/i18n/i18n.en.json')
 * to Node's fetch: every such request fails with "TypeError: Invalid URL", the
 * TranslationLoaderService logs it, and the HighlightingService may still be
 * walking its fallback chain after the fixture's injector is destroyed (NG0205).
 *
 * `provideOfflineHttp()` swaps in the HttpClient testing backend: requests stay
 * pending until a test flushes them through HttpTestingController, so a spec
 * that does not care about loaded data renders against translation keys, quietly.
 */
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

export function provideOfflineHttp(): (Provider | EnvironmentProviders)[] {
  return [provideHttpClient(), provideHttpClientTesting()];
}
