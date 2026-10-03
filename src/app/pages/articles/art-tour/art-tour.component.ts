/**
 * ArtTourComponent
 *
 * Educational article: a walk through this repository itself, ten stations
 * long, each naming a file - the map and its line cap, the versioned
 * constitution, the standards table and the override that is a file, the two
 * indexes checked in both directions and the drift no index check can see, the
 * books, the gates (including why build:prod runs the test suite itself), the
 * specs loop and the license lesson behind ADR-0014, the human gates and what
 * OPEN-QUESTIONS.md records, and the four-stage review whose fourth stage
 * checks the fixer.
 *
 * The article describes the kit as it ships and names files rather than line
 * numbers or counts, which go stale first. It is deliberately a derived view and
 * says so: its last station asks the reader to run the harness, override and
 * test commands rather than believe the text.
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
import { StatCardComponent } from '../../../components/didactic/stat-card.component';
import { StepIndicatorComponent, StepItem } from '../../../components/didactic/step-indicator.component';
import { CheckpointComponent, CheckpointItem } from '../../../components/shared/checkpoint.component';
import { QuizContainerComponent, QuizQuestion } from '../../../components/shared/quiz-container.component';
import { HighlightDirective } from '../../../directives/highlight.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-art-tour',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    StatCardComponent,
    StepIndicatorComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead: the rule the article holds itself to -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleTour.lead.paragraph1')">
          {{ t('articleTour.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleTour.lead.paragraph2')">{{ t('articleTour.lead.paragraph2') }}</p>
        <p [appHighlight]="t('articleTour.lead.paragraph3')">{{ t('articleTour.lead.paragraph3') }}</p>
      </section>

      <!-- Station 1: the map and its line cap -->
      <section id="map" class="article-section">
        <h2 [appHighlight]="t('articleTour.map.title')">{{ t('articleTour.map.title') }}</h2>

        <p [appHighlight]="t('articleTour.map.text1')">{{ t('articleTour.map.text1') }}</p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleTour.map.statLabel'"
            [value]="t('articleTour.map.statValue')"
            icon="pi pi-file"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleTour.map.statDescription'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleTour.map.text2')">{{ t('articleTour.map.text2') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleTour.map.text3')">{{ t('articleTour.map.text3') }}</p>
      </section>

      <!-- Station 2: the constitution -->
      <section id="constitution" class="article-section">
        <h2 [appHighlight]="t('articleTour.constitution.title')">{{ t('articleTour.constitution.title') }}</h2>

        <p [appHighlight]="t('articleTour.constitution.text1')">{{ t('articleTour.constitution.text1') }}</p>
        <p [appHighlight]="t('articleTour.constitution.text2')">{{ t('articleTour.constitution.text2') }}</p>
      </section>

      <!-- Station 3: standards, and the override that is a file -->
      <section id="standards" class="article-section">
        <h2 [appHighlight]="t('articleTour.standards.title')">{{ t('articleTour.standards.title') }}</h2>

        <p [appHighlight]="t('articleTour.standards.text1')">{{ t('articleTour.standards.text1') }}</p>
        <p [appHighlight]="t('articleTour.standards.text2')">{{ t('articleTour.standards.text2') }}</p>

        <app-standard-container [config]="standardsFootnoteConfig">
          <p [appHighlight]="t('articleTour.standards.footnoteText')">{{ t('articleTour.standards.footnoteText') }}</p>
        </app-standard-container>
      </section>

      <!-- Station 4: directives, skills, and the drift an index check cannot see -->
      <section id="directives" class="article-section">
        <h2 [appHighlight]="t('articleTour.directives.title')">{{ t('articleTour.directives.title') }}</h2>

        <p [appHighlight]="t('articleTour.directives.text1')">{{ t('articleTour.directives.text1') }}</p>
        <p [appHighlight]="t('articleTour.directives.text2')">{{ t('articleTour.directives.text2') }}</p>
        <p [appHighlight]="t('articleTour.directives.text3')">{{ t('articleTour.directives.text3') }}</p>

        <app-standard-container [config]="driftConfig">
          <ul class="finding-list">
            <li [appHighlight]="t('articleTour.directives.drift1')">{{ t('articleTour.directives.drift1') }}</li>
            <li [appHighlight]="t('articleTour.directives.drift2')">{{ t('articleTour.directives.drift2') }}</li>
          </ul>
        </app-standard-container>

        <p [appHighlight]="t('articleTour.directives.driftClose')">{{ t('articleTour.directives.driftClose') }}</p>
      </section>

      <!-- Station 5: the books -->
      <section id="books" class="article-section">
        <h2 [appHighlight]="t('articleTour.books.title')">{{ t('articleTour.books.title') }}</h2>

        <p [appHighlight]="t('articleTour.books.text1')">{{ t('articleTour.books.text1') }}</p>
        <p [appHighlight]="t('articleTour.books.text2')">{{ t('articleTour.books.text2') }}</p>
        <p [appHighlight]="t('articleTour.books.text3')">{{ t('articleTour.books.text3') }}</p>
        <p [appHighlight]="t('articleTour.books.text4')">{{ t('articleTour.books.text4') }}</p>
      </section>

      <!-- Station 6: the gates, and the wire from the build to the tests -->
      <section id="gates" class="article-section">
        <h2 [appHighlight]="t('articleTour.gates.title')">{{ t('articleTour.gates.title') }}</h2>

        <p [appHighlight]="t('articleTour.gates.text1')">{{ t('articleTour.gates.text1') }}</p>
        <p [appHighlight]="t('articleTour.gates.text2')">{{ t('articleTour.gates.text2') }}</p>
        <p [appHighlight]="t('articleTour.gates.text3')">{{ t('articleTour.gates.text3') }}</p>
        <p [appHighlight]="t('articleTour.gates.text4')">{{ t('articleTour.gates.text4') }}</p>

        <app-standard-container [config]="gatesStoryConfig">
          <p [appHighlight]="t('articleTour.gates.text5')">{{ t('articleTour.gates.text5') }}</p>
          <p [appHighlight]="t('articleTour.gates.text6')">{{ t('articleTour.gates.text6') }}</p>
          <p [appHighlight]="t('articleTour.gates.text7')">{{ t('articleTour.gates.text7') }}</p>
        </app-standard-container>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleTour.gates.statTestsLabel'"
            [value]="t('articleTour.gates.statTestsValue')"
            icon="pi pi-check-circle"
            color="green"
            variant="gradient"
            [descriptionKey]="'articleTour.gates.statTestsDescription'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleTour.gates.statSilentLabel'"
            [value]="t('articleTour.gates.statSilentValue')"
            icon="pi pi-key"
            color="orange"
            variant="gradient"
            [descriptionKey]="'articleTour.gates.statSilentDescription'"
          >
          </app-stat-card>
        </div>

        <p class="key-sentence" [appHighlight]="t('articleTour.gates.text8')">{{ t('articleTour.gates.text8') }}</p>
      </section>

      <!-- Station 7: the specs loop -->
      <section id="specs" class="article-section">
        <h2 [appHighlight]="t('articleTour.specs.title')">{{ t('articleTour.specs.title') }}</h2>

        <p [appHighlight]="t('articleTour.specs.text1')">{{ t('articleTour.specs.text1') }}</p>
        <p [appHighlight]="t('articleTour.specs.text2')">{{ t('articleTour.specs.text2') }}</p>
        <p [appHighlight]="t('articleTour.specs.text3')">{{ t('articleTour.specs.text3') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleTour.specs.text4')">{{ t('articleTour.specs.text4') }}</p>
      </section>

      <!-- Station 8: where the human decides -->
      <section id="human" class="article-section">
        <h2 [appHighlight]="t('articleTour.human.title')">{{ t('articleTour.human.title') }}</h2>

        <p [appHighlight]="t('articleTour.human.text1')">{{ t('articleTour.human.text1') }}</p>
        <p [appHighlight]="t('articleTour.human.text2')">{{ t('articleTour.human.text2') }}</p>
        <p [appHighlight]="t('articleTour.human.text3')">{{ t('articleTour.human.text3') }}</p>
      </section>

      <!-- Station 9: four stages, and why the fourth exists -->
      <section id="wave" class="article-section">
        <h2 [appHighlight]="t('articleTour.wave.title')">{{ t('articleTour.wave.title') }}</h2>

        <p [appHighlight]="t('articleTour.wave.text1')">{{ t('articleTour.wave.text1') }}</p>

        <app-standard-container [config]="stagesConfig">
          <app-step-indicator
            [steps]="stageSteps"
            layout="vertical"
            [showConnectors]="true"
            [ariaLabel]="t('articleTour.wave.stagesTitle')"
          >
          </app-step-indicator>
        </app-standard-container>

        <p [appHighlight]="t('articleTour.wave.text2')">{{ t('articleTour.wave.text2') }}</p>
        <p [appHighlight]="t('articleTour.wave.text3')">{{ t('articleTour.wave.text3') }}</p>

        <app-standard-container [config]="findingsConfig">
          <ul class="finding-list">
            <li [appHighlight]="t('articleTour.wave.finding1')">{{ t('articleTour.wave.finding1') }}</li>
            <li [appHighlight]="t('articleTour.wave.finding2')">{{ t('articleTour.wave.finding2') }}</li>
            <li [appHighlight]="t('articleTour.wave.finding3')">{{ t('articleTour.wave.finding3') }}</li>
          </ul>
        </app-standard-container>

        <p [appHighlight]="t('articleTour.wave.text4')">{{ t('articleTour.wave.text4') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleTour.wave.text5')">{{ t('articleTour.wave.text5') }}</p>
        <p [appHighlight]="t('articleTour.wave.text6')">{{ t('articleTour.wave.text6') }}</p>
        <p [appHighlight]="t('articleTour.wave.text7')">{{ t('articleTour.wave.text7') }}</p>
      </section>

      <!-- Station 10: what this tour cannot do -->
      <section id="epilogue" class="article-section">
        <h2 [appHighlight]="t('articleTour.epilogue.title')">{{ t('articleTour.epilogue.title') }}</h2>

        <p [appHighlight]="t('articleTour.epilogue.text1')">{{ t('articleTour.epilogue.text1') }}</p>
        <p [appHighlight]="t('articleTour.epilogue.text2')">{{ t('articleTour.epilogue.text2') }}</p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleTour.takeaways.item1')">{{ t('articleTour.takeaways.item1') }}</li>
            <li [appHighlight]="t('articleTour.takeaways.item2')">{{ t('articleTour.takeaways.item2') }}</li>
            <li [appHighlight]="t('articleTour.takeaways.item3')">{{ t('articleTour.takeaways.item3') }}</li>
            <li [appHighlight]="t('articleTour.takeaways.item4')">{{ t('articleTour.takeaways.item4') }}</li>
            <li [appHighlight]="t('articleTour.takeaways.item5')">{{ t('articleTour.takeaways.item5') }}</li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="tour"
          [items]="checkpointItems"
          [titleKey]="'articleTour.checkpoint.title'"
          storageKey="art-tour-checkpoint"
        >
        </app-checkpoint>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container quizId="art-tour-quiz" [titleKey]="'articleTour.quiz.boxTitle'" [questions]="quizQuestions">
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

      .finding-list,
      .takeaways-list {
        margin: 0;
        padding-left: var(--space-6);
      }

      .finding-list li,
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
export class ArtTourComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-tour',
    titleKey: 'articleTour.hero.title',
    subtitleKey: 'articleTour.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '12 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleTour.toc.lead' },
    { id: 'map', key: 'articleTour.toc.map' },
    { id: 'constitution', key: 'articleTour.toc.constitution' },
    { id: 'standards', key: 'articleTour.toc.standards' },
    { id: 'directives', key: 'articleTour.toc.directives' },
    { id: 'books', key: 'articleTour.toc.books' },
    { id: 'gates', key: 'articleTour.toc.gates' },
    { id: 'specs', key: 'articleTour.toc.specs' },
    { id: 'human', key: 'articleTour.toc.human' },
    { id: 'wave', key: 'articleTour.toc.wave' },
    { id: 'epilogue', key: 'articleTour.toc.epilogue' },
    { id: 'takeaways', key: 'articleTour.toc.takeaways' },
    { id: 'checkpoint', key: 'articleTour.toc.checkpoint' },
    { id: 'quiz', key: 'articleTour.toc.quiz' },
  ];

  standardsFootnoteConfig: ContainerConfig = {
    titleKey: 'articleTour.standards.footnoteTitle',
    type: 'info',
    icon: 'pi pi-info-circle',
  };

  driftConfig: ContainerConfig = {
    titleKey: 'articleTour.directives.driftTitle',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  gatesStoryConfig: ContainerConfig = {
    titleKey: 'articleTour.gates.storyTitle',
    type: 'info',
    icon: 'pi pi-info-circle',
  };

  stagesConfig: ContainerConfig = {
    titleKey: 'articleTour.wave.stagesTitle',
    type: 'info',
    icon: 'pi pi-sort-amount-down',
  };

  findingsConfig: ContainerConfig = {
    titleKey: 'articleTour.wave.findingsTitle',
    type: 'warning',
    icon: 'pi pi-search',
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleTour.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  // Illustration of the four stages, not user progress - every step stays 'pending'.
  stageSteps: StepItem[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleTour.checkpoint.item1' },
    { textKey: 'articleTour.checkpoint.item2' },
    { textKey: 'articleTour.checkpoint.item3' },
  ];

  ngOnInit(): void {
    this.updateTocItems();
    this.updateStageSteps();
    this.updateQuizQuestions();
    this.langSub = this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateTocItems();
      this.updateStageSteps();
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

  private updateStageSteps(): void {
    this.stageSteps = [
      {
        id: 1,
        label: this.t('articleTour.wave.step1Label'),
        description: this.t('articleTour.wave.step1Description'),
        status: 'pending' as const,
      },
      {
        id: 2,
        label: this.t('articleTour.wave.step2Label'),
        description: this.t('articleTour.wave.step2Description'),
        status: 'pending' as const,
      },
      {
        id: 3,
        label: this.t('articleTour.wave.step3Label'),
        description: this.t('articleTour.wave.step3Description'),
        status: 'pending' as const,
      },
      {
        id: 4,
        label: this.t('articleTour.wave.step4Label'),
        description: this.t('articleTour.wave.step4Description'),
        status: 'pending' as const,
      },
    ];
  }

  private updateQuizQuestions(): void {
    // Concatenation base kept ending on a dot so check-i18n-keys.mjs recognizes
    // it as a dynamic prefix rather than a (non-existent) literal key.
    const q = (key: string) => this.t('articleTour.quiz.' + key);
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
