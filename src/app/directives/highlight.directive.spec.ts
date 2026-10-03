/**
 * HighlightDirective spec
 *
 * Pins the contract that makes the glossary-highlight directive survive an
 * in-place language switch (Easy-Language toggle / language picker without a
 * reload).
 *
 * Two usage forms:
 *  - Reactive BINDING form `<el [appHighlight]="expr">{{ expr }}</el>` — the
 *    @Input pushes each new value into the directive, so it re-highlights on
 *    every language switch. This is the robust form the shared components use.
 *  - Naked ATTRIBUTE form `<el appHighlight>{{ expr }}</el>` — the directive
 *    reads textContent once. Text WITH a glossary match still freezes on an
 *    in-place switch (documented limitation, fixed only by converting to the
 *    binding form). The hardening here guarantees text WITHOUT a match is never
 *    severed, so it keeps following Angular's interpolation.
 */
import { Component, signal, Type, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightDirective } from './highlight.directive';
import { TranslationService } from '../services/translation.service';
import { HighlightingService } from '../services/highlighting.service';

// --- Mocks ------------------------------------------------------------------

/** Signal-backed language, mirroring production's `get currentLanguage()`. */
class MockTranslationService {
  private lang = signal('de');
  get currentLanguage(): string {
    return this.lang();
  }
  setLanguage(l: string): void {
    this.lang.set(l);
  }
}

/**
 * Highlights the literal term "KI" (single occurrence) — enough to exercise
 * the segment-rebuild path without pulling in the real glossary.
 */
class MockHighlightingService {
  loaded = signal(true);
  enabled = signal(true);
  version = signal(1);
  showPopover = vi.fn();

  isLoadedSignal(): boolean {
    return this.loaded();
  }
  highlightingEnabled$(): boolean {
    return this.enabled();
  }
  dataVersion(): number {
    return this.version();
  }
  initialize(): Promise<void> {
    return Promise.resolve();
  }

  processContent(
    text: string,
    _lang: string,
    _opts?: unknown,
  ): { textSegments: Array<{ text: string; isHighlight: boolean; highlightData?: unknown }> } {
    const term = 'KI';
    const idx = text.indexOf(term);
    if (idx === -1) {
      return { textSegments: [{ text, isHighlight: false }] };
    }
    const segments: Array<{ text: string; isHighlight: boolean; highlightData?: unknown }> = [];
    if (idx > 0) segments.push({ text: text.slice(0, idx), isHighlight: false });
    segments.push({
      text: term,
      isHighlight: true,
      highlightData: {
        term: 'KI',
        termId: 'ki',
        definition: 'Künstliche Intelligenz, ein Teilgebiet der Informatik.',
        category: 'core',
      },
    });
    const rest = text.slice(idx + term.length);
    if (rest) segments.push({ text: rest, isHighlight: false });
    return { textSegments: segments };
  }
}

// --- Host components --------------------------------------------------------

@Component({
  standalone: true,
  imports: [HighlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="naked" appHighlight>{{ text() }}</p>`,
})
class NakedHostComponent {
  text = signal('start');
}

@Component({
  standalone: true,
  imports: [HighlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="bound" [appHighlight]="text()">{{ text() }}</p>`,
})
class BoundHostComponent {
  text = signal('start');
}

// --- Setup ------------------------------------------------------------------

let translation: MockTranslationService;
let highlighting: MockHighlightingService;

function setup<T>(host: new () => T): ComponentFixture<T> {
  translation = new MockTranslationService();
  highlighting = new MockHighlightingService();
  TestBed.configureTestingModule({
    imports: [host as Type<T>],
    providers: [
      { provide: TranslationService, useValue: translation },
      { provide: HighlightingService, useValue: highlighting },
    ],
  });
  return TestBed.createComponent(host as Type<T>) as unknown as ComponentFixture<T>;
}

afterEach(() => TestBed.resetTestingModule());

function naked(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector('.naked') as HTMLElement;
}
function bound(fixture: ComponentFixture<unknown>): HTMLElement {
  return fixture.nativeElement.querySelector('.bound') as HTMLElement;
}
const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();

// --- Tests ------------------------------------------------------------------

describe('HighlightDirective', () => {
  it('renders a glossary highlight for naked text containing a term', () => {
    const fixture = setup(NakedHostComponent);
    fixture.componentInstance.text.set('Hallo KI Welt');
    fixture.detectChanges();

    const hl = naked(fixture).querySelector('.glossary-highlight');
    expect(hl).toBeTruthy();
    expect(hl!.textContent).toBe('KI');
    expect(norm(naked(fixture).textContent)).toBe('Hallo KI Welt');
  });

  it('opens the glossary popover when a highlight is clicked', () => {
    const fixture = setup(NakedHostComponent);
    fixture.componentInstance.text.set('Hallo KI Welt');
    fixture.detectChanges();

    const hl = naked(fixture).querySelector('.glossary-highlight') as HTMLElement;
    hl.click();
    expect(highlighting.showPopover).toHaveBeenCalled();
  });

  it('opens the popover from the keyboard with Enter and with Space, and Space does not scroll', () => {
    const fixture = setup(NakedHostComponent);
    fixture.componentInstance.text.set('Hallo KI Welt');
    fixture.detectChanges();

    const hl = naked(fixture).querySelector('.glossary-highlight') as HTMLElement;
    expect(hl.getAttribute('role')).toBe('button');
    expect(hl.tabIndex).toBe(0);

    hl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(highlighting.showPopover).toHaveBeenCalledTimes(1);

    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    hl.dispatchEvent(space);
    expect(highlighting.showPopover).toHaveBeenCalledTimes(2);
    expect(space.defaultPrevented).toBe(true);

    hl.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true }));
    expect(highlighting.showPopover).toHaveBeenCalledTimes(2);
  });

  // The hardening: naked text with NO glossary match must never be severed, so
  // Angular's interpolation keeps updating it across an in-place language switch.
  it('keeps the live binding for naked text without a match (no sever)', () => {
    const fixture = setup(NakedHostComponent);
    fixture.componentInstance.text.set('Hallo Welt'); // de, no term
    fixture.detectChanges();
    expect(naked(fixture).querySelector('.glossary-highlight')).toBeNull();

    // Simulate the interpolation updating to the Easy-Language string.
    fixture.componentInstance.text.set('Servus Welt'); // de-easy, no term
    fixture.detectChanges();

    expect(norm(naked(fixture).textContent)).toBe('Servus Welt'); // NOT frozen on 'Hallo Welt'
    expect(naked(fixture).querySelector('.glossary-highlight')).toBeNull();
  });

  // The robust form the shared components and codemod target: a changed bound
  // value re-highlights, so language switches are reflected even after the
  // directive has rebuilt the host's children.
  it('re-highlights the bound form when the bound text changes', () => {
    const fixture = setup(BoundHostComponent);
    fixture.componentInstance.text.set('KI ist toll'); // de
    fixture.detectChanges();
    expect(bound(fixture).querySelector('.glossary-highlight')?.textContent).toBe('KI');

    fixture.componentInstance.text.set('KI fuer alle'); // de-easy
    fixture.detectChanges();

    expect(norm(bound(fixture).textContent)).toBe('KI fuer alle');
    expect(bound(fixture).querySelector('.glossary-highlight')?.textContent).toBe('KI');
  });

  // Characterizes the freeze the appHighlight binding sweep
  // removes from production. The naked attribute form on text WITH a glossary
  // match severs Angular's interpolation node on the first highlight rebuild, so
  // a later in-place language switch can no longer reach the DOM — the field
  // stays frozen on the old language. Every production naked-interpolation usage
  // was converted to the bound form (the test above); this pins WHY and guards
  // against reintroducing the naked form for reactive text.
  it('FREEZES the naked form with a match on an in-place language switch (the limitation the sweep eliminates)', () => {
    const fixture = setup(NakedHostComponent);
    fixture.componentInstance.text.set('KI ist toll'); // de, has the term -> builds spans, severs the node
    fixture.detectChanges();
    expect(naked(fixture).querySelector('.glossary-highlight')?.textContent).toBe('KI');

    // In-place switch: language flips AND the interpolation would yield new text.
    translation.setLanguage('en');
    fixture.componentInstance.text.set('AI is great'); // the new-language string the bound form would carry
    fixture.detectChanges();

    // Naked form: textContent is frozen on the old-language text, never updated.
    expect(norm(naked(fixture).textContent)).toBe('KI ist toll');
    expect(norm(naked(fixture).textContent)).not.toBe('AI is great');
  });

  it('removes highlights when highlighting is disabled, keeping the plain text', () => {
    const fixture = setup(NakedHostComponent);
    fixture.componentInstance.text.set('Hallo KI Welt');
    fixture.detectChanges();
    expect(naked(fixture).querySelector('.glossary-highlight')).toBeTruthy();

    highlighting.enabled.set(false);
    fixture.detectChanges();

    expect(naked(fixture).querySelector('.glossary-highlight')).toBeNull();
    expect(norm(naked(fixture).textContent)).toBe('Hallo KI Welt');
  });

  it('does not touch the DOM until the highlighting service is ready', () => {
    const fixture = setup(NakedHostComponent);
    highlighting.loaded.set(false);
    fixture.componentInstance.text.set('Hallo KI Welt');
    fixture.detectChanges();

    // Not ready: left intact, Angular's node still attached.
    expect(naked(fixture).querySelector('.glossary-highlight')).toBeNull();
    expect(norm(naked(fixture).textContent)).toBe('Hallo KI Welt');

    // Becomes ready -> highlights apply.
    highlighting.loaded.set(true);
    fixture.detectChanges();
    expect(naked(fixture).querySelector('.glossary-highlight')?.textContent).toBe('KI');
  });
});
