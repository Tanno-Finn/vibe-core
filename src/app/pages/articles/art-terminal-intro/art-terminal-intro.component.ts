/**
 * ArtTerminalIntroComponent
 *
 * Article: The terminal — graphical interface versus command line, paths, and
 * a first set of commands. Built on the article blueprint documented in
 * `seed-article-1.component.ts`: definition blocks with the analogy/precise
 * toggle, two step-indicator walkthroughs, an icon grid of the commands, a
 * flashcard deck to practice them, collapsible deep dives, takeaways, quiz and
 * checkpoint.
 *
 * Two embedded widgets, one per lesson: `app-path-resolver` in the paths
 * section, where the reader resolves a typed path against a working directory
 * and watches the article's own "/data/file.csv is not data/file.csv" claim
 * hold (specs/2026-08-24-path-resolver-widget/shape.md), and
 * `app-flashcard-deck` in #enrichment for the command vocabulary.
 *
 * Text lives in `assets/i18n/modules/<lang>/articleTerminalIntro.json` (de, en
 * and both Easy-Language variants); meta and related refs in
 * `assets/data/core/articles/art-terminal-intro.json` + `index.json`.
 *
 * SSR-safe: no browser globals here; neither embedded widget owns a timer, so
 * the page prerenders (T2, see scripts/generate-prerender-routes.js).
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
  FlashcardDeckComponent,
  FlashcardDeckConfig,
} from '../../../components/didactic/flashcard-deck/flashcard-deck.component';
import {
  PathResolverComponent,
  PathResolverConfig,
} from '../../../components/didactic/path-resolver/path-resolver.component';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'app-art-terminal-intro',
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
    FlashcardDeckComponent,
    PathResolverComponent,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead Section -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleTerminalIntro.lead.paragraph1')">
          {{ t('articleTerminalIntro.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleTerminalIntro.lead.paragraph2')">
          {{ t('articleTerminalIntro.lead.paragraph2') }}
        </p>
      </section>

      <!-- Section 1: two ways to talk to a computer -->
      <section id="gui-cli" class="article-section">
        <h2 [appHighlight]="t('articleTerminalIntro.guiCli.title')">{{ t('articleTerminalIntro.guiCli.title') }}</h2>

        <app-definition
          [title]="t('articleTerminalIntro.guiCli.definitionTitle')"
          [firstOptionContent]="t('articleTerminalIntro.guiCli.analogy')"
          [secondOptionContent]="t('articleTerminalIntro.guiCli.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleTerminalIntro.guiCli.analogyBreak')">
          {{ t('articleTerminalIntro.guiCli.analogyBreak') }}
        </p>
        <p [appHighlight]="t('articleTerminalIntro.guiCli.history')">{{ t('articleTerminalIntro.guiCli.history') }}</p>
        <p [appHighlight]="t('articleTerminalIntro.guiCli.renameExample')">
          {{ t('articleTerminalIntro.guiCli.renameExample') }}
        </p>

        <!-- Graphical interface vs command line -->
        <app-comparison
          layout="horizontal"
          [beforeLabel]="t('articleTerminalIntro.guiCli.comparison.guiLabel')"
          [beforeResult]="t('articleTerminalIntro.guiCli.comparison.guiResult')"
          [afterLabel]="t('articleTerminalIntro.guiCli.comparison.cliLabel')"
          [afterResult]="t('articleTerminalIntro.guiCli.comparison.cliResult')"
        >
        </app-comparison>

        <!-- Which terminal to use -->
        <app-standard-container [config]="terminalChoiceConfig">
          <p [appHighlight]="t('articleTerminalIntro.guiCli.terminalChoice.text')">
            {{ t('articleTerminalIntro.guiCli.terminalChoice.text') }}
          </p>
        </app-standard-container>

        <!-- No undo -->
        <app-standard-container [config]="noUndoWarningConfig">
          <p [appHighlight]="t('articleTerminalIntro.guiCli.noUndo.text')">
            {{ t('articleTerminalIntro.guiCli.noUndo.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 2: paths -->
      <section id="paths" class="article-section">
        <h2 [appHighlight]="t('articleTerminalIntro.paths.title')">{{ t('articleTerminalIntro.paths.title') }}</h2>

        <app-definition
          [title]="t('articleTerminalIntro.paths.definitionTitle')"
          [firstOptionContent]="t('articleTerminalIntro.paths.analogy')"
          [secondOptionContent]="t('articleTerminalIntro.paths.scientific')"
          [showExample]="false"
          type="primary"
        >
        </app-definition>

        <p [appHighlight]="t('articleTerminalIntro.paths.analogyBreak')">
          {{ t('articleTerminalIntro.paths.analogyBreak') }}
        </p>
        <p [appHighlight]="t('articleTerminalIntro.paths.crossPlatform')">
          {{ t('articleTerminalIntro.paths.crossPlatform') }}
        </p>

        <!-- Navigation walkthrough -->
        <app-standard-container [config]="pathWalkthroughConfig">
          <app-step-indicator [steps]="pathSteps" layout="vertical" [showConnectors]="true"> </app-step-indicator>
        </app-standard-container>

        <!-- Interactive: the reader drives the same navigation themselves.
             Sits between the scripted walkthrough and the pitfalls box, so the
             warning below names traps they have just met. -->
        <h3 [appHighlight]="t('articleTerminalIntro.paths.resolver.title')">
          {{ t('articleTerminalIntro.paths.resolver.title') }}
        </h3>
        <p [appHighlight]="t('articleTerminalIntro.paths.resolver.intro')">
          {{ t('articleTerminalIntro.paths.resolver.intro') }}
        </p>
        <app-path-resolver [config]="pathResolverConfig" />

        <!-- Common pitfalls -->
        <app-standard-container [config]="pathPitfallsConfig">
          <p [appHighlight]="t('articleTerminalIntro.paths.pitfalls.text')">
            {{ t('articleTerminalIntro.paths.pitfalls.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Section 3: the first commands -->
      <section id="commands" class="article-section">
        <h2 [appHighlight]="t('articleTerminalIntro.commands.title')">
          {{ t('articleTerminalIntro.commands.title') }}
        </h2>
        <p [appHighlight]="t('articleTerminalIntro.commands.intro')">{{ t('articleTerminalIntro.commands.intro') }}</p>

        <app-icon-grid [items]="commandItems" [columns]="3" [showDescriptions]="true" size="medium" color="primary">
        </app-icon-grid>

        <p [appHighlight]="t('articleTerminalIntro.commands.tabCompletion')">
          {{ t('articleTerminalIntro.commands.tabCompletion') }}
        </p>

        <!-- Mini-project walkthrough -->
        <app-standard-container [config]="miniProjectConfig">
          <app-step-indicator [steps]="miniProjectSteps" layout="vertical" [showConnectors]="true">
          </app-step-indicator>
        </app-standard-container>

        <!-- The delete command has no undo -->
        <app-standard-container [config]="rmWarningConfig">
          <p [appHighlight]="t('articleTerminalIntro.commands.rmWarning.text')">
            {{ t('articleTerminalIntro.commands.rmWarning.text') }}
          </p>
          <p [appHighlight]="t('articleTerminalIntro.commands.rmWarning.tip')">
            {{ t('articleTerminalIntro.commands.rmWarning.tip') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleTerminalIntro.commands.forwardLink')">
          {{ t('articleTerminalIntro.commands.forwardLink') }}
        </p>
      </section>

      <!-- Interactive: the commands as a flashcard deck -->
      <section id="enrichment" class="article-section">
        <h2 [appHighlight]="t('articleTerminalIntro.enrichment.sectionTitle')">
          {{ t('articleTerminalIntro.enrichment.sectionTitle') }}
        </h2>
        <p [appHighlight]="t('articleTerminalIntro.enrichment.intro')">
          {{ t('articleTerminalIntro.enrichment.intro') }}
        </p>
        <app-flashcard-deck [config]="commandDeckConfig" />
      </section>

      <!-- Deep dive 1: flags and options -->
      <section id="flags" class="article-section">
        <app-standard-container [config]="flagsConfig">
          <p [appHighlight]="t('articleTerminalIntro.flags.intro')">{{ t('articleTerminalIntro.flags.intro') }}</p>
          <p [appHighlight]="t('articleTerminalIntro.flags.examples')">
            {{ t('articleTerminalIntro.flags.examples') }}
          </p>
          <p [appHighlight]="t('articleTerminalIntro.flags.help')">{{ t('articleTerminalIntro.flags.help') }}</p>
        </app-standard-container>
      </section>

      <!-- Deep dive 2: why the terminal matters for AI work -->
      <section id="ai-terminal" class="article-section">
        <app-standard-container [config]="aiTerminalConfig">
          <p [appHighlight]="t('articleTerminalIntro.aiTerminal.intro')">
            {{ t('articleTerminalIntro.aiTerminal.intro') }}
          </p>
          <p [appHighlight]="t('articleTerminalIntro.aiTerminal.useCases')">
            {{ t('articleTerminalIntro.aiTerminal.useCases') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleTerminalIntro.takeaways.items.guiCli')">
              {{ t('articleTerminalIntro.takeaways.items.guiCli') }}
            </li>
            <li [appHighlight]="t('articleTerminalIntro.takeaways.items.paths')">
              {{ t('articleTerminalIntro.takeaways.items.paths') }}
            </li>
            <li [appHighlight]="t('articleTerminalIntro.takeaways.items.commands')">
              {{ t('articleTerminalIntro.takeaways.items.commands') }}
            </li>
            <li [appHighlight]="t('articleTerminalIntro.takeaways.items.tabCompletion')">
              {{ t('articleTerminalIntro.takeaways.items.tabCompletion') }}
            </li>
            <li [appHighlight]="t('articleTerminalIntro.takeaways.items.noUndo')">
              {{ t('articleTerminalIntro.takeaways.items.noUndo') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-terminal-intro-quiz"
          [titleKey]="'articleTerminalIntro.quiz.boxTitle'"
          [questions]="quizQuestions"
        >
        </app-quiz-container>
      </section>

      <!-- Checkpoint -->
      <section id="checkpoint" class="article-section">
        <app-checkpoint
          checkpointId="main"
          [items]="checkpointItems"
          [titleKey]="'articleTerminalIntro.checkpoint.title'"
          storageKey="art-terminal-intro-checkpoint"
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
        /* The section's heading and click prompt have no function on paper; the
         deck itself prints both card faces as a term/explanation list. */
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
export class ArtTerminalIntroComponent implements OnInit {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  lessonMeta: LessonMeta = {
    id: 'art-terminal-intro',
    titleKey: 'articleTerminalIntro.hero.title',
    subtitleKey: 'articleTerminalIntro.hero.subtitle',
    category: 'fundamentals',
    categoryKey: 'articles.category.fundamentals',
    readingTime: '13 min',
    difficulty: 'beginner',
    difficultyKey: 'articles.difficulty.beginner',
    focus: 'theory',
  };

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleTerminalIntro.toc.lead' },
    { id: 'gui-cli', key: 'articleTerminalIntro.toc.guiCli' },
    { id: 'paths', key: 'articleTerminalIntro.toc.paths' },
    { id: 'commands', key: 'articleTerminalIntro.toc.commands' },
    { id: 'enrichment', key: 'articleTerminalIntro.enrichment.tocLabel' },
    { id: 'flags', key: 'articleTerminalIntro.toc.flags' },
    { id: 'ai-terminal', key: 'articleTerminalIntro.toc.aiTerminal' },
    { id: 'takeaways', key: 'articleTerminalIntro.toc.takeaways' },
    { id: 'quiz', key: 'articleTerminalIntro.toc.quiz' },
    { id: 'checkpoint', key: 'articleTerminalIntro.toc.checkpoint' },
  ];

  // Container configs
  terminalChoiceConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.guiCli.terminalChoice.title',
    type: 'info',
    icon: 'pi pi-desktop',
  };

  noUndoWarningConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.guiCli.noUndo.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  pathWalkthroughConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.paths.walkthrough.title',
    type: 'info',
    icon: 'pi pi-compass',
  };

  pathPitfallsConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.paths.pitfalls.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  /**
   * The embedded path resolver. The tree is deliberately the one the
   * walkthrough directly above it builds (`mkdir project` → `cd project` →
   * `mkdir data src`), plus two leaf files, so the widget continues that scene
   * instead of opening a new one. Names stay untranslated, like every other
   * file and folder name in this article.
   *
   * Defaults land on the article's own example: `data/file.csv` from inside
   * `project` finds the file — and the reader's first experiment, adding the
   * leading slash the pitfalls box below warns about, makes it disappear.
   */
  readonly pathResolverConfig: PathResolverConfig = {
    homeDirectory: '/home/user',
    defaultWorkingDirectory: '/home/user/project',
    defaultInput: 'data/file.csv',
    tree: {
      name: '',
      type: 'dir',
      children: [
        {
          name: 'home',
          type: 'dir',
          children: [
            {
              name: 'user',
              type: 'dir',
              children: [
                {
                  name: 'project',
                  type: 'dir',
                  children: [
                    { name: 'data', type: 'dir', children: [{ name: 'file.csv', type: 'file' }] },
                    { name: 'src', type: 'dir', children: [{ name: 'main.py', type: 'file' }] },
                  ],
                },
                { name: 'notes.txt', type: 'file' },
              ],
            },
          ],
        },
      ],
    },
  };

  miniProjectConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.commands.miniProject.title',
    type: 'info',
    icon: 'pi pi-wrench',
  };

  rmWarningConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.commands.rmWarning.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  flagsConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.flags.title',
    type: 'info',
    icon: 'pi pi-sliders-h',
    collapsible: true,
    initiallyExpanded: false,
  };

  aiTerminalConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.aiTerminal.title',
    type: 'info',
    icon: 'pi pi-microchip-ai',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleTerminalIntro.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  /** The embedded deck: eight of the grid's commands, to practice from memory. */
  readonly commandDeckConfig: FlashcardDeckConfig = {
    cards: [
      { id: 1, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.1' },
      { id: 2, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.2' },
      { id: 3, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.3' },
      { id: 4, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.4' },
      { id: 5, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.5' },
      { id: 6, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.6' },
      { id: 7, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.7' },
      { id: 8, translationKeyPrefix: 'articleTerminalIntro.enrichment.cards.8' },
    ],
  };

  // Step indicators
  pathSteps: StepItem[] = [];
  miniProjectSteps: StepItem[] = [];

  // Icon grid
  commandItems: IconGridItem[] = [];

  // Quiz
  quizQuestions: QuizQuestion[] = [];

  // Checkpoint
  checkpointItems: CheckpointItem[] = [
    { textKey: 'articleTerminalIntro.checkpoint.item1' },
    { textKey: 'articleTerminalIntro.checkpoint.item2' },
    { textKey: 'articleTerminalIntro.checkpoint.item3' },
  ];

  ngOnInit(): void {
    this.rebuildTranslatedContent();
    // Steps, ToC labels, grid entries and quiz text are plain strings, not
    // keys — rebuild them whenever the reader switches language (or the Easy
    // variant).
    this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.rebuildTranslatedContent();
      this.cdr.markForCheck();
    });
  }

  private rebuildTranslatedContent(): void {
    this.updateTocItems();
    this.updateSteps();
    this.updateCommandItems();
    this.updateQuizQuestions();
  }

  private updateTocItems(): void {
    this.tocItems = this.tocLabelKeys.map((item) => ({
      id: item.id,
      label: this.t(item.key),
    }));
  }

  private updateSteps(): void {
    this.pathSteps = [
      { id: 1, label: this.t('articleTerminalIntro.paths.walkthrough.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleTerminalIntro.paths.walkthrough.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleTerminalIntro.paths.walkthrough.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleTerminalIntro.paths.walkthrough.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleTerminalIntro.paths.walkthrough.step5'), status: 'pending' as const },
      { id: 6, label: this.t('articleTerminalIntro.paths.walkthrough.step6'), status: 'pending' as const },
    ];

    this.miniProjectSteps = [
      { id: 1, label: this.t('articleTerminalIntro.commands.miniProject.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleTerminalIntro.commands.miniProject.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleTerminalIntro.commands.miniProject.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleTerminalIntro.commands.miniProject.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleTerminalIntro.commands.miniProject.step5'), status: 'pending' as const },
      { id: 6, label: this.t('articleTerminalIntro.commands.miniProject.step6'), status: 'pending' as const },
      { id: 7, label: this.t('articleTerminalIntro.commands.miniProject.step7'), status: 'pending' as const },
    ];
  }

  private updateCommandItems(): void {
    this.commandItems = [
      {
        icon: 'pi pi-map-marker',
        labelKey: 'articleTerminalIntro.commands.grid.pwd.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.pwd.description',
      },
      {
        icon: 'pi pi-list',
        labelKey: 'articleTerminalIntro.commands.grid.ls.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.ls.description',
      },
      {
        icon: 'pi pi-arrow-right',
        labelKey: 'articleTerminalIntro.commands.grid.cd.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.cd.description',
      },
      {
        icon: 'pi pi-folder',
        labelKey: 'articleTerminalIntro.commands.grid.mkdir.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.mkdir.description',
      },
      {
        icon: 'pi pi-file',
        labelKey: 'articleTerminalIntro.commands.grid.touch.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.touch.description',
      },
      {
        icon: 'pi pi-eye',
        labelKey: 'articleTerminalIntro.commands.grid.cat.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.cat.description',
      },
      {
        icon: 'pi pi-copy',
        labelKey: 'articleTerminalIntro.commands.grid.cp.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.cp.description',
      },
      {
        icon: 'pi pi-arrows-h',
        labelKey: 'articleTerminalIntro.commands.grid.mv.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.mv.description',
      },
      {
        icon: 'pi pi-trash',
        labelKey: 'articleTerminalIntro.commands.grid.rm.label',
        descriptionKey: 'articleTerminalIntro.commands.grid.rm.description',
      },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleTerminalIntro.quiz.' + key);
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
