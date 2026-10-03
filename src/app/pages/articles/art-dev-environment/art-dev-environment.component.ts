/**
 * ArtDevEnvironmentComponent
 *
 * Educational article: what a beginner actually has to have on the machine in
 * order to work with an agent - editor, terminal, runtime, git - each introduced
 * by the question it answers, plus the cloud shortcut and an inventory of what
 * the official prerequisite lists do NOT ask for.
 *
 * Written from a reviewed concept spec — a pipeline document of the project this
 * kit was distilled from, not shipped with the kit.
 *
 * SSR note: no window/document/localStorage/navigator access, no timers, no rAF.
 * The only browser-API consumers in the tree (CheckpointComponent,
 * QuizContainerComponent) carry their own isPlatformBrowser guards.
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
  selector: 'app-art-dev-environment',
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
        <p class="lead-text" [appHighlight]="t('articleDevEnvironment.lead.paragraph1')">
          {{ t('articleDevEnvironment.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.lead.paragraph2')">
          {{ t('articleDevEnvironment.lead.paragraph2') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.lead.paragraph3')">
          {{ t('articleDevEnvironment.lead.paragraph3') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.lead.paragraph4')">
          {{ t('articleDevEnvironment.lead.paragraph4') }}
        </p>
      </section>

      <!-- Kernthese + Lernziele -->
      <section id="thesis" class="article-section">
        <h2 [appHighlight]="t('articleDevEnvironment.thesis.title')">{{ t('articleDevEnvironment.thesis.title') }}</h2>
        <p [appHighlight]="t('articleDevEnvironment.thesis.text1')">{{ t('articleDevEnvironment.thesis.text1') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleDevEnvironment.thesis.text2')">
          {{ t('articleDevEnvironment.thesis.text2') }}
        </p>

        <app-standard-container [config]="objectivesConfig">
          <ol class="objectives-list">
            <li [appHighlight]="t('articleDevEnvironment.thesis.objectives.item1')">
              {{ t('articleDevEnvironment.thesis.objectives.item1') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.thesis.objectives.item2')">
              {{ t('articleDevEnvironment.thesis.objectives.item2') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.thesis.objectives.item3')">
              {{ t('articleDevEnvironment.thesis.objectives.item3') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.thesis.objectives.item4')">
              {{ t('articleDevEnvironment.thesis.objectives.item4') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.thesis.objectives.item5')">
              {{ t('articleDevEnvironment.thesis.objectives.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- K1: Vier Teile, vier Fragen -->
      <section id="parts" class="article-section">
        <h2 [appHighlight]="t('articleDevEnvironment.parts.title')">{{ t('articleDevEnvironment.parts.title') }}</h2>

        <app-icon-grid [items]="partItems" [showDescriptions]="true" color="primary" columns="auto"></app-icon-grid>

        <p [appHighlight]="t('articleDevEnvironment.parts.editorText')">
          {{ t('articleDevEnvironment.parts.editorText') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.parts.terminalText')">
          {{ t('articleDevEnvironment.parts.terminalText') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.parts.runtimeIntro')">
          {{ t('articleDevEnvironment.parts.runtimeIntro') }}
        </p>

        <app-definition
          [title]="t('articleDevEnvironment.parts.definitionTitle')"
          [firstOptionLabel]="t('articleDevEnvironment.parts.definitionEverydayLabel')"
          [firstOptionContent]="t('articleDevEnvironment.parts.definitionEveryday')"
          [secondOptionLabel]="t('articleDevEnvironment.parts.definitionPreciseLabel')"
          [secondOptionContent]="t('articleDevEnvironment.parts.definitionPrecise')"
          [showExample]="false"
          icon="pi pi-bolt"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleDevEnvironment.parts.runtimeNotOnlyJs')">
          {{ t('articleDevEnvironment.parts.runtimeNotOnlyJs') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.parts.packageManager')">
          {{ t('articleDevEnvironment.parts.packageManager') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.parts.gitText')">{{ t('articleDevEnvironment.parts.gitText') }}</p>

        <h3 [appHighlight]="t('articleDevEnvironment.parts.exampleTitle')">
          {{ t('articleDevEnvironment.parts.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleDevEnvironment.parts.exampleIntro')">
          {{ t('articleDevEnvironment.parts.exampleIntro') }}
        </p>

        <app-step-indicator
          [steps]="checkSteps"
          layout="vertical"
          [showConnectors]="true"
          [ariaLabel]="t('articleDevEnvironment.parts.stepsAriaLabel')"
        >
        </app-step-indicator>

        <p [appHighlight]="t('articleDevEnvironment.parts.exampleResult')">
          {{ t('articleDevEnvironment.parts.exampleResult') }}
        </p>

        <app-standard-container [config]="partsMisconceptionConfig">
          <p [appHighlight]="t('articleDevEnvironment.parts.misconception.text')">
            {{ t('articleDevEnvironment.parts.misconception.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="datedBoxConfig">
          <p [appHighlight]="t('articleDevEnvironment.parts.dated.runtime')">
            {{ t('articleDevEnvironment.parts.dated.runtime') }}
          </p>
          <p [appHighlight]="t('articleDevEnvironment.parts.dated.git')">
            {{ t('articleDevEnvironment.parts.dated.git') }}
          </p>
          <p [appHighlight]="t('articleDevEnvironment.parts.dated.hardware')">
            {{ t('articleDevEnvironment.parts.dated.hardware') }}
          </p>
          <p [appHighlight]="t('articleDevEnvironment.parts.dated.python')">
            {{ t('articleDevEnvironment.parts.dated.python') }}
          </p>
          <p [appHighlight]="t('articleDevEnvironment.parts.dated.survey')">
            {{ t('articleDevEnvironment.parts.dated.survey') }}
          </p>
          <p [appHighlight]="t('articleDevEnvironment.parts.dated.closing')">
            {{ t('articleDevEnvironment.parts.dated.closing') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="deepDive1Config">
          <p [appHighlight]="t('articleDevEnvironment.parts.deepDive.text1')">
            {{ t('articleDevEnvironment.parts.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleDevEnvironment.parts.deepDive.text2')">
            {{ t('articleDevEnvironment.parts.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Stuetzpassage: Komfort -->
      <section id="comfort" class="article-section">
        <h2 [appHighlight]="t('articleDevEnvironment.comfort.title')">
          {{ t('articleDevEnvironment.comfort.title') }}
        </h2>
        <p [appHighlight]="t('articleDevEnvironment.comfort.intro')">{{ t('articleDevEnvironment.comfort.intro') }}</p>
        <p [appHighlight]="t('articleDevEnvironment.comfort.autosave')">
          {{ t('articleDevEnvironment.comfort.autosave') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.comfort.diff')">{{ t('articleDevEnvironment.comfort.diff') }}</p>
        <p [appHighlight]="t('articleDevEnvironment.comfort.terminal')">
          {{ t('articleDevEnvironment.comfort.terminal') }}
        </p>
      </section>

      <!-- K2: Die Abkuerzung -->
      <section id="cloud" class="article-section">
        <h2 [appHighlight]="t('articleDevEnvironment.cloud.title')">{{ t('articleDevEnvironment.cloud.title') }}</h2>

        <p [appHighlight]="t('articleDevEnvironment.cloud.what')">{{ t('articleDevEnvironment.cloud.what') }}</p>
        <p [appHighlight]="t('articleDevEnvironment.cloud.scope')">{{ t('articleDevEnvironment.cloud.scope') }}</p>
        <p [appHighlight]="t('articleDevEnvironment.cloud.analogy')">{{ t('articleDevEnvironment.cloud.analogy') }}</p>

        <h3 [appHighlight]="t('articleDevEnvironment.cloud.exampleTitle')">
          {{ t('articleDevEnvironment.cloud.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleDevEnvironment.cloud.example1')">
          {{ t('articleDevEnvironment.cloud.example1') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.cloud.example2')">
          {{ t('articleDevEnvironment.cloud.example2') }}
        </p>

        <app-standard-container [config]="tariffConfig">
          <app-comparison
            layout="horizontal"
            variant="neutral"
            [ariaLabel]="t('articleDevEnvironment.cloud.comparison.ariaLabel')"
            [beforeLabel]="t('articleDevEnvironment.cloud.comparison.beforeLabel')"
            [beforeResult]="t('articleDevEnvironment.cloud.comparison.beforeResult')"
            [afterLabel]="t('articleDevEnvironment.cloud.comparison.afterLabel')"
            [afterResult]="t('articleDevEnvironment.cloud.comparison.afterResult')"
          >
            <p slot="before" [appHighlight]="t('articleDevEnvironment.cloud.comparison.beforeText')">
              {{ t('articleDevEnvironment.cloud.comparison.beforeText') }}
            </p>
            <p slot="after" [appHighlight]="t('articleDevEnvironment.cloud.comparison.afterText')">
              {{ t('articleDevEnvironment.cloud.comparison.afterText') }}
            </p>
          </app-comparison>

          <div class="stat-grid">
            <app-stat-card
              [labelKey]="'articleDevEnvironment.cloud.stat.label'"
              [value]="t('articleDevEnvironment.cloud.stat.value')"
              icon="pi pi-calculator"
              color="blue"
              variant="gradient"
              [descriptionKey]="'articleDevEnvironment.cloud.stat.description'"
            >
            </app-stat-card>
          </div>
        </app-standard-container>

        <p class="key-sentence" [appHighlight]="t('articleDevEnvironment.cloud.rule')">
          {{ t('articleDevEnvironment.cloud.rule') }}
        </p>

        <app-standard-container [config]="cloudMisconceptionConfig">
          <p [appHighlight]="t('articleDevEnvironment.cloud.misconception.text')">
            {{ t('articleDevEnvironment.cloud.misconception.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleDevEnvironment.cloud.nothingNeeded')">
          {{ t('articleDevEnvironment.cloud.nothingNeeded') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.cloud.forgetting')">
          {{ t('articleDevEnvironment.cloud.forgetting') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleDevEnvironment.cloud.analogyBreak')">
          {{ t('articleDevEnvironment.cloud.analogyBreak') }}
        </p>
      </section>

      <!-- K3: Was du NICHT brauchst -->
      <section id="notneeded" class="article-section">
        <h2 [appHighlight]="t('articleDevEnvironment.notNeeded.title')">
          {{ t('articleDevEnvironment.notNeeded.title') }}
        </h2>

        <p [appHighlight]="t('articleDevEnvironment.notNeeded.framing')">
          {{ t('articleDevEnvironment.notNeeded.framing') }}
        </p>

        <h3 [appHighlight]="t('articleDevEnvironment.notNeeded.inventoryTitle')">
          {{ t('articleDevEnvironment.notNeeded.inventoryTitle') }}
        </h3>
        <p [appHighlight]="t('articleDevEnvironment.notNeeded.inventory1')">
          {{ t('articleDevEnvironment.notNeeded.inventory1') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.notNeeded.inventory2')">
          {{ t('articleDevEnvironment.notNeeded.inventory2') }}
        </p>

        <p [appHighlight]="t('articleDevEnvironment.notNeeded.analogy')">
          {{ t('articleDevEnvironment.notNeeded.analogy') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.notNeeded.analogyBreak')">
          {{ t('articleDevEnvironment.notNeeded.analogyBreak') }}
        </p>

        <app-standard-container [config]="notNeededMisconceptionConfig">
          <p [appHighlight]="t('articleDevEnvironment.notNeeded.misconception.text')">
            {{ t('articleDevEnvironment.notNeeded.misconception.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleDevEnvironment.notNeeded.hardware')">
          {{ t('articleDevEnvironment.notNeeded.hardware') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.notNeeded.gitGui')">
          {{ t('articleDevEnvironment.notNeeded.gitGui') }}
        </p>
        <p [appHighlight]="t('articleDevEnvironment.notNeeded.agentEditors')">
          {{ t('articleDevEnvironment.notNeeded.agentEditors') }}
        </p>

        <h3 [appHighlight]="t('articleDevEnvironment.notNeeded.departureTitle')">
          {{ t('articleDevEnvironment.notNeeded.departureTitle') }}
        </h3>
        <p [appHighlight]="t('articleDevEnvironment.notNeeded.departure')">
          {{ t('articleDevEnvironment.notNeeded.departure') }}
        </p>

        <app-standard-container [config]="deepDive2Config">
          <p [appHighlight]="t('articleDevEnvironment.notNeeded.deepDive.text1')">
            {{ t('articleDevEnvironment.notNeeded.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleDevEnvironment.notNeeded.deepDive.text2')">
            {{ t('articleDevEnvironment.notNeeded.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Abschluss -->
      <section id="close" class="article-section">
        <h2 [appHighlight]="t('articleDevEnvironment.close.title')">{{ t('articleDevEnvironment.close.title') }}</h2>
        <p [appHighlight]="t('articleDevEnvironment.close.text1')">{{ t('articleDevEnvironment.close.text1') }}</p>
        <p [appHighlight]="t('articleDevEnvironment.close.text2')">{{ t('articleDevEnvironment.close.text2') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleDevEnvironment.close.text3')">
          {{ t('articleDevEnvironment.close.text3') }}
        </p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleDevEnvironment.takeaways.item1')">
              {{ t('articleDevEnvironment.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.takeaways.item2')">
              {{ t('articleDevEnvironment.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.takeaways.item3')">
              {{ t('articleDevEnvironment.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.takeaways.item4')">
              {{ t('articleDevEnvironment.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleDevEnvironment.takeaways.item5')">
              {{ t('articleDevEnvironment.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleDevEnvironment.checkpoint.title'"
          storageKey="art-dev-environment-checkpoint"
        >
        </app-checkpoint>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-dev-environment-quiz"
          [titleKey]="'articleDevEnvironment.quiz.boxTitle'"
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
        margin: var(--space-5) 0 0 0;
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
export class ArtDevEnvironmentComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-dev-environment',
    titleKey: 'articleDevEnvironment.hero.title',
    subtitleKey: 'articleDevEnvironment.hero.subtitle',
    category: 'fundamentals',
    categoryKey: 'articles.category.fundamentals',
    readingTime: '15 min',
    difficulty: 'beginner',
    difficultyKey: 'articles.difficulty.beginner',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleDevEnvironment.toc.lead' },
    { id: 'thesis', key: 'articleDevEnvironment.toc.thesis' },
    { id: 'parts', key: 'articleDevEnvironment.toc.parts' },
    { id: 'comfort', key: 'articleDevEnvironment.toc.comfort' },
    { id: 'cloud', key: 'articleDevEnvironment.toc.cloud' },
    { id: 'notneeded', key: 'articleDevEnvironment.toc.notNeeded' },
    { id: 'close', key: 'articleDevEnvironment.toc.close' },
    { id: 'takeaways', key: 'articleDevEnvironment.toc.takeaways' },
    { id: 'checkpoint', key: 'articleDevEnvironment.toc.checkpoint' },
    { id: 'quiz', key: 'articleDevEnvironment.toc.quiz' },
  ];

  objectivesConfig: ContainerConfig = {
    titleKey: 'articleDevEnvironment.thesis.objectives.title',
    type: 'info',
    icon: 'pi pi-flag',
  };

  partsMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleDevEnvironment.parts.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  /**
   * Change 3 of the Phase-3 review: every version number and every quota lives
   * inside a dated component, never in running prose. This is that component.
   */
  datedBoxConfig: ContainerConfig = {
    titleKey: 'articleDevEnvironment.parts.dated.title',
    type: 'info',
    icon: 'pi pi-calendar',
  };

  deepDive1Config: ContainerConfig = {
    titleKey: 'articleDevEnvironment.parts.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  /** Carries the second dated cluster: both free tiers plus the division. */
  tariffConfig: ContainerConfig = {
    titleKey: 'articleDevEnvironment.cloud.comparison.title',
    type: 'info',
    icon: 'pi pi-cloud',
  };

  cloudMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleDevEnvironment.cloud.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  notNeededMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleDevEnvironment.notNeeded.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  deepDive2Config: ContainerConfig = {
    titleKey: 'articleDevEnvironment.notNeeded.deepDive.title',
    type: 'info',
    icon: 'pi pi-tag',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleDevEnvironment.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /**
   * Four parts, each labeled by the QUESTION it answers. Change 11 of the
   * Phase-3 review: the fourth label is the category with the program name in
   * brackets, so the grid does not read as three categories plus one brand.
   */
  partItems: IconGridItem[] = [
    {
      icon: 'pi pi-file-edit',
      labelKey: 'articleDevEnvironment.parts.grid.editor.label',
      descriptionKey: 'articleDevEnvironment.parts.grid.editor.description',
    },
    {
      icon: 'pi pi-desktop',
      labelKey: 'articleDevEnvironment.parts.grid.terminal.label',
      descriptionKey: 'articleDevEnvironment.parts.grid.terminal.description',
    },
    {
      icon: 'pi pi-bolt',
      labelKey: 'articleDevEnvironment.parts.grid.runtime.label',
      descriptionKey: 'articleDevEnvironment.parts.grid.runtime.description',
    },
    {
      icon: 'pi pi-history',
      labelKey: 'articleDevEnvironment.parts.grid.versioning.label',
      descriptionKey: 'articleDevEnvironment.parts.grid.versioning.description',
    },
  ];

  // Illustration of a diagnosis sequence, not user progress - every step stays 'pending'.
  checkSteps: StepItem[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleDevEnvironment.checkpoint.item1' },
    { textKey: 'articleDevEnvironment.checkpoint.item2' },
    { textKey: 'articleDevEnvironment.checkpoint.item3' },
    { textKey: 'articleDevEnvironment.checkpoint.item4' },
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
   * The self-check. Four steps, four yes/no answers - and deliberately no
   * expected version strings (Tension 3 of the concept): the numbers live in
   * the dated box, the steps show commands and decisions only.
   */
  private updateSteps(): void {
    this.checkSteps = [
      {
        id: 1,
        label: this.t('articleDevEnvironment.parts.steps.step1.label'),
        description: this.t('articleDevEnvironment.parts.steps.step1.description'),
        status: 'pending' as const,
      },
      {
        id: 2,
        label: this.t('articleDevEnvironment.parts.steps.step2.label'),
        description: this.t('articleDevEnvironment.parts.steps.step2.description'),
        status: 'pending' as const,
      },
      {
        id: 3,
        label: this.t('articleDevEnvironment.parts.steps.step3.label'),
        description: this.t('articleDevEnvironment.parts.steps.step3.description'),
        status: 'pending' as const,
      },
      {
        id: 4,
        label: this.t('articleDevEnvironment.parts.steps.step4.label'),
        description: this.t('articleDevEnvironment.parts.steps.step4.description'),
        status: 'pending' as const,
      },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleDevEnvironment.quiz.' + key);
    this.quizQuestions = [
      {
        id: 'q1',
        question: q('q1.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q1.a'), isCorrect: false },
          { id: 'b', text: q('q1.b'), isCorrect: false },
          { id: 'c', text: q('q1.c'), isCorrect: true },
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
