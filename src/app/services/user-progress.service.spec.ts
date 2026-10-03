/**
 * UserProgressService spec — the consent gate (user decision 2026-09-23):
 * nothing progress-related is written to the browser until the visitor has
 * agreed to progress storage. Undecided: progress lives in memory only. "Yes":
 * the session's progress is saved and every later change with it. "No":
 * nothing is written and what was stored is removed. A visitor who agreed
 * under an earlier version keeps their progress.
 *
 * Every test watches `Storage.prototype.setItem`, so a write that slipped past
 * the gate fails the test even if a later step removed it again.
 */
import { TestBed } from '@angular/core/testing';
import type { MockInstance } from 'vitest';

import { UserProgressService } from './user-progress.service';
import { PrivacyConsentService } from './privacy-consent.service';

const KEY = 'user_progress';
const YES = { essential: true, progress: true, analytics: false };
const NO = { essential: true, progress: false, analytics: false };

function fresh(): UserProgressService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({});
  return TestBed.inject(UserProgressService);
}

describe('UserProgressService consent gate', () => {
  let setItem: MockInstance<Storage['setItem']>;

  const progressWrites = () => setItem.mock.calls.filter(([key]) => key === KEY || key.endsWith('-checkpoints'));

  beforeEach(() => {
    localStorage.clear();
    setItem = vi.spyOn(Storage.prototype, 'setItem');
  });

  afterEach(() => {
    setItem.mockRestore();
    localStorage.clear();
  });

  it('writes nothing before a decision, and keeps the progress in memory for the session', () => {
    const progress = fresh();

    progress.addCompletedQuiz('quiz-a');
    progress.setCheckpointCompleted('guide-a', 'step-1');
    progress.addCompletedLearningPath('path-a');
    progress.removeCheckpointCompleted('guide-a', 'step-1');
    progress.setCheckpointCompleted('guide-a', 'step-2');

    expect(progressWrites()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(progress.getCurrentProgress().completedQuizzes).toEqual(['quiz-a']);
    expect(progress.getCheckpoints('guide-a')).toEqual(['step-2']);
  });

  it('saves what the session gathered once the visitor agrees, and every change after that', () => {
    const progress = fresh();
    progress.addCompletedQuiz('quiz-a');

    TestBed.inject(PrivacyConsentService).setCookiePreferences(YES);
    progress.applyConsent();

    expect(JSON.parse(localStorage.getItem(KEY)!).completedQuizzes).toEqual(['quiz-a']);
    // Proves the spy sees the writes the other tests say never happen.
    expect(progressWrites().length).toBe(1);

    progress.setCheckpointCompleted('guide-a', 'step-1');
    expect(JSON.parse(localStorage.getItem(KEY)!).completedCheckpoints).toEqual({ 'guide-a': ['step-1'] });
  });

  it('writes nothing after a "no", and removes what was stored before', () => {
    localStorage.setItem(KEY, JSON.stringify({ completedQuizzes: ['old-quiz'] }));
    localStorage.setItem('user_progress_v2', '{}');
    localStorage.setItem('prompting-guide-checkpoints', '["a"]');
    setItem.mockClear();
    const progress = fresh();

    TestBed.inject(PrivacyConsentService).setCookiePreferences(NO);
    progress.applyConsent();
    progress.addCompletedQuiz('quiz-b');
    progress.setCheckpointCompleted('guide-a', 'step-1');

    expect(progressWrites()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(localStorage.getItem('user_progress_v2')).toBeNull();
    expect(localStorage.getItem('prompting-guide-checkpoints')).toBeNull();
    expect(progress.getCurrentProgress().completedQuizzes).toEqual(['quiz-b']);
  });

  it('clears a stored record on load when a "no" is already on record', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(NO));
    localStorage.setItem(KEY, JSON.stringify({ completedQuizzes: ['old-quiz'] }));
    setItem.mockClear();

    const progress = fresh();

    expect(localStorage.getItem(KEY)).toBeNull();
    expect(progress.getCurrentProgress().completedQuizzes).toEqual([]);
    expect(progressWrites()).toEqual([]);
  });

  it('lets a visitor who agreed under an earlier version keep their progress', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(YES));
    localStorage.setItem(
      KEY,
      JSON.stringify({
        totalPoints: 30,
        quizCount: 1,
        unlockedAchievements: [],
        completedQuizzes: ['quiz-a'],
        completedCheckpoints: { 'guide-a': ['step-1'] },
        completedLearningPaths: [],
        version: 1,
        // Retired fields of older records are tolerated and dropped.
        elizaMessages: 12,
        boidsChallengesCompleted: 3,
        attentionHeadsExplored: ['0-1'],
      }),
    );

    const progress = fresh();
    progress.addCompletedQuiz('quiz-b');

    const stored = JSON.parse(localStorage.getItem(KEY)!);
    expect(stored.completedQuizzes).toEqual(['quiz-a', 'quiz-b']);
    expect(stored.completedCheckpoints).toEqual({ 'guide-a': ['step-1'] });
    expect(stored.totalPoints).toBe(30);
    expect(stored).not.toHaveProperty('elizaMessages');
    expect(stored).not.toHaveProperty('attentionHeadsExplored');
  });

  it('does not overwrite an existing record before a decision, and keeps it when the visitor agrees', () => {
    localStorage.setItem(KEY, JSON.stringify({ completedQuizzes: ['quiz-a'] }));
    setItem.mockClear();
    const progress = fresh();

    progress.addCompletedQuiz('quiz-b');
    expect(progressWrites()).toEqual([]);
    expect(JSON.parse(localStorage.getItem(KEY)!).completedQuizzes).toEqual(['quiz-a']);

    TestBed.inject(PrivacyConsentService).setCookiePreferences(YES);
    progress.applyConsent();
    expect(JSON.parse(localStorage.getItem(KEY)!).completedQuizzes).toEqual(['quiz-a', 'quiz-b']);
  });

  it('migrates the v2 key only with consent', () => {
    localStorage.setItem('user_progress_v2', JSON.stringify({ completedQuizzes: ['v2-quiz'] }));
    setItem.mockClear();

    fresh();
    expect(progressWrites()).toEqual([]);
    expect(localStorage.getItem('user_progress_v2')).not.toBeNull();

    localStorage.setItem('cookiePreferences', JSON.stringify(YES));
    const progress = fresh();
    expect(localStorage.getItem('user_progress_v2')).toBeNull();
    expect(progress.getCurrentProgress().completedQuizzes).toEqual(['v2-quiz']);
  });

  it('applies an import in memory but saves it only with consent', () => {
    const progress = fresh();
    const file = {
      totalPoints: 0,
      quizCount: 1,
      unlockedAchievements: [],
      completedQuizzes: ['imported'],
      completedCheckpoints: {},
      completedLearningPaths: [],
      version: 1,
    };

    progress.importSlice(file);
    expect(progressWrites()).toEqual([]);
    expect(progress.getCurrentProgress().completedQuizzes).toEqual(['imported']);

    TestBed.inject(PrivacyConsentService).setCookiePreferences(YES);
    progress.importSlice(file);
    expect(JSON.parse(localStorage.getItem(KEY)!).completedQuizzes).toEqual(['imported']);
  });

  it('resets without writing an empty record', () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(YES));
    const progress = fresh();
    progress.addCompletedQuiz('quiz-a');
    setItem.mockClear();

    progress.resetProgress();

    expect(progressWrites()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(progress.getCurrentProgress().completedQuizzes).toEqual([]);
  });
});
