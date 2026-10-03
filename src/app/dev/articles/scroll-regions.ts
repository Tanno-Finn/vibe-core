/**
 * Keyboard-scrollable regions for the guide pages (SC 2.1.1, axe
 * `scrollable-region-focusable`).
 *
 * The 61 guides render their code blocks (`pre`) and wide tables (`.table-wrap`,
 * live data tables) with `overflow-x: auto`. On a narrow screen they scroll
 * sideways, and a keyboard user can only scroll what takes focus. Instead of
 * editing every guide, the guide shell watches its own subtree: an element that
 * actually overflows and holds nothing focusable becomes a focusable, named
 * group (`tabindex="0"`, `role="group"`, `aria-label`); once it fits again, the
 * attributes go away, so a desktop page gains no empty tab stops. A group, not
 * a region: a guide tab holds up to a dozen of them under the same name, and
 * as landmarks they failed axe `landmark-unique` and cluttered the landmark
 * list. The shell draws the focus ring for `[data-scroll-region]`. An element
 * whose author set a `tabindex` is left alone.
 */

/**
 * Elements in a guide that may scroll: code blocks, the guides' table wrappers,
 * and the scroll container of a live Optimus data table in a demo.
 */
export const SCROLL_REGION_SELECTOR = 'pre, .table-wrap, .p-datatable-table-container';

/** Marks the attributes this module added, so it only ever removes its own. */
const MARK = 'data-scroll-region';

const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

function scrolls(overflow: string): boolean {
  return overflow === 'auto' || overflow === 'scroll';
}

/** True when the element can be scrolled on either axis right now. */
export function isScrollable(el: HTMLElement): boolean {
  const cs = getComputedStyle(el);
  const x = el.scrollWidth > el.clientWidth + 1 && scrolls(cs.overflowX);
  const y = el.scrollHeight > el.clientHeight + 1 && scrolls(cs.overflowY);
  return x || y;
}

/**
 * Makes one element a focusable, named group while it scrolls and nothing
 * inside it takes focus; undoes its own attributes otherwise. Returns whether
 * the element is a managed region afterwards.
 */
export function syncScrollRegion(el: HTMLElement, label: string): boolean {
  const managed = el.hasAttribute(MARK);
  if (!managed && el.hasAttribute('tabindex')) return false;
  const needed = isScrollable(el) && !el.querySelector(FOCUSABLE);
  if (needed) {
    el.setAttribute(MARK, '');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'group');
    if (el.getAttribute('aria-label') !== label) el.setAttribute('aria-label', label);
    return true;
  }
  if (managed) {
    for (const a of [MARK, 'tabindex', 'role', 'aria-label']) el.removeAttribute(a);
  }
  return false;
}

/**
 * Watches a subtree: new or changed content (tab switches, the agent doc
 * arriving) via MutationObserver, size changes (viewport, a hidden panel
 * shown) via ResizeObserver. Browser-only — the caller starts it after render.
 */
export class ScrollRegionWatcher {
  private readonly seen = new WeakSet<Element>();
  private mutations?: MutationObserver;
  private resizes?: ResizeObserver;
  private frame = 0;

  constructor(
    private readonly root: HTMLElement,
    private readonly labelFor: (el: HTMLElement) => string,
  ) {}

  start(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizes = new ResizeObserver((entries) => {
        for (const e of entries) this.sync(e.target as HTMLElement);
      });
    }
    if (typeof MutationObserver !== 'undefined') {
      this.mutations = new MutationObserver((records) => {
        // Our own attribute writes are not observed (childList/characterData only).
        if (records.length) this.schedule();
      });
      this.mutations.observe(this.root, { childList: true, subtree: true, characterData: true });
    }
    this.refresh();
  }

  /** Re-checks every region now (also after a language switch, for the labels). */
  refresh(): void {
    for (const el of Array.from(this.root.querySelectorAll<HTMLElement>(SCROLL_REGION_SELECTOR))) {
      if (!this.seen.has(el)) {
        this.seen.add(el);
        this.resizes?.observe(el);
      }
      this.sync(el);
    }
  }

  stop(): void {
    this.mutations?.disconnect();
    this.resizes?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
  }

  private sync(el: HTMLElement): void {
    syncScrollRegion(el, this.labelFor(el));
  }

  private schedule(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.refresh();
    });
  }
}
