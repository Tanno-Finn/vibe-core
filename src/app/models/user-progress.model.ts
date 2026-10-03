/**
 * User progress data model.
 * Persistence shape for local learning progress (completed quizzes,
 * checkpoints and learning paths) tracked by UserProgressService.
 *
 * Older records carry more fields — points counters, streaks, visited pages
 * and the metrics of the origin project's demos (ELIZA, Boids, attention
 * heads, evolution …). Nothing in the kit reads or writes them any more, so
 * they were removed from the model; UserProgressService drops them when it
 * loads such a record, and an older export still imports.
 */

export interface UserProgress {
  /**
   * Kept for the export format: `validateSlice` (and so every build that can
   * import a file) checks it. Nothing in the kit awards points today.
   */
  totalPoints: number;
  /** How many distinct quizzes were completed; counted by `addCompletedQuiz`. */
  quizCount: number;
  /** Kept for the export format, like `totalPoints`. Nothing unlocks achievements today. */
  unlockedAchievements: string[];

  // Collections
  completedQuizzes: string[];
  completedLearningPaths: string[]; // Track completed learning paths
  completedCheckpoints: { [storageKey: string]: string[] }; // Checkpoint states per guide/article

  // Version for migration
  version: number;
}

export const DEFAULT_USER_PROGRESS: UserProgress = {
  totalPoints: 0,
  quizCount: 0,
  unlockedAchievements: [],
  completedQuizzes: [],
  completedLearningPaths: [],
  completedCheckpoints: {},
  version: 1,
};
