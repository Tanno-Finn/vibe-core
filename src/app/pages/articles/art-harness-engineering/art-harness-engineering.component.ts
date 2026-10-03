/**
 * ArtHarnessEngineeringComponent
 *
 * Educational article: Harness Engineering - the engineered environment around
 * a coding agent (workshop, gates, rights) and what it measurably does.
 * Written from a reviewed concept spec — a pipeline document of the project this
 * kit was distilled from, not shipped with the kit.
 *
 * SSR note: no window/document/localStorage/navigator access, no timers.
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
  selector: 'app-art-harness-engineering',
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
        <p class="lead-text" [appHighlight]="t('articleHarnessEngineering.lead.paragraph1')">
          {{ t('articleHarnessEngineering.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.lead.paragraph2')">
          {{ t('articleHarnessEngineering.lead.paragraph2') }}
        </p>
      </section>

      <!-- Kernthese, Abgrenzung, Lernziele, Uebersicht -->
      <section id="thesis" class="article-section">
        <h2 [appHighlight]="t('articleHarnessEngineering.thesis.title')">
          {{ t('articleHarnessEngineering.thesis.title') }}
        </h2>

        <p [appHighlight]="t('articleHarnessEngineering.thesis.text1')">
          {{ t('articleHarnessEngineering.thesis.text1') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.thesis.delimitation')">
          {{ t('articleHarnessEngineering.thesis.delimitation') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.thesis.disputed')">
          {{ t('articleHarnessEngineering.thesis.disputed') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.thesis.agcdDelimitation')">
          {{ t('articleHarnessEngineering.thesis.agcdDelimitation') }}
        </p>

        <app-standard-container [config]="objectivesConfig">
          <ol class="objectives-list">
            <li [appHighlight]="t('articleHarnessEngineering.thesis.objectives.item1')">
              {{ t('articleHarnessEngineering.thesis.objectives.item1') }}
            </li>
            <li [appHighlight]="t('articleHarnessEngineering.thesis.objectives.item2')">
              {{ t('articleHarnessEngineering.thesis.objectives.item2') }}
            </li>
            <li [appHighlight]="t('articleHarnessEngineering.thesis.objectives.item3')">
              {{ t('articleHarnessEngineering.thesis.objectives.item3') }}
            </li>
            <li [appHighlight]="t('articleHarnessEngineering.thesis.objectives.item4')">
              {{ t('articleHarnessEngineering.thesis.objectives.item4') }}
            </li>
          </ol>
        </app-standard-container>

        <p [appHighlight]="t('articleHarnessEngineering.thesis.gridIntro')">
          {{ t('articleHarnessEngineering.thesis.gridIntro') }}
        </p>
        <app-icon-grid [items]="harnessParts" [showDescriptions]="true" color="orange" columns="auto"></app-icon-grid>
      </section>

      <!-- K1: Gleicher Arbeiter, zwei Werkstaetten -->
      <section id="workshop" class="article-section">
        <h2 [appHighlight]="t('articleHarnessEngineering.workshop.title')">
          {{ t('articleHarnessEngineering.workshop.title') }}
        </h2>

        <p [appHighlight]="t('articleHarnessEngineering.workshop.intro')">
          {{ t('articleHarnessEngineering.workshop.intro') }}
        </p>

        <app-definition
          [title]="t('articleHarnessEngineering.workshop.definitionTitle')"
          [firstOptionContent]="t('articleHarnessEngineering.workshop.analogy')"
          [secondOptionContent]="t('articleHarnessEngineering.workshop.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleHarnessEngineering.workshop.example')">
          {{ t('articleHarnessEngineering.workshop.example') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.workshop.exampleCaveat')">
          {{ t('articleHarnessEngineering.workshop.exampleCaveat') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.workshop.analogyBreak')">
          {{ t('articleHarnessEngineering.workshop.analogyBreak') }}
        </p>

        <app-standard-container [config]="workshopMisconception1Config">
          <p [appHighlight]="t('articleHarnessEngineering.workshop.misconception1.text')">
            {{ t('articleHarnessEngineering.workshop.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="workshopMisconception2Config">
          <p [appHighlight]="t('articleHarnessEngineering.workshop.misconception2.text')">
            {{ t('articleHarnessEngineering.workshop.misconception2.text') }}
          </p>
        </app-standard-container>

        <h3 [appHighlight]="t('articleHarnessEngineering.memory.title')">
          {{ t('articleHarnessEngineering.memory.title') }}
        </h3>
        <p [appHighlight]="t('articleHarnessEngineering.memory.text')">
          {{ t('articleHarnessEngineering.memory.text') }}
        </p>

        <h3 [appHighlight]="t('articleHarnessEngineering.rules.title')">
          {{ t('articleHarnessEngineering.rules.title') }}
        </h3>
        <p [appHighlight]="t('articleHarnessEngineering.rules.text')">
          {{ t('articleHarnessEngineering.rules.text') }}
        </p>
      </section>

      <!-- K2: Die Pruefstation, nicht das Schild -->
      <section id="gates" class="article-section">
        <h2 [appHighlight]="t('articleHarnessEngineering.gates.title')">
          {{ t('articleHarnessEngineering.gates.title') }}
        </h2>

        <p [appHighlight]="t('articleHarnessEngineering.gates.intro')">
          {{ t('articleHarnessEngineering.gates.intro') }}
        </p>

        <app-definition
          [title]="t('articleHarnessEngineering.gates.definitionTitle')"
          [firstOptionContent]="t('articleHarnessEngineering.gates.analogy')"
          [secondOptionContent]="t('articleHarnessEngineering.gates.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleHarnessEngineering.gates.scope')">
          {{ t('articleHarnessEngineering.gates.scope') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.gates.experiment')">
          {{ t('articleHarnessEngineering.gates.experiment') }}
        </p>

        <app-comparison
          layout="horizontal"
          [ariaLabel]="t('articleHarnessEngineering.gates.comparison.ariaLabel')"
          [beforeLabel]="t('articleHarnessEngineering.gates.comparison.proseLabel')"
          [beforeResult]="t('articleHarnessEngineering.gates.comparison.proseResult')"
          [afterLabel]="t('articleHarnessEngineering.gates.comparison.gateLabel')"
          [afterResult]="t('articleHarnessEngineering.gates.comparison.gateResult')"
        >
        </app-comparison>

        <p class="key-sentence" [appHighlight]="t('articleHarnessEngineering.gates.keySentence')">
          {{ t('articleHarnessEngineering.gates.keySentence') }}
        </p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleHarnessEngineering.gates.stat.label'"
            [value]="t('articleHarnessEngineering.gates.stat.value')"
            icon="pi pi-shield"
            color="green"
            variant="gradient"
            [descriptionKey]="'articleHarnessEngineering.gates.stat.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleHarnessEngineering.gates.statResolve.label'"
            [value]="t('articleHarnessEngineering.gates.statResolve.value')"
            icon="pi pi-check-square"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleHarnessEngineering.gates.statResolve.description'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleHarnessEngineering.gates.inspection')">
          {{ t('articleHarnessEngineering.gates.inspection') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.gates.inspectionBreak')">
          {{ t('articleHarnessEngineering.gates.inspectionBreak') }}
        </p>

        <app-standard-container [config]="gatesMisconception1Config">
          <p [appHighlight]="t('articleHarnessEngineering.gates.misconception1.text')">
            {{ t('articleHarnessEngineering.gates.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="gatesMisconception2Config">
          <p [appHighlight]="t('articleHarnessEngineering.gates.misconception2.text')">
            {{ t('articleHarnessEngineering.gates.misconception2.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="gamingDeepDiveConfig">
          <p [appHighlight]="t('articleHarnessEngineering.gates.deepDive.text1')">
            {{ t('articleHarnessEngineering.gates.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleHarnessEngineering.gates.deepDive.text2')">
            {{ t('articleHarnessEngineering.gates.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- K3: Die Schluesselkarte, nicht der Wachhund -->
      <section id="rights" class="article-section">
        <h2 [appHighlight]="t('articleHarnessEngineering.rights.title')">
          {{ t('articleHarnessEngineering.rights.title') }}
        </h2>

        <p [appHighlight]="t('articleHarnessEngineering.rights.intro')">
          {{ t('articleHarnessEngineering.rights.intro') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.rights.twoDials')">
          {{ t('articleHarnessEngineering.rights.twoDials') }}
        </p>

        <app-standard-container [config]="keycardConfig">
          <app-step-indicator [steps]="keycardSteps" layout="vertical" [showConnectors]="true"> </app-step-indicator>
        </app-standard-container>

        <p [appHighlight]="t('articleHarnessEngineering.rights.analogyBreak')">
          {{ t('articleHarnessEngineering.rights.analogyBreak') }}
        </p>

        <app-standard-container [config]="rightsMisconception1Config">
          <p [appHighlight]="t('articleHarnessEngineering.rights.misconception1.text')">
            {{ t('articleHarnessEngineering.rights.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="rightsMisconception2Config">
          <p [appHighlight]="t('articleHarnessEngineering.rights.misconception2.text')">
            {{ t('articleHarnessEngineering.rights.misconception2.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleHarnessEngineering.rights.injectionLink')">
          {{ t('articleHarnessEngineering.rights.injectionLink') }}
        </p>
      </section>

      <!-- Grenzen -->
      <section id="limits" class="article-section">
        <h2 [appHighlight]="t('articleHarnessEngineering.limits.title')">
          {{ t('articleHarnessEngineering.limits.title') }}
        </h2>

        <p [appHighlight]="t('articleHarnessEngineering.limits.coverage')">
          {{ t('articleHarnessEngineering.limits.coverage') }}
        </p>
        <p [appHighlight]="t('articleHarnessEngineering.limits.coinage')">
          {{ t('articleHarnessEngineering.limits.coinage') }}
        </p>

        <app-standard-container [config]="overheadDeepDiveConfig">
          <p [appHighlight]="t('articleHarnessEngineering.limits.deepDive.text')">
            {{ t('articleHarnessEngineering.limits.deepDive.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Abschluss: Die Haerteschleife -->
      <section id="loop" class="article-section">
        <h2 [appHighlight]="t('articleHarnessEngineering.loop.title')">
          {{ t('articleHarnessEngineering.loop.title') }}
        </h2>
        <p [appHighlight]="t('articleHarnessEngineering.loop.text')">{{ t('articleHarnessEngineering.loop.text') }}</p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleHarnessEngineering.takeaways.item1')">
              {{ t('articleHarnessEngineering.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleHarnessEngineering.takeaways.item2')">
              {{ t('articleHarnessEngineering.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleHarnessEngineering.takeaways.item3')">
              {{ t('articleHarnessEngineering.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleHarnessEngineering.takeaways.item4')">
              {{ t('articleHarnessEngineering.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleHarnessEngineering.takeaways.item5')">
              {{ t('articleHarnessEngineering.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-harness-engineering-quiz"
          [titleKey]="'articleHarnessEngineering.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleHarnessEngineering.checkpoint.title'"
          storageKey="art-harness-engineering-checkpoint"
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
export class ArtHarnessEngineeringComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-harness-engineering',
    titleKey: 'articleHarnessEngineering.hero.title',
    subtitleKey: 'articleHarnessEngineering.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '11 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
    publishDate: new Date('2026-10-07'),
    // Dev-only "Geplant fuer"-Badge; in prod the route guard blocks the page
    // until the date is reached (the cascade adds the path-level gate).
    scheduledFor: new Date('2026-10-07'),
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleHarnessEngineering.toc.lead' },
    { id: 'thesis', key: 'articleHarnessEngineering.toc.thesis' },
    { id: 'workshop', key: 'articleHarnessEngineering.toc.workshop' },
    { id: 'gates', key: 'articleHarnessEngineering.toc.gates' },
    { id: 'rights', key: 'articleHarnessEngineering.toc.rights' },
    { id: 'limits', key: 'articleHarnessEngineering.toc.limits' },
    { id: 'loop', key: 'articleHarnessEngineering.toc.loop' },
    { id: 'takeaways', key: 'articleHarnessEngineering.toc.takeaways' },
    { id: 'quiz', key: 'articleHarnessEngineering.toc.quiz' },
    { id: 'checkpoint', key: 'articleHarnessEngineering.toc.checkpoint' },
  ];

  // Container Configs
  objectivesConfig: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.thesis.objectives.title',
    type: 'info',
    icon: 'pi pi-flag',
  };

  workshopMisconception1Config: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.workshop.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  workshopMisconception2Config: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.workshop.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  gatesMisconception1Config: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.gates.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  gatesMisconception2Config: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.gates.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  gamingDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.gates.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  keycardConfig: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.rights.stepsTitle',
    type: 'info',
    icon: 'pi pi-lock',
  };

  rightsMisconception1Config: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.rights.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  rightsMisconception2Config: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.rights.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  overheadDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.limits.deepDive.title',
    type: 'info',
    icon: 'pi pi-cog',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleHarnessEngineering.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /** Overview of what the harness bundles - orientation before the details. */
  harnessParts: IconGridItem[] = [
    {
      icon: 'pi pi-wrench',
      labelKey: 'articleHarnessEngineering.grid.tools.label',
      descriptionKey: 'articleHarnessEngineering.grid.tools.description',
    },
    {
      icon: 'pi pi-box',
      labelKey: 'articleHarnessEngineering.grid.sandbox.label',
      descriptionKey: 'articleHarnessEngineering.grid.sandbox.description',
    },
    {
      icon: 'pi pi-verified',
      labelKey: 'articleHarnessEngineering.grid.gates.label',
      descriptionKey: 'articleHarnessEngineering.grid.gates.description',
    },
    {
      icon: 'pi pi-book',
      labelKey: 'articleHarnessEngineering.grid.memory.label',
      descriptionKey: 'articleHarnessEngineering.grid.memory.description',
    },
    {
      icon: 'pi pi-file-edit',
      labelKey: 'articleHarnessEngineering.grid.rules.label',
      descriptionKey: 'articleHarnessEngineering.grid.rules.description',
    },
  ];

  // Step indicator (illustration only - all steps stay 'pending')
  keycardSteps: StepItem[] = [];

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Checkpoint
  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleHarnessEngineering.checkpoint.item1' },
    { textKey: 'articleHarnessEngineering.checkpoint.item2' },
    { textKey: 'articleHarnessEngineering.checkpoint.item3' },
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
    this.keycardSteps = [
      { id: 1, label: this.t('articleHarnessEngineering.rights.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleHarnessEngineering.rights.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleHarnessEngineering.rights.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleHarnessEngineering.rights.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleHarnessEngineering.rights.step5'), status: 'pending' as const },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t(`articleHarnessEngineering.quiz.${key}`);
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
          { id: 'c', text: q('q3.c'), isCorrect: false },
          { id: 'd', text: q('q3.d'), isCorrect: true },
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
