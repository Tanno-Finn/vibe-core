import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizContainerComponent, QuizQuestion } from './quiz-container.component';
import { provideOfflineHttp } from '../../testing/offline-http';

/**
 * The quiz used to move the tab stop onto the row wrapper and push the inputs
 * out of the tab order, which is the exact pattern the radiobutton guide names
 * as fatal: it kills the group, so the arrow keys stop moving the selection.
 * These tests pin the native structure the guide asks for.
 */
/**
 * The container frame mounts the cursor-glow directive, which reads
 * `window.matchMedia` in ngOnInit; the test environment has no such function.
 */
function stubMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('QuizContainerComponent option keyboard structure', () => {
  let fixture: ComponentFixture<QuizContainerComponent>;

  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'Which one?',
      type: 'single',
      options: [
        { id: 'a', text: 'Alpha', isCorrect: true },
        { id: 'b', text: 'Beta', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      question: 'Which ones?',
      type: 'multiple',
      options: [
        { id: 'c', text: 'Gamma', isCorrect: true },
        { id: 'd', text: 'Delta', isCorrect: true },
      ],
    },
  ];

  beforeEach(() => stubMatchMedia());

  function render(index: number): HTMLElement {
    TestBed.configureTestingModule({ providers: provideOfflineHttp() });
    fixture = TestBed.createComponent(QuizContainerComponent);
    fixture.componentInstance.questions = questions;
    fixture.componentInstance.shuffleQuestions = false;
    fixture.componentInstance.shuffleOptions = false;
    fixture.detectChanges();
    fixture.componentInstance.quizState.currentQuestionIndex = index;
    // The quiz is OnPush and this mutation bypasses its own events, so mark it.
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('leaves every radio in the tab order and takes the row out of it', () => {
    const host = render(0);
    const radios = Array.from(host.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    expect(radios.length).toBe(2);
    for (const radio of radios) {
      expect(radio.getAttribute('tabindex')).not.toBe('-1');
      expect(radio.tabIndex).toBeGreaterThanOrEqual(0);
    }
    for (const row of Array.from(host.querySelectorAll('.option-item'))) {
      expect(row.hasAttribute('tabindex')).toBe(false);
    }
  });

  it('groups the radios under one name inside a fieldset with a legend', () => {
    const host = render(0);
    const fieldset = host.querySelector('fieldset.options-container');
    expect(fieldset).not.toBeNull();
    expect(fieldset!.querySelector('legend')).not.toBeNull();
    const names = new Set(
      Array.from(host.querySelectorAll<HTMLInputElement>('input[type="radio"]')).map((r) => r.name),
    );
    expect(names.size).toBe(1);
  });

  // The question text is announced once, as the group label on the fieldset. Repeating it
  // per option through aria-describedby would read the whole question after every answer,
  // and on the p-radiobutton / p-checkbox host the attribute lands on a custom element with
  // no role, where it is ignored outright.
  it('describes the question once, on the radio group, and not on any option', () => {
    const host = render(0);
    expect(host.querySelector('fieldset.options-container')!.getAttribute('aria-labelledby')).toMatch(/^question-/);
    expect(host.querySelectorAll('[aria-describedby]').length).toBe(0);
  });

  it('describes the question once, on the checkbox group, and not on any option', () => {
    const host = render(1);
    expect(host.querySelector('fieldset.options-container')!.getAttribute('aria-labelledby')).toMatch(/^question-/);
    expect(host.querySelectorAll('[aria-describedby]').length).toBe(0);
  });

  it('labels every radio with a label pointing at its own id', () => {
    const host = render(0);
    for (const radio of Array.from(host.querySelectorAll<HTMLInputElement>('input[type="radio"]'))) {
      expect(host.querySelector(`label[for="${radio.id}"]`)).not.toBeNull();
    }
  });

  // The review used to print hard-coded English 'True' / 'False', and "this was your
  // answer" lived only in an unlabeled person icon.
  it('labels the review chips with translated text, not an icon or hard-coded English', () => {
    const host = render(0);
    const quiz = fixture.componentInstance;
    quiz.quizState.answers.set('q1', ['b']);
    quiz.quizState.showResults = true;
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();

    const review = host.querySelector('.questions-review')!;
    expect(review.textContent).not.toMatch(/\b(True|False)\b/);
    for (const icon of Array.from(review.querySelectorAll('.quiz-chip i'))) {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    }
    // No bundle is loaded in the test, so translate() echoes the key.
    const choice = review.querySelector('.quiz-chip.user-choice')!;
    expect(choice.querySelector('.sr-only')!.textContent).toContain('quiz.review.yourAnswer');
    expect(choice.textContent).toContain('quiz.review.incorrect');
    const missed = review.querySelector('.option-review.missed-correct .quiz-chip')!;
    expect(missed.textContent).toContain('quiz.review.correctAnswer');
  });

  it('leaves every checkbox in the tab order too', () => {
    const host = render(1);
    const boxes = Array.from(host.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    expect(boxes.length).toBe(2);
    for (const box of boxes) {
      expect(box.getAttribute('tabindex')).not.toBe('-1');
      expect(box.tabIndex).toBeGreaterThanOrEqual(0);
    }
  });
});
