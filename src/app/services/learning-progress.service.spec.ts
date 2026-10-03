/**
 * LearningProgressService spec — the read model's contract: a topic is only
 * "done" when every milestone it ships is reached, the summary has to add up,
 * and every entry of the shipped content indexes has to say what finishes it.
 *
 * The real UserProgressService is used rather than a stub, so the milestone
 * lookups are checked against the field names that service really writes —
 * a stub would keep passing after a rename. The two content indexes are stubbed,
 * because their job here is to be a list, and one of them has to be able to fail.
 * The stubbed entries are fixtures that carry their own milestones, so no test
 * depends on which sample articles the kit happens to ship.
 */
import { TestBed } from '@angular/core/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

import { ArticleMeta, ArticlesService } from './articles.service';
import { DemoMeta, DemosService } from './demos.service';
import {
  LearningProgressReport,
  LearningProgressService,
  Milestone,
  PROGRESS_LOAD_LATENCY_MS,
} from './learning-progress.service';
import { UserProgressService } from './user-progress.service';
import { PrivacyConsentService } from './privacy-consent.service';
import { KIT_DEFAULT_SITE, SITE_CONFIG, siteRulesFor } from '../../config/site';

import ARTICLE_INDEX from '../../assets/data/core/articles/index.json';
import DEMO_INDEX from '../../assets/data/core/demos/index.json';
import LEARNING_PATHS from '../../assets/data/core/learning-paths.json';

const PROGRESS_STORAGE_KEY = 'user_progress';
const CONSENT_STORAGE_KEY = 'cookiePreferences';

/** Quiz plus one checkpoint — the shape most articles ship. */
const quizAndCheckpoint = (id: string): Milestone[] => [
  { type: 'quiz', quizId: `${id}-quiz` },
  { type: 'checkpoint', storageKey: `${id}-checkpoint`, checkpointId: 'main' },
];

/** Fixture ids and what finishes each. Neutral names: nothing here is kit content. */
const MILESTONES: Record<string, Milestone[]> = {
  'two-step': quizAndCheckpoint('two-step'),
  'other-two-step': quizAndCheckpoint('other-two-step'),
  'three-step': [
    { type: 'quiz', quizId: 'three-step-quiz' },
    { type: 'checkpoint', storageKey: 'three-step-checkpoint-1', checkpointId: 'checks' },
    { type: 'checkpoint', storageKey: 'three-step-checkpoint-2', checkpointId: 'exception' },
  ],
  'one-step': [{ type: 'checkpoint', storageKey: 'one-step-checkpoints', checkpointId: 'structure' }],
  'demo-one-step': [{ type: 'checkpoint', storageKey: 'demo-one-step-checkpoints', checkpointId: 'structure' }],
};

/** An index entry; its milestones come from MILESTONES, and an id not listed there has none. */
function article(id: string, path = `articles/${id}`): ArticleMeta {
  return {
    id,
    path,
    milestones: MILESTONES[id],
    titleKey: `${id}.title`,
    descriptionKey: `${id}.description`,
    category: 'fundamentals',
    estimatedTime: '10min',
    difficulty: 'beginner',
    featured: false,
    pageId: id.slice(0, 4),
  };
}

function demo(id: string, path = 'example-demo'): DemoMeta {
  return {
    id,
    path,
    milestones: MILESTONES[id],
    titleKey: `${id}.title`,
    descriptionKey: `${id}.description`,
    category: 'ml',
    estimatedTime: '10min',
    difficulty: 'beginner',
    featured: false,
    icon: 'pi pi-play',
    pageId: 'sdmo',
  };
}

class ArticlesServiceStub {
  articles: ArticleMeta[] = [];
  /** Set to make getAll() fail the way a blocked or missing index fails. */
  failure: Error | null = null;
  hidden = new Set<string>();

  getAll(): Observable<ArticleMeta[]> {
    return this.failure ? throwError(() => this.failure) : of(this.articles);
  }

  isVisible(meta: ArticleMeta): boolean {
    return !this.hidden.has(meta.id);
  }
}

class DemosServiceStub {
  demos: DemoMeta[] = [];
  hidden = new Set<string>();

  getAllDemos(): Observable<DemoMeta[]> {
    return of(this.demos);
  }

  isVisible(meta: DemoMeta): boolean {
    return !this.hidden.has(meta.id);
  }
}

describe('LearningProgressService', () => {
  let service: LearningProgressService;
  let userProgress: UserProgressService;
  let articles: ArticlesServiceStub;
  let demos: DemosServiceStub;

  beforeEach(() => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    articles = new ArticlesServiceStub();
    demos = new DemosServiceStub();

    TestBed.configureTestingModule({
      providers: [
        // No sleeping in tests — the wait is the page's affordance, not this contract.
        { provide: PROGRESS_LOAD_LATENCY_MS, useValue: 0 },
        { provide: ArticlesService, useValue: articles },
        { provide: DemosService, useValue: demos },
      ],
    });

    service = TestBed.inject(LearningProgressService);
    userProgress = TestBed.inject(UserProgressService);
    userProgress.resetProgress();
  });

  afterEach(() => {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  });

  const load = (): Promise<LearningProgressReport> => firstValueFrom(service.load());

  describe('the shipped indexes say what finishes each topic', () => {
    type IndexEntry = { id: string; milestones?: unknown };
    const shipped = [...(ARTICLE_INDEX as IndexEntry[]), ...(DEMO_INDEX as IndexEntry[])];

    const wellFormed = (m: unknown): boolean => {
      const x = m as Record<string, unknown> | null;
      const filled = (v: unknown) => typeof v === 'string' && v !== '';
      if (x?.['type'] === 'quiz') return filled(x['quizId']);
      if (x?.['type'] === 'checkpoint') return filled(x['storageKey']) && filled(x['checkpointId']);
      return false;
    };

    // This is the drift alarm the data model cannot provide: nothing else fails
    // when an entry is added to an index and nobody says what completes it —
    // the page would just leave that topic out.
    it('gives every entry at least one milestone, so no shipped topic drops off the page', () => {
      expect(shipped.length, 'the content indexes are empty').toBeGreaterThan(0);
      for (const { id, milestones } of shipped) {
        expect(Array.isArray(milestones) && milestones.length > 0, id).toBe(true);
      }
    });

    it('writes every milestone in the shape the service reads', () => {
      for (const { id, milestones } of shipped) {
        for (const m of (milestones as unknown[]) ?? []) {
          expect(wellFormed(m), `${id}: ${JSON.stringify(m)}`).toBe(true);
        }
      }
    });

    // The checks above catch a topic nobody wrote milestones for. This one
    // catches the quieter failure: a checkpoint key renamed in learning-paths.json,
    // which /learn would follow and this page would not — every affected topic
    // silently stuck on "not started". It compares wherever a path step declares
    // parts; a step with empty parts (the seed article) has nothing to compare to.
    it('still agrees with learning-paths.json wherever the two overlap', () => {
      type Part = { type: string; quizId?: string; checkpointStorageKey?: string; checkpointId?: string };
      type Step = { id: string; parts?: Part[] };

      const byId = new Map(shipped.map((entry) => [entry.id, entry.milestones]));
      for (const path of LEARNING_PATHS as { steps: Step[] }[]) {
        for (const step of path.steps) {
          // A renamed or dropped `parts` field would make this comparison vacuous.
          expect(Array.isArray(step.parts), `${step.id}: learning-paths.json stopped declaring parts`).toBe(true);
          if (!step.parts || step.parts.length === 0) continue;

          const declared = step.parts.map((p) =>
            p.type === 'quiz'
              ? { type: 'quiz', quizId: p.quizId }
              : { type: 'checkpoint', storageKey: p.checkpointStorageKey, checkpointId: p.checkpointId },
          );

          expect(byId.get(step.id), step.id).toEqual(declared);
        }
      }
    });
  });

  describe('status per topic', () => {
    beforeEach(() => {
      articles.articles = [article('two-step'), article('one-step')];
    });

    it('reports a topic nobody has touched as not started', async () => {
      const report = await load();

      expect(report.topics.map((t) => t.status)).toEqual(['notStarted', 'notStarted']);
      expect(report.topics[0].completedSteps).toBe(0);
      expect(report.topics[0].totalSteps).toBe(2);
    });

    it('reports a two-step topic with one step reached as in progress', async () => {
      userProgress.addCompletedQuiz('two-step-quiz');

      const report = await load();
      const gitIntro = report.topics.find((t) => t.id === 'two-step')!;

      expect(gitIntro.status).toBe('inProgress');
      expect(gitIntro.completedSteps).toBe(1);
      expect(gitIntro.totalSteps).toBe(2);
    });

    it('reports a topic as done only once every milestone is reached', async () => {
      userProgress.addCompletedQuiz('two-step-quiz');
      userProgress.setCheckpointCompleted('two-step-checkpoint', 'main');

      const report = await load();

      expect(report.topics.find((t) => t.id === 'two-step')!.status).toBe('done');
    });

    it('does not count a checkpoint stored under a different id', async () => {
      userProgress.setCheckpointCompleted('two-step-checkpoint', 'somewhere-else');

      const report = await load();

      expect(report.topics.find((t) => t.id === 'two-step')!.completedSteps).toBe(0);
    });

    it('reports a single-step topic as done as soon as its one checkpoint is ticked', async () => {
      userProgress.setCheckpointCompleted('one-step-checkpoints', 'structure');

      const report = await load();
      const seed = report.topics.find((t) => t.id === 'one-step')!;

      expect(seed.status).toBe('done');
      expect(seed.totalSteps).toBe(1);
    });

    it('carries the route the row links to, absolute and ready for routerLink', async () => {
      const report = await load();

      expect(report.topics.find((t) => t.id === 'two-step')!.route).toBe('/articles/two-step');
    });
  });

  describe('the summary', () => {
    it('counts each status and works out the share of steps finished', async () => {
      articles.articles = [article('two-step'), article('other-two-step'), article('one-step')];
      // done: both steps of two-step. in progress: one of two on other-two-step.
      // untouched: one-step. That is 3 of 5 steps.
      userProgress.addCompletedQuiz('two-step-quiz');
      userProgress.setCheckpointCompleted('two-step-checkpoint', 'main');
      userProgress.addCompletedQuiz('other-two-step-quiz');

      const { summary } = await load();

      expect(summary).toEqual({
        topicCount: 3,
        done: 1,
        inProgress: 1,
        notStarted: 1,
        completedSteps: 3,
        totalSteps: 5,
        percentComplete: 60,
      });
    });

    it('reads zero rather than dividing by nothing when the kit ships no content', async () => {
      const { topics, summary } = await load();

      expect(topics).toEqual([]);
      expect(summary.topicCount).toBe(0);
      expect(summary.percentComplete).toBe(0);
    });
  });

  describe('what makes it onto the page', () => {
    it('lists articles and demos together', async () => {
      articles.articles = [article('two-step')];
      demos.demos = [demo('demo-one-step')];

      const report = await load();

      expect(report.topics.map((t) => [t.id, t.kind])).toEqual([
        ['two-step', 'article'],
        ['demo-one-step', 'demo'],
      ]);
      expect(report.topics[1].route).toBe('/example-demo');
    });

    it('neither lists nor counts demos while site.json switches the demos feature off', async () => {
      articles.articles = [article('two-step')];
      demos.demos = [demo('demo-one-step')];
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: PROGRESS_LOAD_LATENCY_MS, useValue: 0 },
          { provide: ArticlesService, useValue: articles },
          { provide: DemosService, useValue: demos },
          { provide: SITE_CONFIG, useValue: siteRulesFor({ ...KIT_DEFAULT_SITE, features: { demos: false } }) },
        ],
      });

      const report = await firstValueFrom(TestBed.inject(LearningProgressService).load());

      expect(report.topics.map((t) => t.id)).toEqual(['two-step']);
      expect(report.summary.totalSteps).toBe(2);
    });

    it('leaves out content the content service says is not visible yet', async () => {
      articles.articles = [article('two-step'), article('other-two-step')];
      articles.hidden.add('other-two-step');

      const report = await load();

      expect(report.topics.map((t) => t.id)).toEqual(['two-step']);
    });

    it('leaves out content whose index entry declares no milestones, rather than showing it as never started', async () => {
      articles.articles = [article('two-step'), article('no-milestones')];

      const report = await load();

      expect(report.topics.map((t) => t.id)).toEqual(['two-step']);
    });
  });

  describe('whether the progress is saved', () => {
    // Without consent nothing is saved, so the page starts from zero on every
    // visit. The report has to say so, or the page reports a falsehood — and
    // it has to tell "not asked yet" from "said no", because the page says
    // different things to each.
    it('reports undecided, declined, and saved as they are', async () => {
      articles.articles = [article('two-step')];
      const privacy = TestBed.inject(PrivacyConsentService);

      expect((await load()).progressStorage).toBe('undecided');

      privacy.setProgressConsent(false);
      expect((await load()).progressStorage).toBe('declined');

      privacy.setProgressConsent(true);
      expect((await load()).progressStorage).toBe('saved');
    });
  });

  describe('reading what an earlier visit stored under user_progress', () => {
    /** A new session: same storage, freshly constructed services. */
    function reopen(stored: unknown): LearningProgressService {
      TestBed.resetTestingModule();
      localStorage.setItem(PROGRESS_STORAGE_KEY, typeof stored === 'string' ? stored : JSON.stringify(stored));
      TestBed.configureTestingModule({
        providers: [
          { provide: PROGRESS_LOAD_LATENCY_MS, useValue: 0 },
          { provide: ArticlesService, useValue: articles },
          { provide: DemosService, useValue: demos },
        ],
      });
      return TestBed.inject(LearningProgressService);
    }

    beforeEach(() => {
      articles.articles = [article('two-step'), article('three-step'), article('one-step')];
    });

    it('counts quizzes and checkpoints from storage, per topic', async () => {
      const report = await firstValueFrom(
        reopen({
          completedQuizzes: ['two-step-quiz', 'three-step-quiz'],
          completedCheckpoints: {
            'two-step-checkpoint': ['main'],
            'three-step-checkpoint-1': ['checks'],
          },
        }).load(),
      );

      expect(report.topics.map((t) => [t.id, t.status, t.completedSteps, t.totalSteps])).toEqual([
        ['two-step', 'done', 2, 2],
        ['three-step', 'inProgress', 2, 3],
        ['one-step', 'notStarted', 0, 1],
      ]);
      expect(report.summary.percentComplete).toBe(67);
    });

    it('reads a stored record without any checkpoints, as older versions wrote it', async () => {
      const report = await firstValueFrom(reopen({ completedQuizzes: ['two-step-quiz'] }).load());

      expect(report.topics.find((t) => t.id === 'two-step')!.completedSteps).toBe(1);
    });

    it('treats an unreadable record as no progress rather than failing the page', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      const report = await firstValueFrom(reopen('{not json').load());

      expect(report.summary.completedSteps).toBe(0);
      vi.mocked(console.warn).mockRestore();
    });

    it('ignores progress stored for an article without milestones', async () => {
      articles.articles = [article('two-step'), article('unknown')];

      const report = await firstValueFrom(
        reopen({
          completedQuizzes: ['unknown-quiz'],
          completedCheckpoints: { 'unknown-checkpoint': ['main'] },
        }).load(),
      );

      expect(report.topics.map((t) => t.id)).toEqual(['two-step']);
      expect(report.summary.completedSteps).toBe(0);
    });

    // A fresh visitor's progress object used to alias the arrays of
    // DEFAULT_USER_PROGRESS, so the first quiz was pushed into the shared
    // default and reappeared in later records. A reset has to start clean.
    it('starts a reset from clean defaults, not from an earlier visitor’s quizzes', () => {
      TestBed.resetTestingModule();
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
      TestBed.configureTestingModule({});
      const fresh = TestBed.inject(UserProgressService);

      fresh.addCompletedQuiz('two-step-quiz');
      fresh.resetProgress();

      expect(fresh.getCurrentProgress().completedQuizzes).toEqual([]);
      expect(localStorage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    });
  });

  describe('failure', () => {
    it('passes a failed index fetch on to the caller instead of reporting an empty kit', async () => {
      articles.failure = new Error('offline');

      await expect(load()).rejects.toThrow('offline');
    });
  });

  describe('simulated latency', () => {
    it('waits the injected number of milliseconds before emitting', async () => {
      vi.useFakeTimers();
      try {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [
            { provide: PROGRESS_LOAD_LATENCY_MS, useValue: 500 },
            { provide: ArticlesService, useValue: articles },
            { provide: DemosService, useValue: demos },
          ],
        });
        articles.articles = [article('two-step')];

        let emitted = false;
        TestBed.inject(LearningProgressService)
          .load()
          .subscribe(() => (emitted = true));

        vi.advanceTimersByTime(499);
        expect(emitted).toBe(false);

        vi.advanceTimersByTime(1);
        expect(emitted).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
