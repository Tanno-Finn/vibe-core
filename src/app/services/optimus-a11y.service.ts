/**
 * OptimusA11yService — the two app-wide accessibility corrections for Optimus
 * UI that the app shell applies above every route:
 *
 *  - `syncAriaStrings()` hands Optimus UI its screen-reader strings in the
 *    page language (the shell runs it in an effect, so it follows a language
 *    switch and a late bundle);
 *  - `patchRoles()` fixes a role mismatch axe reports (p-tabpanels), on the
 *    page and on every node added later (a childList MutationObserver).
 *
 * Both moved verbatim out of AppComponent; the measurements in the comments
 * below were taken there.
 */
import { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Optimus } from '@openng/optimus-ui/config';
import { TranslationService } from './translation.service';

/**
 * The Optimus `aria` keys the kit hands over in the page language — the keys
 * the components in this kit actually read (verified against the shipped
 * sources of @openng/optimus-ui). Each key lives in
 * `src/assets/i18n/modules/<locale>/optimus.json` in all four locales;
 * optimus-a11y.service.spec.ts holds the files and this list equal.
 *
 * `slideNumber` is deliberately NOT on the list: the carousel passes a
 * zero-based index into it and the galleria a one-based one
 * (openng-optimus-ui-carousel.mjs:905, openng-optimus-ui-galleria.mjs:1411),
 * so any wording around the number ("Folie {slideNumber}") announces
 * "Folie 0" on the first carousel slide. The library default is the bare
 * number, which carries no language — the translated `slide` roledescription
 * already says what it is.
 */
export const OPTIMUS_ARIA_KEYS = [
  'listLabel', // select, multiselect, autocomplete
  'removeLabel', // chip and the multiselect token
  'previous', // tablist scroll button
  'next', // tablist scroll button
  'selectAll', // multiselect toggle-all
  'unselectAll', // multiselect toggle-all
  'star', // rating
  'stars', // rating
  'maximizeLabel', // maximizable dialog
  'minimizeLabel', // maximizable dialog
  'close', // p-message, p-toast, image preview (no naming input of their own)
  'zoomImage', // image: the preview trigger
  'zoomIn', // image preview toolbar
  'zoomOut', // image preview toolbar
  'rotateRight', // image preview toolbar
  'rotateLeft', // image preview toolbar
  'slide', // carousel, galleria: aria-roledescription of every slide
  'pageLabel', // carousel/galleria indicators, galleria thumbnails, paginator pages
  'prevPageLabel', // carousel, galleria thumbnails, paginator
  'nextPageLabel', // carousel, galleria thumbnails, paginator
  'firstPageLabel', // paginator
  'lastPageLabel', // paginator
  'rowsPerPageLabel', // paginator rows-per-page select
  'jumpToPageDropdownLabel', // paginator jump-to-page select
] as const;

@Injectable({ providedIn: 'root' })
export class OptimusA11yService implements OnDestroy {
  private readonly translationService = inject(TranslationService);
  private readonly optimus = inject(Optimus);
  private readonly platformId = inject(PLATFORM_ID);

  private a11yObserver?: MutationObserver;

  /**
   * Optimus UI ships its own screen-reader strings and defaults them to English.
   * They are invisible, so nothing on screen betrays that a German page hands a
   * screen reader "Option List" for every open p-select — measured on
   * /ai-timeline with `<html lang="de">`.
   *
   * Only the `aria` block is overridden, and inside it only the keys listed in
   * OPTIMUS_ARIA_KEYS (above the class, each with the components that read it).
   * The date, filter and file-upload vocabulary is deliberately left English:
   * no component here renders it, and translating it would be 60 strings of dead
   * weight per language. `setTranslation` merges, so the untouched keys keep
   * their defaults.
   */
  syncAriaStrings(): void {
    const aria: Record<string, string> = { ...(this.optimus.translation.aria ?? {}) };
    // setTranslation merges one level deep only, so `aria` is replaced wholesale —
    // spread the current block first or the ~40 keys not listed here are lost.
    for (const key of OPTIMUS_ARIA_KEYS) {
      aria[key] = this.translationService.translate(`optimus.${key}`);
    }
    this.optimus.setTranslation({ aria });
  }

  patchRoles(): void {
    if (!isPlatformBrowser(this.platformId) || this.a11yObserver) return;
    const patch = (root: Element | Document) => {
      // NOTE — no p-togglebutton rule. One used to add role="button" to
      // `p-togglebutton:not([role])`, but the component binds `attr.role: "button"`
      // on its own host (openng-optimus-ui-togglebutton.mjs:280, @openng/optimus-ui
      // 2.0.2), so the rule only ever wrote the value the component writes anyway.
      // p-tabpanels: role="presentation" conflicts with semantic children
      root.querySelectorAll('p-tabpanels[role="presentation"]').forEach((el) => {
        el.removeAttribute('role');
      });
      // NOTE — no slider naming here either, deliberately.
      // A rule used to copy a `p-slider` host `aria-label` down onto the handle and,
      // failing that, stamp the English literal 'Slider'. Two problems: the literal
      // is untranslated, and the rule never actually ran — measured 0 handles
      // carrying it across /ai-timeline (2 handles) and the slider guide route
      // (19 handles), because the handle's class binding is applied after the node
      // has already been reported to the MutationObserver. Name sliders at the call
      // site with [ariaLabel] / [ariaLabelledBy]; nothing else works.
      // NOTE — no aria-valuenow patching here, deliberately.
      // An earlier revision recomputed it from the handle's position style
      // (`inset-inline-start` %), which overwrote correct values with pixel-derived,
      // Math.round()-ed ones — measured on the slider guide's playground with
      // [step]="0.1": visible readout 21.7, announced 22. Single handles are fine
      // (openng-optimus-ui-slider.mjs:647 binds `value`). Range handles are NOT:
      // :673/:699 bind `value[0]`/`value[1]`, but range mode stores the model in
      // `values`, so they render with no aria-valuenow at all (scripts/check-a11y.mjs,
      // 2026-09-22). The fix belongs where the model is known — see the date-range
      // slider in ai-timeline.component.ts — not in a pixel-reading global rule.
      // NOTE — no tablist scroll-button naming here, deliberately.
      // A rule used to stamp the English literals 'Previous tabs' / 'Next tabs'
      // onto `.p-tablist > button:not([aria-label])`. It never fired: Optimus UI
      // names those buttons itself from its own `aria.previous` / `aria.next`
      // vocabulary, which syncOptimusAriaStrings() now feeds in the page
      // language. Measured on /dev/design/guide/tabs (the only route in the kit
      // that renders p-tabs at all, 12 tablists): 1 scroll button, already named
      // "Weiter", 0 elements matching the selector, 0 carrying either literal.
    };
    patch(document);
    this.a11yObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (node instanceof HTMLElement) {
            if (node.tagName === 'P-TABPANELS' && node.getAttribute('role') === 'presentation') {
              node.removeAttribute('role');
            }
            patch(node);
          }
        }
      }
    });
    // childList only: the patches above react to nodes appearing, never to an
    // attribute changing. Watching every `style` write on the page cost a
    // callback per animation frame of every slider drag for nothing.
    this.a11yObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /** Stop watching for new nodes (the shell calls this when it is destroyed). */
  stop(): void {
    this.a11yObserver?.disconnect();
    this.a11yObserver = undefined;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
