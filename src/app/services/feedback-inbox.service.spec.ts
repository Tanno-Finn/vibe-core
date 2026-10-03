import { TestBed } from '@angular/core/testing';
import {
  FEEDBACK_MESSAGE_MAX_LENGTH,
  FEEDBACK_MESSAGE_MIN_LENGTH,
  FEEDBACK_NAME_MAX_LENGTH,
  FEEDBACK_SUBMIT_LATENCY_MS,
  FeedbackDraft,
  FeedbackInboxService,
  FeedbackSubmitError,
} from './feedback-inbox.service';

const STORAGE_KEY = 'vibecore.feedback.inbox.v1';

/** A draft that passes every rule; each test breaks exactly one thing. */
function validDraft(overrides: Partial<FeedbackDraft> = {}): FeedbackDraft {
  return {
    name: 'Alex Beispiel',
    email: 'alex@example.org',
    category: 'feature',
    message: 'The glossary would be easier to scan with a letter index on the left.',
    consent: true,
    ...overrides,
  };
}

describe('FeedbackInboxService', () => {
  let service: FeedbackInboxService;

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({
      // No sleeping in tests — the latency is the page's affordance, not the store's contract.
      providers: [{ provide: FEEDBACK_SUBMIT_LATENCY_MS, useValue: 0 }],
    });
    service = TestBed.inject(FeedbackInboxService);
  });

  afterEach(() => localStorage.removeItem(STORAGE_KEY));

  describe('validate', () => {
    it('accepts a complete draft', () => {
      expect(service.validate(validDraft())).toEqual([]);
    });

    it('accepts an empty name and an empty e-mail — both are optional', () => {
      expect(service.validate(validDraft({ name: '', email: '' }))).toEqual([]);
    });

    it('rejects an e-mail that was filled in but is not an address', () => {
      expect(service.validate(validDraft({ email: 'alex@example' }))).toEqual(['emailInvalid']);
    });

    it('rejects a message under the minimum length, counting trimmed characters', () => {
      const padded = ` ${'x'.repeat(FEEDBACK_MESSAGE_MIN_LENGTH - 1)}   `;
      expect(service.validate(validDraft({ message: padded }))).toEqual(['messageTooShort']);
    });

    it('accepts a message of exactly the minimum length', () => {
      const exact = 'x'.repeat(FEEDBACK_MESSAGE_MIN_LENGTH);
      expect(service.validate(validDraft({ message: exact }))).toEqual([]);
    });

    it('rejects a message over the maximum length', () => {
      const tooLong = 'x'.repeat(FEEDBACK_MESSAGE_MAX_LENGTH + 1);
      expect(service.validate(validDraft({ message: tooLong }))).toEqual(['messageTooLong']);
    });

    it('rejects an unticked consent box', () => {
      expect(service.validate(validDraft({ consent: false }))).toEqual(['consentRequired']);
    });

    it('reports every failing rule at once, not just the first', () => {
      const errors = service.validate(validDraft({ email: 'nope', message: 'short', consent: false }));
      expect(errors).toContain('emailInvalid');
      expect(errors).toContain('messageTooShort');
      expect(errors).toContain('consentRequired');
    });
  });

  describe('submit', () => {
    it('stores the trimmed entry and exposes it through entries()', async () => {
      const entry = await service.submit(validDraft({ name: '  Alex  ' }));

      expect(entry.name).toBe('Alex');
      expect(entry.category).toBe('feature');
      expect(entry.submittedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(service.entries().length).toBe(1);
      expect(service.entries()[0].id).toBe(entry.id);
    });

    it('survives a reload — a fresh instance starts empty, then reads the entry back', async () => {
      await service.submit(validDraft());

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: FEEDBACK_SUBMIT_LATENCY_MS, useValue: 0 }],
      });
      const reloaded = TestBed.inject(FeedbackInboxService);

      // Empty until asked: the page is prerendered, so the first client render
      // has to match server markup before storage may speak.
      expect(reloaded.entries()).toEqual([]);

      reloaded.loadStored();
      expect(reloaded.entries().length).toBe(1);
    });

    it('puts the newest message first', async () => {
      await service.submit(validDraft({ message: 'First message, long enough to pass the rule.' }));
      await service.submit(validDraft({ message: 'Second message, long enough to pass the rule.' }));

      expect(service.entries()[0].message).toContain('Second');
    });

    it('truncates an over-long name instead of storing it whole', async () => {
      const entry = await service.submit(validDraft({ name: 'N'.repeat(200) }));
      expect(entry.name.length).toBe(FEEDBACK_NAME_MAX_LENGTH);
    });

    it('keeps at most 50 entries, dropping the oldest (PRIV-002)', async () => {
      // Seed a full store directly — 50 real submits would only test setTimeout.
      const seeded = Array.from({ length: 50 }, (_, i) => ({
        id: `seed-${i}`,
        name: '',
        email: '',
        category: 'general' as const,
        message: `seeded message number ${i}`,
        submittedAt: '2026-08-01T10:00:00.000Z',
        language: 'en',
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      service.loadStored();
      expect(service.entryCount()).toBe(50);

      await service.submit(validDraft({ message: 'the fifty-first message, long enough to pass.' }));

      expect(service.entryCount()).toBe(50);
      expect(service.entries()[0].message).toContain('fifty-first');
      expect(service.entries().some((e) => e.id === 'seed-49')).toBe(false);
    });

    it('stamps the language the page was in', async () => {
      service.useLanguage('de-easy');
      const entry = await service.submit(validDraft());
      expect(entry.language).toBe('de-easy');
    });

    it('rejects an invalid draft with the failing rules and writes nothing', async () => {
      await expect(service.submit(validDraft({ consent: false }))).rejects.toMatchObject({
        reason: 'validation',
        fieldErrors: ['consentRequired'],
      });
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('rejects with reason "storage" when the write genuinely fails', async () => {
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      let caught: FeedbackSubmitError | null = null;
      try {
        await service.submit(validDraft());
      } catch (err) {
        caught = err as FeedbackSubmitError;
      }
      setItem.mockRestore();

      expect(caught?.reason).toBe('storage');
      expect(service.entries().length).toBe(0);
    });
  });

  describe('loadStored', () => {
    it('drops entries that no longer match the shape', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          { id: 'ok', message: 'a real one', submittedAt: '2026-08-20T10:00:00.000Z', category: 'bug' },
          { id: 'broken', message: 'no category' },
          'not an object',
        ]),
      );

      service.loadStored();
      expect(service.entries().length).toBe(1);
      expect(service.entries()[0].id).toBe('ok');
    });

    it('treats unparseable storage as an empty inbox instead of throwing', () => {
      localStorage.setItem(STORAGE_KEY, '{not json');
      expect(() => service.loadStored()).not.toThrow();
      expect(service.entries()).toEqual([]);
    });
  });

  describe('clear', () => {
    it('removes every stored message (PRIV-005)', async () => {
      await service.submit(validDraft());
      expect(service.entryCount()).toBe(1);

      expect(service.clear()).toBe(true);
      expect(service.entryCount()).toBe(0);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });
});
