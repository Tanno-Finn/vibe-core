/**
 * ArtAgentTestsComponent
 *
 * Educational article: how to read an automated test without programming
 * knowledge, what green and coverage actually prove, and the softening trap
 * that appears when the agent owns both the code and the checks on it.
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
  selector: 'app-art-agent-tests',
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
        <p class="lead-text" [appHighlight]="t('articleAgentTests.lead.paragraph1')">
          {{ t('articleAgentTests.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.lead.paragraph2')">{{ t('articleAgentTests.lead.paragraph2') }}</p>
      </section>

      <!-- Kernthese + Lernziele -->
      <section id="thesis" class="article-section">
        <h2 [appHighlight]="t('articleAgentTests.thesis.title')">{{ t('articleAgentTests.thesis.title') }}</h2>
        <p [appHighlight]="t('articleAgentTests.thesis.text1')">{{ t('articleAgentTests.thesis.text1') }}</p>

        <app-standard-container [config]="objectivesConfig">
          <ol class="objectives-list">
            <li [appHighlight]="t('articleAgentTests.thesis.objectives.item1')">
              {{ t('articleAgentTests.thesis.objectives.item1') }}
            </li>
            <li [appHighlight]="t('articleAgentTests.thesis.objectives.item2')">
              {{ t('articleAgentTests.thesis.objectives.item2') }}
            </li>
            <li [appHighlight]="t('articleAgentTests.thesis.objectives.item3')">
              {{ t('articleAgentTests.thesis.objectives.item3') }}
            </li>
            <li [appHighlight]="t('articleAgentTests.thesis.objectives.item4')">
              {{ t('articleAgentTests.thesis.objectives.item4') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- K1: Den Test lesen -->
      <section id="reading" class="article-section">
        <h2 [appHighlight]="t('articleAgentTests.reading.title')">{{ t('articleAgentTests.reading.title') }}</h2>

        <p [appHighlight]="t('articleAgentTests.reading.intro')">{{ t('articleAgentTests.reading.intro') }}</p>
        <p [appHighlight]="t('articleAgentTests.reading.reveal')">{{ t('articleAgentTests.reading.reveal') }}</p>

        <app-definition
          [title]="t('articleAgentTests.reading.definitionTitle')"
          [firstOptionLabel]="t('articleAgentTests.definition.everydayLabel')"
          [secondOptionLabel]="t('articleAgentTests.definition.preciseLabel')"
          [firstOptionContent]="t('articleAgentTests.reading.definitionEveryday')"
          [secondOptionContent]="t('articleAgentTests.reading.definitionPrecise')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <h3 [appHighlight]="t('articleAgentTests.reading.exampleTitle')">
          {{ t('articleAgentTests.reading.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleAgentTests.reading.exampleIntro')">
          {{ t('articleAgentTests.reading.exampleIntro') }}
        </p>

        <pre class="code-block"><code>{{ pytestStarter }}</code></pre>
        <pre class="code-block code-output"><code>{{ pytestFailure }}</code></pre>

        <p [appHighlight]="t('articleAgentTests.reading.exampleWalk')">
          {{ t('articleAgentTests.reading.exampleWalk') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.reading.exampleFiles')">
          {{ t('articleAgentTests.reading.exampleFiles') }}
        </p>

        <app-comparison
          layout="horizontal"
          variant="bad-good"
          [ariaLabel]="t('articleAgentTests.reading.comparison.ariaLabel')"
          [beforeLabel]="t('articleAgentTests.reading.comparison.weakLabel')"
          [beforeCode]="weakTestCode"
          [beforeResult]="t('articleAgentTests.reading.comparison.weakResult')"
          [afterLabel]="t('articleAgentTests.reading.comparison.strongLabel')"
          [afterCode]="strongTestCode"
          [afterResult]="t('articleAgentTests.reading.comparison.strongResult')"
        >
        </app-comparison>

        <p [appHighlight]="t('articleAgentTests.reading.axes')">{{ t('articleAgentTests.reading.axes') }}</p>
        <p [appHighlight]="t('articleAgentTests.reading.context')">{{ t('articleAgentTests.reading.context') }}</p>

        <app-standard-container [config]="readingMisconception1Config">
          <p [appHighlight]="t('articleAgentTests.reading.misconception1.text')">
            {{ t('articleAgentTests.reading.misconception1.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleAgentTests.reading.naming')">{{ t('articleAgentTests.reading.naming') }}</p>
        <p [appHighlight]="t('articleAgentTests.reading.misconception2')">
          {{ t('articleAgentTests.reading.misconception2') }}
        </p>
      </section>

      <!-- Supporting: Testgroessen -->
      <section id="sizes" class="article-section">
        <h2 [appHighlight]="t('articleAgentTests.sizes.title')">{{ t('articleAgentTests.sizes.title') }}</h2>

        <p [appHighlight]="t('articleAgentTests.sizes.text1')">{{ t('articleAgentTests.sizes.text1') }}</p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleAgentTests.sizes.stat.label'"
            [value]="t('articleAgentTests.sizes.stat.value')"
            icon="pi pi-chart-pie"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleAgentTests.sizes.stat.description'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleAgentTests.sizes.text2')">{{ t('articleAgentTests.sizes.text2') }}</p>
        <p [appHighlight]="t('articleAgentTests.sizes.regression')">{{ t('articleAgentTests.sizes.regression') }}</p>
      </section>

      <!-- K2: Abdeckung -->
      <section id="coverage" class="article-section">
        <h2 [appHighlight]="t('articleAgentTests.coverage.title')">{{ t('articleAgentTests.coverage.title') }}</h2>

        <p [appHighlight]="t('articleAgentTests.coverage.intro')">{{ t('articleAgentTests.coverage.intro') }}</p>

        <app-definition
          [title]="t('articleAgentTests.coverage.definitionTitle')"
          [firstOptionLabel]="t('articleAgentTests.definition.everydayLabel')"
          [secondOptionLabel]="t('articleAgentTests.definition.preciseLabel')"
          [firstOptionContent]="t('articleAgentTests.coverage.definitionEveryday')"
          [secondOptionContent]="t('articleAgentTests.coverage.definitionPrecise')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleAgentTests.coverage.analogy')">{{ t('articleAgentTests.coverage.analogy') }}</p>
        <p [appHighlight]="t('articleAgentTests.coverage.halfTruth')">
          {{ t('articleAgentTests.coverage.halfTruth') }}
        </p>

        <h3 [appHighlight]="t('articleAgentTests.coverage.exampleTitle')">
          {{ t('articleAgentTests.coverage.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleAgentTests.coverage.exampleFunnel')">
          {{ t('articleAgentTests.coverage.exampleFunnel') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.coverage.exampleScope')">
          {{ t('articleAgentTests.coverage.exampleScope') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.coverage.exampleTension')">
          {{ t('articleAgentTests.coverage.exampleTension') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.coverage.exampleFilter')">
          {{ t('articleAgentTests.coverage.exampleFilter') }}
        </p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleAgentTests.coverage.stat.label'"
            [value]="t('articleAgentTests.coverage.stat.value')"
            icon="pi pi-filter"
            color="orange"
            variant="gradient"
            [descriptionKey]="'articleAgentTests.coverage.stat.description'"
          >
          </app-stat-card>
        </div>

        <p class="key-sentence" [appHighlight]="t('articleAgentTests.coverage.asymmetry')">
          {{ t('articleAgentTests.coverage.asymmetry') }}
        </p>

        <app-standard-container [config]="coverageMisconception1Config">
          <p [appHighlight]="t('articleAgentTests.coverage.misconception1.text')">
            {{ t('articleAgentTests.coverage.misconception1.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleAgentTests.coverage.misconception2')">
          {{ t('articleAgentTests.coverage.misconception2') }}
        </p>

        <app-standard-container [config]="coverageDeepDiveConfig">
          <p [appHighlight]="t('articleAgentTests.coverage.deepDive.text1')">
            {{ t('articleAgentTests.coverage.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleAgentTests.coverage.deepDive.text2')">
            {{ t('articleAgentTests.coverage.deepDive.text2') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleAgentTests.coverage.forward')">{{ t('articleAgentTests.coverage.forward') }}</p>
      </section>

      <!-- K3: Die Abschwaech-Falle -->
      <section id="weakening" class="article-section">
        <h2 [appHighlight]="t('articleAgentTests.weakening.title')">{{ t('articleAgentTests.weakening.title') }}</h2>

        <p [appHighlight]="t('articleAgentTests.weakening.intro')">{{ t('articleAgentTests.weakening.intro') }}</p>
        <p [appHighlight]="t('articleAgentTests.weakening.setup')">{{ t('articleAgentTests.weakening.setup') }}</p>

        <app-definition
          [title]="t('articleAgentTests.weakening.definitionTitle')"
          [firstOptionLabel]="t('articleAgentTests.definition.everydayLabel')"
          [secondOptionLabel]="t('articleAgentTests.definition.preciseLabel')"
          [firstOptionContent]="t('articleAgentTests.weakening.definitionEveryday')"
          [secondOptionContent]="t('articleAgentTests.weakening.definitionPrecise')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <app-comparison
          layout="horizontal"
          variant="neutral"
          [ariaLabel]="t('articleAgentTests.weakening.comparison.ariaLabel')"
          [beforeLabel]="t('articleAgentTests.weakening.comparison.beforeLabel')"
          [beforeCode]="strictAssertionCode"
          [beforeResult]="t('articleAgentTests.weakening.comparison.beforeResult')"
          [afterLabel]="t('articleAgentTests.weakening.comparison.afterLabel')"
          [afterCode]="softenedAssertionCode"
          [afterResult]="t('articleAgentTests.weakening.comparison.afterResult')"
        >
        </app-comparison>

        <p [appHighlight]="t('articleAgentTests.weakening.inventory')">
          {{ t('articleAgentTests.weakening.inventory') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleAgentTests.weakening.keySentence')">
          {{ t('articleAgentTests.weakening.keySentence') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.weakening.safetyNet')">
          {{ t('articleAgentTests.weakening.safetyNet') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.weakening.threeCases')">
          {{ t('articleAgentTests.weakening.threeCases') }}
        </p>

        <app-standard-container [config]="breakageConfig">
          <app-step-indicator [steps]="breakageSteps" layout="vertical" [showConnectors]="true"> </app-step-indicator>
        </app-standard-container>

        <p [appHighlight]="t('articleAgentTests.weakening.stepsCaveat')">
          {{ t('articleAgentTests.weakening.stepsCaveat') }}
        </p>
        <p [appHighlight]="t('articleAgentTests.weakening.mutation')">
          {{ t('articleAgentTests.weakening.mutation') }}
        </p>

        <app-standard-container [config]="weakeningMisconception1Config">
          <p [appHighlight]="t('articleAgentTests.weakening.misconception1.text')">
            {{ t('articleAgentTests.weakening.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="weakeningMisconception2Config">
          <p [appHighlight]="t('articleAgentTests.weakening.misconception2.text')">
            {{ t('articleAgentTests.weakening.misconception2.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="exploitDeepDiveConfig">
          <p [appHighlight]="t('articleAgentTests.weakening.deepDive.text1')">
            {{ t('articleAgentTests.weakening.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleAgentTests.weakening.deepDive.text2')">
            {{ t('articleAgentTests.weakening.deepDive.text2') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleAgentTests.weakening.forward')">{{ t('articleAgentTests.weakening.forward') }}</p>
      </section>

      <!-- Handlungsliste -->
      <section id="demands" class="article-section">
        <h2 [appHighlight]="t('articleAgentTests.demands.title')">{{ t('articleAgentTests.demands.title') }}</h2>
        <p [appHighlight]="t('articleAgentTests.demands.intro')">{{ t('articleAgentTests.demands.intro') }}</p>

        <app-icon-grid [items]="demandItems" [showDescriptions]="true" color="orange" columns="auto"></app-icon-grid>

        <p [appHighlight]="t('articleAgentTests.demands.closing')">{{ t('articleAgentTests.demands.closing') }}</p>
      </section>

      <!-- Abschluss -->
      <section id="close" class="article-section">
        <h2 [appHighlight]="t('articleAgentTests.close.title')">{{ t('articleAgentTests.close.title') }}</h2>
        <p [appHighlight]="t('articleAgentTests.close.text')">{{ t('articleAgentTests.close.text') }}</p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleAgentTests.takeaways.item1')">
              {{ t('articleAgentTests.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleAgentTests.takeaways.item2')">
              {{ t('articleAgentTests.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleAgentTests.takeaways.item3')">
              {{ t('articleAgentTests.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleAgentTests.takeaways.item4')">
              {{ t('articleAgentTests.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleAgentTests.takeaways.item5')">
              {{ t('articleAgentTests.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-agent-tests-quiz"
          [titleKey]="'articleAgentTests.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleAgentTests.checkpoint.title'"
          storageKey="art-agent-tests-checkpoint"
        >
        </app-checkpoint>
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

      .code-block {
        background: var(--surface-100);
        border: 1px solid var(--surface-300);
        border-radius: var(--radius-md, 8px);
        padding: var(--space-4);
        margin: var(--space-4) 0;
        overflow-x: auto;
      }

      .code-block code {
        font-family: 'Fira Code', 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        white-space: pre;
        color: var(--text-color);
      }

      .code-output {
        background: var(--surface-200);
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
export class ArtAgentTestsComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-agent-tests',
    titleKey: 'articleAgentTests.hero.title',
    subtitleKey: 'articleAgentTests.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '14 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  /**
   * Code samples are deliberately identical across all languages: the article
   * teaches reading THIS artifact, so translating identifiers would break the
   * lesson (02-CONCEPT.MD, Translation Considerations).
   * Source of the starter file and its failure output: pytest Get Started docs.
   */
  pytestStarter =
    '# content of test_sample.py\ndef func(x):\n    return x + 1\n\n\ndef test_answer():\n    assert func(3) == 5';
  pytestFailure = '>       assert func(3) == 5\nE       assert 4 == 5\nE        +  where 4 = func(3)';

  weakTestCode = 'def test_rabatt():\n    assert berechne_rabatt(150) is not None';
  strongTestCode = 'def test_rabatt_ab_100_euro_ist_10_prozent():\n    assert berechne_rabatt(150) == 15';
  strictAssertionCode = 'def test_rabatt_ab_100_euro_ist_10_prozent():\n    assert berechne_rabatt(150) == 15';
  softenedAssertionCode = 'def test_rabatt_ab_100_euro_ist_10_prozent():\n    assert berechne_rabatt(150) >= 0';

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleAgentTests.toc.lead' },
    { id: 'thesis', key: 'articleAgentTests.toc.thesis' },
    { id: 'reading', key: 'articleAgentTests.toc.reading' },
    { id: 'sizes', key: 'articleAgentTests.toc.sizes' },
    { id: 'coverage', key: 'articleAgentTests.toc.coverage' },
    { id: 'weakening', key: 'articleAgentTests.toc.weakening' },
    { id: 'demands', key: 'articleAgentTests.toc.demands' },
    { id: 'close', key: 'articleAgentTests.toc.close' },
    { id: 'takeaways', key: 'articleAgentTests.toc.takeaways' },
    { id: 'quiz', key: 'articleAgentTests.toc.quiz' },
    { id: 'checkpoint', key: 'articleAgentTests.toc.checkpoint' },
  ];

  objectivesConfig: ContainerConfig = {
    titleKey: 'articleAgentTests.thesis.objectives.title',
    type: 'info',
    icon: 'pi pi-flag',
  };

  readingMisconception1Config: ContainerConfig = {
    titleKey: 'articleAgentTests.reading.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  coverageMisconception1Config: ContainerConfig = {
    titleKey: 'articleAgentTests.coverage.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  coverageDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleAgentTests.coverage.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  breakageConfig: ContainerConfig = {
    titleKey: 'articleAgentTests.weakening.stepsTitle',
    type: 'info',
    icon: 'pi pi-wrench',
  };

  weakeningMisconception1Config: ContainerConfig = {
    titleKey: 'articleAgentTests.weakening.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  weakeningMisconception2Config: ContainerConfig = {
    titleKey: 'articleAgentTests.weakening.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  exploitDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleAgentTests.weakening.deepDive.title',
    type: 'info',
    icon: 'pi pi-list',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleAgentTests.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /** The five sentences the reader can send to the agent verbatim. */
  demandItems: IconGridItem[] = [
    {
      icon: 'pi pi-eye',
      labelKey: 'articleAgentTests.demands.item1.label',
      descriptionKey: 'articleAgentTests.demands.item1.description',
    },
    {
      icon: 'pi pi-lock',
      labelKey: 'articleAgentTests.demands.item2.label',
      descriptionKey: 'articleAgentTests.demands.item2.description',
    },
    {
      icon: 'pi pi-pencil',
      labelKey: 'articleAgentTests.demands.item3.label',
      descriptionKey: 'articleAgentTests.demands.item3.description',
    },
    {
      icon: 'pi pi-check-square',
      labelKey: 'articleAgentTests.demands.item4.label',
      descriptionKey: 'articleAgentTests.demands.item4.description',
    },
    {
      icon: 'pi pi-bolt',
      labelKey: 'articleAgentTests.demands.item5.label',
      descriptionKey: 'articleAgentTests.demands.item5.description',
    },
  ];

  // Illustration of a procedure, not user progress - every step stays 'pending'.
  breakageSteps: StepItem[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleAgentTests.checkpoint.item1' },
    { textKey: 'articleAgentTests.checkpoint.item2' },
    { textKey: 'articleAgentTests.checkpoint.item3' },
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
    this.breakageSteps = [
      { id: 1, label: this.t('articleAgentTests.weakening.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleAgentTests.weakening.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleAgentTests.weakening.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleAgentTests.weakening.step4'), status: 'pending' as const },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleAgentTests.quiz.' + key);
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
          { id: 'a', text: q('q2.a'), isCorrect: true },
          { id: 'b', text: q('q2.b'), isCorrect: false },
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
          { id: 'b', text: q('q4.b'), isCorrect: false },
          { id: 'c', text: q('q4.c'), isCorrect: false },
          { id: 'd', text: q('q4.d'), isCorrect: true },
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
