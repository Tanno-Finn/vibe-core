/**
 * LearningProgressService — the read model behind the /progress page.
 *
 * The kit already records progress: `app-quiz-container` stores a completed
 * quiz id and `app-checkpoint` a completed checkpoint, both through
 * `UserProgressService`, which persists to localStorage once the visitor has
 * agreed to progress storage (in memory for the session before). Nothing read that back
 * as an overview. This service does exactly that and nothing else — it never
 * writes.
 *
 * There is no backend. `load()` fetches the two content indexes the app already
 * uses, waits the way a progress endpoint would wait, and folds the stored
 * progress over them. What finishes a topic is the `milestones` field of its
 * index entry (see milestones.types.ts), so the facts leave with the content. Swapping in a real endpoint later means replacing `load()`;
 * the page holds no assumption beyond "this emits a report or errors".
 *
 * Shaped in specs/2026-08-24-progress-page/shape.md.
 */
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, combineLatest, delay, map } from 'rxjs';

import { ArticlesService } from './articles.service';
import { DemosService } from './demos.service';
import { Milestone, Milestones } from './milestones.types';
import { UserProgressService } from './user-progress.service';
import { UserProgress } from '../models/user-progress.model';
import { SITE_CONFIG } from '../../config/site';

/** Where a topic stands. The three values double as i18n key suffixes. */
export type TopicStatus = 'notStarted' | 'inProgress' | 'done';

/** Which kind of content a topic is. Also i18n key suffixes. */
export type TopicKind = 'article' | 'demo';

export type { Milestone } from './milestones.types';

/** At least one milestone, always — `entry()` drops content that declares none. */
type NonEmptyMilestones = readonly [Milestone, ...Milestone[]];

/** One row of the page. */
export interface TopicProgress {
  readonly id: string;
  readonly kind: TopicKind;
  /** Absolute router path, e.g. `/articles/seed-article-1`. */
  readonly route: string;
  readonly titleKey: string;
  readonly status: TopicStatus;
  readonly completedSteps: number;
  /** Always >= 1: content without milestones never becomes a row. */
  readonly totalSteps: number;
}

/** The compact overall picture above the list. */
export interface ProgressSummary {
  readonly topicCount: number;
  readonly done: number;
  readonly inProgress: number;
  readonly notStarted: number;
  readonly completedSteps: number;
  readonly totalSteps: number;
  /** Share of all steps finished, 0–100, rounded. */
  readonly percentComplete: number;
}

/**
 * Whether the progress behind a report is kept beyond this visit:
 *  - `saved`     — the visitor agreed; progress is stored in this browser.
 *  - `declined`  — the visitor said no (cookie banner, cookie settings or
 *                  Settings); nothing is stored, the numbers cover this visit only.
 *  - `undecided` — no decision yet; the same, until the visitor decides.
 */
export type ProgressStorage = 'saved' | 'declined' | 'undecided';

export interface LearningProgressReport {
  readonly topics: readonly TopicProgress[];
  readonly summary: ProgressSummary;
  /**
   * Without consent the numbers count this visit only and start from zero on
   * the next one, not because nothing was done. A page that showed them
   * without saying so would be reporting a falsehood, so the storage state
   * travels with the report.
   */
  readonly progressStorage: ProgressStorage;
}

/**
 * How long a load pretends to take, in milliseconds. Injectable so tests can set
 * it to 0 instead of sleeping — see learning-progress.service.spec.ts. Same shape
 * as FEEDBACK_SUBMIT_LATENCY_MS.
 */
export const PROGRESS_LOAD_LATENCY_MS = new InjectionToken<number>('PROGRESS_LOAD_LATENCY_MS', {
  providedIn: 'root',
  factory: () => 700,
});

function isNonEmpty(milestones: Milestones | undefined): milestones is NonEmptyMilestones {
  return Array.isArray(milestones) && milestones.length > 0;
}

/** What `load()` carries between the two halves of its pipeline. */
interface CatalogueEntry {
  readonly id: string;
  readonly kind: TopicKind;
  readonly route: string;
  readonly titleKey: string;
  readonly milestones: NonEmptyMilestones;
}

@Injectable({ providedIn: 'root' })
export class LearningProgressService {
  private readonly articles = inject(ArticlesService);
  private readonly demos = inject(DemosService);
  private readonly userProgress = inject(UserProgressService);
  private readonly latencyMs = inject(PROGRESS_LOAD_LATENCY_MS);
  /** With the demos feature switched off (site.json) demos are neither listed nor counted. */
  private readonly demosOn = inject(SITE_CONFIG).isFeatureOn('demos');

  /**
   * Read the whole picture once.
   *
   * Errors are not caught here: a failed index fetch is the page's error state,
   * and both content services drop their cache before rethrowing, so
   * re-subscribing really does re-fetch rather than replaying the stored failure.
   */
  load(): Observable<LearningProgressReport> {
    const catalogue$ = combineLatest([this.articles.getAll(), this.demos.getAllDemos()]).pipe(
      map(([articles, demos]) => [
        ...articles
          .filter((article) => this.articles.isVisible(article))
          .map((article) => this.entry(article.id, 'article', article.path, article.titleKey, article.milestones)),
        ...demos
          .filter((demo) => this.demosOn && this.demos.isVisible(demo))
          .map((demo) => this.entry(demo.id, 'demo', demo.path, demo.titleKey, demo.milestones)),
      ]),
      map((entries) => entries.filter((entry): entry is CatalogueEntry => entry !== null)),
    );

    // The stored progress is read once the indexes are in, so the report is a
    // snapshot of one moment rather than two.
    return this.withLatency(catalogue$).pipe(
      map((entries) => this.report(entries, this.userProgress.getCurrentProgress())),
    );
  }

  // ── internals ──────────────────────────────────────────────────────────────

  /**
   * Null for content whose index entry declares no milestones — a fork that adds
   * an article without them gets it left out rather than shown as permanently
   * unstarted. The spec test over the shipped indexes is what stops that
   * happening quietly.
   */
  private entry(
    id: string,
    kind: TopicKind,
    path: string,
    titleKey: string,
    milestones: Milestones | undefined,
  ): CatalogueEntry | null {
    if (!isNonEmpty(milestones)) return null;
    return { id, kind, route: `/${path}`, titleKey, milestones };
  }

  private withLatency<T>(source: Observable<T>): Observable<T> {
    return this.latencyMs > 0 ? source.pipe(delay(this.latencyMs)) : source;
  }

  private report(entries: readonly CatalogueEntry[], progress: UserProgress): LearningProgressReport {
    const topics = entries.map((entry) => this.topic(entry, progress));

    let done = 0;
    let inProgress = 0;
    let notStarted = 0;
    let completedSteps = 0;
    let totalSteps = 0;

    for (const topic of topics) {
      if (topic.status === 'done') done++;
      else if (topic.status === 'inProgress') inProgress++;
      else notStarted++;
      completedSteps += topic.completedSteps;
      totalSteps += topic.totalSteps;
    }

    return {
      topics,
      progressStorage: this.userProgress.isSaving()
        ? 'saved'
        : this.userProgress.isTrackingDisabled()
          ? 'declined'
          : 'undecided',
      summary: {
        topicCount: topics.length,
        done,
        inProgress,
        notStarted,
        completedSteps,
        totalSteps,
        // Zero only when there is no content at all — the page's empty state.
        percentComplete: totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100),
      },
    };
  }

  private topic(entry: CatalogueEntry, progress: UserProgress): TopicProgress {
    const totalSteps = entry.milestones.length;
    const completedSteps = entry.milestones.filter((m) => this.isReached(m, progress)).length;

    return {
      id: entry.id,
      kind: entry.kind,
      route: entry.route,
      titleKey: entry.titleKey,
      status: completedSteps === 0 ? 'notStarted' : completedSteps >= totalSteps ? 'done' : 'inProgress',
      completedSteps,
      totalSteps,
    };
  }

  private isReached(milestone: Milestone, progress: UserProgress): boolean {
    if (milestone.type === 'quiz') {
      return progress.completedQuizzes.includes(milestone.quizId);
    }
    const reached = progress.completedCheckpoints?.[milestone.storageKey] ?? [];
    return reached.includes(milestone.checkpointId);
  }
}
