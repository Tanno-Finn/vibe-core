/**
 * ArtVibecodingComponent
 *
 * Article: programming in natural language — what the shift actually changes,
 * which levels of tool autonomy exist, and where the three traps are. Built on
 * the article blueprint documented in `seed-article-1.component.ts`: a
 * definition block with the analogy/precise toggle, a step indicator for the
 * abstraction ladder, an icon grid for the autonomy levels, misconception and
 * deep-dive boxes, an embedded prompt builder, takeaways, quiz and checkpoint.
 *
 * Vendor-neutral per ADR-0013: the autonomy levels are described as patterns
 * (completion, codebase-aware editor, supervised agent, autonomous agent), not
 * as products, and the identifiers follow suit — a reader in front of any
 * concrete tool can place it on the ladder.
 *
 * Text lives in `assets/i18n/modules/<lang>/articleVibecoding.json` (de, en and
 * both Easy-Language variants); meta and related refs in
 * `assets/data/core/articles/art-vibecoding.json` + `index.json`.
 *
 * SSR-safe: no browser globals here; the embedded builder guards its own
 * clipboard access, so the page prerenders (T2, see
 * scripts/generate-prerender-routes.js).
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
import { StepIndicatorComponent, StepItem } from '../../../components/didactic/step-indicator.component';
import { IconGridComponent, IconGridItem } from '../../../components/didactic/icon-grid.component';
import {
  PromptBuilderComponent,
  PromptBuilderConfig,
} from '../../../components/didactic/prompt-builder/prompt-builder.component';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'app-art-vibecoding',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    StepIndicatorComponent,
    IconGridComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
    PromptBuilderComponent,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead Section -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleVibecoding.lead.paragraph1')">
          {{ t('articleVibecoding.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleVibecoding.lead.paragraph2')">{{ t('articleVibecoding.lead.paragraph2') }}</p>
      </section>

      <!-- Section 1: the paradigm shift -->
      <section id="paradigm" class="article-section">
        <h2 [appHighlight]="t('articleVibecoding.paradigm.title')">{{ t('articleVibecoding.paradigm.title') }}</h2>

        <app-definition
          [title]="t('articleVibecoding.paradigm.definitionTitle')"
          [firstOptionContent]="t('articleVibecoding.paradigm.analogy')"
          [secondOptionContent]="t('articleVibecoding.paradigm.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleVibecoding.paradigm.analogyBreak')">
          {{ t('articleVibecoding.paradigm.analogyBreak') }}
        </p>

        <!-- The abstraction ladder, one rung at a time -->
        <h3 [appHighlight]="t('articleVibecoding.paradigm.abstractionTitle')">
          {{ t('articleVibecoding.paradigm.abstractionTitle') }}
        </h3>
        <app-step-indicator [steps]="abstractionSteps"></app-step-indicator>

        <p [appHighlight]="t('articleVibecoding.paradigm.roleShift')">
          {{ t('articleVibecoding.paradigm.roleShift') }}
        </p>
        <p [appHighlight]="t('articleVibecoding.paradigm.eightTwenty')">
          {{ t('articleVibecoding.paradigm.eightTwenty') }}
        </p>

        <!-- Writing it by hand vs describing it -->
        <app-comparison
          layout="horizontal"
          [beforeLabelKey]="'articleVibecoding.comparison.traditionalLabel'"
          [afterLabelKey]="'articleVibecoding.comparison.vibecodingLabel'"
          [beforeResultKey]="'articleVibecoding.comparison.traditionalResult'"
          [afterResultKey]="'articleVibecoding.comparison.vibecodingResult'"
        >
        </app-comparison>

        <!-- Misconception: programmers become obsolete -->
        <app-standard-container [config]="misconceptionObsoleteConfig">
          <p [appHighlight]="t('articleVibecoding.misconceptions.obsolete.text')">
            {{ t('articleVibecoding.misconceptions.obsolete.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 2: the spectrum of tool autonomy -->
      <section id="tools" class="article-section">
        <h2 [appHighlight]="t('articleVibecoding.tools.title')">{{ t('articleVibecoding.tools.title') }}</h2>
        <p [appHighlight]="t('articleVibecoding.tools.intro')">{{ t('articleVibecoding.tools.intro') }}</p>

        <h3 [appHighlight]="t('articleVibecoding.tools.gridTitle')">{{ t('articleVibecoding.tools.gridTitle') }}</h3>
        <app-icon-grid [items]="autonomyLevels" [columns]="2" [showDescriptions]="true" color="blue" size="medium">
        </app-icon-grid>

        <!-- Misconception: the most autonomous tool is always best -->
        <app-standard-container [config]="misconceptionAutonomyConfig">
          <p [appHighlight]="t('articleVibecoding.misconceptions.autonomy.text')">
            {{ t('articleVibecoding.misconceptions.autonomy.text') }}
          </p>
        </app-standard-container>

        <!-- Deep dive: the code-literacy paradox -->
        <app-standard-container [config]="deepDiveLiteracyConfig">
          <p [appHighlight]="t('articleVibecoding.deepDive.literacy.text')">
            {{ t('articleVibecoding.deepDive.literacy.text') }}
          </p>
          <p [appHighlight]="t('articleVibecoding.deepDive.literacy.insight')">
            {{ t('articleVibecoding.deepDive.literacy.insight') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Interactive: assemble a prompt from building blocks -->
      <section id="enrichment" class="article-section">
        <h2 [appHighlight]="t('articleVibecoding.enrichment.sectionTitle')">
          {{ t('articleVibecoding.enrichment.sectionTitle') }}
        </h2>
        <p [appHighlight]="t('articleVibecoding.enrichment.intro')">{{ t('articleVibecoding.enrichment.intro') }}</p>
        <app-prompt-builder [config]="promptBuilderConfig" />
      </section>

      <!-- Section 3: risks -->
      <section id="risks" class="article-section">
        <h2 [appHighlight]="t('articleVibecoding.risks.title')">{{ t('articleVibecoding.risks.title') }}</h2>
        <p [appHighlight]="t('articleVibecoding.risks.intro')">{{ t('articleVibecoding.risks.intro') }}</p>

        <app-standard-container [config]="risksWarningConfig">
          <p>
            <strong [appHighlight]="t('articleVibecoding.risks.hallucination.title')">{{
              t('articleVibecoding.risks.hallucination.title')
            }}</strong>
            <span [appHighlight]="t('articleVibecoding.risks.hallucination.text')">{{
              t('articleVibecoding.risks.hallucination.text')
            }}</span>
          </p>
          <p>
            <strong [appHighlight]="t('articleVibecoding.risks.contextLoss.title')">{{
              t('articleVibecoding.risks.contextLoss.title')
            }}</strong>
            <span [appHighlight]="t('articleVibecoding.risks.contextLoss.text')">{{
              t('articleVibecoding.risks.contextLoss.text')
            }}</span>
          </p>
          <p>
            <strong [appHighlight]="t('articleVibecoding.risks.cargoCult.title')">{{
              t('articleVibecoding.risks.cargoCult.title')
            }}</strong>
            <span [appHighlight]="t('articleVibecoding.risks.cargoCult.text')">{{
              t('articleVibecoding.risks.cargoCult.text')
            }}</span>
          </p>
        </app-standard-container>

        <!-- What failure looks like in practice -->
        <app-standard-container [config]="failScenarioConfig">
          <p [appHighlight]="t('articleVibecoding.risks.failScenario.text')">
            {{ t('articleVibecoding.risks.failScenario.text') }}
          </p>
          <p [appHighlight]="t('articleVibecoding.risks.failScenario.consequences')">
            {{ t('articleVibecoding.risks.failScenario.consequences') }}
          </p>
        </app-standard-container>

        <!-- Misconception: if it runs, it is safe -->
        <app-standard-container [config]="misconceptionSafeConfig">
          <p [appHighlight]="t('articleVibecoding.misconceptions.safe.text')">
            {{ t('articleVibecoding.misconceptions.safe.text') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleVibecoding.risks.bottomLine')">{{ t('articleVibecoding.risks.bottomLine') }}</p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleVibecoding.takeaways.point1')">
              {{ t('articleVibecoding.takeaways.point1') }}
            </li>
            <li [appHighlight]="t('articleVibecoding.takeaways.point2')">
              {{ t('articleVibecoding.takeaways.point2') }}
            </li>
            <li [appHighlight]="t('articleVibecoding.takeaways.point3')">
              {{ t('articleVibecoding.takeaways.point3') }}
            </li>
            <li [appHighlight]="t('articleVibecoding.takeaways.point4')">
              {{ t('articleVibecoding.takeaways.point4') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-vibecoding-quiz"
          [titleKey]="'articleVibecoding.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleVibecoding.checkpoint.title'"
          storageKey="art-vibecoding-checkpoint"
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

      @media print {
        /* The heading and the invitation only frame the interaction; the block
         catalog below prints and still teaches the prompt pattern. */
        #enrichment > h2,
        #enrichment > p {
          display: none !important;
        }
      }
    `,
  ],
})
export class ArtVibecodingComponent implements OnInit {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  lessonMeta: LessonMeta = {
    id: 'art-vibecoding',
    titleKey: 'articleVibecoding.hero.title',
    subtitleKey: 'articleVibecoding.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '10 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleVibecoding.toc.lead' },
    { id: 'paradigm', key: 'articleVibecoding.toc.paradigm' },
    { id: 'tools', key: 'articleVibecoding.toc.tools' },
    { id: 'enrichment', key: 'articleVibecoding.toc.enrichment' },
    { id: 'risks', key: 'articleVibecoding.toc.risks' },
    { id: 'takeaways', key: 'articleVibecoding.toc.takeaways' },
    { id: 'quiz', key: 'articleVibecoding.toc.quiz' },
    { id: 'checkpoint', key: 'articleVibecoding.toc.checkpoint' },
  ];

  // Container configs
  misconceptionObsoleteConfig: ContainerConfig = {
    titleKey: 'articleVibecoding.misconceptions.obsolete.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  misconceptionAutonomyConfig: ContainerConfig = {
    titleKey: 'articleVibecoding.misconceptions.autonomy.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  deepDiveLiteracyConfig: ContainerConfig = {
    titleKey: 'articleVibecoding.deepDive.literacy.title',
    type: 'info',
    icon: 'pi pi-book',
    collapsible: true,
    initiallyExpanded: false,
  };

  risksWarningConfig: ContainerConfig = {
    titleKey: 'articleVibecoding.risks.warningTitle',
    type: 'warning',
    icon: 'pi pi-shield',
  };

  failScenarioConfig: ContainerConfig = {
    titleKey: 'articleVibecoding.risks.failScenario.title',
    type: 'info',
    icon: 'pi pi-info-circle',
    collapsible: true,
    initiallyExpanded: false,
  };

  misconceptionSafeConfig: ContainerConfig = {
    titleKey: 'articleVibecoding.misconceptions.safe.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleVibecoding.takeaways.title',
    type: 'success',
    icon: 'pi pi-check-circle',
  };

  /**
   * Four rungs of tool autonomy, described as patterns rather than products
   * (ADR-0013): how much the tool does on its own, and how tight the leash is.
   */
  autonomyLevels: IconGridItem[] = [
    {
      icon: 'pi pi-bolt',
      labelKey: 'articleVibecoding.toolGrid.completion.label',
      descriptionKey: 'articleVibecoding.toolGrid.completion.description',
    },
    {
      icon: 'pi pi-pencil',
      labelKey: 'articleVibecoding.toolGrid.editor.label',
      descriptionKey: 'articleVibecoding.toolGrid.editor.description',
    },
    {
      icon: 'pi pi-cog',
      labelKey: 'articleVibecoding.toolGrid.supervised.label',
      descriptionKey: 'articleVibecoding.toolGrid.supervised.description',
    },
    {
      icon: 'pi pi-sitemap',
      labelKey: 'articleVibecoding.toolGrid.autonomous.label',
      descriptionKey: 'articleVibecoding.toolGrid.autonomous.description',
    },
  ];

  /** The embedded builder: four categories, three blocks each. */
  readonly promptBuilderConfig: PromptBuilderConfig = {
    translationPrefix: 'articleVibecoding.enrichment',
    categories: [
      {
        id: 'role',
        icon: 'pi pi-user',
        color: 'var(--semantic-blue-fg)',
        labelKey: 'articleVibecoding.enrichment.category.role.label',
        qualityLabelKey: 'articleVibecoding.enrichment.category.role.quality',
        missingLabelKey: 'articleVibecoding.enrichment.category.role.missing',
      },
      {
        id: 'expertise',
        icon: 'pi pi-server',
        color: 'var(--semantic-cyan-fg)',
        labelKey: 'articleVibecoding.enrichment.category.expertise.label',
        qualityLabelKey: 'articleVibecoding.enrichment.category.expertise.quality',
        missingLabelKey: 'articleVibecoding.enrichment.category.expertise.missing',
      },
      {
        id: 'task',
        icon: 'pi pi-list',
        color: 'var(--semantic-green-fg)',
        labelKey: 'articleVibecoding.enrichment.category.task.label',
        qualityLabelKey: 'articleVibecoding.enrichment.category.task.quality',
        missingLabelKey: 'articleVibecoding.enrichment.category.task.missing',
      },
      {
        id: 'format',
        icon: 'pi pi-check-square',
        color: 'var(--semantic-orange-fg)',
        labelKey: 'articleVibecoding.enrichment.category.format.label',
        qualityLabelKey: 'articleVibecoding.enrichment.category.format.quality',
        missingLabelKey: 'articleVibecoding.enrichment.category.format.missing',
      },
    ],
    blocks: [
      {
        id: 'vc_r1',
        category: 'role',
        labelKey: 'articleVibecoding.enrichment.block.vc_r1.label',
        textKey: 'articleVibecoding.enrichment.block.vc_r1.text',
      },
      {
        id: 'vc_r2',
        category: 'role',
        labelKey: 'articleVibecoding.enrichment.block.vc_r2.label',
        textKey: 'articleVibecoding.enrichment.block.vc_r2.text',
      },
      {
        id: 'vc_r3',
        category: 'role',
        labelKey: 'articleVibecoding.enrichment.block.vc_r3.label',
        textKey: 'articleVibecoding.enrichment.block.vc_r3.text',
      },
      {
        id: 'vc_e1',
        category: 'expertise',
        labelKey: 'articleVibecoding.enrichment.block.vc_e1.label',
        textKey: 'articleVibecoding.enrichment.block.vc_e1.text',
      },
      {
        id: 'vc_e2',
        category: 'expertise',
        labelKey: 'articleVibecoding.enrichment.block.vc_e2.label',
        textKey: 'articleVibecoding.enrichment.block.vc_e2.text',
      },
      {
        id: 'vc_e3',
        category: 'expertise',
        labelKey: 'articleVibecoding.enrichment.block.vc_e3.label',
        textKey: 'articleVibecoding.enrichment.block.vc_e3.text',
      },
      {
        id: 'vc_t1',
        category: 'task',
        labelKey: 'articleVibecoding.enrichment.block.vc_t1.label',
        textKey: 'articleVibecoding.enrichment.block.vc_t1.text',
      },
      {
        id: 'vc_t2',
        category: 'task',
        labelKey: 'articleVibecoding.enrichment.block.vc_t2.label',
        textKey: 'articleVibecoding.enrichment.block.vc_t2.text',
      },
      {
        id: 'vc_t3',
        category: 'task',
        labelKey: 'articleVibecoding.enrichment.block.vc_t3.label',
        textKey: 'articleVibecoding.enrichment.block.vc_t3.text',
      },
      {
        id: 'vc_f1',
        category: 'format',
        labelKey: 'articleVibecoding.enrichment.block.vc_f1.label',
        textKey: 'articleVibecoding.enrichment.block.vc_f1.text',
      },
      {
        id: 'vc_f2',
        category: 'format',
        labelKey: 'articleVibecoding.enrichment.block.vc_f2.label',
        textKey: 'articleVibecoding.enrichment.block.vc_f2.text',
      },
      {
        id: 'vc_f3',
        category: 'format',
        labelKey: 'articleVibecoding.enrichment.block.vc_f3.label',
        textKey: 'articleVibecoding.enrichment.block.vc_f3.text',
      },
    ],
  };

  // Step indicator
  abstractionSteps: StepItem[] = [
    { labelKey: 'articleVibecoding.steps.machineCode', status: 'pending' },
    { labelKey: 'articleVibecoding.steps.assembler', status: 'pending' },
    { labelKey: 'articleVibecoding.steps.highlevel', status: 'pending' },
    { labelKey: 'articleVibecoding.steps.scripting', status: 'pending' },
    { labelKey: 'articleVibecoding.steps.naturalLanguage', status: 'pending' },
  ];

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Checkpoint
  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleVibecoding.checkpoint.q1' },
    { textKey: 'articleVibecoding.checkpoint.q2' },
    { textKey: 'articleVibecoding.checkpoint.q3' },
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
    const q = (key: string) => this.t('articleVibecoding.quiz.' + key);
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
          { id: 'b', text: q('q5.b'), isCorrect: true },
          { id: 'c', text: q('q5.c'), isCorrect: false },
          { id: 'd', text: q('q5.d'), isCorrect: false },
        ],
        explanation: q('q5.explanation'),
      },
      {
        id: 'q6',
        question: q('q6.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q6.a'), isCorrect: false },
          { id: 'b', text: q('q6.b'), isCorrect: true },
          { id: 'c', text: q('q6.c'), isCorrect: false },
          { id: 'd', text: q('q6.d'), isCorrect: false },
        ],
        explanation: q('q6.explanation'),
      },
    ];
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
