/**
 * ArtContextEngineeringComponent
 *
 * Article: context engineering — the difference between a well-phrased question
 * and a well-furnished workplace, what belongs in a rule file, and why more
 * context is not better context. Built on the article blueprint documented in
 * `seed-article-1.component.ts`: definition blocks with the analogy/precise
 * toggle, a comparison, an icon grid, a four-level hierarchy as a step
 * indicator, collapsible deep dives, an embedded scaling slider, takeaways,
 * quiz and checkpoint.
 *
 * Vendor-neutral per ADR-0013: the rule file is taught as a pattern, and the
 * icon grid names the three traits that actually differ between tools (file
 * name, scope, load time) instead of listing products. The one concrete file
 * name used is the kit's own `AGENTS.md`.
 *
 * Text lives in `assets/i18n/modules/<lang>/articleContextEngineering.json`
 * (de, en and both Easy-Language variants); meta and related refs in
 * `assets/data/core/articles/art-context-engineering.json` + `index.json`.
 *
 * SSR-safe: no browser globals here; the embedded slider has no timers, so the
 * page prerenders (T2, see scripts/generate-prerender-routes.js).
 */
import { Component, OnInit, inject, DestroyRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslationService } from '../../../services/translation.service';

import { LessonTemplateComponent, LessonMeta } from '../../../components/shared/lesson-template.component';
import { TocItem } from '../../../components/shared/table-of-contents-fab.component';
import { StandardContainerComponent, ContainerConfig } from '../../../components/shared/standard-container.component';
import { CheckpointComponent, CheckpointItem } from '../../../components/shared/checkpoint.component';
import { QuizContainerComponent, QuizQuestion } from '../../../components/shared/quiz-container.component';
import { DefinitionComponent } from '../../../components/didactic/definition.component';
import { ComparisonComponent } from '../../../components/didactic/comparison.component';
import { IconGridComponent, IconGridItem } from '../../../components/didactic/icon-grid.component';
import { StepIndicatorComponent, StepItem } from '../../../components/didactic/step-indicator.component';
import {
  ScalingSliderComponent,
  ScalingSliderConfig,
} from '../../../components/didactic/scaling-slider/scaling-slider.component';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'app-art-context-engineering',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    IconGridComponent,
    StepIndicatorComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
    ScalingSliderComponent,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead Section -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleContextEngineering.lead.paragraph1')">
          {{ t('articleContextEngineering.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleContextEngineering.lead.paragraph2')">
          {{ t('articleContextEngineering.lead.paragraph2') }}
        </p>
      </section>

      <!-- Section 1: from prompt to context -->
      <section id="prompt-vs-context" class="article-section">
        <h2 [appHighlight]="t('articleContextEngineering.promptVsContext.title')">
          {{ t('articleContextEngineering.promptVsContext.title') }}
        </h2>

        <app-definition
          [title]="t('articleContextEngineering.promptVsContext.definitionTitle')"
          [firstOptionContent]="t('articleContextEngineering.promptVsContext.analogy')"
          [secondOptionContent]="t('articleContextEngineering.promptVsContext.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleContextEngineering.promptVsContext.analogyBreak')">
          {{ t('articleContextEngineering.promptVsContext.analogyBreak') }}
        </p>

        <!-- Optimizing the question vs optimizing the workplace -->
        <app-comparison
          layout="horizontal"
          [beforeLabel]="t('articleContextEngineering.promptVsContext.comparison.promptLabel')"
          [beforeResult]="t('articleContextEngineering.promptVsContext.comparison.promptResult')"
          [afterLabel]="t('articleContextEngineering.promptVsContext.comparison.contextLabel')"
          [afterResult]="t('articleContextEngineering.promptVsContext.comparison.contextResult')"
        >
        </app-comparison>

        <!-- Misconception: a better prompt fixes everything -->
        <app-standard-container [config]="promptMisconceptionConfig">
          <p [appHighlight]="t('articleContextEngineering.promptVsContext.misconception.text')">
            {{ t('articleContextEngineering.promptVsContext.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 2: the rule file -->
      <section id="rule-file" class="article-section">
        <h2 [appHighlight]="t('articleContextEngineering.ruleFile.title')">
          {{ t('articleContextEngineering.ruleFile.title') }}
        </h2>

        <p [appHighlight]="t('articleContextEngineering.ruleFile.intro')">
          {{ t('articleContextEngineering.ruleFile.intro') }}
        </p>

        <!-- What differs between tools: name, scope, load time -->
        <app-icon-grid [items]="ruleFileTraits" [columns]="3" [showDescriptions]="true" size="medium" color="primary">
        </app-icon-grid>

        <p [appHighlight]="t('articleContextEngineering.ruleFile.checklistIntro')">
          {{ t('articleContextEngineering.ruleFile.checklistIntro') }}
        </p>

        <!-- Deep dive: what belongs in a rule file -->
        <app-standard-container [config]="ruleFileDeepDiveConfig">
          <p [appHighlight]="t('articleContextEngineering.ruleFile.deepDive.good')">
            {{ t('articleContextEngineering.ruleFile.deepDive.good') }}
          </p>
          <p [appHighlight]="t('articleContextEngineering.ruleFile.deepDive.bad')">
            {{ t('articleContextEngineering.ruleFile.deepDive.bad') }}
          </p>
        </app-standard-container>

        <!-- A concrete excerpt -->
        <app-standard-container [config]="codeExampleConfig">
          <pre class="code-example"><code>{{ t('articleContextEngineering.ruleFile.codeExample') }}</code></pre>
        </app-standard-container>

        <!-- Misconception: write it once and forget it -->
        <app-standard-container [config]="ruleFileMisconceptionConfig">
          <p [appHighlight]="t('articleContextEngineering.ruleFile.misconception.text')">
            {{ t('articleContextEngineering.ruleFile.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 3: the context hierarchy -->
      <section id="context-hierarchy" class="article-section">
        <h2 [appHighlight]="t('articleContextEngineering.contextHierarchy.title')">
          {{ t('articleContextEngineering.contextHierarchy.title') }}
        </h2>

        <p [appHighlight]="t('articleContextEngineering.contextHierarchy.intro')">
          {{ t('articleContextEngineering.contextHierarchy.intro') }}
        </p>

        <app-step-indicator [steps]="hierarchySteps" layout="vertical"> </app-step-indicator>

        <p [appHighlight]="t('articleContextEngineering.contextHierarchy.analogyText')">
          {{ t('articleContextEngineering.contextHierarchy.analogyText') }}
        </p>
        <p [appHighlight]="t('articleContextEngineering.contextHierarchy.analogyBreak')">
          {{ t('articleContextEngineering.contextHierarchy.analogyBreak') }}
        </p>
        <p [appHighlight]="t('articleContextEngineering.contextHierarchy.example')">
          {{ t('articleContextEngineering.contextHierarchy.example') }}
        </p>

        <!-- Deep dive: the feedback loop -->
        <app-standard-container [config]="feedbackLoopConfig">
          <p [appHighlight]="t('articleContextEngineering.contextHierarchy.feedbackLoop.text')">
            {{ t('articleContextEngineering.contextHierarchy.feedbackLoop.text') }}
          </p>
        </app-standard-container>

        <!-- Misconception: the AI reads everything anyway -->
        <app-standard-container [config]="hierarchyMisconceptionConfig">
          <p [appHighlight]="t('articleContextEngineering.contextHierarchy.misconception.text')">
            {{ t('articleContextEngineering.contextHierarchy.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Interactive: how three kinds of work scale with context size -->
      <section id="enrichment" class="article-section">
        <h2 [appHighlight]="t('articleContextEngineering.enrichment.sectionTitle')">
          {{ t('articleContextEngineering.enrichment.sectionTitle') }}
        </h2>
        <p [appHighlight]="t('articleContextEngineering.enrichment.intro')">
          {{ t('articleContextEngineering.enrichment.intro') }}
        </p>
        <app-scaling-slider [config]="scalingConfig" />
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleContextEngineering.takeaways.point1')">
              {{ t('articleContextEngineering.takeaways.point1') }}
            </li>
            <li [appHighlight]="t('articleContextEngineering.takeaways.point2')">
              {{ t('articleContextEngineering.takeaways.point2') }}
            </li>
            <li [appHighlight]="t('articleContextEngineering.takeaways.point3')">
              {{ t('articleContextEngineering.takeaways.point3') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-context-engineering-quiz"
          [titleKey]="'articleContextEngineering.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleContextEngineering.checkpoint.title'"
          storageKey="art-context-engineering-checkpoint"
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

      .lead-text {
        font-size: 1.2rem;
        line-height: 1.7;
        color: var(--text-color);
        margin-bottom: var(--space-4);
      }

      .takeaways-list {
        margin: 0;
        padding-left: var(--space-6);
      }

      .takeaways-list li {
        margin-bottom: var(--space-3);
        line-height: 1.6;
      }

      .code-example {
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: var(--space-4);
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.875rem;
        line-height: 1.5;
        overflow-x: auto;
        white-space: pre;
        color: var(--text-color);
      }

      @media print {
        /* The heading and the invitation only frame the interaction; the bars,
         the insight and the ratio table print and still carry the argument. */
        #enrichment > h2,
        #enrichment > p {
          display: none !important;
        }
      }
    `,
  ],
})
export class ArtContextEngineeringComponent implements OnInit {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  lessonMeta: LessonMeta = {
    id: 'art-context-engineering',
    titleKey: 'articleContextEngineering.hero.title',
    subtitleKey: 'articleContextEngineering.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '5 min',
    difficulty: 'beginner',
    difficultyKey: 'articles.difficulty.beginner',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleContextEngineering.toc.lead' },
    { id: 'prompt-vs-context', key: 'articleContextEngineering.toc.promptVsContext' },
    { id: 'rule-file', key: 'articleContextEngineering.toc.ruleFile' },
    { id: 'context-hierarchy', key: 'articleContextEngineering.toc.contextHierarchy' },
    { id: 'enrichment', key: 'articleContextEngineering.toc.enrichment' },
    { id: 'takeaways', key: 'articleContextEngineering.toc.takeaways' },
    { id: 'quiz', key: 'articleContextEngineering.toc.quiz' },
    { id: 'checkpoint', key: 'articleContextEngineering.toc.checkpoint' },
  ];

  // Container configs
  promptMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleContextEngineering.promptVsContext.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  ruleFileDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleContextEngineering.ruleFile.deepDive.title',
    type: 'info',
    icon: 'pi pi-list',
    collapsible: true,
    initiallyExpanded: false,
  };

  codeExampleConfig: ContainerConfig = {
    titleKey: 'articleContextEngineering.ruleFile.codeExampleTitle',
    type: 'info',
    icon: 'pi pi-code',
  };

  ruleFileMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleContextEngineering.ruleFile.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  feedbackLoopConfig: ContainerConfig = {
    titleKey: 'articleContextEngineering.contextHierarchy.feedbackLoop.title',
    type: 'info',
    icon: 'pi pi-refresh',
    collapsible: true,
    initiallyExpanded: false,
  };

  hierarchyMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleContextEngineering.contextHierarchy.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleContextEngineering.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /**
   * What actually differs between agent tools (ADR-0013): not which product
   * you use, but where the rule file lives, how far it reaches, and when it is
   * loaded. Those three questions transfer to any tool.
   */
  ruleFileTraits: IconGridItem[] = [
    {
      icon: 'pi pi-file',
      labelKey: 'articleContextEngineering.ruleFileTraits.fileName.label',
      descriptionKey: 'articleContextEngineering.ruleFileTraits.fileName.description',
    },
    {
      icon: 'pi pi-sitemap',
      labelKey: 'articleContextEngineering.ruleFileTraits.scope.label',
      descriptionKey: 'articleContextEngineering.ruleFileTraits.scope.description',
    },
    {
      icon: 'pi pi-clock',
      labelKey: 'articleContextEngineering.ruleFileTraits.loading.label',
      descriptionKey: 'articleContextEngineering.ruleFileTraits.loading.description',
    },
  ];

  /**
   * The embedded slider: three kinds of work over a growing context. Reading
   * is the reference, because "read everything" is the intuitive default the
   * section argues against.
   */
  readonly scalingConfig: ScalingSliderConfig = {
    sliderMin: 1,
    sliderMax: 10000,
    defaultN: 100,
    referenceCurve: 'linear',
    translationPrefix: 'articleContextEngineering.enrichment',
    curves: [
      {
        type: 'constant',
        labelKey: 'articleContextEngineering.enrichment.curve.constant',
        color: 'var(--semantic-green-fg)',
      },
      {
        type: 'linear',
        labelKey: 'articleContextEngineering.enrichment.curve.linear',
        color: 'var(--semantic-blue-fg)',
      },
      {
        type: 'quadratic',
        labelKey: 'articleContextEngineering.enrichment.curve.quadratic',
        color: 'var(--semantic-red-fg)',
      },
    ],
  };

  // The four layers, all pending — an illustration, not a progress bar.
  hierarchySteps: StepItem[] = [
    {
      id: 1,
      labelKey: 'articleContextEngineering.hierarchy.step1.label',
      descriptionKey: 'articleContextEngineering.hierarchy.step1.description',
      status: 'pending',
    },
    {
      id: 2,
      labelKey: 'articleContextEngineering.hierarchy.step2.label',
      descriptionKey: 'articleContextEngineering.hierarchy.step2.description',
      status: 'pending',
    },
    {
      id: 3,
      labelKey: 'articleContextEngineering.hierarchy.step3.label',
      descriptionKey: 'articleContextEngineering.hierarchy.step3.description',
      status: 'pending',
    },
    {
      id: 4,
      labelKey: 'articleContextEngineering.hierarchy.step4.label',
      descriptionKey: 'articleContextEngineering.hierarchy.step4.description',
      status: 'pending',
    },
  ];

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Checkpoint
  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleContextEngineering.checkpoint.item1' },
    { textKey: 'articleContextEngineering.checkpoint.item2' },
    { textKey: 'articleContextEngineering.checkpoint.item3' },
  ];

  ngOnInit(): void {
    this.rebuildTranslatedContent();
    // ToC labels and quiz text are plain strings, not keys — rebuild them
    // whenever the reader switches language (or the Easy variant).
    this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.rebuildTranslatedContent();
      this.cdr.markForCheck();
    });
  }

  private rebuildTranslatedContent(): void {
    this.updateTocItems();
    this.updateQuizQuestions();
  }

  private updateTocItems(): void {
    this.tocItems = this.tocLabelKeys.map((item) => ({
      id: item.id,
      label: this.t(item.key),
    }));
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleContextEngineering.quiz.' + key);
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
          { id: 'b', text: q('q4.b'), isCorrect: true },
          { id: 'c', text: q('q4.c'), isCorrect: false },
          { id: 'd', text: q('q4.d'), isCorrect: false },
        ],
        explanation: q('q4.explanation'),
      },
    ];
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
