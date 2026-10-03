/**
 * Learning Path Service
 * Manages learning path definitions and computes progress from UserProgressService.
 *
 * V2 Curriculum: 18 paths across 4 sectors (Foundation, Academy, Workshop, Society)
 * Source of truth: src/assets/data/core/learning-paths.json — a later change moved the
 * definitions from a TS inline array to a JSON data file so build-time scripts
 * (prerender, sitemap, drift-validator) can read the same source. Definitions
 * remain bundled via `resolveJsonModule` so the runtime API stays synchronous.
 */
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { UserProgressService } from './user-progress.service';
import { UserProgress } from '../models/user-progress.model';
import { TimeGateService } from './time-gate.service';
import { LearningPathDefinition, LearningPathProgress, StepStatus, StepPart } from '../models/learning-path.model';
import LEARNING_PATHS_RAW from '../../assets/data/core/learning-paths.json';

/** All learning path definitions — V2 Curriculum (18 paths). Loaded from JSON. */
const LEARNING_PATHS: LearningPathDefinition[] = LEARNING_PATHS_RAW as LearningPathDefinition[];

@Injectable({
  providedIn: 'root',
})
export class LearningPathService {
  private userProgressService = inject(UserProgressService);
  private timeGateService = inject(TimeGateService);

  private pathsSubject = new BehaviorSubject<LearningPathDefinition[]>(
    [...LEARNING_PATHS].sort((a, b) => a.order - b.order),
  );
  public paths$ = this.pathsSubject.asObservable();

  getPath(id: string): LearningPathDefinition | undefined {
    return this.pathsSubject.value.find((p) => p.id === id);
  }

  /** Find which learning path contains a given article/step ID, if any. */
  getPathForArticle(articleId: string): string | null {
    for (const path of this.pathsSubject.value) {
      if (path.steps.some((step) => step.id === articleId)) {
        return path.id;
      }
    }
    return null;
  }

  /** Check if a path's publishDate has been reached (server-authoritative). */
  isPathPublished(path: LearningPathDefinition): boolean {
    return this.timeGateService.isPublished(path.publishDate);
  }

  getPathProgress$(pathId: string): Observable<LearningPathProgress | null> {
    return combineLatest([this.paths$, this.userProgressService.progress$]).pipe(
      map(([paths, progress]) => {
        const path = paths.find((p) => p.id === pathId);
        if (!path) return null;
        return this.computeProgress(path, progress);
      }),
    );
  }

  getAllPathsProgress$(): Observable<LearningPathProgress[]> {
    return combineLatest([this.paths$, this.userProgressService.progress$]).pipe(
      map(([paths, progress]) => paths.map((path) => this.computeProgress(path, progress))),
    );
  }

  addCompletedLearningPath(pathId: string): void {
    this.userProgressService.addCompletedLearningPath(pathId);
  }

  private computeProgress(path: LearningPathDefinition, progress: UserProgress): LearningPathProgress {
    const stepStatuses: StepStatus[] = path.steps.map((step) => {
      const totalParts = step.parts.length;
      let completedParts = 0;
      for (const part of step.parts) {
        if (this.isPartCompleted(part, progress)) {
          completedParts++;
        }
      }
      return {
        stepId: step.id,
        completedParts,
        totalParts,
        completed: completedParts >= totalParts && totalParts > 0,
      };
    });

    const requiredSteps = path.steps.filter((s) => s.required);
    let totalRequiredParts = 0;
    let completedRequiredParts = 0;
    for (const step of requiredSteps) {
      const status = stepStatuses.find((ss) => ss.stepId === step.id)!;
      totalRequiredParts += status.totalParts;
      completedRequiredParts += status.completedParts;
    }

    const percentage = totalRequiredParts > 0 ? Math.round((completedRequiredParts / totalRequiredParts) * 100) : 0;

    const totalParts = stepStatuses.reduce((sum, s) => sum + s.totalParts, 0);

    return {
      pathId: path.id,
      completedParts: completedRequiredParts,
      totalRequiredParts,
      totalParts,
      percentage,
      isCompleted: completedRequiredParts >= totalRequiredParts && totalRequiredParts > 0,
      stepStatuses,
    };
  }

  private isPartCompleted(part: StepPart, progress: UserProgress): boolean {
    switch (part.type) {
      case 'checkpoint':
        if (!part.checkpointStorageKey || !part.checkpointId) return false;
        return (progress.completedCheckpoints?.[part.checkpointStorageKey] || []).includes(part.checkpointId);
      case 'quiz':
        return part.quizId ? progress.completedQuizzes.includes(part.quizId) : false;
      default:
        return false;
    }
  }
}
