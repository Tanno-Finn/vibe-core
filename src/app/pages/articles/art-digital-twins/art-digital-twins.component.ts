/**
 * ArtDigitalTwinsComponent
 *
 * Educational article: what actually makes a digital twin a twin. Four test
 * questions about the wiring (real counterpart, automatic measurement in,
 * automatic return path, stated purpose and fidelity), the Model/Shadow/Twin
 * ladder, and the same test applied to the "AI twin of a person".
 *
 * Written from a reviewed concept spec — a pipeline document of the project this
 * kit was distilled from, not shipped with the kit.
 *            (14 binding changes, 5 recommended)
 *
 * The four questions are worded once (test.q1..q4) and re-rendered verbatim in
 * the close - review Change 2 requires one discriminating wording everywhere.
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
  selector: 'app-art-digital-twins',
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
        <p class="lead-text" [appHighlight]="t('articleDigitalTwins.lead.paragraph1')">
          {{ t('articleDigitalTwins.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleDigitalTwins.lead.paragraph2')">{{ t('articleDigitalTwins.lead.paragraph2') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.lead.paragraph3')">{{ t('articleDigitalTwins.lead.paragraph3') }}</p>

        <app-standard-container [config]="objectivesConfig">
          <ol class="objectives-list">
            <li [appHighlight]="t('articleDigitalTwins.objectives.item1')">
              {{ t('articleDigitalTwins.objectives.item1') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.objectives.item2')">
              {{ t('articleDigitalTwins.objectives.item2') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.objectives.item3')">
              {{ t('articleDigitalTwins.objectives.item3') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.objectives.item4')">
              {{ t('articleDigitalTwins.objectives.item4') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.objectives.item5')">
              {{ t('articleDigitalTwins.objectives.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Supporting: origin story -->
      <section id="origin" class="article-section">
        <h2 [appHighlight]="t('articleDigitalTwins.origin.title')">{{ t('articleDigitalTwins.origin.title') }}</h2>

        <p [appHighlight]="t('articleDigitalTwins.origin.concept')">{{ t('articleDigitalTwins.origin.concept') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.origin.documents')">
          {{ t('articleDigitalTwins.origin.documents') }}
        </p>
        <p [appHighlight]="t('articleDigitalTwins.origin.substance')">
          {{ t('articleDigitalTwins.origin.substance') }}
        </p>
        <p [appHighlight]="t('articleDigitalTwins.origin.dispute')">{{ t('articleDigitalTwins.origin.dispute') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleDigitalTwins.origin.merke')">
          {{ t('articleDigitalTwins.origin.merke') }}
        </p>
        <p [appHighlight]="t('articleDigitalTwins.origin.misconceptions')">
          {{ t('articleDigitalTwins.origin.misconceptions') }}
        </p>
      </section>

      <!-- K1: the coupling test -->
      <section id="test" class="article-section">
        <h2 [appHighlight]="t('articleDigitalTwins.test.title')">{{ t('articleDigitalTwins.test.title') }}</h2>

        <p [appHighlight]="t('articleDigitalTwins.test.analogy1')">{{ t('articleDigitalTwins.test.analogy1') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.test.analogy2')">{{ t('articleDigitalTwins.test.analogy2') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.test.analogy3')">{{ t('articleDigitalTwins.test.analogy3') }}</p>

        <app-definition
          [title]="t('articleDigitalTwins.test.definitionTitle')"
          [firstOptionLabel]="t('articleDigitalTwins.test.definitionEverydayLabel')"
          [firstOptionContent]="t('articleDigitalTwins.test.definitionEveryday')"
          [secondOptionLabel]="t('articleDigitalTwins.test.definitionPreciseLabel')"
          [secondOptionContent]="t('articleDigitalTwins.test.definitionPrecise')"
          [showExample]="false"
          icon="pi pi-sync"
          type="primary"
        >
        </app-definition>

        <h3 [appHighlight]="t('articleDigitalTwins.test.questionsTitle')">
          {{ t('articleDigitalTwins.test.questionsTitle') }}
        </h3>
        <app-icon-grid [items]="testQuestions" [showDescriptions]="true" color="blue" [columns]="2"></app-icon-grid>

        <p [appHighlight]="t('articleDigitalTwins.test.convergence')">
          {{ t('articleDigitalTwins.test.convergence') }}
        </p>

        <app-standard-container [config]="testMisconception1Config">
          <p [appHighlight]="t('articleDigitalTwins.test.misconception1.text')">
            {{ t('articleDigitalTwins.test.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="testMisconception2Config">
          <p [appHighlight]="t('articleDigitalTwins.test.misconception2.text')">
            {{ t('articleDigitalTwins.test.misconception2.text') }}
          </p>
        </app-standard-container>

        <h3 [appHighlight]="t('articleDigitalTwins.test.breakTitle')">
          {{ t('articleDigitalTwins.test.breakTitle') }}
        </h3>
        <p [appHighlight]="t('articleDigitalTwins.test.analogyBreak')">
          {{ t('articleDigitalTwins.test.analogyBreak') }}
        </p>
      </section>

      <!-- K2: model / shadow / twin -->
      <section id="ladder" class="article-section">
        <h2 [appHighlight]="t('articleDigitalTwins.ladder.title')">{{ t('articleDigitalTwins.ladder.title') }}</h2>

        <p [appHighlight]="t('articleDigitalTwins.ladder.intro')">{{ t('articleDigitalTwins.ladder.intro') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.ladder.naming')">{{ t('articleDigitalTwins.ladder.naming') }}</p>

        <app-standard-container [config]="ladderStepsConfig">
          <p class="illustration-note" [appHighlight]="t('articleDigitalTwins.ladder.illustrationNote')">
            {{ t('articleDigitalTwins.ladder.illustrationNote') }}
          </p>
          <p [appHighlight]="t('articleDigitalTwins.ladder.setup')">{{ t('articleDigitalTwins.ladder.setup') }}</p>
          <app-step-indicator
            [steps]="ladderSteps"
            layout="vertical"
            [showConnectors]="true"
            [ariaLabel]="t('articleDigitalTwins.ladder.stepsAriaLabel')"
          >
          </app-step-indicator>
        </app-standard-container>

        <p [appHighlight]="t('articleDigitalTwins.ladder.level1')">{{ t('articleDigitalTwins.ladder.level1') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.ladder.level2')">{{ t('articleDigitalTwins.ladder.level2') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.ladder.level3')">{{ t('articleDigitalTwins.ladder.level3') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleDigitalTwins.ladder.punchline')">
          {{ t('articleDigitalTwins.ladder.punchline') }}
        </p>

        <app-standard-container [config]="ladderMisconception3Config">
          <p [appHighlight]="t('articleDigitalTwins.ladder.misconception3.text')">
            {{ t('articleDigitalTwins.ladder.misconception3.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="ladderMisconception4Config">
          <p [appHighlight]="t('articleDigitalTwins.ladder.misconception4.text')">
            {{ t('articleDigitalTwins.ladder.misconception4.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="ladderDeepDiveConfig">
          <p [appHighlight]="t('articleDigitalTwins.ladder.deepDive.text1')">
            {{ t('articleDigitalTwins.ladder.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleDigitalTwins.ladder.deepDive.text2')">
            {{ t('articleDigitalTwins.ladder.deepDive.text2') }}
          </p>
          <p [appHighlight]="t('articleDigitalTwins.ladder.deepDive.text3')">
            {{ t('articleDigitalTwins.ladder.deepDive.text3') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Supporting: where the term earns its keep -->
      <section id="works" class="article-section">
        <h2 [appHighlight]="t('articleDigitalTwins.works.title')">{{ t('articleDigitalTwins.works.title') }}</h2>

        <p [appHighlight]="t('articleDigitalTwins.works.aircraft1')">{{ t('articleDigitalTwins.works.aircraft1') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.works.aircraft2')">{{ t('articleDigitalTwins.works.aircraft2') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.works.aircraft3')">{{ t('articleDigitalTwins.works.aircraft3') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.works.caveat')">{{ t('articleDigitalTwins.works.caveat') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.works.human1')">{{ t('articleDigitalTwins.works.human1') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.works.human2')">{{ t('articleDigitalTwins.works.human2') }}</p>
      </section>

      <!-- K3: the AI twin of a person -->
      <section id="person" class="article-section">
        <h2 [appHighlight]="t('articleDigitalTwins.person.title')">{{ t('articleDigitalTwins.person.title') }}</h2>

        <p [appHighlight]="t('articleDigitalTwins.person.intro')">{{ t('articleDigitalTwins.person.intro') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.person.institutional')">
          {{ t('articleDigitalTwins.person.institutional') }}
        </p>
        <p [appHighlight]="t('articleDigitalTwins.person.product')">{{ t('articleDigitalTwins.person.product') }}</p>

        <h3 [appHighlight]="t('articleDigitalTwins.person.checksTitle')">
          {{ t('articleDigitalTwins.person.checksTitle') }}
        </h3>
        <ol class="checks-list">
          <li [appHighlight]="t('articleDigitalTwins.person.check1')">{{ t('articleDigitalTwins.person.check1') }}</li>
          <li [appHighlight]="t('articleDigitalTwins.person.check2')">{{ t('articleDigitalTwins.person.check2') }}</li>
          <li [appHighlight]="t('articleDigitalTwins.person.check3')">{{ t('articleDigitalTwins.person.check3') }}</li>
          <li [appHighlight]="t('articleDigitalTwins.person.check4')">{{ t('articleDigitalTwins.person.check4') }}</li>
        </ol>
        <p class="key-sentence" [appHighlight]="t('articleDigitalTwins.person.score')">
          {{ t('articleDigitalTwins.person.score') }}
        </p>

        <p [appHighlight]="t('articleDigitalTwins.person.calibration')">
          {{ t('articleDigitalTwins.person.calibration') }}
        </p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleDigitalTwins.person.statA.label'"
            [value]="t('articleDigitalTwins.person.statA.value')"
            icon="pi pi-comments"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleDigitalTwins.person.statA.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleDigitalTwins.person.statB.label'"
            [value]="t('articleDigitalTwins.person.statB.value')"
            icon="pi pi-users"
            color="orange"
            variant="gradient"
            [descriptionKey]="'articleDigitalTwins.person.statB.description'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleDigitalTwins.person.snapshot')">{{ t('articleDigitalTwins.person.snapshot') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.person.benchmark')">
          {{ t('articleDigitalTwins.person.benchmark') }}
        </p>

        <p [appHighlight]="t('articleDigitalTwins.person.portrait1')">
          {{ t('articleDigitalTwins.person.portrait1') }}
        </p>
        <p [appHighlight]="t('articleDigitalTwins.person.portrait2')">
          {{ t('articleDigitalTwins.person.portrait2') }}
        </p>

        <app-comparison
          layout="horizontal"
          variant="neutral"
          [ariaLabel]="t('articleDigitalTwins.person.comparison.ariaLabel')"
          [beforeLabel]="t('articleDigitalTwins.person.comparison.beforeLabel')"
          [beforeResult]="t('articleDigitalTwins.person.comparison.beforeResult')"
          [afterLabel]="t('articleDigitalTwins.person.comparison.afterLabel')"
          [afterResult]="t('articleDigitalTwins.person.comparison.afterResult')"
        >
          <p slot="before" [appHighlight]="t('articleDigitalTwins.person.comparison.beforeText')">
            {{ t('articleDigitalTwins.person.comparison.beforeText') }}
          </p>
          <p slot="after" [appHighlight]="t('articleDigitalTwins.person.comparison.afterText')">
            {{ t('articleDigitalTwins.person.comparison.afterText') }}
          </p>
        </app-comparison>

        <app-standard-container [config]="personMisconception5Config">
          <p [appHighlight]="t('articleDigitalTwins.person.misconception5.text')">
            {{ t('articleDigitalTwins.person.misconception5.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="personMisconception6Config">
          <p [appHighlight]="t('articleDigitalTwins.person.misconception6.text')">
            {{ t('articleDigitalTwins.person.misconception6.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleDigitalTwins.person.delimitation')">
          {{ t('articleDigitalTwins.person.delimitation') }}
        </p>
      </section>

      <!-- Supporting: limits -->
      <section id="limits" class="article-section">
        <h2 [appHighlight]="t('articleDigitalTwins.limits.title')">{{ t('articleDigitalTwins.limits.title') }}</h2>

        <p [appHighlight]="t('articleDigitalTwins.limits.useless')">{{ t('articleDigitalTwins.limits.useless') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.limits.objections')">
          {{ t('articleDigitalTwins.limits.objections') }}
        </p>

        <app-standard-container [config]="limitsRightsConfig">
          <p [appHighlight]="t('articleDigitalTwins.limits.rights.text1')">
            {{ t('articleDigitalTwins.limits.rights.text1') }}
          </p>
          <p [appHighlight]="t('articleDigitalTwins.limits.rights.text2')">
            {{ t('articleDigitalTwins.limits.rights.text2') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleDigitalTwins.limits.selfTest1')">
          {{ t('articleDigitalTwins.limits.selfTest1') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleDigitalTwins.limits.selfTest2')">
          {{ t('articleDigitalTwins.limits.selfTest2') }}
        </p>

        <app-standard-container [config]="limitsDeepDiveConfig">
          <p [appHighlight]="t('articleDigitalTwins.limits.deepDive.text1')">
            {{ t('articleDigitalTwins.limits.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleDigitalTwins.limits.deepDive.text2')">
            {{ t('articleDigitalTwins.limits.deepDive.text2') }}
          </p>
          <p [appHighlight]="t('articleDigitalTwins.limits.deepDive.text3')">
            {{ t('articleDigitalTwins.limits.deepDive.text3') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Close: the four questions, verbatim from the icon grid above -->
      <section id="close" class="article-section">
        <h2 [appHighlight]="t('articleDigitalTwins.close.title')">{{ t('articleDigitalTwins.close.title') }}</h2>
        <p [appHighlight]="t('articleDigitalTwins.close.text1')">{{ t('articleDigitalTwins.close.text1') }}</p>
        <p [appHighlight]="t('articleDigitalTwins.close.questionsIntro')">
          {{ t('articleDigitalTwins.close.questionsIntro') }}
        </p>
        <ol class="questions-list">
          <li [appHighlight]="t('articleDigitalTwins.test.q1.label')">{{ t('articleDigitalTwins.test.q1.label') }}</li>
          <li [appHighlight]="t('articleDigitalTwins.test.q2.label')">{{ t('articleDigitalTwins.test.q2.label') }}</li>
          <li [appHighlight]="t('articleDigitalTwins.test.q3.label')">{{ t('articleDigitalTwins.test.q3.label') }}</li>
          <li [appHighlight]="t('articleDigitalTwins.test.q4.label')">{{ t('articleDigitalTwins.test.q4.label') }}</li>
        </ol>
        <p [appHighlight]="t('articleDigitalTwins.close.text2')">{{ t('articleDigitalTwins.close.text2') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleDigitalTwins.close.text3')">
          {{ t('articleDigitalTwins.close.text3') }}
        </p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleDigitalTwins.takeaways.item1')">
              {{ t('articleDigitalTwins.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.takeaways.item2')">
              {{ t('articleDigitalTwins.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.takeaways.item3')">
              {{ t('articleDigitalTwins.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.takeaways.item4')">
              {{ t('articleDigitalTwins.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleDigitalTwins.takeaways.item5')">
              {{ t('articleDigitalTwins.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="digital-twins"
          [items]="checkpointItems"
          [titleKey]="'articleDigitalTwins.checkpoint.title'"
          storageKey="art-digital-twins-checkpoint"
        >
        </app-checkpoint>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-digital-twins-quiz"
          [titleKey]="'articleDigitalTwins.quiz.boxTitle'"
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

      .illustration-note {
        font-style: italic;
        color: var(--text-color-secondary);
        margin-bottom: var(--space-3);
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--space-4);
        margin: var(--space-5) 0;
      }

      .takeaways-list,
      .objectives-list,
      .checks-list,
      .questions-list {
        margin: 0;
        padding-left: var(--space-6);
      }

      .takeaways-list li,
      .objectives-list li,
      .checks-list li,
      .questions-list li {
        margin-bottom: var(--space-3);
        line-height: 1.6;
      }

      .checks-list,
      .questions-list {
        margin: var(--space-4) 0;
      }

      @media (max-width: 768px) {
        .stat-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ArtDigitalTwinsComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-digital-twins',
    titleKey: 'articleDigitalTwins.hero.title',
    subtitleKey: 'articleDigitalTwins.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    // 11 min, nicht die im Konzept geschaetzten 9: das Modul traegt 4.215
    // Woerter, und 9 min ergaeben 468 Woerter/Minute - schneller als jeder
    // bestehende Artikel (secr 387, gate 285, lwai 219). 11 min entspricht der
    // secr-Rate. Der Kernpfad selbst liegt mit 2.039 Woertern im Plan.
    readingTime: '11 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleDigitalTwins.toc.lead' },
    { id: 'origin', key: 'articleDigitalTwins.toc.origin' },
    { id: 'test', key: 'articleDigitalTwins.toc.test' },
    { id: 'ladder', key: 'articleDigitalTwins.toc.ladder' },
    { id: 'works', key: 'articleDigitalTwins.toc.works' },
    { id: 'person', key: 'articleDigitalTwins.toc.person' },
    { id: 'limits', key: 'articleDigitalTwins.toc.limits' },
    { id: 'close', key: 'articleDigitalTwins.toc.close' },
    { id: 'takeaways', key: 'articleDigitalTwins.toc.takeaways' },
    { id: 'checkpoint', key: 'articleDigitalTwins.toc.checkpoint' },
    { id: 'quiz', key: 'articleDigitalTwins.toc.quiz' },
  ];

  objectivesConfig: ContainerConfig = {
    titleKey: 'articleDigitalTwins.objectives.title',
    type: 'info',
    icon: 'pi pi-flag',
  };

  testMisconception1Config: ContainerConfig = {
    titleKey: 'articleDigitalTwins.test.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  testMisconception2Config: ContainerConfig = {
    titleKey: 'articleDigitalTwins.test.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  ladderStepsConfig: ContainerConfig = {
    titleKey: 'articleDigitalTwins.ladder.stepsTitle',
    type: 'info',
    icon: 'pi pi-sort-amount-up',
  };

  ladderMisconception3Config: ContainerConfig = {
    titleKey: 'articleDigitalTwins.ladder.misconception3.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  ladderMisconception4Config: ContainerConfig = {
    titleKey: 'articleDigitalTwins.ladder.misconception4.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  ladderDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleDigitalTwins.ladder.deepDive.title',
    type: 'info',
    icon: 'pi pi-globe',
    collapsible: true,
    initiallyExpanded: false,
  };

  personMisconception5Config: ContainerConfig = {
    titleKey: 'articleDigitalTwins.person.misconception5.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  personMisconception6Config: ContainerConfig = {
    titleKey: 'articleDigitalTwins.person.misconception6.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  limitsRightsConfig: ContainerConfig = {
    titleKey: 'articleDigitalTwins.limits.rights.title',
    type: 'warning',
    icon: 'pi pi-lock',
  };

  limitsDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleDigitalTwins.limits.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleDigitalTwins.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /**
   * The four test questions. Their wording is fixed by review Change 2 and is
   * re-used verbatim in the close, in section "person" and in the deep dive -
   * never paraphrased, because the reader is meant to recognize them again.
   */
  testQuestions: IconGridItem[] = [
    {
      icon: 'pi pi-box',
      labelKey: 'articleDigitalTwins.test.q1.label',
      descriptionKey: 'articleDigitalTwins.test.q1.description',
    },
    {
      icon: 'pi pi-chart-line',
      labelKey: 'articleDigitalTwins.test.q2.label',
      descriptionKey: 'articleDigitalTwins.test.q2.description',
    },
    {
      icon: 'pi pi-replay',
      labelKey: 'articleDigitalTwins.test.q3.label',
      descriptionKey: 'articleDigitalTwins.test.q3.description',
    },
    {
      icon: 'pi pi-compass',
      labelKey: 'articleDigitalTwins.test.q4.label',
      descriptionKey: 'articleDigitalTwins.test.q4.description',
    },
  ];

  // Illustration of an escalation, not user progress - every step stays 'pending'.
  ladderSteps: StepItem[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleDigitalTwins.checkpoint.item1' },
    { textKey: 'articleDigitalTwins.checkpoint.item2' },
    { textKey: 'articleDigitalTwins.checkpoint.item3' },
    { textKey: 'articleDigitalTwins.checkpoint.item4' },
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
    this.ladderSteps = [
      {
        id: 1,
        label: this.t('articleDigitalTwins.ladder.step1'),
        description: this.t('articleDigitalTwins.ladder.step1Desc'),
        status: 'pending' as const,
      },
      {
        id: 2,
        label: this.t('articleDigitalTwins.ladder.step2'),
        description: this.t('articleDigitalTwins.ladder.step2Desc'),
        status: 'pending' as const,
      },
      {
        id: 3,
        label: this.t('articleDigitalTwins.ladder.step3'),
        description: this.t('articleDigitalTwins.ladder.step3Desc'),
        status: 'pending' as const,
      },
    ];
  }

  /**
   * Five questions, Bloom 2x Remember / 2x Apply / 1x Analyze.
   * Review Change 6: the correct option is never the longest one - in every
   * question at least one distractor is longer than the key.
   */
  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleDigitalTwins.quiz.' + key);
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
          { id: 'c', text: q('q2.c'), isCorrect: true },
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
          { id: 'b', text: q('q3.b'), isCorrect: false },
          { id: 'c', text: q('q3.c'), isCorrect: true },
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
          { id: 'b', text: q('q4.b'), isCorrect: true },
          { id: 'c', text: q('q4.c'), isCorrect: false },
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
          { id: 'b', text: q('q5.b'), isCorrect: false },
          { id: 'c', text: q('q5.c'), isCorrect: false },
          { id: 'd', text: q('q5.d'), isCorrect: true },
        ],
        explanation: q('q5.explanation'),
      },
    ];
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
