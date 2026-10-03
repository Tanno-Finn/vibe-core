import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ToastService } from '../services/toast.service';
import { TranslationService } from '../services/translation.service';
import { httpErrorInterceptor, isFallbackBundleUrl } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  describe('isFallbackBundleUrl', () => {
    it.each([
      'assets/i18n/i18n.en.json?v=1',
      'assets/i18n/chunks/de-easy/articleGitIntro.json?v=1',
      '/assets/i18n/i18n.de.json',
      '/assets/i18n/chunks/en/glossary.json',
      '/assets/data/content.de.json?v=1',
      'assets/data/content.en-easy.json',
      'https://example.org/assets/i18n/i18n.en.json',
    ])('treats %s as a bundle with its own fallback chain', (url) => {
      expect(isFallbackBundleUrl(url)).toBe(true);
    });

    it.each(['assets/data/roadmap.json', '/api/feedback', 'https://example.org/assets/img/logo.svg'])(
      'does not treat %s as a fallback bundle',
      (url) => {
        expect(isFallbackBundleUrl(url)).toBe(false);
      },
    );
  });

  describe('toasts', () => {
    let http: HttpClient;
    let controller: HttpTestingController;
    let showError: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      showError = vi.fn();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([httpErrorInterceptor])),
          provideHttpClientTesting(),
          { provide: ToastService, useValue: { showError } },
          // The toast path resolves TranslationService lazily; the real one would load its bundle.
          { provide: TranslationService, useValue: { translate: (key: string) => key } },
        ],
      });
      http = TestBed.inject(HttpClient);
      controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => controller.verify());

    const failWithNetworkError = (url: string) => {
      http.get(url).subscribe({ error: () => undefined });
      controller.expectOne(url).error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    };

    it.each([
      'assets/i18n/i18n.en.json?v=1',
      'assets/i18n/chunks/en/articleGitIntro.json?v=1',
      '/assets/data/content.de.json?v=1',
    ])('stays silent when the relative bundle URL %s fails', (url) => {
      failWithNetworkError(url);
      expect(showError).not.toHaveBeenCalled();
    });

    it('shows a toast when any other request fails', () => {
      failWithNetworkError('assets/data/roadmap.json');
      expect(showError).toHaveBeenCalledTimes(1);
    });
  });
});
