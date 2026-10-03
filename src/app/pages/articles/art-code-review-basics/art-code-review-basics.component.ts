/**
 * ArtCodeReviewBasicsComponent
 *
 * Educational article: what a person who cannot read code can actually check
 * when an agent reports "finished" - the measurable shape of a change, three
 * questions whose answers can be held against an artifact, and a walk through
 * the running program that includes the case which must fail.
 *
 * Written from a reviewed concept spec — a pipeline document of the project this
 * kit was distilled from, not shipped with the kit.
 *
 * SSR note: no window/document/localStorage/navigator access, no timers, no rAF.
 * The only clipboard access lives inside PromptExampleComponent's click handler.
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
import { PromptExampleComponent } from '../../../components/didactic/prompt-example.component';
import { CheckpointComponent, CheckpointItem } from '../../../components/shared/checkpoint.component';
import { QuizContainerComponent, QuizQuestion } from '../../../components/shared/quiz-container.component';
import { HighlightDirective } from '../../../directives/highlight.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-art-code-review-basics',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    DefinitionComponent,
    ComparisonComponent,
    StatCardComponent,
    StepIndicatorComponent,
    PromptExampleComponent,
    CheckpointComponent,
    QuizContainerComponent,
    HighlightDirective,
  ],
  template: `
    <app-lesson-template [meta]="lessonMeta" [tocItems]="tocItems">
      <!-- Lead -->
      <section id="lead" class="article-section">
        <p class="lead-text" [appHighlight]="t('articleCodeReviewBasics.lead.paragraph1')">
          {{ t('articleCodeReviewBasics.lead.paragraph1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.lead.paragraph2')">
          {{ t('articleCodeReviewBasics.lead.paragraph2') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.lead.paragraph3')">
          {{ t('articleCodeReviewBasics.lead.paragraph3') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.lead.paragraph4')">
          {{ t('articleCodeReviewBasics.lead.paragraph4') }}
        </p>
      </section>

      <!-- Kernthese + Lernziele -->
      <section id="thesis" class="article-section">
        <h2 [appHighlight]="t('articleCodeReviewBasics.thesis.title')">
          {{ t('articleCodeReviewBasics.thesis.title') }}
        </h2>
        <p [appHighlight]="t('articleCodeReviewBasics.thesis.text1')">
          {{ t('articleCodeReviewBasics.thesis.text1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.thesis.text2')">
          {{ t('articleCodeReviewBasics.thesis.text2') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.thesis.text3')">
          {{ t('articleCodeReviewBasics.thesis.text3') }}
        </p>

        <app-standard-container [config]="objectivesConfig">
          <ol class="objectives-list">
            <li [appHighlight]="t('articleCodeReviewBasics.thesis.objectives.item1')">
              {{ t('articleCodeReviewBasics.thesis.objectives.item1') }}
            </li>
            <li [appHighlight]="t('articleCodeReviewBasics.thesis.objectives.item2')">
              {{ t('articleCodeReviewBasics.thesis.objectives.item2') }}
            </li>
            <li [appHighlight]="t('articleCodeReviewBasics.thesis.objectives.item3')">
              {{ t('articleCodeReviewBasics.thesis.objectives.item3') }}
            </li>
            <li [appHighlight]="t('articleCodeReviewBasics.thesis.objectives.item4')">
              {{ t('articleCodeReviewBasics.thesis.objectives.item4') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- K1: Was ein Diff verraet, ohne dass du Code liest -->
      <section id="diff" class="article-section">
        <h2 [appHighlight]="t('articleCodeReviewBasics.diff.title')">{{ t('articleCodeReviewBasics.diff.title') }}</h2>

        <p [appHighlight]="t('articleCodeReviewBasics.diff.intro')">{{ t('articleCodeReviewBasics.diff.intro') }}</p>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.analogyBreak1')">
          {{ t('articleCodeReviewBasics.diff.analogyBreak1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.analogyBreak2')">
          {{ t('articleCodeReviewBasics.diff.analogyBreak2') }}
        </p>

        <app-definition
          [title]="t('articleCodeReviewBasics.diff.definitionTitle')"
          [firstOptionLabel]="t('articleCodeReviewBasics.diff.definitionEverydayLabel')"
          [firstOptionContent]="t('articleCodeReviewBasics.diff.definitionEveryday')"
          [secondOptionLabel]="t('articleCodeReviewBasics.diff.definitionPreciseLabel')"
          [secondOptionContent]="t('articleCodeReviewBasics.diff.definitionPrecise')"
          [showExample]="false"
          icon="pi pi-file-edit"
          type="primary"
        >
        </app-definition>

        <h3 [appHighlight]="t('articleCodeReviewBasics.diff.signalsTitle')">
          {{ t('articleCodeReviewBasics.diff.signalsTitle') }}
        </h3>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.signalsIntro')">
          {{ t('articleCodeReviewBasics.diff.signalsIntro') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.signalSize')">
          {{ t('articleCodeReviewBasics.diff.signalSize') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.signalSpread')">
          {{ t('articleCodeReviewBasics.diff.signalSpread') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.signalRatio')">
          {{ t('articleCodeReviewBasics.diff.signalRatio') }}
        </p>

        <p [appHighlight]="t('articleCodeReviewBasics.diff.yardstick')">
          {{ t('articleCodeReviewBasics.diff.yardstick') }}
        </p>

        <div class="stat-grid">
          <app-stat-card
            [labelKey]="'articleCodeReviewBasics.diff.statA.label'"
            value="~100"
            icon="pi pi-arrows-h"
            color="green"
            variant="gradient"
            [descriptionKey]="'articleCodeReviewBasics.diff.statA.description'"
          >
          </app-stat-card>
          <app-stat-card
            [labelKey]="'articleCodeReviewBasics.diff.statB.label'"
            value="24"
            icon="pi pi-chart-bar"
            color="blue"
            variant="gradient"
            [descriptionKey]="'articleCodeReviewBasics.diff.statB.description'"
          >
          </app-stat-card>
        </div>

        <p [appHighlight]="t('articleCodeReviewBasics.diff.yardstickScope')">
          {{ t('articleCodeReviewBasics.diff.yardstickScope') }}
        </p>

        <h3 [appHighlight]="t('articleCodeReviewBasics.diff.exampleTitle')">
          {{ t('articleCodeReviewBasics.diff.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.exampleIntro')">
          {{ t('articleCodeReviewBasics.diff.exampleIntro') }}
        </p>

        <!--
          Machine output, not prose: the block is the verbatim result of
          "git diff --stat=60" for the reconstructed change (Change 21 of the
          Phase-3 review). It is a component constant on purpose so that no
          translation pass in any of the 56 variants can touch the file names
          or the summary line.
        -->
        <app-prompt-example
          type="demo"
          [labelKey]="'articleCodeReviewBasics.diff.blockLabel'"
          [code]="diffstatBlock"
          [copyable]="false"
        >
        </app-prompt-example>

        <p [appHighlight]="t('articleCodeReviewBasics.diff.walkSize')">
          {{ t('articleCodeReviewBasics.diff.walkSize') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.walkRatio')">
          {{ t('articleCodeReviewBasics.diff.walkRatio') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.diff.walkSpread')">
          {{ t('articleCodeReviewBasics.diff.walkSpread') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleCodeReviewBasics.diff.verdict')">
          {{ t('articleCodeReviewBasics.diff.verdict') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleCodeReviewBasics.diff.located')">
          {{ t('articleCodeReviewBasics.diff.located') }}
        </p>

        <app-standard-container [config]="diffMisconception1Config">
          <p [appHighlight]="t('articleCodeReviewBasics.diff.misconception1.text')">
            {{ t('articleCodeReviewBasics.diff.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="diffMisconception2Config">
          <p [appHighlight]="t('articleCodeReviewBasics.diff.misconception2.text')">
            {{ t('articleCodeReviewBasics.diff.misconception2.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Bruecke: Woher der Diff kommt -->
      <section id="origin" class="article-section">
        <h2 [appHighlight]="t('articleCodeReviewBasics.origin.title')">
          {{ t('articleCodeReviewBasics.origin.title') }}
        </h2>

        <p [appHighlight]="t('articleCodeReviewBasics.origin.text1')">
          {{ t('articleCodeReviewBasics.origin.text1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.origin.text2')">
          {{ t('articleCodeReviewBasics.origin.text2') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleCodeReviewBasics.origin.text3')">
          {{ t('articleCodeReviewBasics.origin.text3') }}
        </p>

        <h3 [appHighlight]="t('articleCodeReviewBasics.origin.acquisitionTitle')">
          {{ t('articleCodeReviewBasics.origin.acquisitionTitle') }}
        </h3>
        <p [appHighlight]="t('articleCodeReviewBasics.origin.acquisition1')">
          {{ t('articleCodeReviewBasics.origin.acquisition1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.origin.acquisition2')">
          {{ t('articleCodeReviewBasics.origin.acquisition2') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.origin.acquisition3')">
          {{ t('articleCodeReviewBasics.origin.acquisition3') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.origin.acquisition4')">
          {{ t('articleCodeReviewBasics.origin.acquisition4') }}
        </p>
      </section>

      <!-- Checkpoint 1 -->
      <section id="checkpoint1" class="article-section">
        <app-checkpoint
          checkpointId="diff-origin"
          [items]="checkpoint1Items"
          [titleKey]="'articleCodeReviewBasics.checkpoint1.title'"
          storageKey="art-code-review-basics-checkpoint-1"
        >
        </app-checkpoint>
      </section>

      <!-- K2: Drei Fragen, die etwas messen -->
      <section id="questions" class="article-section">
        <h2 [appHighlight]="t('articleCodeReviewBasics.questions.title')">
          {{ t('articleCodeReviewBasics.questions.title') }}
        </h2>

        <p [appHighlight]="t('articleCodeReviewBasics.questions.intro')">
          {{ t('articleCodeReviewBasics.questions.intro') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.introSure')">
          {{ t('articleCodeReviewBasics.questions.introSure') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.introReally')">
          {{ t('articleCodeReviewBasics.questions.introReally') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.criterion')">
          {{ t('articleCodeReviewBasics.questions.criterion') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.bridge')">
          {{ t('articleCodeReviewBasics.questions.bridge') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.filters')">
          {{ t('articleCodeReviewBasics.questions.filters') }}
        </p>
        <p class="key-sentence" [appHighlight]="t('articleCodeReviewBasics.questions.value')">
          {{ t('articleCodeReviewBasics.questions.value') }}
        </p>

        <app-comparison
          layout="horizontal"
          variant="bad-good"
          [ariaLabel]="t('articleCodeReviewBasics.questions.comparison.ariaLabel')"
          [beforeLabel]="t('articleCodeReviewBasics.questions.comparison.beforeLabel')"
          [beforeResult]="t('articleCodeReviewBasics.questions.comparison.beforeResult')"
          [afterLabel]="t('articleCodeReviewBasics.questions.comparison.afterLabel')"
          [afterResult]="t('articleCodeReviewBasics.questions.comparison.afterResult')"
        >
          <p slot="before" [appHighlight]="t('articleCodeReviewBasics.questions.comparison.beforeText')">
            {{ t('articleCodeReviewBasics.questions.comparison.beforeText') }}
          </p>
          <p slot="after" [appHighlight]="t('articleCodeReviewBasics.questions.comparison.afterText')">
            {{ t('articleCodeReviewBasics.questions.comparison.afterText') }}
          </p>
        </app-comparison>

        <p [appHighlight]="t('articleCodeReviewBasics.questions.comparisonNote')">
          {{ t('articleCodeReviewBasics.questions.comparisonNote') }}
        </p>

        <!-- Frage 1 -->
        <h3 [appHighlight]="t('articleCodeReviewBasics.questions.q1Title')">
          {{ t('articleCodeReviewBasics.questions.q1Title') }}
        </h3>
        <app-prompt-example
          type="good"
          [labelKey]="'articleCodeReviewBasics.questions.q1Label'"
          [codeKey]="'articleCodeReviewBasics.questions.q1Prompt'"
          [copyable]="true"
        >
        </app-prompt-example>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q1Text1')">
          {{ t('articleCodeReviewBasics.questions.q1Text1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q1Text2')">
          {{ t('articleCodeReviewBasics.questions.q1Text2') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q1Text3')">
          {{ t('articleCodeReviewBasics.questions.q1Text3') }}
        </p>

        <!-- Frage 2 -->
        <h3 [appHighlight]="t('articleCodeReviewBasics.questions.q2Title')">
          {{ t('articleCodeReviewBasics.questions.q2Title') }}
        </h3>
        <app-prompt-example
          type="good"
          [labelKey]="'articleCodeReviewBasics.questions.q2Label'"
          [codeKey]="'articleCodeReviewBasics.questions.q2Prompt'"
          [copyable]="true"
        >
        </app-prompt-example>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q2Text1')">
          {{ t('articleCodeReviewBasics.questions.q2Text1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q2Text2')">
          {{ t('articleCodeReviewBasics.questions.q2Text2') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q2Text3')">
          {{ t('articleCodeReviewBasics.questions.q2Text3') }}
        </p>

        <!-- Frage 3 -->
        <h3 [appHighlight]="t('articleCodeReviewBasics.questions.q3Title')">
          {{ t('articleCodeReviewBasics.questions.q3Title') }}
        </h3>
        <app-prompt-example
          type="good"
          [labelKey]="'articleCodeReviewBasics.questions.q3Label'"
          [codeKey]="'articleCodeReviewBasics.questions.q3Prompt'"
          [copyable]="true"
        >
        </app-prompt-example>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q3Text1')">
          {{ t('articleCodeReviewBasics.questions.q3Text1') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q3Text2')">
          {{ t('articleCodeReviewBasics.questions.q3Text2') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.q3Text3')">
          {{ t('articleCodeReviewBasics.questions.q3Text3') }}
        </p>

        <h3 [appHighlight]="t('articleCodeReviewBasics.questions.analogyTitle')">
          {{ t('articleCodeReviewBasics.questions.analogyTitle') }}
        </h3>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.analogy')">
          {{ t('articleCodeReviewBasics.questions.analogy') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.questions.analogyBreak')">
          {{ t('articleCodeReviewBasics.questions.analogyBreak') }}
        </p>

        <app-standard-container [config]="transferConfig">
          <p [appHighlight]="t('articleCodeReviewBasics.questions.transfer.measured')">
            {{ t('articleCodeReviewBasics.questions.transfer.measured') }}
          </p>
          <p [appHighlight]="t('articleCodeReviewBasics.questions.transfer.notMeasured')">
            {{ t('articleCodeReviewBasics.questions.transfer.notMeasured') }}
          </p>
          <p [appHighlight]="t('articleCodeReviewBasics.questions.transfer.why')">
            {{ t('articleCodeReviewBasics.questions.transfer.why') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="questionsMisconceptionConfig">
          <p [appHighlight]="t('articleCodeReviewBasics.questions.misconception.text')">
            {{ t('articleCodeReviewBasics.questions.misconception.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="questionsDeepDiveConfig">
          <p [appHighlight]="t('articleCodeReviewBasics.questions.deepDive.text1')">
            {{ t('articleCodeReviewBasics.questions.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleCodeReviewBasics.questions.deepDive.text2')">
            {{ t('articleCodeReviewBasics.questions.deepDive.text2') }}
          </p>
        </app-standard-container>

        <p [appHighlight]="t('articleCodeReviewBasics.questions.boundary')">
          {{ t('articleCodeReviewBasics.questions.boundary') }}
        </p>
      </section>

      <!-- K3: Die Abnahme -->
      <section id="acceptance" class="article-section">
        <h2 [appHighlight]="t('articleCodeReviewBasics.acceptance.title')">
          {{ t('articleCodeReviewBasics.acceptance.title') }}
        </h2>

        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.analogy')">
          {{ t('articleCodeReviewBasics.acceptance.analogy') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.definitionSentence')">
          {{ t('articleCodeReviewBasics.acceptance.definitionSentence') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.scope')">
          {{ t('articleCodeReviewBasics.acceptance.scope') }}
        </p>

        <app-standard-container [config]="stepsConfig">
          <app-step-indicator
            [steps]="walkSteps"
            layout="vertical"
            [showConnectors]="true"
            [ariaLabel]="t('articleCodeReviewBasics.acceptance.stepsAriaLabel')"
          >
          </app-step-indicator>
        </app-standard-container>

        <p class="key-sentence" [appHighlight]="t('articleCodeReviewBasics.acceptance.stepFiveWhy')">
          {{ t('articleCodeReviewBasics.acceptance.stepFiveWhy') }}
        </p>

        <h3 [appHighlight]="t('articleCodeReviewBasics.acceptance.exampleTitle')">
          {{ t('articleCodeReviewBasics.acceptance.exampleTitle') }}
        </h3>
        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.exampleIntro')">
          {{ t('articleCodeReviewBasics.acceptance.exampleIntro') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.exampleResult')">
          {{ t('articleCodeReviewBasics.acceptance.exampleResult') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.exampleFail')">
          {{ t('articleCodeReviewBasics.acceptance.exampleFail') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.exampleStill')">
          {{ t('articleCodeReviewBasics.acceptance.exampleStill') }}
        </p>

        <p [appHighlight]="t('articleCodeReviewBasics.acceptance.analogyBreak')">
          {{ t('articleCodeReviewBasics.acceptance.analogyBreak') }}
        </p>

        <app-standard-container [config]="acceptanceMisconception1Config">
          <p [appHighlight]="t('articleCodeReviewBasics.acceptance.misconception1.text')">
            {{ t('articleCodeReviewBasics.acceptance.misconception1.text') }}
          </p>
        </app-standard-container>

        <app-standard-container [config]="acceptanceMisconception2Config">
          <p [appHighlight]="t('articleCodeReviewBasics.acceptance.misconception2.text')">
            {{ t('articleCodeReviewBasics.acceptance.misconception2.text') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Grenze: Was der Browser nicht zeigt -->
      <section id="limits" class="article-section">
        <h2 [appHighlight]="t('articleCodeReviewBasics.limits.title')">
          {{ t('articleCodeReviewBasics.limits.title') }}
        </h2>

        <p [appHighlight]="t('articleCodeReviewBasics.limits.intro')">
          {{ t('articleCodeReviewBasics.limits.intro') }}
        </p>

        <ul class="blind-list">
          <li [appHighlight]="t('articleCodeReviewBasics.limits.blind1')">
            {{ t('articleCodeReviewBasics.limits.blind1') }}
          </li>
          <li [appHighlight]="t('articleCodeReviewBasics.limits.blind2')">
            {{ t('articleCodeReviewBasics.limits.blind2') }}
          </li>
          <li [appHighlight]="t('articleCodeReviewBasics.limits.blind3')">
            {{ t('articleCodeReviewBasics.limits.blind3') }}
          </li>
          <li [appHighlight]="t('articleCodeReviewBasics.limits.blind4')">
            {{ t('articleCodeReviewBasics.limits.blind4') }}
          </li>
          <li [appHighlight]="t('articleCodeReviewBasics.limits.blind5')">
            {{ t('articleCodeReviewBasics.limits.blind5') }}
          </li>
          <li [appHighlight]="t('articleCodeReviewBasics.limits.blind6')">
            {{ t('articleCodeReviewBasics.limits.blind6') }}
          </li>
          <li [appHighlight]="t('articleCodeReviewBasics.limits.blind7')">
            {{ t('articleCodeReviewBasics.limits.blind7') }}
          </li>
        </ul>

        <p [appHighlight]="t('articleCodeReviewBasics.limits.dijkstraIntro')">
          {{ t('articleCodeReviewBasics.limits.dijkstraIntro') }}
        </p>
        <blockquote class="quote-block">
          <p [appHighlight]="t('articleCodeReviewBasics.limits.dijkstraQuote')">
            {{ t('articleCodeReviewBasics.limits.dijkstraQuote') }}
          </p>
          <footer [appHighlight]="t('articleCodeReviewBasics.limits.dijkstraSource')">
            {{ t('articleCodeReviewBasics.limits.dijkstraSource') }}
          </footer>
        </blockquote>
        <p [appHighlight]="t('articleCodeReviewBasics.limits.dijkstraTranslation')">
          {{ t('articleCodeReviewBasics.limits.dijkstraTranslation') }}
        </p>

        <p [appHighlight]="t('articleCodeReviewBasics.limits.quality')">
          {{ t('articleCodeReviewBasics.limits.quality') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.limits.handover')">
          {{ t('articleCodeReviewBasics.limits.handover') }}
        </p>

        <app-standard-container [config]="limitsDeepDiveConfig">
          <p [appHighlight]="t('articleCodeReviewBasics.limits.deepDive.text1')">
            {{ t('articleCodeReviewBasics.limits.deepDive.text1') }}
          </p>
          <p [appHighlight]="t('articleCodeReviewBasics.limits.deepDive.text2')">
            {{ t('articleCodeReviewBasics.limits.deepDive.text2') }}
          </p>
        </app-standard-container>
      </section>

      <!-- Checkpoint 2 -->
      <section id="checkpoint2" class="article-section">
        <app-checkpoint
          checkpointId="questions-acceptance"
          [items]="checkpoint2Items"
          [titleKey]="'articleCodeReviewBasics.checkpoint2.title'"
          storageKey="art-code-review-basics-checkpoint-2"
        >
        </app-checkpoint>
      </section>

      <!-- Abschluss -->
      <section id="close" class="article-section">
        <h2 [appHighlight]="t('articleCodeReviewBasics.close.title')">
          {{ t('articleCodeReviewBasics.close.title') }}
        </h2>
        <p [appHighlight]="t('articleCodeReviewBasics.close.text1')">{{ t('articleCodeReviewBasics.close.text1') }}</p>
        <p class="key-sentence" [appHighlight]="t('articleCodeReviewBasics.close.text2')">
          {{ t('articleCodeReviewBasics.close.text2') }}
        </p>
        <p [appHighlight]="t('articleCodeReviewBasics.close.text3')">{{ t('articleCodeReviewBasics.close.text3') }}</p>
      </section>

      <!-- Takeaways -->
      <section id="takeaways" class="article-section">
        <app-standard-container [config]="takeawaysConfig">
          <ol class="takeaways-list">
            <li [appHighlight]="t('articleCodeReviewBasics.takeaways.item1')">
              {{ t('articleCodeReviewBasics.takeaways.item1') }}
            </li>
            <li [appHighlight]="t('articleCodeReviewBasics.takeaways.item2')">
              {{ t('articleCodeReviewBasics.takeaways.item2') }}
            </li>
            <li [appHighlight]="t('articleCodeReviewBasics.takeaways.item3')">
              {{ t('articleCodeReviewBasics.takeaways.item3') }}
            </li>
            <li [appHighlight]="t('articleCodeReviewBasics.takeaways.item4')">
              {{ t('articleCodeReviewBasics.takeaways.item4') }}
            </li>
            <li [appHighlight]="t('articleCodeReviewBasics.takeaways.item5')">
              {{ t('articleCodeReviewBasics.takeaways.item5') }}
            </li>
          </ol>
        </app-standard-container>
      </section>

      <!-- Quiz -->
      <section id="quiz" class="article-section">
        <app-quiz-container
          quizId="art-code-review-basics-quiz"
          [titleKey]="'articleCodeReviewBasics.quiz.boxTitle'"
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
        margin: var(--space-5) 0;
      }

      .takeaways-list,
      .objectives-list,
      .blind-list {
        margin: 0;
        padding-left: var(--space-6);
      }

      .takeaways-list li,
      .objectives-list li,
      .blind-list li {
        margin-bottom: var(--space-3);
        line-height: 1.6;
      }

      .quote-block {
        margin: var(--space-5) 0;
        padding: var(--space-4);
        border-left: 4px solid var(--primary-color);
        background: var(--surface-ground);
        border-radius: var(--border-radius);
      }

      .quote-block p {
        font-size: 1.1rem;
        font-style: italic;
        line-height: 1.6;
        margin: 0 0 var(--space-2);
      }

      .quote-block footer {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }

      @media (max-width: 768px) {
        .stat-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ArtCodeReviewBasicsComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private langSub?: Subscription;

  lessonMeta: LessonMeta = {
    id: 'art-code-review-basics',
    titleKey: 'articleCodeReviewBasics.hero.title',
    subtitleKey: 'articleCodeReviewBasics.hero.subtitle',
    category: 'concepts',
    categoryKey: 'articles.category.concepts',
    readingTime: '19 min',
    difficulty: 'intermediate',
    difficultyKey: 'articles.difficulty.intermediate',
    focus: 'theory',
  };

  /**
   * Verbatim output of `git diff --stat=60` for the reconstructed change of the
   * worked example (4 files, 31 insertions, 56 deletions). Deliberately NOT a
   * translation key: this is machine output and has to stay byte-identical in
   * every one of the 56 language variants.
   */
  readonly diffstatBlock =
    ' src/checkout/preise.py    | 14 +++---\n' +
    ' src/checkout/rabatt.py    |  3 +-\n' +
    ' src/checkout/warenkorb.py | 62 ++++++---------------------\n' +
    ' tests/test_preise.py      |  8 ++++\n' +
    ' 4 files changed, 31 insertions(+), 56 deletions(-)';

  tocItems: TocItem[] = [];

  private tocLabelKeys = [
    { id: 'lead', key: 'articleCodeReviewBasics.toc.lead' },
    { id: 'thesis', key: 'articleCodeReviewBasics.toc.thesis' },
    { id: 'diff', key: 'articleCodeReviewBasics.toc.diff' },
    { id: 'origin', key: 'articleCodeReviewBasics.toc.origin' },
    { id: 'questions', key: 'articleCodeReviewBasics.toc.questions' },
    { id: 'acceptance', key: 'articleCodeReviewBasics.toc.acceptance' },
    { id: 'limits', key: 'articleCodeReviewBasics.toc.limits' },
    { id: 'close', key: 'articleCodeReviewBasics.toc.close' },
    { id: 'takeaways', key: 'articleCodeReviewBasics.toc.takeaways' },
    { id: 'quiz', key: 'articleCodeReviewBasics.toc.quiz' },
  ];

  objectivesConfig: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.thesis.objectives.title',
    type: 'info',
    icon: 'pi pi-flag',
  };

  diffMisconception1Config: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.diff.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  diffMisconception2Config: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.diff.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  // The transfer limit is neither optional nor collapsible (Concept, binding).
  transferConfig: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.questions.transfer.title',
    type: 'info',
    icon: 'pi pi-info-circle',
  };

  questionsMisconceptionConfig: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.questions.misconception.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  questionsDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.questions.deepDive.title',
    type: 'info',
    icon: 'pi pi-search',
    collapsible: true,
    initiallyExpanded: false,
  };

  stepsConfig: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.acceptance.stepsTitle',
    type: 'info',
    icon: 'pi pi-directions',
  };

  acceptanceMisconception1Config: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.acceptance.misconception1.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  acceptanceMisconception2Config: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.acceptance.misconception2.title',
    type: 'warning',
    icon: 'pi pi-exclamation-triangle',
  };

  limitsDeepDiveConfig: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.limits.deepDive.title',
    type: 'info',
    icon: 'pi pi-users',
    collapsible: true,
    initiallyExpanded: false,
  };

  takeawaysConfig: ContainerConfig = {
    titleKey: 'articleCodeReviewBasics.takeaways.containerTitle',
    type: 'success',
    icon: 'pi pi-check',
  };

  // Illustration of a procedure, not user progress - every step stays 'pending'.
  walkSteps: StepItem[] = [];

  quizQuestions: QuizQuestion[] = [];

  checkpoint1Items: CheckpointItem[] = [
    { textKey: 'articleCodeReviewBasics.checkpoint1.item1' },
    { textKey: 'articleCodeReviewBasics.checkpoint1.item2' },
    { textKey: 'articleCodeReviewBasics.checkpoint1.item3' },
  ];

  checkpoint2Items: CheckpointItem[] = [
    { textKey: 'articleCodeReviewBasics.checkpoint2.item1' },
    { textKey: 'articleCodeReviewBasics.checkpoint2.item2' },
    { textKey: 'articleCodeReviewBasics.checkpoint2.item3' },
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
    this.walkSteps = [
      { id: 1, label: this.t('articleCodeReviewBasics.acceptance.step1'), status: 'pending' as const },
      { id: 2, label: this.t('articleCodeReviewBasics.acceptance.step2'), status: 'pending' as const },
      { id: 3, label: this.t('articleCodeReviewBasics.acceptance.step3'), status: 'pending' as const },
      { id: 4, label: this.t('articleCodeReviewBasics.acceptance.step4'), status: 'pending' as const },
      { id: 5, label: this.t('articleCodeReviewBasics.acceptance.step5'), status: 'pending' as const },
      { id: 6, label: this.t('articleCodeReviewBasics.acceptance.step6'), status: 'pending' as const },
    ];
  }

  private updateQuizQuestions(): void {
    const q = (key: string) => this.t('articleCodeReviewBasics.quiz.' + key);
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
