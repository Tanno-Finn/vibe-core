/**
 * FeedbackComponent spec — the /feedback page's contract: nothing may be stored
 * until every rule passes, the state machine has to reach `sent`, and the
 * delete-everything action has to actually empty the store (PRIV-005).
 *
 * Most cases drive the component's own API, which is the readable way to say
 * what a state means. One case deliberately goes through the DOM instead —
 * typing into the real inputs and submitting the real form — because every
 * API-level case here would stay green if the template bindings were deleted,
 * and something has to fail when they are.
 *
 * The page is rendered with the real FeedbackInboxService (latency 0) so the
 * test exercises the same validation the user meets, and with a stub
 * TranslationService so an assertion never depends on translated copy.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideOfflineHttp } from '../../testing/offline-http';
import { Subject } from 'rxjs';

import { TranslationService } from '../../services/translation.service';
import { FeedbackComponent } from './feedback.component';
import { FEEDBACK_SUBMIT_LATENCY_MS, FeedbackInboxService } from '../../services/feedback-inbox.service';

const STORAGE_KEY = 'vibecore.feedback.inbox.v1';

/** Returns the key itself, so an expectation never reads a translated string. */
class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage$ = () => 'en';
  get currentLanguage(): string {
    return 'en';
  }
  get currentIntlLocale(): string {
    return 'en';
  }
  translate(key: string): string {
    return key;
  }
}

/**
 * The page frame (app-article) mounts the cursor-glow directive, which reads
 * `window.matchMedia` in ngOnInit; the test environment has no such function.
 * Nothing here depends on its answer, so a permanently "no preference" stub is
 * enough to let the frame render.
 */
function stubMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('FeedbackComponent', () => {
  let fixture: ComponentFixture<FeedbackComponent>;
  let component: FeedbackComponent;
  let inbox: FeedbackInboxService;

  beforeEach(async () => {
    stubMatchMedia();
    localStorage.removeItem(STORAGE_KEY);

    await TestBed.configureTestingModule({
      imports: [FeedbackComponent],
      providers: [
        provideRouter([]),
        // Offline HttpClient: the glossary highlighting load stays pending instead of
        // failing against jsdom and logging after teardown.
        provideOfflineHttp(),
        // app-standard-container animates its expand/collapse; without an
        // animation provider its synthetic property throws NG05105.
        { provide: TranslationService, useClass: TranslationServiceStub },
        { provide: FEEDBACK_SUBMIT_LATENCY_MS, useValue: 0 },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    inbox = TestBed.inject(FeedbackInboxService);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem(STORAGE_KEY));

  /** Type into a real control and let ngModel hear about it. */
  function type(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /** Fill the form the way a user would leave it before pressing send. */
  function fillValidForm(): void {
    component.name.set('Alex');
    component.email.set('alex@example.org');
    component.category.set('bug');
    component.message.set('The timeline filter forgets my selection when I go back.');
    component.consent.set(true);
  }

  it('renders the form, not the success panel, on arrival', () => {
    expect(component.status()).toBe('idle');
    expect(fixture.nativeElement.querySelector('form.fb-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.fb-success')).toBeNull();
  });

  it('shows the empty-inbox text before anything has been submitted', () => {
    expect(fixture.nativeElement.querySelector('.fb-inbox__empty')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.fb-inbox__list')).toBeNull();
  });

  // The "storage stays silent until after the first render" contract is pinned
  // where it lives — feedback-inbox.service.spec.ts, "survives a reload". Asserting
  // it through the component would depend on whether TestBed happens to flush
  // afterNextRender, which is a property of the harness, not of this page.

  it('stays quiet about errors until a field is left or send is pressed', () => {
    component.email.set('not-an-address');
    fixture.detectChanges();
    expect(component.shows('emailInvalid')).toBe(false);

    component.touch('email');
    fixture.detectChanges();
    expect(component.shows('emailInvalid')).toBe(true);
  });

  it('refuses to send an incomplete form and shows every failing rule at once', async () => {
    component.message.set('too short');
    await component.submit();
    fixture.detectChanges();

    expect(component.status()).toBe('idle');
    expect(component.shows('messageTooShort')).toBe(true);
    expect(component.shows('consentRequired')).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('refuses to send when only the consent tick is missing', async () => {
    fillValidForm();
    component.consent.set(false);

    await component.submit();

    expect(component.status()).toBe('idle');
    expect(component.shows('consentRequired')).toBe(true);
    expect(inbox.entryCount()).toBe(0);
  });

  it('carries what the user typed into the store, through the real bindings', async () => {
    const el: HTMLElement = fixture.nativeElement;
    const name = el.querySelector('#fb-name') as HTMLInputElement;
    const message = el.querySelector('#fb-message') as HTMLTextAreaElement;
    const consent = el.querySelector('#fb-consent') as HTMLInputElement;

    type(name, 'Alex');
    type(message, 'The timeline filter forgets my selection when I go back.');
    consent.click();
    fixture.detectChanges();

    (el.querySelector('form.fb-form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();
    fixture.detectChanges();

    expect(inbox.entryCount()).toBe(1);
    expect(inbox.entries()[0].name).toBe('Alex');
    expect(inbox.entries()[0].message).toContain('timeline filter');
    expect(el.querySelector('.fb-success')).not.toBeNull();
  });

  it('sends a complete form, reaches the sent state and stores the message', async () => {
    fillValidForm();

    await component.submit();
    fixture.detectChanges();

    expect(component.status()).toBe('sent');
    expect(inbox.entryCount()).toBe(1);
    expect(inbox.entries()[0].category).toBe('bug');
    expect(fixture.nativeElement.querySelector('.fb-success')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('form.fb-form')).toBeNull();
  });

  it('announces the outcome as text in the live region', async () => {
    fillValidForm();
    await component.submit();
    fixture.detectChanges();

    const live = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
    expect(live.getAttribute('aria-live')).toBe('polite');
    expect(live.textContent?.trim()).toBe('feedback.page.successText');
  });

  it('goes back to an empty form when the user writes another message', async () => {
    fillValidForm();
    await component.submit();

    component.writeAnother();
    fixture.detectChanges();

    expect(component.status()).toBe('idle');
    expect(component.message()).toBe('');
    expect(component.consent()).toBe(false);
    expect(component.shows('consentRequired')).toBe(false);
    expect(fixture.nativeElement.querySelector('form.fb-form')).not.toBeNull();
  });

  it('renders the storage failure inline instead of pretending it went through', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    fillValidForm();

    await component.submit();
    setItem.mockRestore();
    fixture.detectChanges();

    expect(component.status()).toBe('error');
    expect(fixture.nativeElement.querySelector('.fb-success')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('feedback.page.error.storage');
  });

  it('deletes every stored message on demand (PRIV-005)', async () => {
    fillValidForm();
    await component.submit();
    expect(inbox.entryCount()).toBe(1);

    component.clearAll();
    fixture.detectChanges();

    expect(inbox.entryCount()).toBe(0);
    expect(component.confirmClear()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  describe('focus after a state swap', () => {
    // Every swap below destroys the element the user was standing on. If focus is
    // not handed on, it falls to <body> and a keyboard user loses their place.

    it('lands on the success heading after sending', async () => {
      fillValidForm();
      await component.submit();

      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.fb-success__title'));
    });

    it('lands on the name field when writing another message', async () => {
      fillValidForm();
      await component.submit();

      component.writeAnother();

      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#fb-name'));
    });

    it('lands on the confirm button when the delete is armed, and back again on cancel', async () => {
      fillValidForm();
      await component.submit();
      component.writeAnother();

      component.askToClear();
      const confirmBtn = fixture.nativeElement.querySelectorAll('.fb-inbox__actions button')[0];
      expect(document.activeElement).toBe(confirmBtn);

      component.cancelClear();
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.fb-inbox__actions button'));
    });

    it('lands on the empty-inbox note after deleting everything', async () => {
      fillValidForm();
      await component.submit();
      component.writeAnother();

      component.clearAll();

      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.fb-inbox__empty'));
    });
  });
});
