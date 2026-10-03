/**
 * Milestone types — what "finished" means for one article or demo.
 *
 * Each entry of `assets/data/core/articles/index.json` and
 * `assets/data/core/demos/index.json` carries its own `milestones`, so the
 * facts live with the content: removing an entry removes its milestones with
 * it. LearningProgressService (the /progress page) is the only reader.
 *
 * Both kinds are already written by the kit's own components — a quiz by
 * `app-quiz-container`, a checkpoint by `app-checkpoint` — so nothing here
 * invents a new unit of progress. For most sample articles
 * `learning-paths.json` carries the same facts as step `parts` (under the
 * field names `checkpointStorageKey`/`checkpointId`); a spec holds the two in
 * agreement wherever they overlap.
 */
export type Milestone =
  | { readonly type: 'quiz'; readonly quizId: string }
  | { readonly type: 'checkpoint'; readonly storageKey: string; readonly checkpointId: string };

/**
 * The `milestones` field of an index entry. An entry without one (or with an
 * empty list) is left off the /progress page rather than shown as permanently
 * unstarted; the spec requires every shipped entry to declare at least one.
 */
export type Milestones = readonly Milestone[];
