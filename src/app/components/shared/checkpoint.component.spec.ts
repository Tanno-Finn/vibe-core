/**
 * CheckpointComponent spec — the completion toast tells the truth about
 * storage: "progress saved" only when it was (progress consent), and without
 * consent a short line that it was not, and where to allow it, instead of
 * silence the visitor would read as "saved".
 *
 * TranslationService is stubbed to return the key; ToastService is a spy.
 * Consent and progress use the real services.
 */
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { CheckpointComponent } from './checkpoint.component';
import { TranslationService } from '../../services/translation.service';
import { ToastService } from '../../services/toast.service';
import { PrivacyConsentService } from '../../services/privacy-consent.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  translate(key: string): string {
    return key;
  }
}

function complete(): { title: string; detail?: string }[] {
  const toasts: { title: string; detail?: string }[] = [];
  TestBed.configureTestingModule({
    imports: [CheckpointComponent],
    providers: [
      { provide: TranslationService, useClass: TranslationServiceStub },
      {
        provide: ToastService,
        useValue: { showSuccess: (title: string, detail?: string) => toasts.push({ title, detail }) },
      },
    ],
  });
  const fixture = TestBed.createComponent(CheckpointComponent);
  fixture.componentRef.setInput('checkpointId', 'foundations');
  fixture.componentRef.setInput('storageKey', 'spec-guide');
  fixture.detectChanges();
  fixture.componentInstance.toggle();
  return toasts;
}

describe('CheckpointComponent completion toast', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('says the progress was saved when the visitor agreed to storing it', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: false }));

    expect(complete()).toEqual([{ title: 'checkpoint.completed', detail: 'checkpoint.progressSaved' }]);
    expect(JSON.parse(localStorage.getItem('user_progress')!).completedCheckpoints).toEqual({
      'spec-guide': ['foundations'],
    });
  });

  it('says the progress was not saved after a "no"', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: false, analytics: false }));

    expect(complete()).toEqual([{ title: 'checkpoint.completed', detail: 'checkpoint.progressNotSaved' }]);
    expect(localStorage.getItem('user_progress')).toBeNull();
  });

  it('says the progress was not saved before any decision', () => {
    const toasts = complete();

    expect(TestBed.inject(PrivacyConsentService).getCookiePreferences()).toBeNull();
    expect(toasts).toEqual([{ title: 'checkpoint.completed', detail: 'checkpoint.progressNotSaved' }]);
    expect(localStorage.getItem('user_progress')).toBeNull();
  });
});
