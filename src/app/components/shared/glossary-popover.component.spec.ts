/**
 * GlossaryPopoverComponent spec — the desktop popover is a keyboard-usable
 * dialog:
 *  - opening it moves focus from the term to its close button (its buttons
 *    otherwise sit at the far end of the tab order);
 *  - Escape closes it and hands focus back to the term that opened it;
 *  - Escape does nothing while no popover is open;
 *  - the "go to glossary" link shows only while the glossary feature is on
 *    (src/config/site.json), the definition always.
 *
 * HighlightingService is stubbed with a writable popover signal; jsdom's
 * default viewport (1024 px) is the desktop branch.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';

import { GlossaryPopoverComponent } from './glossary-popover.component';
import { TranslationService } from '../../services/translation.service';
import { HighlightingService } from '../../services/highlighting.service';
import { LanguageUrlService } from '../../services/language-url.service';
import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, SiteRules, siteRulesFor } from '../../../config/site';

interface PopoverData {
  term: string;
  definition: string;
  category: string;
  termId: string;
  position: { x: number; y: number; termTop: number };
}

class HighlightingStub {
  readonly popover = signal<PopoverData | null>(null);
  readonly currentPopover$ = this.popover.asReadonly();
  hidePopover = vi.fn(() => this.popover.set(null));
}

let highlighting: HighlightingStub;

function escape(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

async function render(site: SiteRules = KIT_DEFAULT_SITE_RULES): Promise<ComponentFixture<GlossaryPopoverComponent>> {
  highlighting = new HighlightingStub();
  TestBed.configureTestingModule({
    imports: [GlossaryPopoverComponent],
    providers: [
      provideRouter([]),
      { provide: HighlightingService, useValue: highlighting },
      {
        provide: TranslationService,
        useValue: { languageChanged: new Subject<string>(), translate: (k: string) => k },
      },
      { provide: LanguageUrlService, useValue: { currentUrlLang: 'en' } },
      { provide: SITE_CONFIG, useValue: site },
    ],
  });
  const fixture = TestBed.createComponent(GlossaryPopoverComponent);
  document.body.appendChild(fixture.nativeElement);
  fixture.detectChanges();
  await fixture.whenStable();
  return fixture;
}

async function openFrom(fixture: ComponentFixture<GlossaryPopoverComponent>, trigger: HTMLElement): Promise<void> {
  trigger.focus();
  highlighting.popover.set({
    term: 'Token',
    definition: 'A piece of text.',
    category: 'core',
    termId: 'token',
    position: { x: 10, y: 30, termTop: 10 },
  });
  fixture.detectChanges();
  await fixture.whenStable();
}

describe('GlossaryPopoverComponent (desktop)', () => {
  let trigger: HTMLElement;

  beforeEach(() => {
    trigger = document.createElement('span');
    trigger.tabIndex = 0;
    trigger.setAttribute('role', 'button');
    document.body.appendChild(trigger);
  });

  afterEach(() => document.body.replaceChildren());

  it('moves focus from the term to the popover close button on open', async () => {
    const fixture = await render();
    await openFrom(fixture, trigger);

    const dialog = (fixture.nativeElement as HTMLElement).querySelector('.debug-popover[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(document.activeElement).toBe(dialog!.querySelector('.close-btn'));
  });

  it('closes on Escape and returns focus to the term', async () => {
    const fixture = await render();
    await openFrom(fixture, trigger);

    escape();
    fixture.detectChanges();

    expect(highlighting.hidePopover).toHaveBeenCalledTimes(1);
    expect((fixture.nativeElement as HTMLElement).querySelector('.debug-popover')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('ignores Escape while no popover is open', async () => {
    await render();
    escape();
    expect(highlighting.hidePopover).not.toHaveBeenCalled();
  });

  it('offers the way to the glossary while the glossary is on', async () => {
    const fixture = await render();
    await openFrom(fixture, trigger);

    const dialog = (fixture.nativeElement as HTMLElement).querySelector('.debug-popover')!;
    expect(dialog.querySelector('.glossar-button')).not.toBeNull();
  });

  it('keeps the definition but drops the glossary link when the glossary is switched off', async () => {
    const fixture = await render(siteRulesFor({ ...KIT_DEFAULT_SITE, features: { glossary: false } }));
    await openFrom(fixture, trigger);

    const dialog = (fixture.nativeElement as HTMLElement).querySelector('.debug-popover')!;
    expect(dialog.querySelector('.definition')?.textContent).toContain('A piece of text.');
    expect(dialog.querySelector('.glossar-button')).toBeNull();
    expect(dialog.querySelector('hr')).toBeNull();
  });
});
