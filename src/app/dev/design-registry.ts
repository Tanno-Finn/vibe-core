import { VIBE_DEV_SENTINEL } from './dev-sentinel';

/**
 * Semantic design-system registry (SPEC N5, decision D4; amended in N5.2).
 *
 * The single source of truth for which reusable components appear in the
 * `/dev/design` gallery. Curation rule (D6): a component belongs here only if it
 * is a GENUINELY REUSABLE primitive (container, box, card, header, tooltip,
 * quiz/checkpoint, progress, step indicator ...). One-off didactic demo
 * visualizations and page-specific / app-shell components go to
 * `design-registry.exclusions.json` instead.
 *
 * Any *.component.ts under src/app/components/** that is in NEITHER this registry
 * NOR the exclusions file fails `scripts/check-design-system.mjs` (the
 * self-maintenance gate). Adding a new component therefore forces a conscious
 * "reusable? -> registry, else exclusion" decision.
 *
 * N5.2 AMENDMENT: the former `load: () => import(...)` field is gone. The live
 * demo is now rendered by `demo-host.component.ts`, which imports every gallery
 * component STATICALLY (a static `@switch (slug)` template — the only way to get
 * real `<ng-content>` projection, which dynamic `createComponent` cannot do
 * cleanly). The dynamic import therefore carried no weight and is replaced by
 * `sourcePath` (a repo-relative string), which the gate uses to locate the
 * component file and which the detail page shows as provenance.
 *
 * PARSER CONTRACT: the gate reads this file as text (it is dependency-free and
 * cannot run ts-node). Keep each entry's field order exactly
 * `slug, name, selector, tags, docPath, sourcePath`, with every value a single-
 * quoted string literal (tags a single-quoted array on one logical line), so the
 * regex in check-design-system.mjs can extract slug / tags / docPath / sourcePath.
 */
export interface DesignRegistryEntry {
  /** URL-safe id; also the canonical doc filename (`<slug>.md`). */
  slug: string;
  /** Human-readable display name for the gallery tile. */
  name: string;
  /** The component's Angular selector. */
  selector: string;
  /** Keyword tags for the gallery filter (must be non-empty). */
  tags: string[];
  /** Browser asset URL of the canonical doc (served + fetched by the gallery). */
  docPath: string;
  /** Repo-relative path to the component source (gate locator + detail-page provenance). */
  sourcePath: string;
}

export const designRegistry: DesignRegistryEntry[] = [
  {
    slug: 'standard-container',
    name: 'Standard Container',
    selector: 'app-standard-container',
    tags: ['container', 'layout', 'surface'],
    docPath: 'assets/design-system/standard-container.md',
    sourcePath: 'src/app/components/shared/standard-container.component.ts',
  },
  {
    slug: 'text-container',
    name: 'Text Container',
    selector: 'app-text-container',
    tags: ['container', 'text', 'reading', 'layout'],
    docPath: 'assets/design-system/text-container.md',
    sourcePath: 'src/app/components/shared/text-container.component.ts',
  },
  {
    slug: 'page-header',
    name: 'Page Header',
    selector: 'app-page-header',
    tags: ['header', 'layout', 'title'],
    docPath: 'assets/design-system/page-header.md',
    sourcePath: 'src/app/components/shared/page-header.component.ts',
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    selector: 'app-breadcrumb',
    tags: ['navigation', 'breadcrumb', 'wayfinding'],
    docPath: 'assets/design-system/breadcrumb.md',
    sourcePath: 'src/app/components/shared/breadcrumb.component.ts',
  },
  {
    slug: 'info-box',
    name: 'Info Box',
    selector: 'app-info-box',
    tags: ['callout', 'box', 'info', 'didactic'],
    docPath: 'assets/design-system/info-box.md',
    sourcePath: 'src/app/components/shared/info-box.component.ts',
  },
  {
    slug: 'example-box',
    name: 'Example Box',
    selector: 'app-example-box',
    tags: ['box', 'example', 'didactic'],
    docPath: 'assets/design-system/example-box.md',
    sourcePath: 'src/app/components/shared/example-box.component.ts',
  },
  {
    slug: 'definition',
    name: 'Definition',
    selector: 'app-definition',
    tags: ['definition', 'box', 'didactic', 'glossary'],
    docPath: 'assets/design-system/definition.md',
    sourcePath: 'src/app/components/didactic/definition.component.ts',
  },
  {
    slug: 'prompt-example',
    name: 'Prompt Example',
    selector: 'app-prompt-example',
    tags: ['prompt', 'code', 'example', 'didactic'],
    docPath: 'assets/design-system/prompt-example.md',
    sourcePath: 'src/app/components/didactic/prompt-example.component.ts',
  },
  {
    slug: 'formula-block',
    name: 'Formula Block',
    selector: 'app-formula-block',
    tags: ['math', 'formula', 'didactic'],
    docPath: 'assets/design-system/formula-block.md',
    sourcePath: 'src/app/components/didactic/formula-block.component.ts',
  },
  {
    slug: 'info-tooltip',
    name: 'Info Tooltip',
    selector: 'app-info-tooltip',
    tags: ['tooltip', 'help', 'a11y', 'overlay'],
    docPath: 'assets/design-system/info-tooltip.md',
    sourcePath: 'src/app/components/shared/info-tooltip.component.ts',
  },
  {
    slug: 'checkpoint',
    name: 'Checkpoint',
    selector: 'app-checkpoint',
    tags: ['checklist', 'progress', 'gamification', 'didactic'],
    docPath: 'assets/design-system/checkpoint.md',
    sourcePath: 'src/app/components/shared/checkpoint.component.ts',
  },
  {
    slug: 'takeaways-list',
    name: 'Takeaways List',
    selector: 'app-takeaways-list',
    tags: ['list', 'summary', 'didactic'],
    docPath: 'assets/design-system/takeaways-list.md',
    sourcePath: 'src/app/components/shared/takeaways-list.component.ts',
  },
  {
    slug: 'quiz-container',
    name: 'Quiz Container',
    selector: 'app-quiz-container',
    tags: ['quiz', 'interactive', 'assessment', 'didactic'],
    docPath: 'assets/design-system/quiz-container.md',
    sourcePath: 'src/app/components/shared/quiz-container.component.ts',
  },
  {
    slug: 'generic-card',
    name: 'Generic Card',
    selector: 'app-generic-card',
    tags: ['card', 'layout', 'surface'],
    docPath: 'assets/design-system/generic-card.md',
    sourcePath: 'src/app/components/ui/generic-card.component.ts',
  },
  {
    slug: 'stat-card',
    name: 'Stat Card',
    selector: 'app-stat-card',
    tags: ['card', 'stat', 'metric', 'kpi'],
    docPath: 'assets/design-system/stat-card.md',
    sourcePath: 'src/app/components/didactic/stat-card.component.ts',
  },
  {
    slug: 'circular-progress',
    name: 'Circular Progress',
    selector: 'app-circular-progress',
    tags: ['progress', 'chart', 'indicator'],
    docPath: 'assets/design-system/circular-progress.md',
    sourcePath: 'src/app/components/ui/circular-progress.component.ts',
  },
  {
    slug: 'split-bar',
    name: 'Split Bar',
    selector: 'app-split-bar',
    tags: ['chart', 'bar', 'proportion', 'viz'],
    docPath: 'assets/design-system/split-bar.md',
    sourcePath: 'src/app/components/shared/split-bar.component.ts',
  },
  {
    slug: 'step-indicator',
    name: 'Step Indicator',
    selector: 'app-step-indicator',
    tags: ['steps', 'progress', 'navigation', 'didactic'],
    docPath: 'assets/design-system/step-indicator.md',
    sourcePath: 'src/app/components/didactic/step-indicator.component.ts',
  },
];

/**
 * Strip-proof sentinel (D2). Referenced here so this dev-only module carries the
 * literal in dev builds and the optimizer cannot tree-shake it away.
 */
export const REGISTRY_SENTINEL = VIBE_DEV_SENTINEL;
