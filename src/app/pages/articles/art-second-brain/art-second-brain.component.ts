/**
 * ArtSecondBrainComponent
 *
 * Educational article: a second brain is not a store but a procedure - the
 * asymmetry inside CODE (capture and organize are cheap, distill and express
 * create the value), the measured reason why access feels like understanding,
 * and what changes once an assistant can be pointed at your own notes.
 *
 * Written from a reviewed concept spec — a pipeline document of the project this
 * kit was distilled from, not shipped with the kit.
 *            (17 mandatory changes, 1-7 gating)
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
import { TimelineComponent, TimelineEvent } from '../../../components/didactic/timeline.component';
import { CheckpointComponent, CheckpointItem } from '../../../components/shared/checkpoint.component';
import { QuizContainerComponent, QuizQuestion } from '../../../components/shared/quiz-container.component';
import { HighlightDirective } from '../../../directives/highlight.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-art-second-brain',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    StatCardComponent,
    StepIndicatorComponent,
    TimelineComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead: die Trichter-Rechnung, offen als Modell -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleSecondBrain.lead.paragraph1')">
          {{ t('articleSecondBrain.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleSecondBrain.lead.paragraph2')">{{ t('articleSecondBrain.lead.paragraph2') }}</p>
        <p [appHighlight]="t('articleSecondBrain.lead.paragraph3')">{{ t('articleSecondBrain.lead.paragraph3') }}</p>
      </section>

      <!-- K1: Was ein zweites Gehirn ist -->
      <section id="brain" class="article-section">
        <h2 [appHighlight]="t('articleSecondBrain.brain.title')">{{ t('articleSecondBrain.brain.title') }}</h2>

        <p [appHighlight]="t('articleSecondBrain.brain.build1')">{{ t('articleSecondBrain.brain.build1') }}</p>
        <p [appHighlight]="t('articleSecondBrain.brain.build2')">{{ t('articleSecondBrain.brain.build2') }}</p>

        <app-definition
          [title]="t('articleSecondBrain.brain.definitionTitle')"
          [firstOptionLabel]="t('articleSecondBrain.brain.definitionEverydayLabel')"
          [firstOptionContent]="t('articleSecondBrain.brain.definitionEveryday')"
          [secondOptionLabel]="t('articleSecondBrain.brain.definitionPreciseLabel')"
          [secondOptionContent]="t('articleSecondBrain.brain.definitionPrecise')"
          [showExample]="false"
          icon="pi pi-inbox"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleSecondBrain.brain.notAnApp')">{{ t('articleSecondBrain.brain.notAnApp') }}</p>
        <p [appHighlight]="t('articleSecondBrain.brain.example')">{{ t('articleSecondBrain.brain.example') }}</p>

        <app-standard-container [config]="brainMisconceptionConfig">
          <p [appHighlight]="t('articleSecondBrain.brain.misconception.text')">
            {{ t('articleSecondBrain.brain.misconception.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleSecondBrain.brain.analogyBreak')">
          {{ t('articleSecondBrain.brain.analogyBreak') }}
        </p>
      </section>

      <!-- Stuetzpassage: Herkunft -->
      <section id="origin" class="article-section">
        <h2 [appHighlight]="t('articleSecondBrain.origin.title')">{{ t('articleSecondBrain.origin.title') }}</h2>

        <app-timeline [events]="originEvents" orientation="vertical" color="primary" [headingLevel]="3"></app-timeline>

        <p [appHighlight]="t('articleSecondBrain.origin.text1')">{{ t('articleSecondBrain.origin.text1') }}</p>
        <p [appHighlight]="t('articleSecondBrain.origin.text2')">{{ t('articleSecondBrain.origin.text2') }}</p>
        <p [appHighlight]="t('articleSecondBrain.origin.text3')">{{ t('articleSecondBrain.origin.text3') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleSecondBrain.origin.useful')">
          {{ t('articleSecondBrain.origin.useful') }}
        </p>
      </section>

      <!-- K2: Die schiefe Haelfte -->
      <section id="code" class="article-section">
        <h2 [appHighlight]="t('articleSecondBrain.code.title')">{{ t('articleSecondBrain.code.title') }}</h2>

        <p [appHighlight]="t('articleSecondBrain.code.intro')">{{ t('articleSecondBrain.code.intro') }}</p>
        <p [appHighlight]="t('articleSecondBrain.code.kitchen1')">{{ t('articleSecondBrain.code.kitchen1') }}</p>
        <p [appHighlight]="t('articleSecondBrain.code.kitchen2')">{{ t('articleSecondBrain.code.kitchen2') }}</p>

        <p [appHighlight]="t('articleSecondBrain.code.funnelIntro')">{{ t('articleSecondBrain.code.funnelIntro') }}</p>

        <app-standard-container [config]="funnelConfig">
          <app-step-indicator
            [steps]="funnelSteps"
            layout="vertical"
            [showConnectors]="true"
            [ariaLabel]="t('articleSecondBrain.code.stepsAriaLabel')"
          >
          </app-step-indicator>
        </app-standard-container>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleSecondBrain.code.statLabel'"
            [value]="t('articleSecondBrain.code.statValue')"
            icon="pi pi-filter"
            color="orange"
            variant="gradient"
            [descriptionKey]="'articleSecondBrain.code.statDescription'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleSecondBrain.code.secondCalc')">{{ t('articleSecondBrain.code.secondCalc') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleSecondBrain.code.lever')">
          {{ t('articleSecondBrain.code.lever') }}
        </p>
        <p [appHighlight]="t('articleSecondBrain.code.para')">{{ t('articleSecondBrain.code.para') }}</p>

        <h3 [appHighlight]="t('articleSecondBrain.code.retrievalTitle')">
          {{ t('articleSecondBrain.code.retrievalTitle') }}
        </h3>
        <p [appHighlight]="t('articleSecondBrain.code.retrieval1')">{{ t('articleSecondBrain.code.retrieval1') }}</p>
        <p [appHighlight]="t('articleSecondBrain.code.retrieval2')">{{ t('articleSecondBrain.code.retrieval2') }}</p>
        <p [appHighlight]="t('articleSecondBrain.code.retrieval3')">{{ t('articleSecondBrain.code.retrieval3') }}</p>

        <app-standard-container [config]="codeMisconceptionConfig">
          <p [appHighlight]="t('articleSecondBrain.code.misconception.text')">
            {{ t('articleSecondBrain.code.misconception.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="codeDeepDiveConfig">
          <p [appHighlight]="t('articleSecondBrain.code.deepDive.text1')">
            {{ t('articleSecondBrain.code.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleSecondBrain.code.deepDive.text2')">
            {{ t('articleSecondBrain.code.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- K3: Sammeln ist nicht Verstehen -->
      <section id="limit" class="article-section">
        <h2 [appHighlight]="t('articleSecondBrain.limit.title')">{{ t('articleSecondBrain.limit.title') }}</h2>

        <p [appHighlight]="t('articleSecondBrain.limit.intro')">{{ t('articleSecondBrain.limit.intro') }}</p>
        <p [appHighlight]="t('articleSecondBrain.limit.experiment1')">
          {{ t('articleSecondBrain.limit.experiment1') }}
        </p>
        <p [appHighlight]="t('articleSecondBrain.limit.experiment2')">
          {{ t('articleSecondBrain.limit.experiment2') }}
        </p>
        <p [appHighlight]="t('articleSecondBrain.limit.experiment3')">
          {{ t('articleSecondBrain.limit.experiment3') }}
        </p>
        <p [appHighlight]="t('articleSecondBrain.limit.experiment4')">
          {{ t('articleSecondBrain.limit.experiment4') }}
        </p>

        <app-comparison
          layout="horizontal"
          variant="neutral"
          [ariaLabel]="t('articleSecondBrain.limit.comparison.ariaLabel')"
          [beforeLabel]="t('articleSecondBrain.limit.comparison.beforeLabel')"
          [beforeResult]="t('articleSecondBrain.limit.comparison.beforeResult')"
          [afterLabel]="t('articleSecondBrain.limit.comparison.afterLabel')"
          [afterResult]="t('articleSecondBrain.limit.comparison.afterResult')"
        >
          <p slot="before" [appHighlight]="t('articleSecondBrain.limit.comparison.beforeText')">
            {{ t('articleSecondBrain.limit.comparison.beforeText') }}
          </p>
          <p slot="after" [appHighlight]="t('articleSecondBrain.limit.comparison.afterText')">
            {{ t('articleSecondBrain.limit.comparison.afterText') }}
          </p>
        </app-comparison>

        <app-standard-container [config]="limitMisconceptionConfig">
          <p [appHighlight]="t('articleSecondBrain.limit.misconception.text')">
            {{ t('articleSecondBrain.limit.misconception.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleSecondBrain.limit.luhmannContext')">
          {{ t('articleSecondBrain.limit.luhmannContext') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleSecondBrain.limit.luhmannQuote')">
          {{ t('articleSecondBrain.limit.luhmannQuote') }}
        </p>
        <p [appHighlight]="t('articleSecondBrain.limit.analogyBreak')">
          {{ t('articleSecondBrain.limit.analogyBreak') }}
        </p>

        <app-standard-container [config]="limitDeepDiveConfig">
          <p [appHighlight]="t('articleSecondBrain.limit.deepDive.text1')">
            {{ t('articleSecondBrain.limit.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleSecondBrain.limit.deepDive.text2')">
            {{ t('articleSecondBrain.limit.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Stuetzpassage: die KI-Wende -->
      <section id="ai" class="article-section">
        <h2 [appHighlight]="t('articleSecondBrain.ai.title')">{{ t('articleSecondBrain.ai.title') }}</h2>

        <p [appHighlight]="t('articleSecondBrain.ai.text1')">{{ t('articleSecondBrain.ai.text1') }}</p>
        <p [appHighlight]="t('articleSecondBrain.ai.text2')">{{ t('articleSecondBrain.ai.text2') }}</p>
        <p [appHighlight]="t('articleSecondBrain.ai.text3')">{{ t('articleSecondBrain.ai.text3') }}</p>
        <p [appHighlight]="t('articleSecondBrain.ai.survey')">{{ t('articleSecondBrain.ai.survey') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleSecondBrain.ai.bottleneck')">
          {{ t('articleSecondBrain.ai.bottleneck') }}
        </p>

        <app-standard-container [config]="privacyConfig">
          <p [appHighlight]="t('articleSecondBrain.privacy.text1')">{{ t('articleSecondBrain.privacy.text1') }}</p>
          <p [appHighlight]="t('articleSecondBrain.privacy.text2')">{{ t('articleSecondBrain.privacy.text2') }}</p>
          <p [appHighlight]="t('articleSecondBrain.privacy.text3')">{{ t('articleSecondBrain.privacy.text3') }}</p>
        </app-standard-container>
      </section>

      <!-- Stuetzpassage: doppelte Selbstreferenz -->
      <section id="mirror" class="article-section">
        <h2 [appHighlight]="t('articleSecondBrain.mirror.title')">{{ t('articleSecondBrain.mirror.title') }}</h2>

        <p [appHighlight]="t('articleSecondBrain.mirror.text1')">{{ t('articleSecondBrain.mirror.text1') }}</p>
        <p [appHighlight]="t('articleSecondBrain.mirror.text2')">{{ t('articleSecondBrain.mirror.text2') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleSecondBrain.mirror.text3')">
          {{ t('articleSecondBrain.mirror.text3') }}
        </p>
        <p [appHighlight]="t('articleSecondBrain.mirror.forward')">{{ t('articleSecondBrain.mirror.forward') }}</p>
      </section>

      <!-- Abschluss -->
      <section id="close" class="article-section">
        <h2 [appHighlight]="t('articleSecondBrain.close.title')">{{ t('articleSecondBrain.close.title') }}</h2>
        <p [appHighlight]="t('articleSecondBrain.close.text1')">{{ t('articleSecondBrain.close.text1') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleSecondBrain.close.text2')">
          {{ t('articleSecondBrain.close.text2') }}
        </p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleSecondBrain.takeaways.item1')">
              {{ t('articleSecondBrain.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleSecondBrain.takeaways.item2')">
              {{ t('articleSecondBrain.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleSecondBrain.takeaways.item3')">
              {{ t('articleSecondBrain.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleSecondBrain.takeaways.item4')">
              {{ t('articleSecondBrain.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleSecondBrain.takeaways.item5')">
              {{ t('articleSecondBrain.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="second-brain"
          [items]="checkpointItems"
          [titleKey]="'articleSecondBrain.checkpoint.title'"
          storageKey="art-second-brain-checkpoint"
        >
        </app-checkpoint>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-second-brain-quiz"
          [titleKey]="'articleSecondBrain.quiz.boxTitle'"
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

      .takeaways-list {
        margin: 0;
        padding-left: var(--space-6);
      }

      .takeaways-list li {
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
export class ArtSecondBrainComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-second-brain',
    titleKey: 'articleSecondBrain.hero.title',
    subtitleKey: 'articleSecondBrain.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '11 min',
    difficulty: 'beginner',
    difficultyKey: 'articles.difficulty.beginner',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleSecondBrain.toc.lead' },
    { id: 'brain', key: 'articleSecondBrain.toc.brain' },
    { id: 'origin', key: 'articleSecondBrain.toc.origin' },
    { id: 'code', key: 'articleSecondBrain.toc.code' },
    { id: 'limit', key: 'articleSecondBrain.toc.limit' },
    { id: 'ai', key: 'articleSecondBrain.toc.ai' },
    { id: 'mirror', key: 'articleSecondBrain.toc.mirror' },
    { id: 'close', key: 'articleSecondBrain.toc.close' },
    { id: 'takeaways', key: 'articleSecondBrain.toc.takeaways' },
    { id: 'checkpoint', key: 'articleSecondBrain.toc.checkpoint' },
    { id: 'quiz', key: 'articleSecondBrain.toc.quiz' },
  ];

  brainMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.brain.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  funnelConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.code.stepsTitle',
    type: 'info',
    icon: 'pi pi-filter',
  };

  codeMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.code.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  privacyConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.privacy.title',
    type: 'warning',
    icon: 'pi pi-lock',
  };

  codeDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.code.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  limitMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.limit.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  limitDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.limit.deepDive.title',
    type: 'info',
    icon: 'pi pi-verified',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleSecondBrain.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  // Illustration of the funnel, not user progress - every step stays 'pending'.
  funnelSteps: StepItem[] = [];

  originEvents: TimelineEvent[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleSecondBrain.checkpoint.item1' },
    { textKey: 'articleSecondBrain.checkpoint.item2' },
    { textKey: 'articleSecondBrain.checkpoint.item3' },
  ];

  ngOnInit(): void {
    this.updateTocItems();
    this.updateFunnelSteps();
    this.updateOriginEvents();
    this.updateQuizQuestions();
    this.langSub = this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateTocItems();
      this.updateFunnelSteps();
      this.updateOriginEvents();
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

  private updateFunnelSteps(): void {
    this.funnelSteps = [
      {
        id: 1,
        label: this.t('articleSecondBrain.code.step1.label'),
        description: this.t('articleSecondBrain.code.step1.description'),
        status: 'pending' as const,
      },
      {
        id: 2,
        label: this.t('articleSecondBrain.code.step2.label'),
        description: this.t('articleSecondBrain.code.step2.description'),
        status: 'pending' as const,
      },
      {
        id: 3,
        label: this.t('articleSecondBrain.code.step3.label'),
        description: this.t('articleSecondBrain.code.step3.description'),
        status: 'pending' as const,
      },
      {
        id: 4,
        label: this.t('articleSecondBrain.code.step4.label'),
        description: this.t('articleSecondBrain.code.step4.description'),
        status: 'pending' as const,
      },
    ];
  }

  private updateOriginEvents(): void {
    // Concatenation base kept ending on a dot so check-i18n-keys.mjs recognizes
    // it as a dynamic prefix rather than a (non-existent) literal key.
    const e = (n: number, field: string) => this.t('articleSecondBrain.origin.' + `event${n}.${field}`);
    this.originEvents = [1, 2, 3, 4, 5].map((n) => ({
      date: e(n, 'date'),
      title: e(n, 'title'),
      description: e(n, 'description'),
      past: true,
    }));
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleSecondBrain.quiz.' + key);
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
          { id: 'c', text: q('q5.c'), isCorrect: true },
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
