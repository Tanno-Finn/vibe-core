/**
 * UserSettingsComponent spec — the progress switch is a consent decision and
 * has one source of truth with the cookie banner: `cookiePreferences.progress`.
 * The switch shows what that record says (off until the visitor agreed),
 * writes it, and saves or clears the progress accordingly. The page also
 * reopens the cookie settings dialog, and its switch follows a decision saved
 * there.
 *
 * Only the component class is under test: the template is replaced by an
 * empty one and every service the constructor touches for other sections is
 * stubbed. Consent and progress use the real services.
 */
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { UserSettingsComponent } from './user-settings.component';
import { TranslationService } from '../../services/translation.service';
import { FontService } from '../../services/font.service';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { HighlightingService } from '../../services/highlighting.service';
import { PrivacyConsentService } from '../../services/privacy-consent.service';
import { UserProgressService } from '../../services/user-progress.service';
import { CookieSettingsService } from '../../services/cookie-settings.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage$ = () => 'en';
  translate(key: string): string {
    return key;
  }
}

function create(): UserSettingsComponent {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [UserSettingsComponent],
    providers: [
      { provide: TranslationService, useClass: TranslationServiceStub },
      { provide: FontService, useValue: { preloadAll: () => undefined, current: () => 'system', options: [] } },
      { provide: ThemeService, useValue: {} },
      { provide: HighlightingService, useValue: { highlightingEnabled$: () => true } },
      {
        provide: ToastService,
        useValue: { showSuccess: () => '', showWarning: () => '', showError: () => '' },
      },
    ],
  });
  TestBed.overrideComponent(UserSettingsComponent, { set: { template: '', imports: [] } });
  return TestBed.createComponent(UserSettingsComponent).componentInstance;
}

describe('UserSettingsComponent progress switch', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts off for a visitor who has not agreed yet', () => {
    expect(create().isProgressTrackingEnabled).toBe(false);
  });

  it('shows the decision stored by the cookie banner', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: false }));
    expect(create().isProgressTrackingEnabled).toBe(true);
  });

  it('switching on records consent in cookiePreferences and saves the session’s progress', () => {
    const settings = create();
    const progress = TestBed.inject(UserProgressService);
    progress.addCompletedQuiz('quiz-a');
    expect(localStorage.getItem('user_progress')).toBeNull();

    settings.toggleProgressTracking();

    expect(TestBed.inject(PrivacyConsentService).getCookiePreferences()).toEqual({
      essential: true,
      progress: true,
      analytics: false,
    });
    expect(JSON.parse(localStorage.getItem('user_progress')!).completedQuizzes).toEqual(['quiz-a']);
  });

  it('switching off withdraws consent, keeps the analytics choice and removes the stored progress', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: true }));
    const settings = create();
    TestBed.inject(UserProgressService).addCompletedQuiz('quiz-a');
    expect(localStorage.getItem('user_progress')).not.toBeNull();

    settings.toggleProgressTracking();

    expect(settings.isProgressTrackingEnabled).toBe(false);
    expect(TestBed.inject(PrivacyConsentService).getCookiePreferences()).toEqual({
      essential: true,
      progress: false,
      analytics: true,
    });
    expect(localStorage.getItem('user_progress')).toBeNull();
    expect(localStorage.getItem('disableProgressTracking')).toBeNull();
  });
});

describe('UserSettingsComponent cookie settings entry', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('asks for the cookie settings dialog', () => {
    const settings = create();
    let requests = 0;
    TestBed.inject(CookieSettingsService).openRequested.subscribe(() => requests++);

    settings.openCookieSettings();

    expect(requests).toBe(1);
  });

  it('moves the progress switch when the dialog saves a new decision', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: false }));
    const settings = create();
    expect(settings.isProgressTrackingEnabled).toBe(true);

    TestBed.inject(PrivacyConsentService).setProgressConsent(false);
    TestBed.inject(CookieSettingsService).notifySaved();

    expect(settings.isProgressTrackingEnabled).toBe(false);
  });
});
