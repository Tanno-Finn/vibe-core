/**
 * Cookie Settings Service
 *
 * Lets any part of the app open the one cookie settings dialog that
 * `CookieConsentComponent` renders, and hear when a decision was saved there.
 *
 * Why this exists: withdrawing consent must be as easy as giving it (GDPR
 * Art. 7 (3)). The banner offers the dialog only until the first decision; after
 * that the footer's "Cookie settings" entry and the settings page reopen it
 * through `open()`. The request is synchronous, so the dialog still sees the
 * trigger as `document.activeElement` and hands focus back to it on close.
 *
 * `saved` fires after the dialog stored a decision, so a page that shows the
 * consent state (the settings page's progress switch) can re-read it.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CookieSettingsService {
  private readonly openRequests = new Subject<void>();
  private readonly saves = new Subject<void>();

  /** Emits each time something asks for the dialog. Listened to by `CookieConsentComponent`. */
  readonly openRequested = this.openRequests.asObservable();

  /** Emits after the dialog (or the banner) stored a consent decision. */
  readonly saved = this.saves.asObservable();

  /** Open the cookie settings dialog. Call it from a click, while the trigger has focus. */
  open(): void {
    this.openRequests.next();
  }

  /** Called by `CookieConsentComponent` once a decision is stored. */
  notifySaved(): void {
    this.saves.next();
  }
}
