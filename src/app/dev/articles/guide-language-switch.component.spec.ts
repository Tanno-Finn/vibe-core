/**
 * German guide twins (ADR-0018) — the runtime half:
 *   - GuideLanguageSwitchComponent renders the German twin on a `de` base language
 *     (de, de-easy), English otherwise, follows a language switch, and falls back to
 *     English while a guide has no twin;
 *   - guideComponentsResolver loads both classes before the route activates;
 *   - every registry entry carries German display strings, and localizedGuide()
 *     picks them by base language.
 */
import { Component, signal, type Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import {
  GUIDE_COMPONENTS_KEY,
  GuideLanguageSwitchComponent,
  guideComponentsResolver,
  type GuideComponents,
} from './guide-language-switch.component';
import { articleRegistry, localizedGuide } from './article-registry';
import { TranslationService } from '../../services/translation.service';

@Component({ selector: 'app-stub-en', standalone: true, template: '<p>english article</p>' })
class EnStubComponent {}

@Component({ selector: 'app-stub-de', standalone: true, template: '<p>deutscher Artikel</p>' })
class DeStubComponent {}

function render(language: string, guide: GuideComponents) {
  const currentLanguage$ = signal(language);
  TestBed.configureTestingModule({
    imports: [GuideLanguageSwitchComponent],
    providers: [
      { provide: TranslationService, useValue: { currentLanguage$ } },
      { provide: ActivatedRoute, useValue: { snapshot: { data: { [GUIDE_COMPONENTS_KEY]: guide } } } },
    ],
  });
  const fixture = TestBed.createComponent(GuideLanguageSwitchComponent);
  fixture.detectChanges();
  const text = () => (fixture.nativeElement as HTMLElement).textContent?.trim();
  return { fixture, currentLanguage$, text };
}

describe('GuideLanguageSwitchComponent', () => {
  const both: GuideComponents = { en: EnStubComponent, de: DeStubComponent };

  it('renders the German twin for de and de-easy', () => {
    expect(render('de', both).text()).toBe('deutscher Artikel');
    TestBed.resetTestingModule();
    expect(render('de-easy', both).text()).toBe('deutscher Artikel');
  });

  it('renders English for en and en-easy', () => {
    expect(render('en', both).text()).toBe('english article');
    TestBed.resetTestingModule();
    expect(render('en-easy', both).text()).toBe('english article');
  });

  it('follows a language switch', () => {
    const { fixture, currentLanguage$, text } = render('en', both);
    currentLanguage$.set('de');
    fixture.detectChanges();
    expect(text()).toBe('deutscher Artikel');
    currentLanguage$.set('en-easy');
    fixture.detectChanges();
    expect(text()).toBe('english article');
  });

  it('falls back to English while a guide has no German twin', () => {
    expect(render('de', { en: EnStubComponent, de: null }).text()).toBe('english article');
  });
});

describe('guideComponentsResolver', () => {
  const run = (resolver: ReturnType<typeof guideComponentsResolver>) =>
    (resolver as unknown as () => Promise<GuideComponents>)();

  it('loads the English component and the German twin', async () => {
    const guide = await run(
      guideComponentsResolver(
        () => Promise.resolve(EnStubComponent as Type<unknown>),
        () => Promise.resolve(DeStubComponent as Type<unknown>),
      ),
    );
    expect(guide.en).toBe(EnStubComponent);
    expect(guide.de).toBe(DeStubComponent);
  });

  it('resolves de to null for a guide without a twin', async () => {
    const guide = await run(guideComponentsResolver(() => Promise.resolve(EnStubComponent as Type<unknown>), undefined));
    expect(guide.de).toBeNull();
  });
});

describe('German registry strings', () => {
  it('every guide has a German title and summary', () => {
    for (const entry of articleRegistry) {
      expect(entry.titleDe.trim(), entry.id).not.toBe('');
      expect(entry.summaryDe.trim(), entry.id).not.toBe('');
    }
  });

  it('localizedGuide() picks the pair by base language', () => {
    const entry = articleRegistry.find((e) => e.id === 'text-inputs')!;
    expect(localizedGuide(entry, 'de')).toEqual({ title: entry.titleDe, summary: entry.summaryDe });
    expect(localizedGuide(entry, 'de-easy').title).toBe(entry.titleDe);
    expect(localizedGuide(entry, 'en')).toEqual({ title: entry.title, summary: entry.summary });
    expect(localizedGuide(entry, 'en-easy').title).toBe(entry.title);
  });
});
