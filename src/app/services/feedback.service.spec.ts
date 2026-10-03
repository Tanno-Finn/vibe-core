import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { provideOfflineHttp } from '../testing/offline-http';
import { FeedbackService } from './feedback.service';
import { ThemeService } from './theme.service';
import { TranslationService } from './translation.service';

/**
 * A submission counts as sent only when the endpoint answers the contract's
 * `{ "success": true }` (docs/how-to/add-a-backend.md). Anything else on a 2xx
 * used to reach the dialog as a value — and the dialog showed "sent" for it.
 */
describe('FeedbackService submission result', () => {
  const endpoint = '/api/feedback';
  let service: FeedbackService;
  let controller: HttpTestingController;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        provideOfflineHttp(),
        provideRouter([]),
        { provide: TranslationService, useValue: { currentLanguage: 'en', translate: (key: string) => key } },
        { provide: ThemeService, useValue: { mode: () => 'light' } },
      ],
    });
    service = TestBed.inject(FeedbackService);
    // The kit ships without an endpoint; point the service at a test one.
    (service as unknown as { API_URL: string }).API_URL = endpoint;
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    vi.restoreAllMocks();
  });

  const send = () => firstValueFrom(service.sendFeedback({ type: 'idea', message: 'Hello', category: 'general' }));

  it('resolves true when the endpoint confirms success', async () => {
    const result = send();
    controller.expectOne(endpoint).flush({ success: true });
    await expect(result).resolves.toBe(true);
  });

  it.each([{ success: false }, {}, { success: 'yes' }, null])(
    'rejects a 2xx answer without success === true (%j)',
    async (body) => {
      const result = send();
      controller.expectOne(endpoint).flush(body);
      await expect(result).rejects.toThrow('feedback.error.rejected');
    },
  );

  it('still maps a 429 to the rate-limit error', async () => {
    const result = send();
    controller.expectOne(endpoint).flush(null, { status: 429, statusText: 'Too Many Requests' });
    await expect(result).rejects.toThrow('feedback.error.rateLimit');
  });
});
