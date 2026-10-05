/**
 * ArtGitIntroComponent
 *
 * Article: Version control with Git — repository, commits, and hosting
 * platforms. A worked example of the article blueprint documented in
 * `seed-article-1.component.ts`: definition blocks with the analogy/precise
 * toggle, two step-indicator walkthroughs, comparisons, collapsible deep
 * dives, an embedded interactive timeline, takeaways, quiz and checkpoint.
 *
 * Text lives in `assets/i18n/modules/<lang>/articleGitIntro.json` (de, en and
 * both Easy-Language variants); meta and related refs in
 * `assets/data/core/articles/art-git-intro.json` + `index.json`.
 *
 * SSR-safe: no browser globals here; the embedded timeline guards its own
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
  InteractiveTimelineComponent,
  InteractiveTimelineConfig,
} from '../../../components/didactic/interactive-timeline/interactive-timeline.component';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'app-art-git-intro',
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
    InteractiveTimelineComponent,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead Section -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleGitIntro.lead.paragraph1')">
          {{ t('articleGitIntro.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleGitIntro.lead.paragraph2')">{{ t('articleGitIntro.lead.paragraph2') }}</p>
      </section>

      <!-- Section 1: Repository -->
      <section id="repository" class="article-section">
        <h2 [appHighlight]="t('articleGitIntro.repository.title')">{{ t('articleGitIntro.repository.title') }}</h2>

        <app-definition
          [title]="t('articleGitIntro.repository.definitionTitle')"
          [firstOptionContent]="t('articleGitIntro.repository.analogy')"
          [secondOptionContent]="t('articleGitIntro.repository.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleGitIntro.repository.analogyBreak')">
          {{ t('articleGitIntro.repository.analogyBreak') }}
        </p>

        <!-- git init walkthrough -->
        <app-standard-container [config]="gitInitConfig">
          <app-step-indicator [steps]="gitInitSteps" layout="vertical" [showConnectors]="true"> </app-step-indicator>
        </app-standard-container>

        <!-- Distributed vs centralized -->
        <app-comparison
          layout="horizontal"
          [beforeLabel]="t('articleGitIntro.repository.comparison.centralizedLabel')"
          [beforeResult]="t('articleGitIntro.repository.comparison.centralizedResult')"
          [afterLabel]="t('articleGitIntro.repository.comparison.distributedLabel')"
          [afterResult]="t('articleGitIntro.repository.comparison.distributedResult')"
        >
        </app-comparison>

        <!-- Misconception: commits go to the server -->
        <app-standard-container [config]="misconceptionRepoConfig">
          <p [appHighlight]="t('articleGitIntro.repository.misconception.text')">
            {{ t('articleGitIntro.repository.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 2: Commit -->
      <section id="commit" class="article-section">
        <h2 [appHighlight]="t('articleGitIntro.commit.title')">{{ t('articleGitIntro.commit.title') }}</h2>

        <app-definition
          [title]="t('articleGitIntro.commit.definitionTitle')"
          [firstOptionContent]="t('articleGitIntro.commit.analogy')"
          [secondOptionContent]="t('articleGitIntro.commit.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleGitIntro.commit.analogyBreak')">{{ t('articleGitIntro.commit.analogyBreak') }}</p>

        <!-- Three-zone workflow -->
        <app-standard-container [config]="workflowConfig">
          <app-step-indicator [steps]="workflowSteps" layout="vertical" [showConnectors]="true"> </app-step-indicator>
        </app-standard-container>

        <p [appHighlight]="t('articleGitIntro.commit.example')">{{ t('articleGitIntro.commit.example') }}</p>

        <!-- Misconception: staging is not committing -->
        <app-standard-container [config]="misconceptionCommitConfig">
          <p [appHighlight]="t('articleGitIntro.commit.misconception.text')">
            {{ t('articleGitIntro.commit.misconception.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Deep dive 1: inside .git -->
      <section id="git-internals" class="article-section">
        <app-standard-container [config]="gitInternalsConfig">
          <p [appHighlight]="t('articleGitIntro.deepDive.gitInternals.text')">
            {{ t('articleGitIntro.deepDive.gitInternals.text') }}
          </p>
          <p [appHighlight]="t('articleGitIntro.deepDive.gitInternals.hashing')">
            {{ t('articleGitIntro.deepDive.gitInternals.hashing') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 3: hosting platform -->
      <section id="github" class="article-section">
        <h2 [appHighlight]="t('articleGitIntro.github.title')">{{ t('articleGitIntro.github.title') }}</h2>

        <!-- Tool vs platform -->
        <app-comparison
          layout="horizontal"
          [beforeLabel]="t('articleGitIntro.github.comparison.gitLabel')"
          [beforeResult]="t('articleGitIntro.github.comparison.gitResult')"
          [afterLabel]="t('articleGitIntro.github.comparison.githubLabel')"
          [afterResult]="t('articleGitIntro.github.comparison.githubResult')"
        >
        </app-comparison>

        <p [appHighlight]="t('articleGitIntro.github.cameraAlbumAnalogy')">
          {{ t('articleGitIntro.github.cameraAlbumAnalogy') }}
        </p>

        <!-- Key numbers -->
        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleGitIntro.github.stats.founded.label'"
            value="2008"
            icon="pi pi-calendar"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleGitIntro.github.stats.founded.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleGitIntro.github.stats.acquisition.label'"
            [value]="t('articleGitIntro.github.stats.acquisition.value')"
            [suffix]="t('articleGitIntro.github.stats.acquisition.suffix')"
            icon="pi pi-dollar"
            color="green"
            variant="gradient"
            [descriptionKey]="'articleGitIntro.github.stats.acquisition.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleGitIntro.github.stats.users.label'"
            [value]="t('articleGitIntro.github.stats.users.value')"
            [suffix]="t('articleGitIntro.github.stats.users.suffix')"
            icon="pi pi-users"
            color="orange"
            variant="gradient"
            [descriptionKey]="'articleGitIntro.github.stats.users.description'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleGitIntro.github.clonePushPull')">
          {{ t('articleGitIntro.github.clonePushPull') }}
        </p>

        <!-- Large files warning -->
        <app-standard-container [config]="largeFilesConfig">
          <p [appHighlight]="t('articleGitIntro.github.largeFiles.text')">
            {{ t('articleGitIntro.github.largeFiles.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Deep dive 2: branches & merge conflicts -->
      <section id="merge-conflicts" class="article-section">
        <app-standard-container [config]="mergeConflictsConfig">
          <p [appHighlight]="t('articleGitIntro.deepDive.mergeConflicts.text')">
            {{ t('articleGitIntro.deepDive.mergeConflicts.text') }}
          </p>
          <p [appHighlight]="t('articleGitIntro.deepDive.mergeConflicts.branches')">
            {{ t('articleGitIntro.deepDive.mergeConflicts.branches') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Interactive: the Git workflow as a click-through sequence -->
      <section id="enrichment" class="article-section">
        <h2 [appHighlight]="t('articleGitIntro.enrichment.sectionTitle')">
          {{ t('articleGitIntro.enrichment.sectionTitle') }}
        </h2>
        <p [appHighlight]="t('articleGitIntro.enrichment.intro')">{{ t('articleGitIntro.enrichment.intro') }}</p>
        <app-interactive-timeline [config]="workflowTimelineConfig" />
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleGitIntro.takeaways.items.repository')">
              {{ t('articleGitIntro.takeaways.items.repository') }}
            </li>
            <li [appHighlight]="t('articleGitIntro.takeaways.items.distributed')">
              {{ t('articleGitIntro.takeaways.items.distributed') }}
            </li>
            <li [appHighlight]="t('articleGitIntro.takeaways.items.staging')">
              {{ t('articleGitIntro.takeaways.items.staging') }}
            </li>
            <li [appHighlight]="t('articleGitIntro.takeaways.items.commit')">
              {{ t('articleGitIntro.takeaways.items.commit') }}
            </li>
            <li [appHighlight]="t('articleGitIntro.takeaways.items.github')">
              {{ t('articleGitIntro.takeaways.items.github') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-git-intro-quiz"
          [titleKey]="'articleGitIntro.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleGitIntro.checkpoint.title'"
          storageKey="art-git-intro-checkpoint"
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
        /* The interactive section's heading and click prompt have no function on
         paper; the timeline's own step labels stay and remain informative. */
        #enrichment > h2 {
          display: none !important;
        }
        #enrichment > p {
          display: none !important;
        }
      }
    `,
  ],
})
export class ArtGitIntroComponent implements OnInit {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  lessonMeta: LessonMeta = {
    id: 'art-git-intro',
    titleKey: 'articleGitIntro.hero.title',
    subtitleKey: 'articleGitIntro.hero.subtitle',
    category: 'fundamentals',
    categoryKey: 'articles.category.fundamentals',
    readingTime: '12 min',
    difficulty: 'beginner',
    difficultyKey: 'articles.difficulty.beginner',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleGitIntro.toc.lead' },
    { id: 'repository', key: 'articleGitIntro.toc.repository' },
    { id: 'commit', key: 'articleGitIntro.toc.commit' },
    { id: 'github', key: 'articleGitIntro.toc.github' },
    { id: 'enrichment', key: 'articleGitIntro.enrichment.tocLabel' },
    { id: 'takeaways', key: 'articleGitIntro.toc.takeaways' },
    { id: 'quiz', key: 'articleGitIntro.toc.quiz' },
    { id: 'checkpoint', key: 'articleGitIntro.toc.checkpoint' },
  ];

  // Container configs
  gitInitConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.repository.walkthrough.title',
    type: 'info',
    icon: 'pi pi-folder-open',
  };

  misconceptionRepoConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.repository.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  workflowConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.commit.workflow.title',
    type: 'info',
    icon: 'pi pi-arrow-right',
  };

  misconceptionCommitConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.commit.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  gitInternalsConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.deepDive.gitInternals.title',
    type: 'info',
    icon: 'pi pi-cog',
    collapsible: true,
    initiallyExpanded: false,
  };

  largeFilesConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.github.largeFiles.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  mergeConflictsConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.deepDive.mergeConflicts.title',
    type: 'info',
    icon: 'pi pi-code-pull-request',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleGitIntro.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /** The embedded click-through: init → add → commit → push. */
  readonly workflowTimelineConfig: InteractiveTimelineConfig = {
    events: [
      {
        id: 'init',
        year: 'init',
        color: 'var(--semantic-blue-fg)',
        translationKeyPrefix: 'articleGitIntro.enrichment.event.init',
      },
      {
        id: 'add',
        year: 'add',
        color: 'var(--semantic-green-fg)',
        translationKeyPrefix: 'articleGitIntro.enrichment.event.add',
      },
      {
        id: 'commit',
        year: 'commit',
        color: 'var(--semantic-orange-fg)',
        translationKeyPrefix: 'articleGitIntro.enrichment.event.commit',
      },
      {
        id: 'push',
        year: 'push',
        color: 'var(--semantic-cyan-fg)',
        translationKeyPrefix: 'articleGitIntro.enrichment.event.push',
      },
    ],
    autoPlayDelay: 5000,
    resumeDelay: 8000,
  };

  // Step indicators
  gitInitSteps: StepItem[] = [];
  workflowSteps: StepItem[] = [];

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Checkpoint
  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleGitIntro.checkpoint.item1' },
    { textKey: 'articleGitIntro.checkpoint.item2' },
    { textKey: 'articleGitIntro.checkpoint.item3' },
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
    this.gitInitSteps = [
      { id: 1, label: this.t('articleGitIntro.repository.walkthrough.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleGitIntro.repository.walkthrough.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleGitIntro.repository.walkthrough.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleGitIntro.repository.walkthrough.step4'), status: 'pending' as const },
    ];

    this.workflowSteps = [
      { id: 1, label: this.t('articleGitIntro.commit.workflow.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleGitIntro.commit.workflow.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleGitIntro.commit.workflow.step3'), status: 'pending' as const },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleGitIntro.quiz.' + key);
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
