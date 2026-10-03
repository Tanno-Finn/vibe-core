/**
 * Focus return for overlays — the one clause of the APG modal-dialog contract
 * Optimus UI does not implement.
 *
 * `p-dialog` traps focus while it is open, but nothing records or restores the
 * element that opened it: measured on the live guide page, `document.activeElement`
 * after Escape was `<body>`. WCAG 2.2 SC 2.4.3 (Focus Order) requires focus to
 * come back to the trigger, otherwise a keyboard or screen-reader user is
 * dropped at the top of the document and has to walk the whole page again.
 *
 * Usage — capture before the overlay opens, restore from `(onHide)`, which
 * Optimus UI emits for the close button, the dismissable mask and the document
 * Escape listener. It is not literally every path: `p-drawer` also dismantles
 * itself from a container `keydown` handler that emits nothing, so a drawer
 * needs the visible close controls its guide asks for:
 *
 *   private readonly focusReturn = new FocusReturn();
 *
 *   openDialog(): void {
 *     this.focusReturn.capture();
 *     this.visible.set(true);
 *   }
 *
 *   closeDialog(): void {
 *     this.visible.set(false);
 *     this.focusReturn.restore();
 *   }
 *
 *   <p-dialog [(visible)]="visible" … (onHide)="closeDialog()"> … </p-dialog>
 *
 * Components that route both the close button and `(onHide)` through the same
 * handler call `restore()` twice; that is intended and harmless.
 *
 * SSR-safe: every method no-ops when there is no `document`.
 *
 * @see src/assets/design-system/guides/dialog.agent.md — "Accessibility"
 */
export class FocusReturn {
  private trigger: HTMLElement | null = null;

  /**
   * Remember what currently has focus. Call this *before* the overlay opens,
   * while the trigger is still the active element. `<body>` is ignored — it is
   * what the browser reports when nothing is focused, and focusing it back
   * would be the very failure this class exists to prevent.
   */
  capture(): void {
    if (typeof document === 'undefined') {
      this.trigger = null;
      return;
    }
    const active = document.activeElement;
    this.trigger = active instanceof HTMLElement && active !== document.body ? active : null;
  }

  /**
   * Hand focus back to the captured trigger. No-op when nothing was captured
   * or when the trigger has since left the document — a detached element
   * cannot take focus, and calling `focus()` on it silently moves focus to
   * `<body>`.
   */
  restore(): void {
    const trigger = this.trigger;
    if (!trigger || typeof document === 'undefined') return;
    if (!trigger.isConnected) {
      this.trigger = null;
      return;
    }
    trigger.focus();
  }

  /**
   * Forget the trigger without focusing it — for close paths that navigate
   * away or hand focus somewhere else on purpose.
   */
  release(): void {
    this.trigger = null;
  }
}
