/**
 * CookieConsentComponent spec — five promises the banner makes:
 *  - it offers an analytics choice only when analytics can actually happen
 *    (an endpoint is configured), and never stores a consent otherwise;
 *  - it adds no heading to the page outline it floats over;
 *  - its settings dialog is a real modal: focus moves in on open, Tab cycles
 *    inside it (cdkTrapFocus), Escape closes it and hands focus back;
 *  - no learning progress is written before a "yes": the dialog's progress
 *    switch starts off, "accept all" saves the session's progress, "essential
 *    only" writes none and clears what was stored; a decision made on the
 *    settings page instead removes the banner at once;
 *  - after the first decision the dialog stays one click away: the footer's
 *    "Cookie settings" button reopens it, saving there changes or withdraws
 *    consent, and focus goes back to that button.
 *
 * TranslationService is stubbed to return the key; AnalyticsService is stubbed
 * so each test decides whether an endpoint "exists". jsdom has no layout, so
 * the CDK's visibility check is stubbed to "visible" — tabbability still
 * follows tabIndex and the disabled attribute.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InteractivityChecker } from '@angular/cdk/a11y';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';

import { TranslationService } from '../../services/translation.service';
import { CookieConsentComponent } from './cookie-consent.component';
import { AppFooterComponent } from './app-footer.component';
import { AnalyticsService } from '../../services/analytics.service';
import { CookieSettingsService } from '../../services/cookie-settings.service';
import { PrivacyConsentService } from '../../services/privacy-consent.service';
import { UserProgressService } from '../../services/user-progress.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage$ = () => 'en';
  get currentLanguage(): string {
    return 'en';
  }
  translate(key: string): string {
    return key;
  }
}

function render(analyticsConfigured: boolean): ComponentFixture<CookieConsentComponent> {
  TestBed.configureTestingModule({
    imports: [CookieConsentComponent],
    providers: [
      { provide: TranslationService, useClass: TranslationServiceStub },
      {
        provide: AnalyticsService,
        useValue: {
          isConfigured: analyticsConfigured,
          initialize: () => undefined,
          trackConsentDecision: () => undefined,
        },
      },
      {
        provide: InteractivityChecker,
        useValue: {
          isDisabled: (e: HTMLElement) => e.hasAttribute('disabled'),
          isVisible: () => true,
          isFocusable: (e: HTMLElement) => !e.hasAttribute('disabled') && e.tabIndex >= -1,
          isTabbable: (e: HTMLElement) => !e.hasAttribute('disabled') && e.tabIndex >= 0,
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(CookieConsentComponent);
  fixture.detectChanges();
  return fixture;
}

function openSettings(fixture: ComponentFixture<CookieConsentComponent>): HTMLElement {
  fixture.componentInstance.showCookieSettings.set(true);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('CookieConsentComponent', () => {
  beforeEach(() => localStorage.clear());

  it('shows the banner on a first visit without any heading element', () => {
    const el = render(false).nativeElement as HTMLElement;
    const banner = el.querySelector('.cookie-consent');
    expect(banner).not.toBeNull();
    expect(banner!.getAttribute('role')).toBe('region');
    expect(banner!.getAttribute('aria-label')).toBe('cookie.bannerLabel');
    expect(banner!.querySelectorAll('h1, h2, h3, h4, h5, h6').length).toBe(0);
  });

  it('gives the settings dialog one h2 title and no nested headings', () => {
    const el = openSettings(render(true));
    const dialog = el.querySelector('[role="dialog"]')!;
    expect([...dialog.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((h) => h.tagName)).toEqual(['H2']);
    expect(dialog.getAttribute('aria-labelledby')).toBe('cookie-settings-title');
  });

  it('hides the analytics toggle and its text when no endpoint is configured', () => {
    const el = openSettings(render(false));
    expect(el.querySelectorAll('fieldset.cookie-category').length).toBe(2);
    expect(el.textContent).not.toContain('cookie.analytics.title');
    expect(el.textContent).not.toContain('cookie.analytics.description');
  });

  it('shows the analytics toggle when an endpoint is configured', () => {
    const el = openSettings(render(true));
    expect(el.querySelectorAll('fieldset.cookie-category').length).toBe(3);
    expect(el.textContent).toContain('cookie.analytics.description');
  });

  it('does not store an analytics consent from "accept" when analytics cannot run', () => {
    const fixture = render(false);
    fixture.componentInstance.acceptAllCookies();

    const privacy = TestBed.inject(PrivacyConsentService);
    expect(privacy.getCookiePreferences()).toEqual({ essential: true, progress: true, analytics: false });
    expect(privacy.hasAnalyticsConsent()).toBe(false);
  });

  it('records the analytics consent from "accept" when analytics is configured', () => {
    const fixture = render(true);
    fixture.componentInstance.acceptAllCookies();

    expect(TestBed.inject(PrivacyConsentService).hasAnalyticsConsent()).toBe(true);
  });

  describe('progress consent', () => {
    it('starts the dialog with the progress switch off — a pre-ticked box is not consent', async () => {
      const fixture = render(false);
      const el = openSettings(fixture);
      // ngModel writes the checked state after a microtask.
      await fixture.whenStable();
      fixture.detectChanges();

      const progressSwitch = el.querySelector<HTMLInputElement>(
        'input[aria-describedby="progress-cookies-description"]',
      )!;
      expect(progressSwitch).not.toBeNull();
      expect(progressSwitch.checked).toBe(false);
      expect(fixture.componentInstance.cookiePreferences.progress).toBe(false);
    });

    it('saving the dialog untouched records a "no" to progress', () => {
      const fixture = render(false);
      openSettings(fixture);
      fixture.componentInstance.saveCookiePreferences();

      expect(TestBed.inject(PrivacyConsentService).hasProgressConsent()).toBe(false);
      expect(localStorage.getItem('user_progress')).toBeNull();
    });

    it('writes no progress before a decision, and saves the session’s progress on "accept all"', () => {
      const fixture = render(false);
      const progress = TestBed.inject(UserProgressService);
      progress.addCompletedQuiz('quiz-a');
      expect(localStorage.getItem('user_progress')).toBeNull();

      fixture.componentInstance.acceptAllCookies();

      expect(TestBed.inject(PrivacyConsentService).hasProgressConsent()).toBe(true);
      expect(JSON.parse(localStorage.getItem('user_progress')!).completedQuizzes).toEqual(['quiz-a']);
    });

    it('writes nothing on "essential only" and clears what was stored', () => {
      localStorage.setItem('user_progress', JSON.stringify({ completedQuizzes: ['old'] }));
      const fixture = render(false);
      const progress = TestBed.inject(UserProgressService);

      fixture.componentInstance.acceptEssentialCookies();
      progress.addCompletedQuiz('quiz-b');

      expect(TestBed.inject(PrivacyConsentService).hasProgressConsent()).toBe(false);
      expect(localStorage.getItem('user_progress')).toBeNull();
      expect(localStorage.getItem('disableProgressTracking')).toBeNull();
    });

    it('keeps the progress of a visitor who accepted earlier and shows no banner', () => {
      localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: false }));
      localStorage.setItem('user_progress', JSON.stringify({ completedQuizzes: ['quiz-a'] }));

      const el = render(false).nativeElement as HTMLElement;

      expect(el.querySelector('.cookie-consent')).toBeNull();
      expect(TestBed.inject(UserProgressService).getCurrentProgress().completedQuizzes).toEqual(['quiz-a']);
      expect(JSON.parse(localStorage.getItem('user_progress')!).completedQuizzes).toEqual(['quiz-a']);
    });

    it.each([true, false])(
      'hides the banner at once when the settings page records a decision (progress %s)',
      async (granted) => {
        const fixture = render(false);
        const el = fixture.nativeElement as HTMLElement;
        expect(el.querySelector('.cookie-consent')).not.toBeNull();

        // What the settings page's progress switch does.
        TestBed.inject(PrivacyConsentService).setProgressConsent(granted);
        fixture.detectChanges();

        expect(el.querySelector('.cookie-consent')).toBeNull();
        // A dialog opened afterwards starts from that decision.
        openSettings(fixture);
        await fixture.whenStable();
        fixture.detectChanges();
        const progressSwitch = el.querySelector<HTMLInputElement>(
          'input[aria-describedby="progress-cookies-description"]',
        )!;
        expect(progressSwitch.checked).toBe(granted);
      },
    );
  });

  describe('settings dialog focus handling', () => {
    afterEach(() => document.body.replaceChildren());

    async function openFromBanner(): Promise<{
      fixture: ComponentFixture<CookieConsentComponent>;
      trigger: HTMLElement;
    }> {
      const fixture = render(true);
      document.body.appendChild(fixture.nativeElement);
      const trigger = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.cookie-settings-btn')!;
      trigger.focus();
      trigger.click();
      fixture.detectChanges();
      await fixture.whenStable();
      return { fixture, trigger };
    }

    it('moves focus to the close button and arms a focus trap around the dialog', async () => {
      const { fixture } = await openFromBanner();
      const el = fixture.nativeElement as HTMLElement;
      const dialog = el.querySelector<HTMLElement>('[role="dialog"]')!;
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(document.activeElement).toBe(dialog.querySelector('.cookie-close-btn'));

      const anchors = [...el.querySelectorAll<HTMLElement>('.cdk-focus-trap-anchor')];
      expect(anchors.length).toBe(2);
      expect(anchors.every((a) => a.getAttribute('tabindex') === '0')).toBe(true);
      expect(anchors[0].nextElementSibling).toBe(dialog);
      expect(dialog.nextElementSibling).toBe(anchors[1]);
    });

    it('cycles Tab inside the dialog: past the last control to the first, before the first to the last', async () => {
      const { fixture } = await openFromBanner();
      const el = fixture.nativeElement as HTMLElement;
      const [start, end] = [...el.querySelectorAll<HTMLElement>('.cdk-focus-trap-anchor')];

      // Tab from the last control lands on the end anchor, which wraps to the first.
      end.focus();
      expect(document.activeElement).toBe(el.querySelector('.cookie-close-btn'));

      // Shift+Tab from the first control lands on the start anchor, which wraps to the last.
      start.focus();
      expect(document.activeElement).toBe(el.querySelector('.cookie-save-btn'));
    });

    it('closes on Escape and returns focus to the button that opened it', async () => {
      const { fixture, trigger } = await openFromBanner();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect((fixture.nativeElement as HTMLElement).querySelector('[role="dialog"]')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });

    it('hands focus back to a trigger outside the banner when saving', async () => {
      const fixture = render(true);
      document.body.appendChild(fixture.nativeElement);
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      outside.focus();
      TestBed.inject(CookieSettingsService).open();
      fixture.detectChanges();
      await fixture.whenStable();

      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.cookie-save-btn')!.click();
      fixture.detectChanges();

      expect(document.activeElement).toBe(outside);
    });

    it('sends focus to the main landmark when saving removes the banner the trigger sat in', async () => {
      const main = document.createElement('main');
      main.id = 'main-content';
      main.tabIndex = -1;
      document.body.appendChild(main);
      const { fixture } = await openFromBanner();

      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.cookie-save-btn')!.click();
      fixture.detectChanges();

      expect((fixture.nativeElement as HTMLElement).querySelector('.cookie-consent')).toBeNull();
      expect(document.activeElement).toBe(main);
    });
  });

  /**
   * GDPR Art. 7 (3): withdrawing consent must be as easy as giving it. After
   * the first decision the banner is gone, so the footer's "Cookie settings"
   * entry is the way back into the dialog — rendered here the way the app
   * shell renders them, side by side.
   */
  describe('reopened from the footer after a decision', () => {
    @Component({
      standalone: true,
      imports: [AppFooterComponent, CookieConsentComponent],
      template: `<app-footer></app-footer><app-cookie-consent></app-cookie-consent>`,
    })
    class ShellHost {}

    async function renderShell(analyticsConfigured: boolean): Promise<{
      fixture: ComponentFixture<ShellHost>;
      el: HTMLElement;
      footerButton: HTMLButtonElement;
    }> {
      TestBed.configureTestingModule({
        imports: [ShellHost],
        providers: [
          provideRouter([]),
          { provide: TranslationService, useClass: TranslationServiceStub },
          {
            provide: AnalyticsService,
            useValue: {
              isConfigured: analyticsConfigured,
              initialize: () => undefined,
              trackConsentDecision: () => undefined,
            },
          },
          {
            provide: InteractivityChecker,
            useValue: {
              isDisabled: (e: HTMLElement) => e.hasAttribute('disabled'),
              isVisible: () => true,
              isFocusable: (e: HTMLElement) => !e.hasAttribute('disabled') && e.tabIndex >= -1,
              isTabbable: (e: HTMLElement) => !e.hasAttribute('disabled') && e.tabIndex >= 0,
            },
          },
        ],
      });
      const fixture = TestBed.createComponent(ShellHost);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
      await fixture.whenStable();
      const el = fixture.nativeElement as HTMLElement;
      const footerButton = [...el.querySelectorAll<HTMLButtonElement>('app-footer button')].find(
        (b) => b.textContent?.trim() === 'app.footer.cookieSettings',
      )!;
      return { fixture, el, footerButton };
    }

    async function openFromFooter(fixture: ComponentFixture<ShellHost>, footerButton: HTMLButtonElement) {
      footerButton.focus();
      footerButton.click();
      fixture.detectChanges();
      // ngModel writes the switches' checked state after a microtask.
      await fixture.whenStable();
      fixture.detectChanges();
    }

    const progressSwitch = (el: HTMLElement) =>
      el.querySelector<HTMLInputElement>('input[aria-describedby="progress-cookies-description"]')!;

    beforeEach(() =>
      localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: true })),
    );
    afterEach(() => document.body.replaceChildren());

    it('offers a keyboard-reachable "Cookie settings" button in the footer while no banner is shown', async () => {
      const { el, footerButton } = await renderShell(true);

      expect(el.querySelector('.cookie-consent')).toBeNull();
      expect(footerButton).toBeDefined();
      expect(footerButton.getAttribute('type')).toBe('button');
      expect(footerButton.tabIndex).toBe(0);
      expect(footerButton.getAttribute('aria-haspopup')).toBe('dialog');
    });

    it('opens the dialog with the switches set to the stored decision, focus inside', async () => {
      const { fixture, el, footerButton } = await renderShell(true);
      await openFromFooter(fixture, footerButton);

      const dialog = el.querySelector<HTMLElement>('[role="dialog"]')!;
      expect(dialog).not.toBeNull();
      expect(document.activeElement).toBe(dialog.querySelector('.cookie-close-btn'));
      expect(progressSwitch(el).checked).toBe(true);
    });

    it('withdraws consent on save: nothing more is stored, and focus returns to the footer button', async () => {
      localStorage.setItem('user_progress', JSON.stringify({ completedQuizzes: ['quiz-a'] }));
      const { fixture, el, footerButton } = await renderShell(true);
      await openFromFooter(fixture, footerButton);

      progressSwitch(el).click();
      el.querySelector<HTMLInputElement>('input[aria-describedby="analytics-cookies-description"]')!.click();
      fixture.detectChanges();
      el.querySelector<HTMLElement>('.cookie-save-btn')!.click();
      fixture.detectChanges();

      const privacy = TestBed.inject(PrivacyConsentService);
      expect(privacy.hasProgressConsent()).toBe(false);
      expect(privacy.isProgressDeclined()).toBe(true);
      expect(privacy.hasAnalyticsConsent()).toBe(false);
      expect(localStorage.getItem('user_progress')).toBeNull();
      expect(el.querySelector('[role="dialog"]')).toBeNull();
      expect(document.activeElement).toBe(footerButton);
    });

    it('gives consent again the same way it was withdrawn', async () => {
      localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: false, analytics: false }));
      const { fixture, el, footerButton } = await renderShell(false);
      TestBed.inject(UserProgressService).addCompletedQuiz('quiz-b');
      await openFromFooter(fixture, footerButton);
      expect(progressSwitch(el).checked).toBe(false);

      progressSwitch(el).click();
      fixture.detectChanges();
      el.querySelector<HTMLElement>('.cookie-save-btn')!.click();
      fixture.detectChanges();

      expect(TestBed.inject(PrivacyConsentService).hasProgressConsent()).toBe(true);
      expect(JSON.parse(localStorage.getItem('user_progress')!).completedQuizzes).toEqual(['quiz-b']);
    });

    it('closes on Escape without changing the decision and returns focus to the footer button', async () => {
      const { fixture, el, footerButton } = await renderShell(true);
      await openFromFooter(fixture, footerButton);

      progressSwitch(el).click();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect(el.querySelector('[role="dialog"]')).toBeNull();
      expect(document.activeElement).toBe(footerButton);
      expect(TestBed.inject(PrivacyConsentService).hasProgressConsent()).toBe(true);
    });
  });
});
