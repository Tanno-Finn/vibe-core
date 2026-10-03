/**
 * LocalDataResetService spec — "Delete all my data" has to mean all of it.
 * The old reset removed progress, two consent keys and one legacy flag, and
 * left the feedback inbox (name, e-mail, message), the font, the playground,
 * the version marker and the debug map behind.
 */
import { TestBed } from '@angular/core/testing';

import { LocalDataResetService } from './local-data-reset.service';
import { UserProgressService } from './user-progress.service';
import { FEEDBACK_SUBMIT_LATENCY_MS, FeedbackInboxService } from './feedback-inbox.service';
import { STORAGE_KEYS } from '../utils/storage-keys';

describe('LocalDataResetService', () => {
  let reset: LocalDataResetService;
  let progress: UserProgressService;
  let inbox: FeedbackInboxService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [{ provide: FEEDBACK_SUBMIT_LATENCY_MS, useValue: 0 }] });
    reset = TestBed.inject(LocalDataResetService);
    progress = TestBed.inject(UserProgressService);
    inbox = TestBed.inject(FeedbackInboxService);
  });

  it('removes every registered key, including those the old reset missed', () => {
    for (const { name: key } of STORAGE_KEYS) localStorage.setItem(key, `seed:${key}`);

    reset.resetAll();

    for (const { name: key } of STORAGE_KEYS) {
      expect(localStorage.getItem(key), key).toBeNull();
    }
  });

  it('empties the feedback inbox in memory and in storage', async () => {
    await inbox.submit({
      name: 'Test Person',
      email: 'test@example.org',
      category: 'general',
      message: 'A synthetic message that is long enough to pass.',
      consent: true,
    });
    expect(inbox.entryCount()).toBe(1);
    expect(localStorage.getItem('vibecore.feedback.inbox.v1')).not.toBeNull();

    reset.resetAll();

    expect(inbox.entryCount()).toBe(0);
    expect(localStorage.getItem('vibecore.feedback.inbox.v1')).toBeNull();
  });

  it('resets in-memory progress and does not leave a fresh progress record behind', () => {
    progress.setCheckpointCompleted('some-guide', 'step-1');
    expect(progress.getCheckpoints('some-guide')).toEqual(['step-1']);

    reset.resetAll();

    expect(progress.getCheckpoints('some-guide')).toEqual([]);
    expect(localStorage.getItem('user_progress')).toBeNull();
  });

  it('removes legacy per-guide checkpoint keys but not keys the kit does not own', () => {
    localStorage.setItem('prompting-guide-checkpoints', '["a"]');
    localStorage.setItem('someone-elses-key', 'x');

    reset.resetAll();

    expect(localStorage.getItem('prompting-guide-checkpoints')).toBeNull();
    expect(localStorage.getItem('someone-elses-key')).toBe('x');
  });
});
