import { SCROLL_REGION_SELECTOR, ScrollRegionWatcher, syncScrollRegion } from './scroll-regions';

/** A box with fixed geometry: jsdom does no layout, so the sizes are stubbed. */
function box(tag: string, scrollWidth: number, clientWidth: number, overflowX = 'auto'): HTMLElement {
  const el = document.createElement(tag);
  el.style.overflowX = overflowX;
  Object.defineProperty(el, 'scrollWidth', { configurable: true, get: () => scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => clientWidth });
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => 0 });
  Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => 0 });
  document.body.appendChild(el);
  return el;
}

function resize(el: HTMLElement, scrollWidth: number, clientWidth: number): void {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, get: () => scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => clientWidth });
}

describe('scroll regions (guide pages, SC 2.1.1)', () => {
  afterEach(() => (document.body.innerHTML = ''));

  it('makes an overflowing code block a focusable, named group', () => {
    const pre = box('pre', 600, 300);
    expect(syncScrollRegion(pre, 'Codebeispiel')).toBe(true);
    expect(pre.getAttribute('tabindex')).toBe('0');
    expect(pre.getAttribute('role')).toBe('group');
    expect(pre.getAttribute('aria-label')).toBe('Codebeispiel');
    expect(pre.hasAttribute('data-scroll-region')).toBe(true);
  });

  it('leaves a block that fits without a tab stop', () => {
    const pre = box('pre', 300, 300);
    expect(syncScrollRegion(pre, 'Codebeispiel')).toBe(false);
    expect(pre.hasAttribute('tabindex')).toBe(false);
    expect(pre.hasAttribute('role')).toBe(false);
  });

  it('removes its own attributes once the region fits again', () => {
    const pre = box('pre', 600, 300);
    syncScrollRegion(pre, 'Code example');
    resize(pre, 300, 300);
    expect(syncScrollRegion(pre, 'Code example')).toBe(false);
    for (const a of ['tabindex', 'role', 'aria-label', 'data-scroll-region']) expect(pre.hasAttribute(a)).toBe(false);
  });

  it('does not count overflow the element cannot scroll (overflow visible)', () => {
    const pre = box('pre', 600, 300, 'visible');
    expect(syncScrollRegion(pre, 'Codebeispiel')).toBe(false);
  });

  it('skips a region whose content is already focusable', () => {
    const wrap = box('div', 900, 300);
    wrap.className = 'table-wrap';
    wrap.innerHTML = '<table><tr><td><a href="#x">link</a></td></tr></table>';
    expect(syncScrollRegion(wrap, 'Tabelle')).toBe(false);
    expect(wrap.hasAttribute('tabindex')).toBe(false);
  });

  it('never touches a tabindex the author set', () => {
    const pre = box('pre', 600, 300);
    pre.setAttribute('tabindex', '-1');
    expect(syncScrollRegion(pre, 'Codebeispiel')).toBe(false);
    expect(pre.getAttribute('tabindex')).toBe('-1');
    expect(pre.hasAttribute('role')).toBe(false);
  });

  it('the watcher names code blocks and tables by kind and relabels on refresh', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const pre = box('pre', 600, 300);
    const wrap = box('div', 900, 300);
    wrap.className = 'table-wrap';
    root.append(pre, wrap);
    let lang = 'de';
    const watcher = new ScrollRegionWatcher(root, (el) =>
      el.tagName === 'PRE' ? (lang === 'de' ? 'Codebeispiel' : 'Code example') : lang === 'de' ? 'Tabelle' : 'Table',
    );
    watcher.start();
    expect(pre.getAttribute('aria-label')).toBe('Codebeispiel');
    expect(wrap.getAttribute('aria-label')).toBe('Tabelle');
    lang = 'en';
    watcher.refresh();
    expect(pre.getAttribute('aria-label')).toBe('Code example');
    expect(wrap.getAttribute('aria-label')).toBe('Table');
    watcher.stop();
  });

  it('covers code blocks, table wrappers and data-table scroll containers', () => {
    expect(SCROLL_REGION_SELECTOR).toContain('pre');
    expect(SCROLL_REGION_SELECTOR).toContain('.table-wrap');
    expect(SCROLL_REGION_SELECTOR).toContain('.p-datatable-table-container');
  });
});
