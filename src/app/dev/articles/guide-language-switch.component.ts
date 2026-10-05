import { ChangeDetectionStrategy, Component, computed, inject, type Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, type ResolveFn } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { LANGUAGE_RULES } from '../../../config/languages';

/** Both language versions of one guide article, resolved before the route activates. */
export interface GuideComponents {
  /** The English canonical article component. */
  en: Type<unknown>;
  /** The German twin (`<id>-article.de.component.ts`), or null while the guide has none. */
  de: Type<unknown> | null;
}

/** Route-data key the resolver writes and the switch reads. */
export const GUIDE_COMPONENTS_KEY = 'guideComponents';

/**
 * Resolver factory for one guide route: loads the English component and, when the
 * guide has one, its German twin — in parallel, before activation. Resolving both
 * up front keeps the switch synchronous: the server render, the first browser
 * render and a later language switch all pick from classes already in hand, so
 * nothing async runs inside a component (no pending task, no empty first frame).
 * The twin extends the English class, so loading it costs the English chunk anyway.
 */
export function guideComponentsResolver(
  en: () => Promise<Type<unknown>>,
  de: (() => Promise<Type<unknown>>) | undefined,
): ResolveFn<GuideComponents> {
  return () => Promise.all([en(), de ? de() : Promise.resolve(null)]).then(([enType, deType]) => ({ en: enType, de: deType }));
}

/**
 * Renders a guide article in the reader's language (ADR-0018): the German twin
 * when the base language is `de` (covers `de` and `de-easy`), the English
 * component for every other language, and English as well while a guide has no
 * twin yet. Reacts to a language switch through `currentLanguage$`; no browser
 * global is touched, so it renders the same on the server.
 */
@Component({
  selector: 'app-guide-language-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
  template: `<ng-container [ngComponentOutlet]="component()" />`,
})
export class GuideLanguageSwitchComponent {
  private readonly i18n = inject(TranslationService);
  private readonly guide = inject(ActivatedRoute).snapshot.data[GUIDE_COMPONENTS_KEY] as GuideComponents;

  /** The class to render for the current language. */
  readonly component = computed<Type<unknown>>(() =>
    LANGUAGE_RULES.baseLanguageOf(this.i18n.currentLanguage$()) === 'de' && this.guide.de
      ? this.guide.de
      : this.guide.en,
  );
}
