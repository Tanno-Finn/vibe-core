/**
 * ArtApisMcpComponent
 *
 * Article: using interfaces — what happens when software instead of a person
 * talks to a language model, what a tool-connection standard like MCP buys
 * you, and which four parts turn a single model call into an agent. Built on
 * the article blueprint documented in `seed-article-1.component.ts`:
 * definition blocks with the analogy/precise toggle, key numbers, a
 * comparison, an icon grid, a step indicator for the agent loop, collapsible
 * deep dives, an animated HTTP round trip, takeaways, quiz and checkpoint.
 *
 * Vendor-neutral per ADR-0013: the sample call is a plain HTTP POST against a
 * placeholder endpoint rather than one provider's SDK, and the framework
 * overview names four emphases instead of four products. The single exception
 * is the dated aging box in the MCP section, which records who published the
 * protocol and says so about itself.
 *
 * Text lives in `assets/i18n/modules/<lang>/articleApisMcp.json` (de, en and
 * both Easy-Language variants); meta and related refs in
 * `assets/data/core/articles/art-apis-mcp.json` + `index.json`.
 *
 * SSR-safe: no browser globals here; the embedded diagram guards its own
 * timer, so the page prerenders (T2, see scripts/generate-prerender-routes.js).
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
import { StatCardComponent } from '../../../components/didactic/stat-card.component';
import {
  HttpRequestFlowComponent,
  HttpRequestFlowConfig,
} from '../../../components/didactic/http-request-flow/http-request-flow.component';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'app-art-apis-mcp',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    IconGridComponent,
    StepIndicatorComponent,
    StatCardComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
    HttpRequestFlowComponent,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead Section -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleApisMcp.lead.paragraph1')">
          {{ t('articleApisMcp.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleApisMcp.lead.paragraph2')">{{ t('articleApisMcp.lead.paragraph2') }}</p>
      </section>

      <!-- Section 1: from the chat window to code -->
      <section id="api-section" class="article-section">
        <h2 [appHighlight]="t('articleApisMcp.apiSection.title')">{{ t('articleApisMcp.apiSection.title') }}</h2>

        <p [appHighlight]="t('articleApisMcp.apiSection.intro')">{{ t('articleApisMcp.apiSection.intro') }}</p>

        <app-definition
          [title]="t('articleApisMcp.apiSection.definitionTitle')"
          [firstOptionContent]="t('articleApisMcp.apiSection.analogy')"
          [secondOptionContent]="t('articleApisMcp.apiSection.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleApisMcp.apiSection.analogyNote')">
          {{ t('articleApisMcp.apiSection.analogyNote') }}
        </p>

        <!-- A plain HTTP POST: no SDK, so the shape is visible (ADR-0013) -->
        <p [appHighlight]="t('articleApisMcp.apiSection.codeIntro')">{{ t('articleApisMcp.apiSection.codeIntro') }}</p>
        <pre class="code-block"><code>import requests

response = requests.post(
    "https://api.example.com/v1/chat/completions",
    headers=&#123;"Authorization": f"Bearer &#123;API_KEY&#125;"&#125;,
    json=&#123;
        "model": "&lt;model-name&gt;",
        "messages": [&#123;"role": "user", "content": "What is DNA?"&#125;]
    &#125;,
)
print(response.json()["choices"][0]["message"]["content"])</code></pre>

        <!-- Deep dive: what a call costs -->
        <app-standard-container [config]="pricingConfig">
          <p [appHighlight]="t('articleApisMcp.apiSection.pricingIntro')">
            {{ t('articleApisMcp.apiSection.pricingIntro') }}
          </p>
          <p [appHighlight]="t('articleApisMcp.apiSection.pricingExample')">
            {{ t('articleApisMcp.apiSection.pricingExample') }}
          </p>
          <p [appHighlight]="t('articleApisMcp.apiSection.pricingScale')">
            {{ t('articleApisMcp.apiSection.pricingScale') }}
          </p>
        </app-standard-container>

        <!-- Key numbers -->
        <div class="stat-grid">
          <app-stat-card
            [value]="t('articleApisMcp.apiSection.stats.costPerCall.value')"
            [suffix]="t('articleApisMcp.apiSection.stats.costPerCall.suffix')"
            [labelKey]="'articleApisMcp.apiSection.stats.costPerCall.label'"
            [descriptionKey]="'articleApisMcp.apiSection.stats.costPerCall.description'"
            icon="pi pi-dollar"
            color="orange"
            variant="gradient"
          >
          </app-stat-card>
          <app-stat-card
            [value]="t('articleApisMcp.apiSection.stats.costAtScale.value')"
            [suffix]="t('articleApisMcp.apiSection.stats.costAtScale.suffix')"
            [labelKey]="'articleApisMcp.apiSection.stats.costAtScale.label'"
            [descriptionKey]="'articleApisMcp.apiSection.stats.costAtScale.description'"
            icon="pi pi-chart-line"
            color="red"
            variant="gradient"
          >
          </app-stat-card>
          <app-stat-card
            [value]="t('articleApisMcp.apiSection.stats.mcpReduction.value')"
            [suffix]="t('articleApisMcp.apiSection.stats.mcpReduction.suffix')"
            [labelKey]="'articleApisMcp.apiSection.stats.mcpReduction.label'"
            [descriptionKey]="'articleApisMcp.apiSection.stats.mcpReduction.description'"
            icon="pi pi-percentage"
            color="green"
            variant="gradient"
          >
          </app-stat-card>
        </div>

        <!-- Misconception: APIs are expensive -->
        <app-standard-container [config]="apiMisconceptionConfig">
          <p [appHighlight]="t('articleApisMcp.apiSection.misconception')">
            {{ t('articleApisMcp.apiSection.misconception') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Interactive: one HTTP round trip, animated -->
      <section id="enrichment" class="article-section">
        <h2 [appHighlight]="t('articleApisMcp.enrichment.sectionTitle')">
          {{ t('articleApisMcp.enrichment.sectionTitle') }}
        </h2>
        <p [appHighlight]="t('articleApisMcp.enrichment.introText')">{{ t('articleApisMcp.enrichment.introText') }}</p>
        <app-http-request-flow [config]="requestFlowConfig" />
      </section>

      <!-- Section 2: one plug for everything -->
      <section id="mcp-section" class="article-section">
        <h2 [appHighlight]="t('articleApisMcp.mcpSection.title')">{{ t('articleApisMcp.mcpSection.title') }}</h2>

        <p [appHighlight]="t('articleApisMcp.mcpSection.intro')">{{ t('articleApisMcp.mcpSection.intro') }}</p>

        <app-definition
          [title]="t('articleApisMcp.mcpSection.definitionTitle')"
          [firstOptionContent]="t('articleApisMcp.mcpSection.analogy')"
          [secondOptionContent]="t('articleApisMcp.mcpSection.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <!-- N×M vs N+M -->
        <app-comparison
          layout="horizontal"
          variant="bad-good"
          [beforeLabel]="t('articleApisMcp.mcpSection.comparison.withoutLabel')"
          [beforeResult]="t('articleApisMcp.mcpSection.comparison.withoutResult')"
          [afterLabel]="t('articleApisMcp.mcpSection.comparison.withLabel')"
          [afterResult]="t('articleApisMcp.mcpSection.comparison.withResult')"
        >
        </app-comparison>

        <p [appHighlight]="t('articleApisMcp.mcpSection.analogyLimit')">
          {{ t('articleApisMcp.mcpSection.analogyLimit') }}
        </p>
        <p [appHighlight]="t('articleApisMcp.mcpSection.architecture')">
          {{ t('articleApisMcp.mcpSection.architecture') }}
        </p>

        <!-- The one dated box this article is allowed (ADR-0013) -->
        <app-standard-container [config]="originConfig">
          <p [appHighlight]="t('articleApisMcp.mcpSection.origin')">{{ t('articleApisMcp.mcpSection.origin') }}</p>
        </app-standard-container>

        <!-- MCP is not a universal replacement -->
        <app-standard-container [config]="mcpWarningConfig">
          <p [appHighlight]="t('articleApisMcp.mcpSection.warning')">{{ t('articleApisMcp.mcpSection.warning') }}</p>
        </app-standard-container>
      </section>

      <!-- Section 3: anatomy of an agent -->
      <section id="agent-section" class="article-section">
        <h2 [appHighlight]="t('articleApisMcp.agentSection.title')">{{ t('articleApisMcp.agentSection.title') }}</h2>

        <p [appHighlight]="t('articleApisMcp.agentSection.intro')">{{ t('articleApisMcp.agentSection.intro') }}</p>

        <app-icon-grid
          [items]="agentBuildingBlocks"
          [columns]="4"
          [showDescriptions]="true"
          size="medium"
          color="primary"
        >
        </app-icon-grid>

        <p [appHighlight]="t('articleApisMcp.agentSection.analogyIntro')">
          {{ t('articleApisMcp.agentSection.analogyIntro') }}
        </p>
        <p [appHighlight]="t('articleApisMcp.agentSection.analogy')">{{ t('articleApisMcp.agentSection.analogy') }}</p>
        <p [appHighlight]="t('articleApisMcp.agentSection.analogyNote')">
          {{ t('articleApisMcp.agentSection.analogyNote') }}
        </p>

        <!-- The loop itself -->
        <app-step-indicator [steps]="agentLoopSteps" layout="horizontal"> </app-step-indicator>

        <!-- A worked example -->
        <app-standard-container [config]="travelExampleConfig">
          <p [appHighlight]="t('articleApisMcp.agentSection.example')">
            {{ t('articleApisMcp.agentSection.example') }}
          </p>
        </app-standard-container>

        <!-- Misconception: agents are autonomous AI -->
        <app-standard-container [config]="agentMisconceptionConfig">
          <p [appHighlight]="t('articleApisMcp.agentSection.misconception')">
            {{ t('articleApisMcp.agentSection.misconception') }}
          </p>
        </app-standard-container>

        <!-- Deep dive: four emphases, not four products -->
        <app-standard-container [config]="frameworkConfig">
          <p [appHighlight]="t('articleApisMcp.agentSection.frameworks.broad')">
            {{ t('articleApisMcp.agentSection.frameworks.broad') }}
          </p>
          <p [appHighlight]="t('articleApisMcp.agentSection.frameworks.retrieval')">
            {{ t('articleApisMcp.agentSection.frameworks.retrieval') }}
          </p>
          <p [appHighlight]="t('articleApisMcp.agentSection.frameworks.multiAgent')">
            {{ t('articleApisMcp.agentSection.frameworks.multiAgent') }}
          </p>
          <p [appHighlight]="t('articleApisMcp.agentSection.frameworks.minimal')">
            {{ t('articleApisMcp.agentSection.frameworks.minimal') }}
          </p>
          <p [appHighlight]="t('articleApisMcp.agentSection.frameworkNote')">
            {{ t('articleApisMcp.agentSection.frameworkNote') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleApisMcp.takeaways.item1')">{{ t('articleApisMcp.takeaways.item1') }}</li>
            <li [appHighlight]="t('articleApisMcp.takeaways.item2')">{{ t('articleApisMcp.takeaways.item2') }}</li>
            <li [appHighlight]="t('articleApisMcp.takeaways.item3')">{{ t('articleApisMcp.takeaways.item3') }}</li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-apis-mcp-quiz"
          [titleKey]="'articleApisMcp.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleApisMcp.checkpoint.title'"
          storageKey="art-apis-mcp-checkpoint"
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

      .code-block {
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: var(--space-4);
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
        overflow-x: auto;
        margin: var(--space-4) 0;
        color: var(--text-color);
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-4);
        margin: var(--space-6) 0;
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

      @media print {
        /* The heading and the click prompt only frame the interaction; the
         diagram itself prints every station at once and still speaks. */
        #enrichment > h2,
        #enrichment > p {
          display: none !important;
        }
      }
    `,
  ],
})
export class ArtApisMcpComponent implements OnInit {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  lessonMeta: LessonMeta = {
    id: 'art-apis-mcp',
    titleKey: 'articleApisMcp.hero.title',
    subtitleKey: 'articleApisMcp.hero.subtitle',
    category: 'architecture',
    categoryKey: 'articles.category.architecture',
    readingTime: '10 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleApisMcp.toc.lead' },
    { id: 'api-section', key: 'articleApisMcp.toc.apiSection' },
    { id: 'enrichment', key: 'articleApisMcp.enrichment.tocLabel' },
    { id: 'mcp-section', key: 'articleApisMcp.toc.mcpSection' },
    { id: 'agent-section', key: 'articleApisMcp.toc.agentSection' },
    { id: 'takeaways', key: 'articleApisMcp.toc.takeaways' },
    { id: 'quiz', key: 'articleApisMcp.toc.quiz' },
    { id: 'checkpoint', key: 'articleApisMcp.toc.checkpoint' },
  ];

  // Container configs
  pricingConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.apiSection.pricingTitle',
    type: 'info',
    icon: 'pi pi-calculator',
    collapsible: true,
    initiallyExpanded: false,
  };

  apiMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.apiSection.misconceptionTitle',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  /**
   * The dated aging box (ADR-0013): the only place in this article where a
   * concrete vendor is named, and it declares its own expiry.
   */
  originConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.mcpSection.originTitle',
    type: 'secondary',
    icon: 'pi pi-calendar',
    collapsible: true,
    initiallyExpanded: false,
  };

  mcpWarningConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.mcpSection.warningTitle',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  travelExampleConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.agentSection.exampleTitle',
    type: 'info',
    icon: 'pi pi-map',
  };

  agentMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.agentSection.misconceptionTitle',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  frameworkConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.agentSection.frameworkTitle',
    type: 'info',
    icon: 'pi pi-th-large',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleApisMcp.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /** The embedded diagram: the six stations of one API call, narrated. */
  readonly requestFlowConfig: HttpRequestFlowConfig = {
    translationPrefix: 'articleApisMcp.enrichment',
    stages: [
      {
        id: 'browser',
        labelKey: 'articleApisMcp.enrichment.stage.browser',
        descriptionKey: 'articleApisMcp.enrichment.stageDesc.browser',
      },
      {
        id: 'dns',
        labelKey: 'articleApisMcp.enrichment.stage.dns',
        descriptionKey: 'articleApisMcp.enrichment.stageDesc.dns',
      },
      {
        id: 'tls',
        labelKey: 'articleApisMcp.enrichment.stage.tls',
        descriptionKey: 'articleApisMcp.enrichment.stageDesc.tls',
      },
      {
        id: 'request',
        labelKey: 'articleApisMcp.enrichment.stage.request',
        descriptionKey: 'articleApisMcp.enrichment.stageDesc.request',
      },
      {
        id: 'server',
        labelKey: 'articleApisMcp.enrichment.stage.server',
        descriptionKey: 'articleApisMcp.enrichment.stageDesc.server',
      },
      {
        id: 'response',
        labelKey: 'articleApisMcp.enrichment.stage.response',
        descriptionKey: 'articleApisMcp.enrichment.stageDesc.response',
      },
    ],
    autoAdvanceDelay: 2500,
  };

  // The four parts of an agent
  agentBuildingBlocks: IconGridItem[] = [
    {
      icon: 'pi pi-bolt',
      labelKey: 'articleApisMcp.agentSection.iconGrid.llm.label',
      descriptionKey: 'articleApisMcp.agentSection.iconGrid.llm.description',
    },
    {
      icon: 'pi pi-wrench',
      labelKey: 'articleApisMcp.agentSection.iconGrid.tools.label',
      descriptionKey: 'articleApisMcp.agentSection.iconGrid.tools.description',
    },
    {
      icon: 'pi pi-bookmark',
      labelKey: 'articleApisMcp.agentSection.iconGrid.context.label',
      descriptionKey: 'articleApisMcp.agentSection.iconGrid.context.description',
    },
    {
      icon: 'pi pi-sitemap',
      labelKey: 'articleApisMcp.agentSection.iconGrid.orchestration.label',
      descriptionKey: 'articleApisMcp.agentSection.iconGrid.orchestration.description',
    },
  ];

  // The loop, all pending — an illustration, not a progress bar.
  agentLoopSteps: StepItem[] = [
    { id: 1, labelKey: 'articleApisMcp.agentSection.steps.receive', status: 'pending' },
    { id: 2, labelKey: 'articleApisMcp.agentSection.steps.plan', status: 'pending' },
    { id: 3, labelKey: 'articleApisMcp.agentSection.steps.execute', status: 'pending' },
    { id: 4, labelKey: 'articleApisMcp.agentSection.steps.observe', status: 'pending' },
    { id: 5, labelKey: 'articleApisMcp.agentSection.steps.decide', status: 'pending' },
  ];

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Checkpoint
  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleApisMcp.checkpoint.item1' },
    { textKey: 'articleApisMcp.checkpoint.item2' },
    { textKey: 'articleApisMcp.checkpoint.item3' },
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
    const q = (key: string) => this.t('articleApisMcp.quiz.' + key);
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
      {
        id: 'q6',
        question: q('q6.question'),
        type: 'single',
        options: [
          { id: 'a', text: q('q6.a'), isCorrect: true },
          { id: 'b', text: q('q6.b'), isCorrect: false },
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
