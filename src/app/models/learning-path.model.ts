/**
 * Learning Path data models
 * Defines the structure for learning path definitions and runtime state
 */

export type LearningPathDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LearningPathStepType = 'demo' | 'article';
export type LearningPathSector = 'foundation' | 'workshop' | 'academy' | 'society' | 'misc';

/** A single completable part within a step */
export interface StepPart {
  type: 'checkpoint' | 'quiz';
  /** For checkpoint: the storageKey used in UserProgressService.completedCheckpoints */
  checkpointStorageKey?: string;
  /** For checkpoint: the checkpointId within that storageKey */
  checkpointId?: string;
  /** For quiz: the quizId in completedQuizzes */
  quizId?: string;
}

export interface LearningPathStep {
  type: LearningPathStepType;
  id: string;
  route: string;
  titleKey: string;
  descriptionKey?: string;
  required: boolean;
  /** The individual parts that make up 100% of this step */
  parts: StepPart[];
}

export interface LearningPathDefinition {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  difficulty: LearningPathDifficulty;
  sector: LearningPathSector;
  color: string;
  order: number;
  steps: LearningPathStep[];
  achievementId?: string;
  learningPromiseKey?: string;
  targetAudienceKey?: string;
  durationKey?: string;
  prerequisitesKey?: string;
  /** IDs of prerequisite learning paths (for clickable links) */
  prerequisitePathIds?: string[];
  /** ISO date string (e.g. '2026-04-13') — path is hidden until this date */
  publishDate?: string;
}

export interface LearningPathProgress {
  pathId: string;
  completedParts: number;
  totalRequiredParts: number;
  totalParts: number;
  percentage: number;
  isCompleted: boolean;
  stepStatuses: StepStatus[];
}

export interface StepStatus {
  stepId: string;
  completedParts: number;
  totalParts: number;
  completed: boolean;
}
