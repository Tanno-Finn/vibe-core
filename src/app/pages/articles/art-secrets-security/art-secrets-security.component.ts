/**
 * ArtSecretsSecurityComponent
 *
 * Educational article: why a credential that has once been published cannot be
 * taken back - the six-link chain from content-addressed objects to the one
 * step that changes anything (invalidating the value), and the sorting rule
 * that follows from it: delegate by reversibility, not by danger.
 *
 * Written from a reviewed concept spec — a pipeline document of the project this
 * kit was distilled from, not shipped with the kit.
 *
 * SSR note: no window/document/localStorage/navigator access, no timers, no rAF.
 */
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { LessonTemplateComponent, LessonMeta } from '../../../components/shared/lesson-template.component';
import { TocItem } from '../../../components/shared/table-of-contents-fab.component';
import { StandardContainerComponent, ContainerConfig } from '../../../components/shared/standard-container.component';
import { DefinitionComponent } from '../../../components/didactic/definition.component';
import { ComparisonComponent } from '../../../components/didactic/comparison.component';
import { StatCardComponent } from '../../../components/didactic/stat-card.component';
import { StepIndicatorComponent, StepItem } from '../../../components/didactic/step-indicator.component';
import { IconGridComponent, IconGridItem } from '../../../components/didactic/icon-grid.component';
import { CheckpointComponent, CheckpointItem } from '../../../components/shared/checkpoint.component';
import { QuizContainerComponent, QuizQuestion } from '../../../components/shared/quiz-container.component';
import { HighlightDirective } from '../../../directives/highlight.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-art-secrets-security',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    StatCardComponent,
    StepIndicatorComponent,
    IconGridComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleSecretsSecurity.lead.paragraph1')">
          {{ t('articleSecretsSecurity.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.lead.paragraph2')">
          {{ t('articleSecretsSecurity.lead.paragraph2') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.lead.paragraph3')">
          {{ t('articleSecretsSecurity.lead.paragraph3') }}
        </p>
      </section>

      <!-- Bruecke zum Git-Artikel -->
      <section id="bridge" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.bridge.title')">
          {{ t('articleSecretsSecurity.bridge.title') }}
        </h2>
        <p [appHighlight]="t('articleSecretsSecurity.bridge.text1')">{{ t('articleSecretsSecurity.bridge.text1') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.bridge.text2')">{{ t('articleSecretsSecurity.bridge.text2') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.bridge.album1')">
          {{ t('articleSecretsSecurity.bridge.album1') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.bridge.album2')">
          {{ t('articleSecretsSecurity.bridge.album2') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleSecretsSecurity.bridge.rule')">
          {{ t('articleSecretsSecurity.bridge.rule') }}
        </p>
      </section>

      <!-- Kernthese + Lernziele -->
      <section id="thesis" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.thesis.title')">
          {{ t('articleSecretsSecurity.thesis.title') }}
        </h2>
        <p [appHighlight]="t('articleSecretsSecurity.thesis.text1')">{{ t('articleSecretsSecurity.thesis.text1') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.thesis.text2')">{{ t('articleSecretsSecurity.thesis.text2') }}</p>

        <app-standard-container [config]="objectivesConfig">
          <ol class="objectives-list">
            <li [appHighlight]="t('articleSecretsSecurity.thesis.objectives.item1')">
              {{ t('articleSecretsSecurity.thesis.objectives.item1') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.thesis.objectives.item2')">
              {{ t('articleSecretsSecurity.thesis.objectives.item2') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.thesis.objectives.item3')">
              {{ t('articleSecretsSecurity.thesis.objectives.item3') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.thesis.objectives.item4')">
              {{ t('articleSecretsSecurity.thesis.objectives.item4') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.thesis.objectives.item5')">
              {{ t('articleSecretsSecurity.thesis.objectives.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- K1: Der Schluessel steht nicht im Bauplan -->
      <section id="secret" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.secret.title')">
          {{ t('articleSecretsSecurity.secret.title') }}
        </h2>

        <p [appHighlight]="t('articleSecretsSecurity.secret.analogy1')">
          {{ t('articleSecretsSecurity.secret.analogy1') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.secret.analogy2')">
          {{ t('articleSecretsSecurity.secret.analogy2') }}
        </p>

        <app-definition
          [title]="t('articleSecretsSecurity.secret.definitionTitle')"
          [firstOptionLabel]="t('articleSecretsSecurity.secret.definitionEverydayLabel')"
          [firstOptionContent]="t('articleSecretsSecurity.secret.definitionEveryday')"
          [secondOptionLabel]="t('articleSecretsSecurity.secret.definitionPreciseLabel')"
          [secondOptionContent]="t('articleSecretsSecurity.secret.definitionPrecise')"
          [showExample]="false"
          icon="pi pi-key"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleSecretsSecurity.secret.test')">{{ t('articleSecretsSecurity.secret.test') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.secret.ask')">{{ t('articleSecretsSecurity.secret.ask') }}</p>

        <h3 [appHighlight]="t('articleSecretsSecurity.secret.formsTitle')">
          {{ t('articleSecretsSecurity.secret.formsTitle') }}
        </h3>
        <app-icon-grid [items]="secretForms" [showDescriptions]="true" color="orange" columns="auto"></app-icon-grid>

        <app-standard-container [config]="secretMisconception1Config">
          <p [appHighlight]="t('articleSecretsSecurity.secret.misconception1.text')">
            {{ t('articleSecretsSecurity.secret.misconception1.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleSecretsSecurity.secret.lookLike')">
          {{ t('articleSecretsSecurity.secret.lookLike') }}
        </p>

        <h3 [appHighlight]="t('articleSecretsSecurity.secret.breakTitle')">
          {{ t('articleSecretsSecurity.secret.breakTitle') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.secret.analogyBreak')">
          {{ t('articleSecretsSecurity.secret.analogyBreak') }}
        </p>
      </section>

      <!-- Stuetzpassage: Die Ignorier-Regel und ihre Grenze -->
      <section id="ignore" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.ignore.title')">
          {{ t('articleSecretsSecurity.ignore.title') }}
        </h2>

        <p [appHighlight]="t('articleSecretsSecurity.ignore.habit')">{{ t('articleSecretsSecurity.ignore.habit') }}</p>

        <app-standard-container [config]="ignoreMisconceptionConfig">
          <p [appHighlight]="t('articleSecretsSecurity.ignore.misconception.text')">
            {{ t('articleSecretsSecurity.ignore.misconception.text') }}
          </p>
        </app-standard-container>

        <p class="key-sentence" [appHighlight]="t('articleSecretsSecurity.ignore.silent')">
          {{ t('articleSecretsSecurity.ignore.silent') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.ignore.repair')">
          {{ t('articleSecretsSecurity.ignore.repair') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.ignore.completion')">
          {{ t('articleSecretsSecurity.ignore.completion') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.ignore.twoQuestions')">
          {{ t('articleSecretsSecurity.ignore.twoQuestions') }}
        </p>
      </section>

      <!-- K2: Gedruckt ist gedruckt -->
      <section id="chain" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.chain.title')">{{ t('articleSecretsSecurity.chain.title') }}</h2>

        <p [appHighlight]="t('articleSecretsSecurity.chain.intro')">{{ t('articleSecretsSecurity.chain.intro') }}</p>

        <app-standard-container [config]="chainStepsConfig">
          <app-step-indicator
            [steps]="chainSteps"
            layout="vertical"
            [showConnectors]="true"
            [ariaLabel]="t('articleSecretsSecurity.chain.stepsAriaLabel')"
          >
          </app-step-indicator>
        </app-standard-container>

        <h3 [appHighlight]="t('articleSecretsSecurity.chain.link1Title')">
          {{ t('articleSecretsSecurity.chain.link1Title') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.chain.link1Hash')">
          {{ t('articleSecretsSecurity.chain.link1Hash') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.chain.link1')">{{ t('articleSecretsSecurity.chain.link1') }}</p>

        <h3 [appHighlight]="t('articleSecretsSecurity.chain.link2Title')">
          {{ t('articleSecretsSecurity.chain.link2Title') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.chain.link2')">{{ t('articleSecretsSecurity.chain.link2') }}</p>

        <app-standard-container [config]="chainMisconception1Config">
          <p [appHighlight]="t('articleSecretsSecurity.chain.misconception1.text')">
            {{ t('articleSecretsSecurity.chain.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-comparison
          layout="horizontal"
          variant="neutral"
          [ariaLabel]="t('articleSecretsSecurity.chain.comparison.ariaLabel')"
          [beforeLabel]="t('articleSecretsSecurity.chain.comparison.beforeLabel')"
          [beforeResult]="t('articleSecretsSecurity.chain.comparison.beforeResult')"
          [afterLabel]="t('articleSecretsSecurity.chain.comparison.afterLabel')"
          [afterResult]="t('articleSecretsSecurity.chain.comparison.afterResult')"
        >
          <p slot="before" [appHighlight]="t('articleSecretsSecurity.chain.comparison.beforeText')">
            {{ t('articleSecretsSecurity.chain.comparison.beforeText') }}
          </p>
          <p slot="after" [appHighlight]="t('articleSecretsSecurity.chain.comparison.afterText')">
            {{ t('articleSecretsSecurity.chain.comparison.afterText') }}
          </p>
        </app-comparison>

        <h3 [appHighlight]="t('articleSecretsSecurity.chain.link3Title')">
          {{ t('articleSecretsSecurity.chain.link3Title') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.chain.link3')">{{ t('articleSecretsSecurity.chain.link3') }}</p>

        <app-standard-container [config]="chainMisconception2Config">
          <p [appHighlight]="t('articleSecretsSecurity.chain.misconception2.text')">
            {{ t('articleSecretsSecurity.chain.misconception2.text') }}
          </p>
        </app-standard-container>

        <h3 [appHighlight]="t('articleSecretsSecurity.chain.link4Title')">
          {{ t('articleSecretsSecurity.chain.link4Title') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.chain.fork')">{{ t('articleSecretsSecurity.chain.fork') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.chain.link4')">{{ t('articleSecretsSecurity.chain.link4') }}</p>

        <app-standard-container [config]="chainDeepDiveConfig">
          <p [appHighlight]="t('articleSecretsSecurity.chain.deepDive.text1')">
            {{ t('articleSecretsSecurity.chain.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleSecretsSecurity.chain.deepDive.text2')">
            {{ t('articleSecretsSecurity.chain.deepDive.text2') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleSecretsSecurity.chain.privateRepo')">
          {{ t('articleSecretsSecurity.chain.privateRepo') }}
        </p>

        <h3 [appHighlight]="t('articleSecretsSecurity.chain.link5Title')">
          {{ t('articleSecretsSecurity.chain.link5Title') }}
        </h3>
        <p class="key-sentence" [appHighlight]="t('articleSecretsSecurity.chain.claim')">
          {{ t('articleSecretsSecurity.chain.claim') }}
        </p>

        <h3 [appHighlight]="t('articleSecretsSecurity.chain.link6Title')">
          {{ t('articleSecretsSecurity.chain.link6Title') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.chain.lockNotKey')">
          {{ t('articleSecretsSecurity.chain.lockNotKey') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.chain.where')">{{ t('articleSecretsSecurity.chain.where') }}</p>

        <app-standard-container [config]="chainMisconception3Config">
          <p [appHighlight]="t('articleSecretsSecurity.chain.misconception3.text')">
            {{ t('articleSecretsSecurity.chain.misconception3.text') }}
          </p>
        </app-standard-container>

        <h3 [appHighlight]="t('articleSecretsSecurity.chain.exampleTitle')">
          {{ t('articleSecretsSecurity.chain.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.chain.example')">
          {{ t('articleSecretsSecurity.chain.example') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.chain.populationIntro')">
          {{ t('articleSecretsSecurity.chain.populationIntro') }}
        </p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleSecretsSecurity.chain.stat.label'"
            [value]="t('articleSecretsSecurity.chain.stat.value')"
            icon="pi pi-inbox"
            color="orange"
            variant="gradient"
            [descriptionKey]="'articleSecretsSecurity.chain.stat.description'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleSecretsSecurity.chain.validity')">
          {{ t('articleSecretsSecurity.chain.validity') }}
        </p>
      </section>

      <!-- Checkpoint 1 -->
      <section id="checkpoint1" class="article-section">
        <app-checkpoint
          checkpointId="chain"
          [items]="checkpoint1Items"
          [titleKey]="'articleSecretsSecurity.checkpoint1.title'"
          storageKey="art-secrets-security-checkpoint-1"
        >
        </app-checkpoint>
      </section>

      <!-- K3: Der Schritt ohne Rueckweg gehoert dir -->
      <section id="sort" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.sort.title')">{{ t('articleSecretsSecurity.sort.title') }}</h2>

        <p [appHighlight]="t('articleSecretsSecurity.sort.intro')">{{ t('articleSecretsSecurity.sort.intro') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.sort.delimitation')">
          {{ t('articleSecretsSecurity.sort.delimitation') }}
        </p>

        <app-comparison
          layout="horizontal"
          variant="neutral"
          [ariaLabel]="t('articleSecretsSecurity.sort.comparison.ariaLabel')"
          [beforeLabel]="t('articleSecretsSecurity.sort.comparison.beforeLabel')"
          [beforeResult]="t('articleSecretsSecurity.sort.comparison.beforeResult')"
          [afterLabel]="t('articleSecretsSecurity.sort.comparison.afterLabel')"
          [afterResult]="t('articleSecretsSecurity.sort.comparison.afterResult')"
        >
          <p slot="before" [appHighlight]="t('articleSecretsSecurity.sort.comparison.beforeText')">
            {{ t('articleSecretsSecurity.sort.comparison.beforeText') }}
          </p>
          <p slot="after" [appHighlight]="t('articleSecretsSecurity.sort.comparison.afterText')">
            {{ t('articleSecretsSecurity.sort.comparison.afterText') }}
          </p>
        </app-comparison>

        <p class="key-sentence" [appHighlight]="t('articleSecretsSecurity.sort.axis')">
          {{ t('articleSecretsSecurity.sort.axis') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.sort.rules')">{{ t('articleSecretsSecurity.sort.rules') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.sort.injection')">
          {{ t('articleSecretsSecurity.sort.injection') }}
        </p>

        <h3 [appHighlight]="t('articleSecretsSecurity.sort.doorTitle')">
          {{ t('articleSecretsSecurity.sort.doorTitle') }}
        </h3>
        <p [appHighlight]="t('articleSecretsSecurity.sort.door')">{{ t('articleSecretsSecurity.sort.door') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.sort.doorBreak1')">
          {{ t('articleSecretsSecurity.sort.doorBreak1') }}
        </p>
        <p [appHighlight]="t('articleSecretsSecurity.sort.doorBreak2')">
          {{ t('articleSecretsSecurity.sort.doorBreak2') }}
        </p>
      </section>

      <!-- Grenzen -->
      <section id="limits" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.limits.title')">
          {{ t('articleSecretsSecurity.limits.title') }}
        </h2>

        <p [appHighlight]="t('articleSecretsSecurity.limits.gate')">{{ t('articleSecretsSecurity.limits.gate') }}</p>

        <app-standard-container [config]="limitsMisconceptionConfig">
          <p [appHighlight]="t('articleSecretsSecurity.limits.misconception.text')">
            {{ t('articleSecretsSecurity.limits.misconception.text') }}
          </p>
        </app-standard-container>

        <p class="key-sentence" [appHighlight]="t('articleSecretsSecurity.limits.bypass')">
          {{ t('articleSecretsSecurity.limits.bypass') }}
        </p>

        <app-standard-container [config]="limitsDeepDiveConfig">
          <p [appHighlight]="t('articleSecretsSecurity.limits.deepDive.text1')">
            {{ t('articleSecretsSecurity.limits.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleSecretsSecurity.limits.deepDive.text2')">
            {{ t('articleSecretsSecurity.limits.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Checkpoint 2 -->
      <section id="checkpoint2" class="article-section">
        <app-checkpoint
          checkpointId="sort"
          [items]="checkpoint2Items"
          [titleKey]="'articleSecretsSecurity.checkpoint2.title'"
          storageKey="art-secrets-security-checkpoint-2"
        >
        </app-checkpoint>
      </section>

      <!-- Abschluss -->
      <section id="close" class="article-section">
        <h2 [appHighlight]="t('articleSecretsSecurity.close.title')">{{ t('articleSecretsSecurity.close.title') }}</h2>
        <p [appHighlight]="t('articleSecretsSecurity.close.text1')">{{ t('articleSecretsSecurity.close.text1') }}</p>
        <p [appHighlight]="t('articleSecretsSecurity.close.text2')">{{ t('articleSecretsSecurity.close.text2') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleSecretsSecurity.close.text3')">
          {{ t('articleSecretsSecurity.close.text3') }}
        </p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleSecretsSecurity.takeaways.item1')">
              {{ t('articleSecretsSecurity.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.takeaways.item2')">
              {{ t('articleSecretsSecurity.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.takeaways.item3')">
              {{ t('articleSecretsSecurity.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.takeaways.item4')">
              {{ t('articleSecretsSecurity.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleSecretsSecurity.takeaways.item5')">
              {{ t('articleSecretsSecurity.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-secrets-security-quiz"
          [titleKey]="'articleSecretsSecurity.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>
    </app-lesson-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .article-section {
        margin-bottom: var(--space-8);
      }

      .article-section h2 {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: var(--space-4);
        color: var(--text-color);
      }

      .article-section h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: var(--space-6);
        margin-bottom: var(--space-3);
        color: var(--text-color);
      }

      .lead-text {
        font-size: 1.2rem;
        line-height: 1.7;
        color: var(--text-color);
        margin-bottom: var(--space-4);
      }

      .key-sentence {
        font-size: 1.1rem;
        font-weight: 600;
        line-height: 1.6;
        margin: var(--space-5) 0;
        padding-left: var(--space-4);
        border-left: 4px solid var(--primary-color);
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--space-4);
        margin: var(--space-5) 0;
      }

      .takeaways-list,
      .objectives-list {
        margin: 0;
        padding-left: var(--space-6);
      }

      .takeaways-list li,
      .objectives-list li {
        margin-bottom: var(--space-3);
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .stat-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ArtSecretsSecurityComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-secrets-security',
    titleKey: 'articleSecretsSecurity.hero.title',
    subtitleKey: 'articleSecretsSecurity.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '12 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleSecretsSecurity.toc.lead' },
    { id: 'bridge', key: 'articleSecretsSecurity.toc.bridge' },
    { id: 'thesis', key: 'articleSecretsSecurity.toc.thesis' },
    { id: 'secret', key: 'articleSecretsSecurity.toc.secret' },
    { id: 'ignore', key: 'articleSecretsSecurity.toc.ignore' },
    { id: 'chain', key: 'articleSecretsSecurity.toc.chain' },
    { id: 'sort', key: 'articleSecretsSecurity.toc.sort' },
    { id: 'limits', key: 'articleSecretsSecurity.toc.limits' },
    { id: 'close', key: 'articleSecretsSecurity.toc.close' },
    { id: 'takeaways', key: 'articleSecretsSecurity.toc.takeaways' },
    { id: 'quiz', key: 'articleSecretsSecurity.toc.quiz' },
  ];

  objectivesConfig: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.thesis.objectives.title',
    type: 'info',
    icon: 'pi pi-flag',
  };

  secretMisconception1Config: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.secret.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  ignoreMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.ignore.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  chainStepsConfig: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.chain.stepsTitle',
    type: 'info',
    icon: 'pi pi-link',
  };

  chainMisconception1Config: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.chain.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  chainMisconception2Config: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.chain.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  chainMisconception3Config: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.chain.misconception3.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  chainDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.chain.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  limitsMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.limits.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  limitsDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.limits.deepDive.title',
    type: 'info',
    icon: 'pi pi-tag',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleSecretsSecurity.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /**
   * Five categories, deliberately no example values: the concept's "protection
   * side only" rule forbids anything that imitates a real credential shape.
   * The meaning of each form lives in descriptionKey.
   */
  secretForms: IconGridItem[] = [
    {
      icon: 'pi pi-key',
      labelKey: 'articleSecretsSecurity.secret.forms.apiKey.label',
      descriptionKey: 'articleSecretsSecurity.secret.forms.apiKey.description',
    },
    {
      icon: 'pi pi-id-card',
      labelKey: 'articleSecretsSecurity.secret.forms.token.label',
      descriptionKey: 'articleSecretsSecurity.secret.forms.token.description',
    },
    {
      icon: 'pi pi-file',
      labelKey: 'articleSecretsSecurity.secret.forms.keyFile.label',
      descriptionKey: 'articleSecretsSecurity.secret.forms.keyFile.description',
    },
    {
      icon: 'pi pi-database',
      labelKey: 'articleSecretsSecurity.secret.forms.database.label',
      descriptionKey: 'articleSecretsSecurity.secret.forms.database.description',
    },
    {
      icon: 'pi pi-cog',
      labelKey: 'articleSecretsSecurity.secret.forms.config.label',
      descriptionKey: 'articleSecretsSecurity.secret.forms.config.description',
    },
  ];

  // Illustration of a causal chain, not user progress - every step stays 'pending'.
  chainSteps: StepItem[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpoint1Items: CheckpointItem[] = [
    { textKey: 'articleSecretsSecurity.checkpoint1.item1' },
    { textKey: 'articleSecretsSecurity.checkpoint1.item2' },
    { textKey: 'articleSecretsSecurity.checkpoint1.item3' },
  ];

  checkpoint2Items: CheckpointItem[] = [
    { textKey: 'articleSecretsSecurity.checkpoint2.item1' },
    { textKey: 'articleSecretsSecurity.checkpoint2.item2' },
  ];

  ngOnInit(): void {
    this.updateTocItems();
    this.updateSteps();
    this.updateQuizQuestions();
    this.langSub = this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateTocItems();
      this.updateSteps();
      this.updateQuizQuestions();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  private updateTocItems(): void {
    this.tocItems = this.tocLabelKeys.map((item) => ({
      id: item.id,
      label: this.t(item.key),
    }));
  }

  /**
   * Six links, not five. Change 3 of the Phase-3 review requires the premise
   * that makes invalidation work (a credential is a claim the service honors)
   * to carry its own step - otherwise the chain's exit is unexplained.
   */
  private updateSteps(): void {
    this.chainSteps = [
      { id: 1, label: this.t('articleSecretsSecurity.chain.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleSecretsSecurity.chain.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleSecretsSecurity.chain.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleSecretsSecurity.chain.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleSecretsSecurity.chain.step5'), status: 'pending' as const },
      { id: 6, label: this.t('articleSecretsSecurity.chain.step6'), status: 'pending' as const },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleSecretsSecurity.quiz.' + key);
    this.quizQuestions = [
      {
        id: 'q1',
        question: q('q1.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q1.a'), isCorrect: false },
          { id: 'b', text: q('q1.b'), isCorrect: true },
          { id: 'c', text: q('q1.c'), isCorrect: false },
          { id: 'd', text: q('q1.d'), isCorrect: false },
        ],
        explanation: q('q1.explanation'),
      },
      {
        id: 'q2',
        question: q('q2.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q2.a'), isCorrect: false },
          { id: 'b', text: q('q2.b'), isCorrect: true },
          { id: 'c', text: q('q2.c'), isCorrect: false },
          { id: 'd', text: q('q2.d'), isCorrect: false },
        ],
        explanation: q('q2.explanation'),
      },
      {
        id: 'q3',
        question: q('q3.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q3.a'), isCorrect: false },
          { id: 'b', text: q('q3.b'), isCorrect: true },
          { id: 'c', text: q('q3.c'), isCorrect: false },
          { id: 'd', text: q('q3.d'), isCorrect: false },
        ],
        explanation: q('q3.explanation'),
      },
      {
        id: 'q4',
        question: q('q4.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q4.a'), isCorrect: false },
          { id: 'b', text: q('q4.b'), isCorrect: false },
          { id: 'c', text: q('q4.c'), isCorrect: true },
          { id: 'd', text: q('q4.d'), isCorrect: false },
        ],
        explanation: q('q4.explanation'),
      },
      {
        id: 'q5',
        question: q('q5.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q5.a'), isCorrect: false },
          { id: 'b', text: q('q5.b'), isCorrect: true },
          { id: 'c', text: q('q5.c'), isCorrect: false },
          { id: 'd', text: q('q5.d'), isCorrect: false },
        ],
        explanation: q('q5.explanation'),
      },
    ];
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
