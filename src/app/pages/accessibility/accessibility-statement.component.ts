import { ChangeDetectorRef, Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslationService } from '../../services/translation.service';
import { BASE_LANGUAGES } from '../../../config/languages';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { StandardContainerComponent } from '../../components/shared/standard-container.component';
import { ArticleComponent } from '../../components/shared/article.component';

/**
 * Erklärung zur Barrierefreiheit — voluntary accessibility statement for the
 * portal. Private, free educational project ⇒ no statutory obligation; the
 * statement is voluntary and self-assessed, and its copy is written in
 * Plain Language.
 *
 * All copy lives in the `accessibility.*` i18n namespace (56 language variants,
 * de/en/de-easy/en-easy authored, rest seeded from en pending Phase 4).
 *
 * SSR-safe: no window/document/localStorage/navigator access.
 */
@Component({
  selector: 'app-accessibility-statement',
  standalone: true,
  imports: [PageHeaderComponent, StandardContainerComponent, ArticleComponent],
  template: `
    <app-article width="page" [transparentBackground]="true">
      <app-page-header titleKey="accessibility.title" subtitleKey="accessibility.subtitle"></app-page-header>

      <!-- 1. Geltungsbereich + freiwillig -->
      <app-standard-container
        id="a11y-intro"
        [config]="{
          titleKey: 'accessibility.introTitle',
          type: 'primary',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-info-circle',
          headingLevel: 2,
        }"
      >
        <p class="a11y-text">{{ t('accessibility.introText') }}</p>
      </app-standard-container>

      <!-- 2. Bezugsnorm -->
      <app-standard-container
        id="a11y-standard"
        [config]="{
          titleKey: 'accessibility.standardTitle',
          type: 'secondary',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-check-square',
          headingLevel: 2,
        }"
      >
        <p class="a11y-text">{{ t('accessibility.standardText') }}</p>
      </app-standard-container>

      <!-- 3. Status: teilweise vereinbar -->
      <app-standard-container
        id="a11y-status"
        [config]="{
          titleKey: 'accessibility.statusTitle',
          type: 'success',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-verified',
          headingLevel: 2,
        }"
      >
        <p class="a11y-text">{{ t('accessibility.statusText') }}</p>
      </app-standard-container>

      <!-- 4. Bekannte Einschränkungen -->
      <app-standard-container
        id="a11y-limits"
        [config]="{
          titleKey: 'accessibility.limitsTitle',
          type: 'warning',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-exclamation-triangle',
          headingLevel: 2,
        }"
      >
        <dl class="a11y-limits">
          @for (limit of limits(); track limit.label) {
            <div class="a11y-limit">
              <dt>{{ limit.label }}</dt>
              <dd>{{ limit.text }}</dd>
            </div>
          }
        </dl>
      </app-standard-container>

      <!-- 8. Bedienhilfen -->
      <app-standard-container
        id="a11y-help"
        [config]="{
          titleKey: 'accessibility.helpTitle',
          type: 'info',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-compass',
          headingLevel: 2,
        }"
      >
        <ul class="a11y-help">
          @for (item of helpItems(); track item) {
            <li>{{ item }}</li>
          }
        </ul>
      </app-standard-container>

      <!-- 5. Erstellung: Selbstbewertung + Datum -->
      <app-standard-container
        id="a11y-method"
        [config]="{
          titleKey: 'accessibility.methodTitle',
          type: 'secondary',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-calendar',
          headingLevel: 2,
        }"
      >
        <p class="a11y-text">{{ t('accessibility.methodText') }}</p>
        <div class="a11y-dates">
          <span class="a11y-date">
            <strong>{{ t('accessibility.createdLabel') }}:</strong> {{ t('accessibility.createdDate') }}
          </span>
          <span class="a11y-date">
            <strong>{{ t('accessibility.updatedLabel') }}:</strong> {{ t('accessibility.updatedDate') }}
          </span>
        </div>
      </app-standard-container>

      <!-- 6. Barriere melden -->
      <app-standard-container
        id="a11y-feedback"
        [config]="{
          titleKey: 'accessibility.feedbackTitle',
          type: 'primary',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-flag',
          headingLevel: 2,
        }"
      >
        <p class="a11y-text">{{ t('accessibility.feedbackText') }}</p>
      </app-standard-container>

      <!-- 7. Grenzen / Ehrlichkeit zum Schluss -->
      <app-standard-container
        id="a11y-enforcement"
        [config]="{
          titleKey: 'accessibility.enforcementTitle',
          type: 'info',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-heart',
          headingLevel: 2,
        }"
      >
        <p class="a11y-text">{{ t('accessibility.enforcementText') }}</p>
      </app-standard-container>
    </app-article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .a11y-text {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.95rem;
        line-height: 1.7;
      }

      /* Known limitations — definition list */
      .a11y-limits {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        margin: 0;
      }

      .a11y-limit {
        padding: var(--space-4) var(--space-5);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        border-radius: var(--border-radius-lg, 12px);
      }

      .a11y-limit dt {
        margin: 0 0 var(--space-2) 0;
        font-weight: 600;
        font-size: 1rem;
        color: var(--text-color);
      }

      .a11y-limit dd {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.65;
      }

      /* Operating aids — bullet list */
      .a11y-help {
        margin: 0;
        padding-left: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .a11y-help li {
        padding-left: var(--space-1);
      }

      /* Created / reviewed dates */
      .a11y-dates {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3) var(--space-6);
        margin-top: var(--space-4);
        padding-top: var(--space-4);
        border-top: 1px solid var(--surface-border);
      }

      .a11y-date {
        color: var(--text-color-secondary);
        font-size: 0.9rem;
      }

      .a11y-date strong {
        color: var(--text-color);
        font-weight: 600;
      }
    `,
  ],
})
export class AccessibilityStatementComponent {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);

  // Track the current language so computed() re-evaluates on language change.
  private currentLanguage = computed(() => this.translationService.currentLanguage);

  constructor() {
    // Re-run change detection when the active language changes (mirrors the
    // reactive-translation pattern used by ImpressumComponent).
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => this.cdr.detectChanges());
  }

  /** Reactive translate helper — reads currentLanguage so the value tracks language switches. */
  t(key: string): string {
    // touch the signal so template method calls re-evaluate after a language change
    this.currentLanguage();
    return this.translationService.translate(key);
  }

  limits = computed(() => {
    this.currentLanguage();
    const keys = [
      ['accessibility.limitLanguageLabel', 'accessibility.limitLanguageText'],
      ['accessibility.limitDemosLabel', 'accessibility.limitDemosText'],
      ['accessibility.limitTranslationsLabel', 'accessibility.limitTranslationsText'],
      ['accessibility.limitSignLabel', 'accessibility.limitSignText'],
    ];
    // {count} is the number of base languages the kit ships (src/config/languages.json),
    // so the statement stays true when a language is added or removed.
    const count = String(BASE_LANGUAGES.length);
    return keys.map(([labelKey, textKey]) => ({
      label: this.translationService.translate(labelKey),
      text: this.translationService.translate(textKey).replace('{count}', count),
    }));
  });

  helpItems = computed(() => {
    this.currentLanguage();
    return [
      'accessibility.helpKeyboard',
      'accessibility.helpContrast',
      'accessibility.helpEasyLanguage',
      'accessibility.helpStructure',
    ].map((k) => this.translationService.translate(k));
  });
}
