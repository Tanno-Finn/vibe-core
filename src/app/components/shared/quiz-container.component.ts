/**
 * Quiz Container Component
 * Interactive quiz component built on StandardContainerComponent for consistent styling.
 * Supports both single choice (radio) and multiple choice (checkbox) questions.
 * Features scoring and feedback.
 * Ideal for knowledge testing, learning verification, and interactive assessments.
 */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Optimus UI
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { BadgeModule } from '@openng/optimus-ui/badge';

// Shared Components
import { StandardContainerComponent, ContainerConfig, ContainerType } from './standard-container.component';

// Services
import { TranslationService } from '../../services/translation.service';
import { UserProgressService } from '../../services/user-progress.service';

// Highlighting System - Disabled in Quiz to prevent cheating
// import { HighlightDirective } from '../../directives/highlight.directive';

export interface QuizOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
  explanation?: string;
  points?: number;
  hint?: string;
}

export interface QuizResult {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
  points: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Map<string, string[]>;
  showResults: boolean;
  score: number;
  maxScore: number;
}

@Component({
  selector: 'app-quiz-container',
  standalone: true,
  imports: [
    FormsModule,
    RadioButtonModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    StandardContainerComponent,
  ],
  template: `
    <app-standard-container [config]="containerConfig">
      <!-- Quiz Header -->
      <div class="quiz-header" [slot]="'header'">
        @if (subtitle) {
          <p class="quiz-subtitle">{{ subtitle }}</p>
        }
        <div class="quiz-header-top">
          <div class="quiz-progress">
            <span class="progress-text">
              @if (!quizState.showResults) {
                {{ translationService.translate('quiz.question') }}
                {{ currentQuestionIndex + 1 }} / {{ questions.length }}
              }
              @if (quizState.showResults) {
                {{ translationService.translate('quiz.completed') }}
              }
            </span>
          </div>
          <div class="quiz-header-right">
            @if (quizId) {
              <span class="quiz-status-tag" [class.completed]="isCompleted">
                <i class="pi" [class.pi-check-circle]="isCompleted" [class.pi-circle]="!isCompleted"></i>
                {{ translationService.translate(isCompleted ? 'quiz.statusCompleted' : 'quiz.statusOpen') }}
              </span>
            }
            @if (showScore && quizState.showResults) {
              <div class="quiz-score">
                <i class="pi pi-star-fill"></i>
                <span>{{ quizState.score }} / {{ quizState.maxScore }}</span>
              </div>
            }
          </div>
        </div>
        <div
          class="progress-bar"
          role="progressbar"
          [attr.aria-valuenow]="currentQuestionIndex + 1"
          [attr.aria-valuemin]="1"
          [attr.aria-valuemax]="questions.length"
          [attr.aria-label]="translationService.translate('quiz.progressLabel')"
        >
          <div
            class="progress-fill"
            [style.width.%]="quizState.showResults ? 100 : ((currentQuestionIndex + 1) / questions.length) * 100"
          ></div>
        </div>
      </div>

      <!-- Quiz Content -->
      <div class="quiz-content" [slot]="'content'">
        <!-- Current Question -->
        @if (currentQuestion && !quizState.showResults) {
          <section class="question-container" [attr.aria-label]="getQuestionAriaLabel()" role="group">
            <div class="question-header">
              <h3
                class="question-title"
                [id]="'question-' + currentQuestion.id"
                [textContent]="currentQuestion.question"
              ></h3>
              @if (currentQuestion.hint && !isHintShown(currentQuestion.id)) {
                <button
                  pButton
                  type="button"
                  [attr.aria-label]="translationService.translate('quiz.hint')"
                  severity="help"
                  [outlined]="true"
                  size="small"
                  (click)="showHint(currentQuestion.id)"
                  class="hint-button"
                >
                  <i class="pi pi-lightbulb" pButtonIcon aria-hidden="true"></i
                  ><span pButtonLabel>{{ translationService.translate('quiz.hint') }}</span>
                </button>
              }
            </div>
            <!-- Hint Display -->
            @if (currentQuestion.hint && isHintShown(currentQuestion.id)) {
              <div class="hint-container" role="note" [attr.aria-label]="translationService.translate('quiz.hint')">
                <div class="hint-content">
                  <i class="pi pi-lightbulb hint-icon" aria-hidden="true"></i>
                  <span class="hint-text" [textContent]="currentQuestion.hint"></span>
                </div>
              </div>
            }
            <!-- Single Choice (Radio) -->
            @if (currentQuestion.type === 'single') {
              <fieldset class="options-container" [attr.aria-labelledby]="'question-' + currentQuestion.id">
                <legend class="sr-only">{{ translationService.translate('quiz.selectOne') }}</legend>
                @for (option of currentQuestion.options; track trackByOptionId($index, option)) {
                  <div class="option-item" [class.selected]="selectedSingleOption === option.id">
                    <p-radiobutton
                      [inputId]="option.id"
                      [value]="option.id"
                      [(ngModel)]="selectedSingleOption"
                      name="singleChoice"
                      [autofocus]="false"
                    >
                    </p-radiobutton>
                    <label [for]="option.id" [id]="option.id + '-label'" class="option-label">{{ option.text }}</label>
                  </div>
                }
              </fieldset>
            }
            <!-- Multiple Choice (Checkbox) -->
            @if (currentQuestion.type === 'multiple') {
              <fieldset class="options-container" [attr.aria-labelledby]="'question-' + currentQuestion.id">
                <legend class="sr-only">{{ translationService.translate('quiz.selectMultiple') }}</legend>
                @for (option of currentQuestion.options; track trackByOptionId($index, option)) {
                  <div class="option-item" [class.selected]="selectedMultipleOptions.includes(option.id!)">
                    <p-checkbox
                      [inputId]="option.id"
                      [value]="option.id"
                      [(ngModel)]="selectedMultipleOptions"
                      [binary]="false"
                    >
                    </p-checkbox>
                    <label [for]="option.id" [id]="option.id + '-label'" class="option-label">{{ option.text }}</label>
                  </div>
                }
              </fieldset>
            }
            <!-- Question Actions -->
            <div class="question-actions">
              @if (currentQuestionIndex > 0) {
                <button pButton type="button" (click)="previousQuestion()" class="p-button-outlined">
                  <i class="pi pi-chevron-left" pButtonIcon aria-hidden="true"></i
                  ><span pButtonLabel>{{ translationService.translate('quiz.previous') }}</span>
                </button>
              }
              <!-- Spacer to keep Next button on the right when Previous is hidden -->
              @if (currentQuestionIndex === 0) {
                <div></div>
              }
              <button
                pButton
                type="button"
                [attr.aria-label]="
                  isLastQuestion
                    ? translationService.translate('quiz.finish')
                    : translationService.translate('quiz.next')
                "
                [disabled]="!hasValidSelection"
                (click)="nextQuestion()"
                [severity]="isLastQuestion ? 'success' : 'primary'"
              >
                <span pButtonLabel>{{
                  isLastQuestion
                    ? translationService.translate('quiz.finish')
                    : translationService.translate('quiz.next')
                }}</span
                ><i [class]="isLastQuestion ? 'pi pi-check' : 'pi pi-chevron-right'" pButtonIcon aria-hidden="true"></i>
              </button>
            </div>
          </section>
        }

        <!-- Quiz Results -->
        @if (quizState.showResults) {
          <section
            class="quiz-results"
            [attr.aria-label]="translationService.translate('quiz.resultsSection')"
            role="region"
          >
            <div class="results-summary">
              <div class="score-display" [attr.aria-label]="getScoreAriaLabel()">
                <i class="pi pi-star-fill score-icon" aria-hidden="true"></i>
                <h2>{{ translationService.translate('quiz.finalScore') }}</h2>
                <div class="score-value" [attr.aria-label]="getScoreValueAriaLabel()">
                  {{ quizState.score }} / {{ quizState.maxScore }}
                </div>
                <div class="score-percentage" [attr.aria-label]="getScorePercentageAriaLabel()">
                  {{ getScorePercentage() }}%
                </div>
              </div>
            </div>
            <!-- Question Review -->
            <div class="questions-review">
              <h3>{{ translationService.translate('quiz.reviewAnswers') }}</h3>
              @for (question of questions; track trackByQuestionId(i, question); let i = $index) {
                <div class="review-item">
                  <div class="review-header">
                    <span class="question-number">{{ i + 1 }}.</span>
                    <span class="question-text">{{ question.question }}</span>
                    <i
                      class="{{ getQuestionResultIcon(question.id) }}"
                      [class]="getQuestionResultClass(question.id)"
                      aria-hidden="true"
                    ></i>
                    <span class="sr-only">{{
                      translationService.translate(
                        getQuestionResultIcon(question.id) === 'pi pi-check-circle'
                          ? 'quiz.review.correct'
                          : 'quiz.review.incorrect'
                      )
                    }}</span>
                  </div>
                  <div class="review-options">
                    @for (option of question.options; track trackByOptionId($index, option)) {
                      <div
                        class="option-review"
                        [class.user-correct]="isUserSelected(question.id, option.id!) && option.isCorrect"
                        [class.user-incorrect]="isUserSelected(question.id, option.id!) && !option.isCorrect"
                        [class.missed-correct]="!isUserSelected(question.id, option.id!) && option.isCorrect"
                      >
                        <span class="option-text">{{ option.text }}</span>
                        <div class="option-indicators">
                          @if (isUserSelected(question.id, option.id!)) {
                            <span
                              class="quiz-chip user-choice"
                              [class.correct-chip]="option.isCorrect"
                              [class.incorrect-chip]="!option.isCorrect"
                            >
                              <i class="pi pi-user" aria-hidden="true"></i>
                              <span class="sr-only">{{ translationService.translate('quiz.review.yourAnswer') }}:</span>
                              <span>{{
                                translationService.translate(
                                  option.isCorrect ? 'quiz.review.correct' : 'quiz.review.incorrect'
                                )
                              }}</span>
                            </span>
                          }
                          @if (option.isCorrect && !isUserSelected(question.id, option.id!)) {
                            <span class="quiz-chip correct-chip">
                              <i class="pi pi-check" aria-hidden="true"></i>
                              <span>{{ translationService.translate('quiz.review.correctAnswer') }}</span>
                            </span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                  @if (question.explanation) {
                    <div class="explanation">
                      <p>
                        <strong>{{ translationService.translate('quiz.explanation') }}:</strong>
                        <span>{{ question.explanation }}</span>
                      </p>
                    </div>
                  }
                </div>
              }
            </div>
            <!-- Results Actions -->
            <div class="results-actions">
              <button pButton type="button" (click)="resetQuiz()" class="p-button-outlined">
                <i class="pi pi-refresh" pButtonIcon aria-hidden="true"></i
                ><span pButtonLabel>{{ translationService.translate('quiz.retake') }}</span>
              </button>
            </div>
          </section>
        }

        <!-- Print-only: Worksheet with all questions -->
        <div class="quiz-print-worksheet">
          <div class="quiz-print-questions">
            @for (question of questions; track question.id; let i = $index) {
              <div class="print-question">
                <p class="print-question-text">
                  <strong>{{ i + 1 }}.</strong> {{ question.question }}
                </p>
                <ul class="print-options">
                  @for (option of question.options; track option.id; let j = $index) {
                    <li>&#9744; {{ getOptionLetter(j) }}) {{ option.text }}</li>
                  }
                </ul>
              </div>
            }
          </div>
          <div class="quiz-print-answer-key">
            <span class="answer-key-content">
              {{ translationService.translate('quiz.answerKey') }}:
              @for (question of questions; track question.id; let i = $index) {
                {{ i + 1 }})
                @for (option of question.options; track option.id; let j = $index) {
                  @if (option.isCorrect) {
                    {{ getOptionLetter(j) }}
                  }
                }
                {{ i < questions.length - 1 ? ' · ' : '' }}
              }
            </span>
          </div>
        </div>

        <!-- Live regions for screen reader announcements -->
        <div aria-live="polite" aria-atomic="true" class="sr-only">
          @if (liveAnnouncement) {
            <span>{{ liveAnnouncement }}</span>
          }
        </div>

        <div aria-live="assertive" aria-atomic="true" class="sr-only">
          @if (urgentAnnouncement) {
            <span>{{ urgentAnnouncement }}</span>
          }
        </div>
      </div>
    </app-standard-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* A query container: the @container rules below read the width of the
       column this widget sits in (article, demo frame, card), not the window. */
      :host {
        display: block;
        container-type: inline-size;
      }

      /* Quiz Header */
      .quiz-header {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--surface-50);
        border-radius: var(--border-radius);
      }

      .quiz-subtitle {
        margin: 0 0 0.75rem 0;
        font-size: 0.95rem;
        color: var(--text-color-secondary);
        line-height: 1.4;
      }

      .quiz-header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .quiz-progress {
        flex: 1;
      }

      .progress-text {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        margin-bottom: 0.5rem;
        display: block;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: var(--surface-border);
        border-radius: 4px;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-color-light));
        transition: width 0.4s ease;
        border-radius: 4px;
        position: relative;
      }

      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      .quiz-header-right {
        display: flex;
        align-items: center;
        gap: var(--space-3, 0.75rem);
      }

      .quiz-score {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: var(--primary-color-fg);
      }

      /* Status tag — shows completion state */
      .quiz-status-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
        transition: all 0.3s ease;
        /* Default: open/warning state */
        background: var(--p-orange-100);
        color: var(--p-orange-900);
        border: 1px solid color-mix(in srgb, var(--orange-500) 30%, var(--surface-border));
      }
      :host-context(.dark-theme) .quiz-status-tag {
        background: var(--p-orange-900);
        color: var(--p-orange-100);
      }

      .quiz-status-tag.completed {
        background: var(--p-green-100);
        color: var(--p-green-900);
        border-color: color-mix(in srgb, var(--green-500) 30%, var(--surface-border));
      }
      :host-context(.dark-theme) .quiz-status-tag.completed {
        background: var(--p-green-900);
        color: var(--p-green-100);
      }

      .quiz-status-tag i {
        font-size: 0.85rem;
      }

      /* Question Container */
      .question-container {
        margin-bottom: 2rem;
      }

      .question-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .question-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
        line-height: 1.4;
        flex: 1;
      }

      .hint-button {
        flex-shrink: 0;
        transition: all 0.2s ease;
      }

      .hint-button:hover {
      }

      /* Hint Container */
      .hint-container {
        margin-bottom: 1rem;
        animation: slideDown 0.3s ease-out;
      }

      .hint-content {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: color-mix(in srgb, var(--p-blue-500, var(--blue-500)) 10%, var(--surface-card));
        border: 1px solid color-mix(in srgb, var(--p-blue-500, var(--blue-500)) 30%, var(--surface-border));
        border-radius: var(--border-radius);
        border-left: 4px solid var(--p-blue-500, var(--blue-500));
      }

      .hint-icon {
        color: var(--p-blue-400, var(--blue-400));
        font-size: 1.1rem;
        margin-top: 0.1rem;
        flex-shrink: 0;
      }

      .hint-text {
        color: var(--text-color);
        line-height: 1.5;
        font-size: 0.95rem;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
          max-height: 0;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          max-height: 100px;
        }
      }

      /* Options */
      .options-container {
        margin-bottom: 2rem;
      }

      .option-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        margin-bottom: 0.75rem;
        border: 2px solid var(--surface-border);
        border-radius: var(--border-radius);
        background: var(--surface-card);
        transition: all 0.2s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .option-item::before {
        content: '';
        position: absolute;
        left: -100%;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(var(--primary-color-rgb), 0.1), transparent);
        transition: left 0.5s ease;
      }

      .option-item:hover {
        background: var(--surface-hover);
        border-color: var(--primary-color-fg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .option-item:hover::before {
        left: 100%;
      }

      .option-item.selected {
        border-color: var(--primary-color-fg);
        background: var(--primary-color-50);
        box-shadow: 0 0 0 1px var(--primary-color);
      }

      /* The row is no longer a tab stop; the ring follows the control inside it. */
      .option-item:focus-within {
        outline: 3px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-color: var(--primary-color-fg);
      }

      .option-label {
        flex: 1;
        line-height: 1.4;
        cursor: pointer;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
      }

      /* Question Actions */
      .question-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        gap: 1rem;
      }

      .question-actions button {
        transition: all 0.2s ease;
        min-width: 120px;
      }

      .question-actions button:hover:not(:disabled) {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .question-actions button:active:not(:disabled) {
        transform: translateY(0);
      }

      /* Quiz Results */
      .quiz-results {
        text-align: center;
        animation: fadeInUp 0.6s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .results-summary {
        margin-bottom: 3rem;
      }

      .score-display {
        background: linear-gradient(135deg, var(--surface-section), var(--surface-card));
        padding: 2rem;
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--surface-border);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
      }

      .score-display::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        animation: slideAcross 2s ease-in-out infinite;
      }

      @keyframes slideAcross {
        0% {
          left: -100%;
        }
        50% {
          left: 100%;
        }
        100% {
          left: 100%;
        }
      }

      .score-icon {
        font-size: 3rem;
        color: var(--yellow-500);
        margin-bottom: 1rem;
      }

      .score-display h2 {
        margin: 0 0 1rem 0;
        color: var(--text-color);
      }

      .score-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--primary-color-fg);
        margin-bottom: 0.5rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        animation: countUp 1s ease-out 0.5s both;
      }

      @keyframes countUp {
        from {
          opacity: 0;
          transform: scale(0.5);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .score-percentage {
        font-size: 1.25rem;
        color: var(--text-color-secondary);
        font-weight: 500;
        animation: fadeIn 1s ease-out 1s both;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      /* Questions Review */
      .questions-review {
        text-align: left;
        margin-bottom: 2rem;
      }

      .questions-review h3 {
        margin-bottom: 1.5rem;
        color: var(--text-color);
        font-size: 1.5rem;
        border-bottom: 2px solid var(--surface-border);
        padding-bottom: 0.75rem;
      }

      .review-item {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        background: var(--surface-card);
        transition: all 0.3s ease;
        animation: slideInLeft 0.4s ease-out;
        animation-fill-mode: both;
      }

      .review-item:nth-child(1) {
        animation-delay: 0.1s;
      }
      .review-item:nth-child(2) {
        animation-delay: 0.2s;
      }
      .review-item:nth-child(3) {
        animation-delay: 0.3s;
      }
      .review-item:nth-child(4) {
        animation-delay: 0.4s;
      }

      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .review-item:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border-color: var(--primary-color-200);
      }

      .review-header {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .question-number {
        font-weight: 600;
        color: var(--primary-color-fg);
        min-width: 2rem;
      }

      .question-text {
        flex: 1;
        font-weight: 500;
      }

      .review-options {
        margin-left: 2.5rem;
        margin-bottom: 1rem;
      }

      .explanation {
        margin-left: 2.5rem;
        padding: 1rem;
        background: var(--surface-section);
        border-radius: var(--border-radius);
        border-left: 3px solid var(--blue-500);
      }

      .explanation p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
      }

      /* Result Icons and Colors */
      .correct-icon {
        color: var(--green-500) !important;
        font-size: 1.1rem;
        font-weight: bold;
      }

      .incorrect-icon {
        color: var(--red-500) !important;
        font-size: 1.1rem;
        font-weight: bold;
      }

      .correct-option {
        color: var(--p-green-400, var(--green-400)) !important;
        font-weight: 600;
        background-color: color-mix(in srgb, var(--p-green-500, var(--green-500)) 10%, var(--surface-card));
        padding: 0.25rem 0.5rem;
        border-radius: var(--border-radius-sm);
        border-left: 3px solid var(--p-green-500, var(--green-500));
      }

      .incorrect-option {
        color: var(--p-red-400, var(--red-400)) !important;
        font-weight: 600;
        background-color: color-mix(in srgb, var(--p-red-500, var(--red-500)) 10%, var(--surface-card));
        padding: 0.25rem 0.5rem;
        border-radius: var(--border-radius-sm);
        border-left: 3px solid var(--p-red-500, var(--red-500));
      }

      .user-selected {
        font-weight: 700;
        text-decoration: underline;
      }

      /* Enhanced option review styling */
      .option-review {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        margin-bottom: 0.75rem;
        border-radius: var(--border-radius);
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        transition: all 0.2s ease;
      }

      .option-text {
        flex: 1;
        font-size: 1rem;
        line-height: 1.4;
        color: var(--text-color);
      }

      .option-indicators {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      /* Custom quiz chips (replacing Optimus UI p-chip to avoid ::ng-deep) */
      .quiz-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.625rem;
        border-radius: 1rem;
        font-size: 0.85rem;
        line-height: 1.4;
        white-space: nowrap;
      }

      .quiz-chip.correct-chip {
        background-color: color-mix(in srgb, var(--p-green-500, var(--green-500)) 20%, var(--surface-card));
        color: var(--p-green-400, var(--green-400));
        border: 1px solid color-mix(in srgb, var(--p-green-500, var(--green-500)) 40%, var(--surface-border));
      }

      .quiz-chip.incorrect-chip {
        background-color: color-mix(in srgb, var(--p-red-500, var(--red-500)) 20%, var(--surface-card));
        color: var(--p-red-400, var(--red-400));
        border: 1px solid color-mix(in srgb, var(--p-red-500, var(--red-500)) 40%, var(--surface-border));
      }

      .quiz-chip.user-choice {
        font-weight: 600;
      }

      .quiz-chip.user-choice i {
        color: var(--primary-color-fg);
      }

      /* Results Actions */
      .results-actions {
        margin-top: 2rem;
        animation: fadeIn 1s ease-out 1.5s both;
      }

      .results-actions button {
        transition: all 0.3s ease;
        min-width: 140px;
      }

      .results-actions button:hover {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      /* Narrow widget: full-width results actions */
      @container (max-width: 768px) {
        .results-actions button {
          width: 100%;
          justify-content: center;
        }
      }

      /* Narrow widget */
      @container (max-width: 768px) {
        .quiz-header-top {
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .progress-bar {
          width: 100%;
        }

        .question-actions {
          flex-direction: column;
          gap: 1rem;
        }

        /* Button full width on mobile */
        .question-actions button {
          width: 100%;
          justify-content: center;
        }

        .score-display {
          padding: 1.5rem;
        }

        .score-value {
          font-size: 2rem;
        }

        .question-header {
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
        }

        /* Hint button full width on mobile */
        .hint-button {
          width: 100%;
          justify-content: center;
        }

        /* Mobile-specific option styling */
        .option-item {
          padding: 0.75rem;
          gap: 0.5rem;
        }

        .option-label {
          font-size: 0.95rem;
          word-break: break-word;
          hyphens: manual;
          max-width: calc(100% - 2rem);
        }

        /* Ensure radio buttons and checkboxes don't shrink */
        .option-item p-radiobutton,
        .option-item p-checkbox {
          flex-shrink: 0;
          min-width: 20px;
        }

        /* Review options mobile optimization */
        .option-review {
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
        }

        .option-text {
          font-size: 0.95rem;
          word-break: break-word;
        }

        .option-indicators {
          align-self: flex-start;
        }

        /* Keep some indentation on tablets */
        .review-options {
          margin-left: 1.5rem;
        }

        .explanation {
          margin-left: 1.5rem;
        }
      }

      /* Very narrow widget (a phone in portrait, or a slim column) */
      @container (max-width: 480px) {
        .question-title {
          font-size: 1.1rem;
        }

        .option-item {
          padding: 0.625rem;
          margin-bottom: 0.5rem;
        }

        .option-label {
          font-size: 0.9rem;
        }

        /* Ensure options container uses full width */
        .options-container {
          margin-left: -0.5rem;
          margin-right: -0.5rem;
          padding: 0 0.5rem;
        }

        /* Adjust chip sizes for mobile */
        .quiz-chip {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
        }

        .review-item {
          padding: 1rem;
        }

        .review-header {
          flex-direction: row; /* Keep in row on mobile */
          align-items: flex-start;
          gap: 0.5rem;
        }

        .question-number {
          min-width: auto;
          flex-shrink: 0; /* Prevent number from shrinking */
        }

        .question-text {
          flex: 1;
          word-break: break-word;
          line-height: 1.4;
        }

        /* Icons in review header */
        .review-header i {
          margin-left: auto;
          flex-shrink: 0;
        }

        /* Remove left margins on mobile */
        .review-options {
          margin-left: 0;
          padding: 0;
        }

        .explanation {
          margin-left: 0;
          padding: 0.75rem;
          font-size: 0.85rem;
        }

        /* Adjust option review for mobile */
        .option-review {
          padding: 0.625rem;
          margin-bottom: 0.5rem;
        }
      }

      /* Extra narrow: up to 360px, WCAG 1.4.10 Reflow */
      @container (max-width: 360px) {
        .quiz-header {
          padding: 0.75rem;
        }

        .option-item {
          padding: var(--space-2);
          font-size: 0.85rem;
        }

        .question-actions button {
          font-size: 0.85rem;
          min-height: 44px;
        }

        .score-value {
          font-size: 1.5rem;
        }

        .score-display {
          padding: 1rem;
        }
      }

      /* Reduced motion for WCAG 2.3.3 */
      @media (prefers-reduced-motion: reduce) {
        .quiz-results,
        .score-value,
        .score-percentage,
        .results-actions,
        .review-item,
        .hint-container,
        .progress-fill,
        .progress-fill::after,
        .option-item,
        .option-item::before,
        .score-display::before,
        .question-actions button,
        .results-actions button {
          animation: none !important;
          transition: none !important;
        }
      }

      /* Quiz results color coding — uses color-mix for dark mode compatibility */
      .review-options .option-review.user-correct {
        border: 2px solid var(--p-green-600, var(--green-600));
        background: color-mix(in srgb, var(--p-green-500, var(--green-500)) 15%, var(--surface-card));
        box-shadow: 0 2px 8px color-mix(in srgb, var(--p-green-500, var(--green-500)) 15%, transparent);
      }

      .review-options .option-review.user-incorrect {
        border: 2px solid var(--p-red-600, var(--red-600));
        background: color-mix(in srgb, var(--p-red-500, var(--red-500)) 15%, var(--surface-card));
        box-shadow: 0 2px 8px color-mix(in srgb, var(--p-red-500, var(--red-500)) 15%, transparent);
      }

      .review-options .option-review.missed-correct {
        border: 2px solid var(--p-orange-600, var(--orange-600));
        background: color-mix(in srgb, var(--p-orange-500, var(--orange-500)) 15%, var(--surface-card));
        box-shadow: 0 2px 8px color-mix(in srgb, var(--p-orange-500, var(--orange-500)) 15%, transparent);
      }

      /* Print worksheet: hidden on screen */
      .quiz-print-worksheet {
        display: none;
      }

      @media print {
        /* Hide interactive quiz elements (NOT the wrapper — worksheet lives inside it) */
        .quiz-header {
          display: none !important;
        }
        .quiz-content > *:not(.quiz-print-worksheet) {
          display: none !important;
        }
        /* Show print worksheet */
        .quiz-print-worksheet {
          display: block !important;
        }

        .print-question {
          margin-bottom: 1rem;
          break-inside: avoid;
        }
        .print-question-text {
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #000;
        }
        .print-options {
          list-style: none;
          padding-left: 1.5rem;
          margin: 0;
        }
        .print-options li {
          margin-bottom: 0.25rem;
          color: #000;
        }

        /* Answer key upside-down (anti-spoiler) */
        .quiz-print-answer-key {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #ccc;
          transform: rotate(180deg);
          font-size: 0.75rem;
          color: #666;
        }
      }

      /* Fieldset styling reset */
      fieldset.options-container {
        border: none;
        padding: 0;
        margin: 0;
        min-width: 0;
      }

      fieldset.options-container legend {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `,
  ],
})
export class QuizContainerComponent implements OnInit, OnChanges {
  protected translationService = inject(TranslationService);
  private userProgressService = inject(UserProgressService);
  private cdr = inject(ChangeDetectorRef);

  /**
   * Quiz questions array
   */
  @Input() questions: QuizQuestion[] = [];

  /**
   * Whether to show score during quiz
   */
  @Input() showScore: boolean = true;

  /**
   * Whether to shuffle questions
   */
  @Input() shuffleQuestions: boolean = false;

  /**
   * Whether to shuffle options within questions.
   * Defaults to true so the correct answer is not pinned to its authored
   * position (authors overwhelmingly place it at option 2). Shuffling is
   * answer-safe: correctness travels with each option (id + isCorrect),
   * never the index.
   */
  @Input() shuffleOptions: boolean = true;

  /**
   * Unique quiz identifier for persistence.
   * When set, quiz completion is persisted via UserProgressService
   * and the container shows visual status (warning when open, success when done).
   */
  @Input() quizId: string = '';

  /**
   * Container configuration
   */
  @Input() type: ContainerType = 'primary';
  @Input() title: string = '';
  @Input() titleKey?: string;
  @Input() subtitle?: string;
  @Input() icon: string = 'pi pi-question-circle';

  /**
   * Events
   */

  /**
   * Emitted when the entire quiz is completed
   * Contains all question results for final scoring and achievements
   */
  @Output() quizCompleted = new EventEmitter<QuizResult[]>();

  /**
   * Emitted when a single question is answered (on Next button click)
   * Contains the result for the just-answered question
   * Perfect for per-question achievements and real-time feedback
   */
  @Output() questionAnswered = new EventEmitter<QuizResult>();

  // Completion tracking (persisted via UserProgressService when quizId is set)
  isCompleted = false;

  // True once the view has hydrated in the browser. Shuffling is gated on this
  // so the first (SSR/hydration) render keeps the authored option order and the
  // prerendered @for nodes hydrate without a mismatch.
  private hydrated = false;

  // Quiz state
  quizState: QuizState = {
    currentQuestionIndex: 0,
    answers: new Map(),
    showResults: false,
    score: 0,
    maxScore: 0,
  };

  // Current question selections
  selectedSingleOption: string = '';
  selectedMultipleOptions: string[] = [];

  // Hint state - tracks which questions have their hints shown
  private shownHints = new Set<string>();

  // Live announcements for screen readers
  liveAnnouncement: string = '';
  urgentAnnouncement: string = '';

  constructor() {
    // Don't initialize here - questions might not be available yet

    // Defer the first shuffle until AFTER hydration (browser-only). A synchronous
    // shuffle in ngOnInit would reorder the data while @for hydrates against the
    // prerendered (authored-order) DOM → hydration mismatch. afterNextRender runs
    // post-hydration in the browser and is a no-op on the server.
    // See lesson "Filter während Hydration verkeilt @for".
    afterNextRender(() => {
      this.hydrated = true;
      if (this.questions.length > 0 && !this.quizState.showResults) {
        this.applyShuffle();
        this.loadQuestionState();
        this.cdr.detectChanges();
      }
    });

    // Subscribe to language changes for reactivity
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    // Check persisted completion state
    this.checkCompletionState();

    // Normalize: auto-generate missing IDs for questions and options
    this.normalizeIds();

    // Initialize only when component is fully ready and inputs are available
    if (this.questions && this.questions.length > 0) {
      this.initializeQuiz();
    }
  }

  /** Auto-generate IDs for questions/options that don't have them */
  private normalizeIds(): void {
    if (!this.questions) return;
    this.questions.forEach((q, qi) => {
      if (!q.id) q.id = `q${qi}`;
      q.options.forEach((o, oi) => {
        if (!o.id) o.id = `${q.id}_o${oi}`;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-initialize when questions change
    if (changes['questions'] && this.questions && this.questions.length > 0) {
      this.normalizeIds();
      // Only initialize if this is the first change or if the questions are actually different
      // Check if questions are actually different by comparing question IDs
      const currentChange = changes['questions'];
      if (currentChange.firstChange) {
        // First time initialization
        this.initializeQuiz();
      } else if (currentChange.previousValue && currentChange.currentValue) {
        // Check if questions have actually changed by comparing IDs
        const prevIds = currentChange.previousValue.map((q: QuizQuestion) => q.id).join(',');
        const currIds = currentChange.currentValue.map((q: QuizQuestion) => q.id).join(',');
        if (prevIds !== currIds) {
          // Questions have actually changed, re-initialize
          this.initializeQuiz();
        }
      }
    }
  }

  /**
   * Get current question
   */
  get currentQuestion(): QuizQuestion | null {
    if (this.questions.length === 0) return null;
    return this.questions[this.quizState.currentQuestionIndex] || null;
  }

  /**
   * Get current question index for display
   */
  get currentQuestionIndex(): number {
    return this.quizState.currentQuestionIndex;
  }

  /**
   * Check if this is the last question
   */
  get isLastQuestion(): boolean {
    return this.quizState.currentQuestionIndex === this.questions.length - 1;
  }

  /**
   * Check if user has made a valid selection
   */
  get hasValidSelection(): boolean {
    if (!this.currentQuestion) return false;

    if (this.currentQuestion.type === 'single') {
      return this.selectedSingleOption !== '';
    } else {
      return this.selectedMultipleOptions.length > 0;
    }
  }

  /**
   * Get container configuration.
   * When quizId is set, container type switches dynamically:
   * - 'warning' (orange) when quiz is not yet completed
   * - 'success' (green) when quiz has been completed
   */
  get containerConfig(): ContainerConfig {
    const effectiveType = this.quizId ? (this.isCompleted ? 'success' : 'warning') : this.type;
    const effectiveIcon = this.quizId && this.isCompleted ? 'pi pi-check-circle' : this.icon;
    return {
      type: effectiveType,
      title: this.title,
      titleKey: this.titleKey,
      icon: effectiveIcon,
    };
  }

  /**
   * Check if quiz was previously completed (via UserProgressService)
   */
  private checkCompletionState(): void {
    if (!this.quizId) return;
    const progress = this.userProgressService.getCurrentProgress();
    this.isCompleted = progress.completedQuizzes.includes(this.quizId);
  }

  /**
   * Initialize or reset quiz
   */
  private initializeQuiz(): void {
    if (this.questions.length === 0) return;

    // Calculate max score
    this.quizState.maxScore = this.questions.reduce((total, q) => total + (q.points || 1), 0);

    // Shuffle only once we are post-hydration (browser). On the first/SSR pass
    // hydrated is false → authored order is kept so the prerendered @for nodes
    // hydrate cleanly; the constructor's afterNextRender does the initial shuffle.
    // Runtime re-inits (resetQuiz, question swap via ngOnChanges) are already
    // post-hydration and shuffle here directly.
    if (this.hydrated) {
      this.applyShuffle();
    }

    // Reset state
    this.quizState.currentQuestionIndex = 0;
    this.quizState.answers.clear();
    this.quizState.showResults = false;
    this.quizState.score = 0;

    // Reset hint state
    this.shownHints.clear();

    this.loadQuestionState();
  }

  /**
   * Fisher-Yates shuffle — uniform and unbiased, unlike the
   * `sort(() => Math.random() - 0.5)` idiom (engine-dependent, leaves elements
   * near their origin, which is what kept the correct answer pinned to pos. 2).
   */
  private shuffleArray<T>(input: readonly T[]): T[] {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Apply the enabled shuffles. Answer-safe: correctness lives on each option
   * (id + isCorrect) and scoring compares by id/flag, never by index — so
   * reordering can never break the matching.
   */
  private applyShuffle(): void {
    if (this.shuffleQuestions) {
      this.questions = this.shuffleArray(this.questions);
    }
    if (this.shuffleOptions) {
      this.questions.forEach((question) => {
        question.options = this.shuffleArray(question.options);
      });
    }
  }

  /**
   * Load current question state
   */
  private loadQuestionState(): void {
    if (!this.currentQuestion) return;

    const savedAnswer = this.quizState.answers.get(this.currentQuestion.id);

    if (this.currentQuestion.type === 'single') {
      this.selectedSingleOption = savedAnswer?.[0] || '';
      this.selectedMultipleOptions = [];
    } else {
      this.selectedMultipleOptions = savedAnswer || [];
      this.selectedSingleOption = '';
    }
  }

  /**
   * Save current question state
   */
  private saveQuestionState(): void {
    if (!this.currentQuestion) return;

    let selectedOptions: string[] = [];

    if (this.currentQuestion.type === 'single') {
      selectedOptions = this.selectedSingleOption ? [this.selectedSingleOption] : [];
    } else {
      selectedOptions = [...this.selectedMultipleOptions];
    }

    this.quizState.answers.set(this.currentQuestion.id, selectedOptions);
  }

  /**
   * Go to previous question
   */
  previousQuestion(): void {
    this.saveQuestionState();

    if (this.quizState.currentQuestionIndex > 0) {
      this.quizState.currentQuestionIndex--;
      this.loadQuestionState();

      // Force change detection to update the view
      this.cdr.detectChanges();

      // Announce question change
      this.announceLive(
        this.translationService
          .translate('quiz.previousQuestionAnnouncement')
          .replace('{current}', (this.currentQuestionIndex + 1).toString())
          .replace('{total}', this.questions.length.toString()),
      );
    }
  }

  /**
   * Go to next question or finish quiz
   */
  nextQuestion(): void {
    if (!this.hasValidSelection) return;

    this.saveQuestionState();

    // Emit questionAnswered event for the current question
    if (this.currentQuestion) {
      const questionResult = this.generateQuestionResult(this.currentQuestion);
      this.questionAnswered.emit(questionResult);
    }

    if (this.isLastQuestion) {
      this.finishQuiz();
    } else {
      this.quizState.currentQuestionIndex++;
      this.loadQuestionState();

      // Force change detection to update the view
      this.cdr.detectChanges();

      // Announce question change to screen readers
      this.announceLive(
        this.translationService
          .translate('quiz.nextQuestionAnnouncement')
          .replace('{current}', (this.currentQuestionIndex + 1).toString())
          .replace('{total}', this.questions.length.toString()),
      );
    }
  }

  /**
   * Finish quiz and show results
   */
  private finishQuiz(): void {
    this.calculateScore();
    this.quizState.showResults = true;

    // Persist completion state
    if (this.quizId) {
      this.userProgressService.addCompletedQuiz(this.quizId);
      this.isCompleted = true;
    }

    // Announce quiz completion to screen readers
    this.announceUrgent(
      this.translationService
        .translate('quiz.quizCompletedAnnouncement')
        .replace('{score}', this.quizState.score.toString())
        .replace('{total}', this.quizState.maxScore.toString()),
    );

    // Emit results
    const results = this.generateResults();
    this.quizCompleted.emit(results);
  }

  /**
   * Calculate final score
   */
  private calculateScore(): void {
    let score = 0;

    this.questions.forEach((question) => {
      const userAnswers = this.quizState.answers.get(question.id) || [];
      const correctAnswers = question.options.filter((opt) => opt.isCorrect).map((opt) => opt.id!);

      const isCorrect = this.arraysEqual(userAnswers.sort(), correctAnswers.sort());

      if (isCorrect) {
        score += question.points || 1;
      }
    });

    this.quizState.score = score;
  }

  /**
   * Check if two arrays are equal
   */
  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  /**
   * Generate result for a single question
   */
  private generateQuestionResult(question: QuizQuestion): QuizResult {
    const userAnswers = this.quizState.answers.get(question.id) || [];
    const correctAnswers = question.options.filter((opt) => opt.isCorrect).map((opt) => opt.id!);
    const isCorrect = this.arraysEqual(userAnswers.sort(), correctAnswers.sort());

    return {
      questionId: question.id,
      selectedOptionIds: userAnswers,
      isCorrect,
      points: isCorrect ? question.points || 1 : 0,
    };
  }

  /**
   * Generate quiz results
   */
  private generateResults(): QuizResult[] {
    return this.questions.map((question) => this.generateQuestionResult(question));
  }

  /**
   * Reset quiz to start over
   */
  resetQuiz(): void {
    this.initializeQuiz();
  }

  /**
   * Get score percentage
   */
  getScorePercentage(): number {
    if (this.quizState.maxScore === 0) return 0;
    return Math.round((this.quizState.score / this.quizState.maxScore) * 100);
  }

  /**
   * Get question result icon
   */
  getQuestionResultIcon(questionId: string): string {
    const userAnswers = this.quizState.answers.get(questionId) || [];
    const question = this.questions.find((q) => q.id === questionId);
    if (!question) return 'pi pi-question';

    const correctAnswers = question.options.filter((opt) => opt.isCorrect).map((opt) => opt.id!);
    const isCorrect = this.arraysEqual(userAnswers.sort(), correctAnswers.sort());

    return isCorrect ? 'pi pi-check-circle' : 'pi pi-times-circle';
  }

  /**
   * Get question result class
   */
  getQuestionResultClass(questionId: string): string {
    const userAnswers = this.quizState.answers.get(questionId) || [];
    const question = this.questions.find((q) => q.id === questionId);
    if (!question) return '';

    const correctAnswers = question.options.filter((opt) => opt.isCorrect).map((opt) => opt.id!);
    const isCorrect = this.arraysEqual(userAnswers.sort(), correctAnswers.sort());

    return isCorrect ? 'correct-icon' : 'incorrect-icon';
  }

  /**
   * Check if option was selected by user
   */
  isUserSelected(questionId: string, optionId: string): boolean {
    const userAnswers = this.quizState.answers.get(questionId) || [];
    return userAnswers.includes(optionId);
  }

  /**
   * Show hint for a question
   */
  showHint(questionId: string): void {
    this.shownHints.add(questionId);
  }

  /**
   * Check if hint is shown for a question
   */
  isHintShown(questionId: string): boolean {
    return this.shownHints.has(questionId);
  }

  /**
   * Get ARIA label for current question
   */
  getQuestionAriaLabel(): string {
    return this.translationService
      .translate('quiz.questionAriaLabel')
      .replace('{current}', (this.currentQuestionIndex + 1).toString())
      .replace('{total}', this.questions.length.toString());
  }

  /**
   * Get ARIA label for quiz score
   */
  getScoreAriaLabel(): string {
    return this.translationService
      .translate('quiz.scoreAriaLabel')
      .replace('{score}', this.quizState.score.toString())
      .replace('{total}', this.quizState.maxScore.toString())
      .replace('{percentage}', this.getScorePercentage().toString());
  }

  /**
   * Get ARIA label for score value
   */
  getScoreValueAriaLabel(): string {
    return this.translationService
      .translate('quiz.scoreOf')
      .replace('{score}', this.quizState.score.toString())
      .replace('{total}', this.quizState.maxScore.toString());
  }

  /**
   * Get ARIA label for score percentage
   */
  getScorePercentageAriaLabel(): string {
    return this.translationService
      .translate('quiz.percentage')
      .replace('{percent}', this.getScorePercentage().toString());
  }

  /**
   * Announce live updates to screen readers
   */
  private announceLive(message: string): void {
    this.liveAnnouncement = message;
    setTimeout(() => {
      this.liveAnnouncement = '';
      // Timer callback: nothing marks this OnPush view dirty on its own.
      this.cdr.markForCheck();
    }, 3000);
  }

  /**
   * Announce urgent updates to screen readers
   */
  private announceUrgent(message: string): void {
    this.urgentAnnouncement = message;
    setTimeout(() => {
      this.urgentAnnouncement = '';
      // Timer callback: nothing marks this OnPush view dirty on its own.
      this.cdr.markForCheck();
    }, 3000);
  }

  /**
   * Convert option index to letter (0→A, 1→B, 2→C, 3→D)
   */
  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  trackByOptionId(_index: number, option: QuizOption): string {
    return option.id || `opt_${_index}`;
  }

  trackByQuestionId(_index: number, question: QuizQuestion): string {
    return question.id || `q_${_index}`;
  }
}
