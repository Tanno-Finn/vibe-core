/**
 * ProgressComponent spec — the /progress page's contract: all four branches have
 * to be reachable and to say what they are, the retry has to ask the service
 * again, and no state swap the visitor asked for may drop focus on <body>.
 *
 * The page is rendered against a stubbed LearningProgressService whose answers
 * are queued per call — that is what makes "fails, then works on retry" a test
 * rather than a hope. The read model itself is pinned in
 * learning-progress.service.spec.ts; nothing here re-asserts its arithmetic.
 *
 * TranslationService is stubbed to return the key, so no assertion depends on
 * translated copy.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideOfflineHttp } from '../../testing/offline-http';
import { NEVER, Observable, Subject, of, throwError } from 'rxjs';

import { TranslationService } from '../../services/translation.service';
import { ProgressComponent } from './progress.component';
import {
  LearningProgressReport,
  LearningProgressService,
  ProgressStorage,
  TopicProgress,
} from '../../services/learning-progress.service';

/** Returns the key itself, so an expectation never reads a translated string. */
class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage$ = () => 'en';
  get currentLanguage(): string {
    return 'en';
  }
  get currentIntlLocale(): string {
    return 'en';
  }
  translate(key: string): string {
    return key;
  }
}

/**
 * One queued answer per `load()` call. A call past the end of the queue gets an
 * observable that never emits — which is exactly the loading state.
 */
class LearningProgressServiceStub {
  /** `'hold'` returns an observable this test controls through `gate` — that is
   *  the only way to inspect the page mid-load. */
  outcomes: (LearningProgressReport | Error | 'hold')[] = [];
  calls = 0;
  gate: Subject<LearningProgressReport> | null = null;

  load(): Observable<LearningProgressReport> {
    const outcome = this.outcomes[this.calls++];
    if (outcome === undefined) return NEVER;
    if (outcome === 'hold') {
      this.gate = new Subject<LearningProgressReport>();
      return this.gate.asObservable();
    }
    return outcome instanceof Error ? throwError(() => outcome) : of(outcome);
  }
}

function topic(id: string, status: TopicProgress['status'], completedSteps: number): TopicProgress {
  return {
    id,
    kind: 'article',
    route: `/articles/${id}`,
    titleKey: `${id}.title`,
    status,
    completedSteps,
    totalSteps: 2,
  };
}

function report(topics: TopicProgress[], progressStorage: ProgressStorage = 'saved'): LearningProgressReport {
  const completedSteps = topics.reduce((sum, t) => sum + t.completedSteps, 0);
  const totalSteps = topics.reduce((sum, t) => sum + t.totalSteps, 0);
  return {
    topics,
    progressStorage,
    summary: {
      topicCount: topics.length,
      done: topics.filter((t) => t.status === 'done').length,
      inProgress: topics.filter((t) => t.status === 'inProgress').length,
      notStarted: topics.filter((t) => t.status === 'notStarted').length,
      completedSteps,
      totalSteps,
      percentComplete: totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100),
    },
  };
}

const FULL_REPORT = report([
  topic('art-git-intro', 'done', 2),
  topic('art-vibecoding', 'inProgress', 1),
  topic('seed-article-1', 'notStarted', 0),
]);

/**
 * The page frame (app-article) mounts the cursor-glow directive, which reads
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

describe('ProgressComponent', () => {
  let fixture: ComponentFixture<ProgressComponent>;
  let component: ProgressComponent;
  let progress: LearningProgressServiceStub;
  let el: HTMLElement;

  beforeEach(() => {
    stubMatchMedia();
    progress = new LearningProgressServiceStub();

    TestBed.configureTestingModule({
      imports: [ProgressComponent],
      providers: [
        provideRouter([]),
        // Offline HttpClient: the glossary highlighting load stays pending instead of
        // failing against jsdom and logging after teardown.
        provideOfflineHttp(),
        // app-standard-container animates its expand/collapse; without an
        // animation provider its synthetic property throws NG05105.
        { provide: TranslationService, useClass: TranslationServiceStub },
        { provide: LearningProgressService, useValue: progress },
      ],
    });
  });

  /**
   * Mount and let the deferred load run. The page starts loading from
   * afterNextRender — TestBed.tick() is what flushes those hooks, and without it
   * the page would sit in its prerender state forever.
   */
  function render(): void {
    fixture = TestBed.createComponent(ProgressComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
  }

  /** The one polite region; its text is the whole announcement. */
  function announcement(): string {
    return (el.querySelector('[role="status"]') as HTMLElement).textContent?.trim() ?? '';
  }

  describe('while the answer is outstanding', () => {
    it('shows the placeholder shape and says that something is loading', () => {
      render();

      expect(component.state()).toBe('loading');
      expect(el.querySelector('.lp-skeleton')).not.toBeNull();
      expect(el.querySelector('.lp-table')).toBeNull();
      expect(announcement()).toBe('common.loading');
    });

    it('marks the region busy so a screen reader knows it is mid-update', () => {
      render();

      expect(el.querySelector('[role="status"]')!.getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('when the report arrives', () => {
    beforeEach(() => {
      progress.outcomes = [FULL_REPORT];
      render();
    });

    it('renders one row per topic and drops the placeholders', () => {
      expect(component.state()).toBe('ready');
      expect(el.querySelectorAll('.lp-table tbody tr').length).toBe(3);
      expect(el.querySelector('.lp-skeleton')).toBeNull();
    });

    it('names every status in words, not by color alone (A11Y-006)', () => {
      const tags = Array.from(el.querySelectorAll('.lp-table tbody .p-tag')).map((t) => t.textContent?.trim());

      expect(tags).toEqual(['progress.status.done', 'progress.status.inProgress', 'progress.status.notStarted']);
    });

    it('shows the steps each topic has behind it, without repeating the column name', () => {
      const cells = Array.from(el.querySelectorAll('.lp-table tbody .lp-table__num')).map((c) =>
        c.textContent?.replace(/\s+/g, ' ').trim(),
      );

      expect(cells).toEqual(['2 / 2', '1 / 2', '0 / 2']);
    });

    it('says where the numbers live and offers the way to delete them (PRIV-004, PRIV-005)', () => {
      const note = el.querySelector('.lp-note') as HTMLElement;

      expect(note.textContent).toContain('progress.storageNote');
      expect(note.querySelector('a')!.getAttribute('href')).toBe('/user-settings');
      expect(el.querySelector('.lp-note--flag')).toBeNull();
    });

    it('links each row to the topic it is about', () => {
      const first = el.querySelector('.lp-table tbody a') as HTMLAnchorElement;

      expect(first.getAttribute('href')).toBe('/articles/art-git-intro');
    });

    it('summarizes the whole thing above the list', () => {
      expect(el.querySelectorAll('.lp-summary app-stat-card').length).toBe(4);
      expect(component.summary().percentComplete).toBe(50);
      expect(component.stepsLabel()).toBe('3 / 6');
    });

    it('stops saying "busy" and announces that the content landed', () => {
      expect(el.querySelector('[role="status"]')!.getAttribute('aria-busy')).toBeNull();
      expect(announcement()).toBe('common.loadingDone');
    });
  });

  describe('when the kit ships no content', () => {
    beforeEach(() => {
      progress.outcomes = [report([])];
      render();
    });

    it('says so rather than showing an empty table', () => {
      expect(component.state()).toBe('empty');
      expect(el.querySelector('.lp-table')).toBeNull();
      expect(el.textContent).toContain('progress.emptyTitle');
    });

    it('announces the empty result rather than claiming content loaded', () => {
      expect(announcement()).toBe('progress.emptyTitle');
    });
  });

  describe('when the progress is not saved', () => {
    // Without consent the numbers count this visit only. Without a note the
    // page would imply they are kept, which is a falsehood.
    it('says so after a "no", and where to allow saving', () => {
      progress.outcomes = [report([topic('art-git-intro', 'inProgress', 1)], 'declined')];
      render();

      expect(component.progressStorage()).toBe('declined');
      const flags = el.querySelectorAll('.lp-note--flag');
      expect(flags.length).toBe(1);
      expect(flags[0].textContent).toContain('progress.trackingOffNote');
    });

    it('says so to a visitor who has not decided yet, in its own words', () => {
      progress.outcomes = [report([topic('art-git-intro', 'inProgress', 1)], 'undecided')];
      render();

      const flags = el.querySelectorAll('.lp-note--flag');
      expect(flags.length).toBe(1);
      expect(flags[0].textContent).toContain('progress.trackingUndecidedNote');
    });
  });

  describe('when the load fails', () => {
    beforeEach(() => {
      progress.outcomes = [new Error('offline')];
      render();
    });

    it('renders the failure and a way out instead of an empty page', () => {
      expect(component.state()).toBe('error');
      expect(el.textContent).toContain('common.loadError');
      expect(el.querySelector('button')).not.toBeNull();
      expect(el.querySelector('.lp-table')).toBeNull();
    });

    it('announces the failure as text', () => {
      expect(announcement()).toBe('common.loadError');
    });

    it('asks the service again when the visitor retries, and shows what comes back', () => {
      progress.outcomes.push(FULL_REPORT);

      (el.querySelector('button') as HTMLButtonElement).click();
      fixture.detectChanges();

      expect(progress.calls).toBe(2);
      expect(component.state()).toBe('ready');
      expect(el.querySelectorAll('.lp-table tbody tr').length).toBe(3);
    });
  });

  describe('focus after a state swap', () => {
    // Every swap below destroys the element the visitor was standing on. If focus
    // is not handed on it falls to <body>, and a keyboard user loses their place.

    it('does not steal focus on the first load — nobody asked for it', () => {
      progress.outcomes = [FULL_REPORT];
      render();

      expect(document.activeElement).toBe(document.body);
    });

    it('lands on the topic heading when a retry succeeds', () => {
      progress.outcomes = [new Error('offline'), FULL_REPORT];
      render();

      (el.querySelector('button') as HTMLButtonElement).click();

      expect(document.activeElement).toBe(el.querySelector('.lp-topics__title'));
    });

    it('never lets go of the retry button while the reload is in flight', () => {
      progress.outcomes = [new Error('offline'), 'hold'];
      render();
      const button = el.querySelector('.lp-notice button') as HTMLButtonElement;
      button.focus();

      button.click();
      fixture.detectChanges();

      // The error branch deliberately survives the reload: tearing it down would
      // drop the visitor on <body> for the length of the wait.
      expect(component.state()).toBe('error');
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(document.activeElement).toBe(button);

      progress.gate!.next(FULL_REPORT);
      progress.gate!.complete();
      fixture.detectChanges();

      expect(component.state()).toBe('ready');
      expect(document.activeElement).toBe(el.querySelector('.lp-topics__title'));
    });

    it('leaves focus where it is when the retry fails too', () => {
      progress.outcomes = [new Error('offline'), new Error('still offline')];
      render();
      const button = el.querySelector('.lp-notice button') as HTMLButtonElement;
      button.focus();

      button.click();
      fixture.detectChanges();

      expect(component.state()).toBe('error');
      expect(document.activeElement).toBe(button);
    });

    it('ignores a second press while the first reload is still running', () => {
      progress.outcomes = [new Error('offline'), 'hold'];
      render();
      const button = el.querySelector('.lp-notice button') as HTMLButtonElement;

      button.click();
      button.click();

      expect(progress.calls).toBe(2);
    });

    it('lands on the empty note when a retry finds nothing to show', () => {
      progress.outcomes = [new Error('offline'), report([])];
      render();

      (el.querySelector('button') as HTMLButtonElement).click();

      expect(document.activeElement).toBe(el.querySelector('.lp-notice__title'));
    });
  });
});
