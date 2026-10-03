/**
 * ArtQualityGatesComponent
 *
 * Educational article: the row of machine checks between "the agent says it is
 * finished" and "the change is actually in" - which questions they answer, why
 * the place they run decides between advice and refusal, what a red board is
 * worth, and what a documented exception looks like.
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
import { FrameworkCardsComponent, FrameworkCard } from '../../../components/didactic/framework-cards.component';
import { CheckpointComponent, CheckpointItem } from '../../../components/shared/checkpoint.component';
import { QuizContainerComponent, QuizQuestion } from '../../../components/shared/quiz-container.component';
import { HighlightDirective } from '../../../directives/highlight.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-art-quality-gates',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    StatCardComponent,
    StepIndicatorComponent,
    IconGridComponent,
    FrameworkCardsComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleQualityGates.lead.paragraph1')">
          {{ t('articleQualityGates.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.lead.paragraph2')">{{ t('articleQualityGates.lead.paragraph2') }}</p>
        <p [appHighlight]="t('articleQualityGates.lead.paragraph3')">{{ t('articleQualityGates.lead.paragraph3') }}</p>
      </section>

      <!-- Kernthese + Lernziele -->
      <section id="thesis" class="article-section">
        <h2 [appHighlight]="t('articleQualityGates.thesis.title')">{{ t('articleQualityGates.thesis.title') }}</h2>
        <p [appHighlight]="t('articleQualityGates.thesis.text1')">{{ t('articleQualityGates.thesis.text1') }}</p>
        <p [appHighlight]="t('articleQualityGates.thesis.text2')">{{ t('articleQualityGates.thesis.text2') }}</p>

        <app-standard-container [config]="objectivesConfig">
          <ol class="objectives-list">
            <li [appHighlight]="t('articleQualityGates.thesis.objectives.item1')">
              {{ t('articleQualityGates.thesis.objectives.item1') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.thesis.objectives.item2')">
              {{ t('articleQualityGates.thesis.objectives.item2') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.thesis.objectives.item3')">
              {{ t('articleQualityGates.thesis.objectives.item3') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.thesis.objectives.item4')">
              {{ t('articleQualityGates.thesis.objectives.item4') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.thesis.objectives.item5')">
              {{ t('articleQualityGates.thesis.objectives.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- K1: Fuenf Fragen, fuenf Sorten Rot -->
      <section id="checks" class="article-section">
        <h2 [appHighlight]="t('articleQualityGates.checks.title')">{{ t('articleQualityGates.checks.title') }}</h2>

        <p [appHighlight]="t('articleQualityGates.checks.intro')">{{ t('articleQualityGates.checks.intro') }}</p>

        <app-definition
          [title]="t('articleQualityGates.checks.definitionTitle')"
          [firstOptionLabel]="t('articleQualityGates.checks.definitionEverydayLabel')"
          [firstOptionContent]="t('articleQualityGates.checks.definitionEveryday')"
          [secondOptionLabel]="t('articleQualityGates.checks.definitionPreciseLabel')"
          [secondOptionContent]="t('articleQualityGates.checks.definitionPrecise')"
          [showExample]="false"
          icon="pi pi-shield"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleQualityGates.checks.questions')">
          {{ t('articleQualityGates.checks.questions') }}
        </p>

        <app-icon-grid [items]="checkItems" [showDescriptions]="true" color="orange" columns="auto"></app-icon-grid>

        <p [appHighlight]="t('articleQualityGates.checks.overlap')">{{ t('articleQualityGates.checks.overlap') }}</p>
        <p [appHighlight]="t('articleQualityGates.checks.handover')">{{ t('articleQualityGates.checks.handover') }}</p>

        <h3 [appHighlight]="t('articleQualityGates.checks.analogyTitle')">
          {{ t('articleQualityGates.checks.analogyTitle') }}
        </h3>
        <p [appHighlight]="t('articleQualityGates.checks.analogy')">{{ t('articleQualityGates.checks.analogy') }}</p>
        <p [appHighlight]="t('articleQualityGates.checks.analogyBreak1')">
          {{ t('articleQualityGates.checks.analogyBreak1') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.checks.analogyBreak2')">
          {{ t('articleQualityGates.checks.analogyBreak2') }}
        </p>

        <h3 [appHighlight]="t('articleQualityGates.checks.exampleTitle')">
          {{ t('articleQualityGates.checks.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleQualityGates.checks.exampleIntro')">
          {{ t('articleQualityGates.checks.exampleIntro') }}
        </p>

        <app-standard-container [config]="timelineConfig">
          <app-step-indicator
            [steps]="timelineSteps"
            layout="vertical"
            [showConnectors]="true"
            [ariaLabel]="t('articleQualityGates.checks.stepsAriaLabel')"
          >
          </app-step-indicator>
        </app-standard-container>

        <p [appHighlight]="t('articleQualityGates.checks.exampleCounter')">
          {{ t('articleQualityGates.checks.exampleCounter') }}
        </p>

        <h3 [appHighlight]="t('articleQualityGates.checks.placeTitle')">
          {{ t('articleQualityGates.checks.placeTitle') }}
        </h3>
        <p [appHighlight]="t('articleQualityGates.checks.placeIntro')">
          {{ t('articleQualityGates.checks.placeIntro') }}
        </p>

        <app-comparison
          layout="horizontal"
          variant="neutral"
          [ariaLabel]="t('articleQualityGates.checks.comparison.ariaLabel')"
          [beforeLabel]="t('articleQualityGates.checks.comparison.beforeLabel')"
          [beforeResult]="t('articleQualityGates.checks.comparison.beforeResult')"
          [afterLabel]="t('articleQualityGates.checks.comparison.afterLabel')"
          [afterResult]="t('articleQualityGates.checks.comparison.afterResult')"
        >
          <p slot="before" [appHighlight]="t('articleQualityGates.checks.comparison.beforeText')">
            {{ t('articleQualityGates.checks.comparison.beforeText') }}
          </p>
          <p slot="after" [appHighlight]="t('articleQualityGates.checks.comparison.afterText')">
            {{ t('articleQualityGates.checks.comparison.afterText') }}
          </p>
        </app-comparison>

        <p [appHighlight]="t('articleQualityGates.checks.platform')">{{ t('articleQualityGates.checks.platform') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleQualityGates.checks.authority')">
          {{ t('articleQualityGates.checks.authority') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.checks.severityForward')">
          {{ t('articleQualityGates.checks.severityForward') }}
        </p>

        <app-standard-container [config]="checksMisconception1Config">
          <p [appHighlight]="t('articleQualityGates.checks.misconception1.text')">
            {{ t('articleQualityGates.checks.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="checksMisconception2Config">
          <p [appHighlight]="t('articleQualityGates.checks.misconception2.text')">
            {{ t('articleQualityGates.checks.misconception2.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Checkpoint 1 -->
      <section id="checkpoint1" class="article-section">
        <app-checkpoint
          checkpointId="checks"
          [items]="checkpoint1Items"
          [titleKey]="'articleQualityGates.checkpoint1.title'"
          storageKey="art-quality-gates-checkpoint-1"
        >
        </app-checkpoint>
      </section>

      <!-- K2: Rot ist der billige Fehler -->
      <section id="cheap" class="article-section">
        <h2 [appHighlight]="t('articleQualityGates.cheap.title')">{{ t('articleQualityGates.cheap.title') }}</h2>

        <p [appHighlight]="t('articleQualityGates.cheap.intro')">{{ t('articleQualityGates.cheap.intro') }}</p>
        <p [appHighlight]="t('articleQualityGates.cheap.claimNot')">{{ t('articleQualityGates.cheap.claimNot') }}</p>
        <p [appHighlight]="t('articleQualityGates.cheap.claimIs')">{{ t('articleQualityGates.cheap.claimIs') }}</p>

        <h3 [appHighlight]="t('articleQualityGates.cheap.exampleTitle')">
          {{ t('articleQualityGates.cheap.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleQualityGates.cheap.exampleSetup')">
          {{ t('articleQualityGates.cheap.exampleSetup') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.cheap.exampleMerged')">
          {{ t('articleQualityGates.cheap.exampleMerged') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.cheap.exampleFound')">
          {{ t('articleQualityGates.cheap.exampleFound') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.cheap.exampleOutside')">
          {{ t('articleQualityGates.cheap.exampleOutside') }}
        </p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleQualityGates.cheap.statA.label'"
            value="+48 %"
            icon="pi pi-search"
            color="green"
            variant="gradient"
            [descriptionKey]="'articleQualityGates.cheap.statA.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleQualityGates.cheap.statB.label'"
            value="±0"
            icon="pi pi-users"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleQualityGates.cheap.statB.description'"
          >
          </app-stat-card>
        </div>

        <p class="key-sentence" [appHighlight]="t('articleQualityGates.cheap.exampleResult')">
          {{ t('articleQualityGates.cheap.exampleResult') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.cheap.caveat')">{{ t('articleQualityGates.cheap.caveat') }}</p>

        <h3 [appHighlight]="t('articleQualityGates.cheap.analogyTitle')">
          {{ t('articleQualityGates.cheap.analogyTitle') }}
        </h3>
        <p [appHighlight]="t('articleQualityGates.cheap.analogy')">{{ t('articleQualityGates.cheap.analogy') }}</p>
        <p [appHighlight]="t('articleQualityGates.cheap.analogyBreak1')">
          {{ t('articleQualityGates.cheap.analogyBreak1') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.cheap.analogyBreak2')">
          {{ t('articleQualityGates.cheap.analogyBreak2') }}
        </p>

        <app-standard-container [config]="cheapMisconception1Config">
          <p [appHighlight]="t('articleQualityGates.cheap.misconception1.text')">
            {{ t('articleQualityGates.cheap.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="cheapMisconception2Config">
          <p [appHighlight]="t('articleQualityGates.cheap.misconception2.text')">
            {{ t('articleQualityGates.cheap.misconception2.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Supporting: Was keine Pruefung entscheiden kann -->
      <section id="limits" class="article-section">
        <h2 [appHighlight]="t('articleQualityGates.limits.title')">{{ t('articleQualityGates.limits.title') }}</h2>

        <p [appHighlight]="t('articleQualityGates.limits.text1')">{{ t('articleQualityGates.limits.text1') }}</p>
        <p [appHighlight]="t('articleQualityGates.limits.text2')">{{ t('articleQualityGates.limits.text2') }}</p>

        <app-standard-container [config]="limitsDeepDiveConfig">
          <p [appHighlight]="t('articleQualityGates.limits.deepDive.text1')">
            {{ t('articleQualityGates.limits.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleQualityGates.limits.deepDive.text2')">
            {{ t('articleQualityGates.limits.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- K3: Die dokumentierte Ausnahme -->
      <section id="exception" class="article-section">
        <h2 [appHighlight]="t('articleQualityGates.exception.title')">
          {{ t('articleQualityGates.exception.title') }}
        </h2>

        <p [appHighlight]="t('articleQualityGates.exception.intro')">{{ t('articleQualityGates.exception.intro') }}</p>
        <p [appHighlight]="t('articleQualityGates.exception.severity')">
          {{ t('articleQualityGates.exception.severity') }}
        </p>

        <h3 [appHighlight]="t('articleQualityGates.exception.recordTitle')">
          {{ t('articleQualityGates.exception.recordTitle') }}
        </h3>
        <p [appHighlight]="t('articleQualityGates.exception.recordIntro')">
          {{ t('articleQualityGates.exception.recordIntro') }}
        </p>

        <app-framework-cards [cards]="recordCards" colorScheme="monochrome" [columns]="3" [headingLevel]="4">
        </app-framework-cards>

        <p [appHighlight]="t('articleQualityGates.exception.refusals')">
          {{ t('articleQualityGates.exception.refusals') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.exception.alone')">{{ t('articleQualityGates.exception.alone') }}</p>

        <h3 [appHighlight]="t('articleQualityGates.exception.exampleTitle')">
          {{ t('articleQualityGates.exception.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleQualityGates.exception.exampleIntro')">
          {{ t('articleQualityGates.exception.exampleIntro') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.exception.exampleA')">
          {{ t('articleQualityGates.exception.exampleA') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.exception.exampleB')">
          {{ t('articleQualityGates.exception.exampleB') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.exception.recurring')">
          {{ t('articleQualityGates.exception.recurring') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.exception.exampleC')">
          {{ t('articleQualityGates.exception.exampleC') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.exception.point')">{{ t('articleQualityGates.exception.point') }}</p>

        <p class="key-sentence" [appHighlight]="t('articleQualityGates.exception.overrideDoes')">
          {{ t('articleQualityGates.exception.overrideDoes') }}
        </p>
        <p [appHighlight]="t('articleQualityGates.exception.companion')">
          {{ t('articleQualityGates.exception.companion') }}
        </p>

        <app-standard-container [config]="exceptionMisconception1Config">
          <p [appHighlight]="t('articleQualityGates.exception.misconception1.text')">
            {{ t('articleQualityGates.exception.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="exceptionMisconception2Config">
          <p [appHighlight]="t('articleQualityGates.exception.misconception2.text')">
            {{ t('articleQualityGates.exception.misconception2.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="exceptionDeepDiveConfig">
          <p [appHighlight]="t('articleQualityGates.exception.deepDive.text1')">
            {{ t('articleQualityGates.exception.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleQualityGates.exception.deepDive.text2')">
            {{ t('articleQualityGates.exception.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Checkpoint 2 -->
      <section id="checkpoint2" class="article-section">
        <app-checkpoint
          checkpointId="exception"
          [items]="checkpoint2Items"
          [titleKey]="'articleQualityGates.checkpoint2.title'"
          storageKey="art-quality-gates-checkpoint-2"
        >
        </app-checkpoint>
      </section>

      <!-- Supporting: Warum das bei Agenten staerker zaehlt -->
      <section id="agents" class="article-section">
        <h2 [appHighlight]="t('articleQualityGates.agents.title')">{{ t('articleQualityGates.agents.title') }}</h2>
        <p [appHighlight]="t('articleQualityGates.agents.text1')">{{ t('articleQualityGates.agents.text1') }}</p>
        <p [appHighlight]="t('articleQualityGates.agents.text2')">{{ t('articleQualityGates.agents.text2') }}</p>
        <p [appHighlight]="t('articleQualityGates.agents.text3')">{{ t('articleQualityGates.agents.text3') }}</p>
      </section>

      <!-- Abschluss -->
      <section id="close" class="article-section">
        <h2 [appHighlight]="t('articleQualityGates.close.title')">{{ t('articleQualityGates.close.title') }}</h2>
        <p [appHighlight]="t('articleQualityGates.close.text1')">{{ t('articleQualityGates.close.text1') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleQualityGates.close.text2')">
          {{ t('articleQualityGates.close.text2') }}
        </p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleQualityGates.takeaways.item1')">
              {{ t('articleQualityGates.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.takeaways.item2')">
              {{ t('articleQualityGates.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.takeaways.item3')">
              {{ t('articleQualityGates.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.takeaways.item4')">
              {{ t('articleQualityGates.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleQualityGates.takeaways.item5')">
              {{ t('articleQualityGates.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-quality-gates-quiz"
          [titleKey]="'articleQualityGates.quiz.boxTitle'"
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
export class ArtQualityGatesComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-quality-gates',
    titleKey: 'articleQualityGates.hero.title',
    subtitleKey: 'articleQualityGates.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '18 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleQualityGates.toc.lead' },
    { id: 'thesis', key: 'articleQualityGates.toc.thesis' },
    { id: 'checks', key: 'articleQualityGates.toc.checks' },
    { id: 'cheap', key: 'articleQualityGates.toc.cheap' },
    { id: 'limits', key: 'articleQualityGates.toc.limits' },
    { id: 'exception', key: 'articleQualityGates.toc.exception' },
    { id: 'agents', key: 'articleQualityGates.toc.agents' },
    { id: 'close', key: 'articleQualityGates.toc.close' },
    { id: 'takeaways', key: 'articleQualityGates.toc.takeaways' },
    { id: 'quiz', key: 'articleQualityGates.toc.quiz' },
  ];

  objectivesConfig: ContainerConfig = {
    titleKey: 'articleQualityGates.thesis.objectives.title',
    type: 'info',
    icon: 'pi pi-flag',
  };

  timelineConfig: ContainerConfig = {
    titleKey: 'articleQualityGates.checks.stepsTitle',
    type: 'info',
    icon: 'pi pi-clock',
  };

  checksMisconception1Config: ContainerConfig = {
    titleKey: 'articleQualityGates.checks.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  checksMisconception2Config: ContainerConfig = {
    titleKey: 'articleQualityGates.checks.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  cheapMisconception1Config: ContainerConfig = {
    titleKey: 'articleQualityGates.cheap.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  cheapMisconception2Config: ContainerConfig = {
    titleKey: 'articleQualityGates.cheap.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  limitsDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleQualityGates.limits.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  exceptionMisconception1Config: ContainerConfig = {
    titleKey: 'articleQualityGates.exception.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  exceptionMisconception2Config: ContainerConfig = {
    titleKey: 'articleQualityGates.exception.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  exceptionDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleQualityGates.exception.deepDive.title',
    type: 'info',
    icon: 'pi pi-list',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleQualityGates.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /**
   * Five questions, not five products. Change 3 of the Phase-3 review forbids
   * presenting them as five independent machines - the running text says once
   * that one run may answer several of them. The meaning of each kind of red
   * lives in descriptionKey, never in the key-less `badge` input (Change 10).
   */
  checkItems: IconGridItem[] = [
    {
      icon: 'pi pi-box',
      labelKey: 'articleQualityGates.checks.grid.build.label',
      descriptionKey: 'articleQualityGates.checks.grid.build.description',
    },
    {
      icon: 'pi pi-link',
      labelKey: 'articleQualityGates.checks.grid.types.label',
      descriptionKey: 'articleQualityGates.checks.grid.types.description',
    },
    {
      icon: 'pi pi-book',
      labelKey: 'articleQualityGates.checks.grid.linter.label',
      descriptionKey: 'articleQualityGates.checks.grid.linter.description',
    },
    {
      icon: 'pi pi-align-center',
      labelKey: 'articleQualityGates.checks.grid.format.label',
      descriptionKey: 'articleQualityGates.checks.grid.format.description',
    },
    {
      icon: 'pi pi-check-square',
      labelKey: 'articleQualityGates.checks.grid.tests.label',
      descriptionKey: 'articleQualityGates.checks.grid.tests.description',
    },
  ];

  /**
   * The record as a form, six fields of equal weight - the owner field included
   * rather than relegated to prose (Phase-3 review, decided question 1). The
   * numerals are decorative order marks only and carry no meaning, which is why
   * `letter` may stay aria-hidden; the meaning is in every card title.
   * `monochrome` avoids the rainbow chips reading as a second icon grid.
   */
  recordCards: FrameworkCard[] = [
    {
      letter: '1',
      titleKey: 'articleQualityGates.exception.cards.rule.title',
      descriptionKey: 'articleQualityGates.exception.cards.rule.description',
    },
    {
      letter: '2',
      titleKey: 'articleQualityGates.exception.cards.when.title',
      descriptionKey: 'articleQualityGates.exception.cards.when.description',
    },
    {
      letter: '3',
      titleKey: 'articleQualityGates.exception.cards.why.title',
      descriptionKey: 'articleQualityGates.exception.cards.why.description',
    },
    {
      letter: '4',
      titleKey: 'articleQualityGates.exception.cards.background.title',
      descriptionKey: 'articleQualityGates.exception.cards.background.description',
    },
    {
      letter: '5',
      titleKey: 'articleQualityGates.exception.cards.conditions.title',
      descriptionKey: 'articleQualityGates.exception.cards.conditions.description',
    },
    {
      letter: '6',
      titleKey: 'articleQualityGates.exception.cards.owner.title',
      descriptionKey: 'articleQualityGates.exception.cards.owner.description',
    },
  ];

  // Illustration of a procedure, not user progress - every step stays 'pending'.
  timelineSteps: StepItem[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpoint1Items: CheckpointItem[] = [
    { textKey: 'articleQualityGates.checkpoint1.item1' },
    { textKey: 'articleQualityGates.checkpoint1.item2' },
    { textKey: 'articleQualityGates.checkpoint1.item3' },
  ];

  checkpoint2Items: CheckpointItem[] = [
    { textKey: 'articleQualityGates.checkpoint2.item1' },
    { textKey: 'articleQualityGates.checkpoint2.item2' },
    { textKey: 'articleQualityGates.checkpoint2.item3' },
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

  private updateSteps(): void {
    this.timelineSteps = [
      { id: 1, label: this.t('articleQualityGates.checks.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleQualityGates.checks.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleQualityGates.checks.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleQualityGates.checks.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleQualityGates.checks.step5'), status: 'pending' as const },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleQualityGates.quiz.' + key);
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
          { id: 'b', text: q('q2.b'), isCorrect: false },
          { id: 'c', text: q('q2.c'), isCorrect: false },
          { id: 'd', text: q('q2.d'), isCorrect: true },
        ],
        explanation: q('q2.explanation'),
      },
      {
        id: 'q3',
        question: q('q3.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q3.a'), isCorrect: true },
          { id: 'b', text: q('q3.b'), isCorrect: false },
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
