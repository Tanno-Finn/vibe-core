/**
 * ArtNetworkingApisComponent
 *
 * Article: the internet and APIs — client and server, addresses and name
 * resolution, and the interface a program talks to. Built on the article
 * blueprint documented in `seed-article-1.component.ts`: definition blocks
 * with the analogy/precise toggle, two step-indicator walkthroughs, key
 * numbers, comparisons, collapsible deep dives, an animated diagram of one
 * HTTP round trip, takeaways, quiz and checkpoint.
 *
 * Text lives in `assets/i18n/modules/<lang>/articleNetworkingApis.json` (de,
 * en and both Easy-Language variants); meta and related refs in
 * `assets/data/core/articles/art-networking-apis.json` + `index.json`.
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
import { StatCardComponent } from '../../../components/didactic/stat-card.component';
import { StepIndicatorComponent, StepItem } from '../../../components/didactic/step-indicator.component';
import {
  HttpRequestFlowComponent,
  HttpRequestFlowConfig,
} from '../../../components/didactic/http-request-flow/http-request-flow.component';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'app-art-networking-apis',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    StatCardComponent,
    StepIndicatorComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
    HttpRequestFlowComponent,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead Section -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleNetworkingApis.lead.paragraph1')">
          {{ t('articleNetworkingApis.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleNetworkingApis.lead.paragraph2')">
          {{ t('articleNetworkingApis.lead.paragraph2') }}
        </p>
      </section>

      <!-- Section 1: client and server -->
      <section id="client-server" class="article-section">
        <h2 [appHighlight]="t('articleNetworkingApis.clientServer.title')">
          {{ t('articleNetworkingApis.clientServer.title') }}
        </h2>

        <app-definition
          [title]="t('articleNetworkingApis.clientServer.definitionTitle')"
          [firstOptionContent]="t('articleNetworkingApis.clientServer.analogy')"
          [secondOptionContent]="t('articleNetworkingApis.clientServer.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleNetworkingApis.clientServer.analogyBreak')">
          {{ t('articleNetworkingApis.clientServer.analogyBreak') }}
        </p>

        <!-- What happens when a page is opened -->
        <app-standard-container [config]="pageLoadWalkthroughConfig">
          <app-step-indicator [steps]="pageLoadSteps" layout="vertical" [showConnectors]="true"> </app-step-indicator>
        </app-standard-container>

        <!-- Misconception: internet equals web -->
        <app-standard-container [config]="misconceptionInternetConfig">
          <p [appHighlight]="t('articleNetworkingApis.clientServer.misconception.text')">
            {{ t('articleNetworkingApis.clientServer.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 2: addresses and name resolution -->
      <section id="dns" class="article-section">
        <h2 [appHighlight]="t('articleNetworkingApis.dns.title')">{{ t('articleNetworkingApis.dns.title') }}</h2>

        <app-definition
          [title]="t('articleNetworkingApis.dns.definitionTitle')"
          [firstOptionContent]="t('articleNetworkingApis.dns.analogy')"
          [secondOptionContent]="t('articleNetworkingApis.dns.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <!-- Key numbers -->
        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleNetworkingApis.dns.stats.ipv4.label'"
            [value]="t('articleNetworkingApis.dns.stats.ipv4.value')"
            [suffix]="t('articleNetworkingApis.dns.stats.ipv4.suffix')"
            icon="pi pi-globe"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleNetworkingApis.dns.stats.ipv4.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleNetworkingApis.dns.stats.dnsTime.label'"
            value="~50"
            suffix=" ms"
            icon="pi pi-clock"
            color="green"
            variant="gradient"
            [descriptionKey]="'articleNetworkingApis.dns.stats.dnsTime.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleNetworkingApis.dns.stats.port.label'"
            value="443"
            icon="pi pi-lock"
            color="orange"
            variant="gradient"
            [descriptionKey]="'articleNetworkingApis.dns.stats.port.description'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleNetworkingApis.dns.phoneBookAnalogy')">
          {{ t('articleNetworkingApis.dns.phoneBookAnalogy') }}
        </p>
        <p [appHighlight]="t('articleNetworkingApis.dns.analogyBreak')">
          {{ t('articleNetworkingApis.dns.analogyBreak') }}
        </p>

        <!-- Name resolution, step by step -->
        <app-standard-container [config]="dnsResolutionConfig">
          <app-step-indicator [steps]="dnsSteps" layout="vertical" [showConnectors]="true"> </app-step-indicator>
        </app-standard-container>

        <p [appHighlight]="t('articleNetworkingApis.dns.portsExplanation')">
          {{ t('articleNetworkingApis.dns.portsExplanation') }}
        </p>

        <!-- Misconception: an address is permanent -->
        <app-standard-container [config]="misconceptionIpConfig">
          <p [appHighlight]="t('articleNetworkingApis.dns.misconception.text')">
            {{ t('articleNetworkingApis.dns.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 3: APIs -->
      <section id="apis" class="article-section">
        <h2 [appHighlight]="t('articleNetworkingApis.apis.title')">{{ t('articleNetworkingApis.apis.title') }}</h2>

        <app-definition
          [title]="t('articleNetworkingApis.apis.definitionTitle')"
          [firstOptionContent]="t('articleNetworkingApis.apis.analogy')"
          [secondOptionContent]="t('articleNetworkingApis.apis.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleNetworkingApis.apis.analogyBreak')">
          {{ t('articleNetworkingApis.apis.analogyBreak') }}
        </p>

        <!-- A page for people vs an interface for programs -->
        <app-comparison
          layout="horizontal"
          [beforeLabel]="t('articleNetworkingApis.apis.comparison.websiteLabel')"
          [beforeResult]="t('articleNetworkingApis.apis.comparison.websiteResult')"
          [afterLabel]="t('articleNetworkingApis.apis.comparison.apiLabel')"
          [afterResult]="t('articleNetworkingApis.apis.comparison.apiResult')"
        >
        </app-comparison>

        <p [appHighlight]="t('articleNetworkingApis.apis.weatherExample')">
          {{ t('articleNetworkingApis.apis.weatherExample') }}
        </p>
        <p [appHighlight]="t('articleNetworkingApis.apis.aiForwardLink')">
          {{ t('articleNetworkingApis.apis.aiForwardLink') }}
        </p>

        <!-- Misconception: APIs are for programmers only -->
        <app-standard-container [config]="misconceptionApiConfig">
          <p [appHighlight]="t('articleNetworkingApis.apis.misconception.text')">
            {{ t('articleNetworkingApis.apis.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Deep dive 1: methods and status codes -->
      <section id="http-methods" class="article-section">
        <app-standard-container [config]="httpMethodsConfig">
          <p [appHighlight]="t('articleNetworkingApis.deepDive.httpMethods.text')">
            {{ t('articleNetworkingApis.deepDive.httpMethods.text') }}
          </p>
          <p [appHighlight]="t('articleNetworkingApis.deepDive.httpMethods.statusCodes')">
            {{ t('articleNetworkingApis.deepDive.httpMethods.statusCodes') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Deep dive 2: the same pattern for AI services -->
      <section id="ai-apis" class="article-section">
        <app-standard-container [config]="aiApisConfig">
          <p [appHighlight]="t('articleNetworkingApis.deepDive.aiApis.text')">
            {{ t('articleNetworkingApis.deepDive.aiApis.text') }}
          </p>
          <p [appHighlight]="t('articleNetworkingApis.deepDive.aiApis.samePattern')">
            {{ t('articleNetworkingApis.deepDive.aiApis.samePattern') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Interactive: one HTTP round trip, animated -->
      <section id="enrichment" class="article-section">
        <h2 [appHighlight]="t('articleNetworkingApis.enrichment.sectionTitle')">
          {{ t('articleNetworkingApis.enrichment.sectionTitle') }}
        </h2>
        <app-http-request-flow [config]="requestFlowConfig" />
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleNetworkingApis.takeaways.items.clientServer')">
              {{ t('articleNetworkingApis.takeaways.items.clientServer') }}
            </li>
            <li [appHighlight]="t('articleNetworkingApis.takeaways.items.dns')">
              {{ t('articleNetworkingApis.takeaways.items.dns') }}
            </li>
            <li [appHighlight]="t('articleNetworkingApis.takeaways.items.api')">
              {{ t('articleNetworkingApis.takeaways.items.api') }}
            </li>
            <li [appHighlight]="t('articleNetworkingApis.takeaways.items.json')">
              {{ t('articleNetworkingApis.takeaways.items.json') }}
            </li>
            <li [appHighlight]="t('articleNetworkingApis.takeaways.items.cloud')">
              {{ t('articleNetworkingApis.takeaways.items.cloud') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-networking-apis-quiz"
          [titleKey]="'articleNetworkingApis.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleNetworkingApis.checkpoint.title'"
          storageKey="art-networking-apis-checkpoint"
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

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

      @media print {
        /* The heading only frames the interaction; the diagram itself stays and
         prints every station at once, so it still speaks on paper. */
        #enrichment > h2 {
          display: none !important;
        }
      }
    `,
  ],
})
export class ArtNetworkingApisComponent implements OnInit {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  lessonMeta: LessonMeta = {
    id: 'art-networking-apis',
    titleKey: 'articleNetworkingApis.hero.title',
    subtitleKey: 'articleNetworkingApis.hero.subtitle',
    category: 'fundamentals',
    categoryKey: 'articles.category.fundamentals',
    readingTime: '14 min',
    difficulty: 'beginner',
    difficultyKey: 'articles.difficulty.beginner',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleNetworkingApis.toc.lead' },
    { id: 'client-server', key: 'articleNetworkingApis.toc.clientServer' },
    { id: 'dns', key: 'articleNetworkingApis.toc.dns' },
    { id: 'apis', key: 'articleNetworkingApis.toc.apis' },
    { id: 'enrichment', key: 'articleNetworkingApis.enrichment.tocLabel' },
    { id: 'takeaways', key: 'articleNetworkingApis.toc.takeaways' },
    { id: 'quiz', key: 'articleNetworkingApis.toc.quiz' },
    { id: 'checkpoint', key: 'articleNetworkingApis.toc.checkpoint' },
  ];

  // Container configs
  pageLoadWalkthroughConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.clientServer.walkthrough.title',
    type: 'info',
    icon: 'pi pi-globe',
  };

  misconceptionInternetConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.clientServer.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  dnsResolutionConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.dns.resolution.title',
    type: 'info',
    icon: 'pi pi-search',
  };

  misconceptionIpConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.dns.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  misconceptionApiConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.apis.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  httpMethodsConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.deepDive.httpMethods.title',
    type: 'info',
    icon: 'pi pi-code',
    collapsible: true,
    initiallyExpanded: false,
  };

  aiApisConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.deepDive.aiApis.title',
    type: 'info',
    icon: 'pi pi-microchip-ai',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleNetworkingApis.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /** The embedded diagram: the six stations of one request, narrated. */
  readonly requestFlowConfig: HttpRequestFlowConfig = {
    translationPrefix: 'articleNetworkingApis.enrichment',
    stages: [
      {
        id: 'browser',
        labelKey: 'articleNetworkingApis.enrichment.stage.title1',
        descriptionKey: 'articleNetworkingApis.enrichment.stage.desc1',
      },
      {
        id: 'dns',
        labelKey: 'articleNetworkingApis.enrichment.stage.title2',
        descriptionKey: 'articleNetworkingApis.enrichment.stage.desc2',
      },
      {
        id: 'tls',
        labelKey: 'articleNetworkingApis.enrichment.stage.title3',
        descriptionKey: 'articleNetworkingApis.enrichment.stage.desc3',
      },
      {
        id: 'request',
        labelKey: 'articleNetworkingApis.enrichment.stage.title4',
        descriptionKey: 'articleNetworkingApis.enrichment.stage.desc4',
      },
      {
        id: 'server',
        labelKey: 'articleNetworkingApis.enrichment.stage.title5',
        descriptionKey: 'articleNetworkingApis.enrichment.stage.desc5',
      },
      {
        id: 'response',
        labelKey: 'articleNetworkingApis.enrichment.stage.title6',
        descriptionKey: 'articleNetworkingApis.enrichment.stage.desc6',
      },
    ],
    autoAdvanceDelay: 2000,
  };

  // Step indicators
  pageLoadSteps: StepItem[] = [];
  dnsSteps: StepItem[] = [];

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Checkpoint
  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleNetworkingApis.checkpoint.item1' },
    { textKey: 'articleNetworkingApis.checkpoint.item2' },
    { textKey: 'articleNetworkingApis.checkpoint.item3' },
  ];

  ngOnInit(): void {
    this.rebuildTranslatedContent();
    // Steps, ToC labels and quiz text are plain strings, not keys — rebuild
    // them whenever the reader switches language (or the Easy variant).
    this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.rebuildTranslatedContent();
      this.cdr.markForCheck();
    });
  }

  private rebuildTranslatedContent(): void {
    this.updateTocItems();
    this.updateSteps();
    this.updateQuizQuestions();
  }

  private updateTocItems(): void {
    this.tocItems = this.tocLabelKeys.map((item) => ({
      id: item.id,
      label: this.t(item.key),
    }));
  }

  private updateSteps(): void {
    this.pageLoadSteps = [
      { id: 1, label: this.t('articleNetworkingApis.clientServer.walkthrough.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleNetworkingApis.clientServer.walkthrough.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleNetworkingApis.clientServer.walkthrough.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleNetworkingApis.clientServer.walkthrough.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleNetworkingApis.clientServer.walkthrough.step5'), status: 'pending' as const },
      { id: 6, label: this.t('articleNetworkingApis.clientServer.walkthrough.step6'), status: 'pending' as const },
    ];

    this.dnsSteps = [
      { id: 1, label: this.t('articleNetworkingApis.dns.resolution.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleNetworkingApis.dns.resolution.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleNetworkingApis.dns.resolution.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleNetworkingApis.dns.resolution.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleNetworkingApis.dns.resolution.step5'), status: 'pending' as const },
      { id: 6, label: this.t('articleNetworkingApis.dns.resolution.step6'), status: 'pending' as const },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleNetworkingApis.quiz.' + key);
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
          { id: 'b', text: q('q4.b'), isCorrect: false },
          { id: 'c', text: q('q4.c'), isCorrect: true },
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
