import { designRegistry, DesignRegistryEntry } from './design-registry';

/**
 * Shared task-group derivation for the design-system workshop pages.
 *
 * SINGLE SOURCE: the tag→group map below is consumed by BOTH derived views —
 * the `/dev/agents` task-index table AND the `/dev/design` gallery sections —
 * and by the detail page's component quick-switch. Edit groups HERE only.
 *
 * Matching rule: a registry entry belongs to the FIRST group (in
 * `DESIGN_GROUP_DEFS` order) that shares at least one tag with it. Entries
 * matching no group land in the guaranteed `other` fallback, so EVERY registry
 * entry appears in exactly one group — a new `/new-component` scaffold shows up
 * in all three consumers automatically, no manual upkeep.
 *
 * i18n: group titles/hints live under `devWorkshop.groups.<id>` (shared
 * namespace — deliberately NOT under `agents.` since the gallery uses them too).
 */
export interface DesignGroupDef {
  id: string;
  /** Registry tags routed to this group (first match in def order wins). */
  tags: string[];
  titleKey: string;
  hintKey: string;
  /** Short noun label for compact chips (detail-page toolbar). */
  chipKey: string;
}

export const DESIGN_GROUP_DEFS: DesignGroupDef[] = [
  {
    id: 'scaffolding',
    tags: ['container', 'header', 'breadcrumb', 'wayfinding'],
    titleKey: 'devWorkshop.groups.scaffolding.title',
    hintKey: 'devWorkshop.groups.scaffolding.hint',
    chipKey: 'devWorkshop.groups.scaffolding.chip',
  },
  {
    id: 'content',
    tags: ['callout', 'box', 'example', 'definition', 'prompt', 'formula', 'math', 'summary'],
    titleKey: 'devWorkshop.groups.content.title',
    hintKey: 'devWorkshop.groups.content.hint',
    chipKey: 'devWorkshop.groups.content.chip',
  },
  {
    id: 'inlineHelp',
    tags: ['tooltip', 'overlay', 'help'],
    titleKey: 'devWorkshop.groups.inlineHelp.title',
    hintKey: 'devWorkshop.groups.inlineHelp.hint',
    chipKey: 'devWorkshop.groups.inlineHelp.chip',
  },
  {
    id: 'quiz',
    tags: ['quiz', 'assessment', 'checklist'],
    titleKey: 'devWorkshop.groups.quiz.title',
    hintKey: 'devWorkshop.groups.quiz.hint',
    chipKey: 'devWorkshop.groups.quiz.chip',
  },
  {
    id: 'progress',
    tags: ['progress', 'stat', 'metric', 'kpi', 'chart', 'steps', 'indicator'],
    titleKey: 'devWorkshop.groups.progress.title',
    hintKey: 'devWorkshop.groups.progress.hint',
    chipKey: 'devWorkshop.groups.progress.chip',
  },
  {
    id: 'cards',
    tags: ['card', 'surface'],
    titleKey: 'devWorkshop.groups.cards.title',
    hintKey: 'devWorkshop.groups.cards.hint',
    chipKey: 'devWorkshop.groups.cards.chip',
  },
];

/** Fallback group — catches every registry entry no matcher claims. */
export const FALLBACK_GROUP_DEF: DesignGroupDef = {
  id: 'other',
  tags: [],
  titleKey: 'devWorkshop.groups.other.title',
  hintKey: 'devWorkshop.groups.other.hint',
  chipKey: 'devWorkshop.groups.other.chip',
};

export interface DesignGroup {
  def: DesignGroupDef;
  entries: DesignRegistryEntry[];
}

/**
 * Partition registry entries into the curated groups (def order preserved,
 * fallback last). Guarantees: every input entry appears in EXACTLY one group;
 * empty groups are dropped. Pass a filtered subset to get grouped filter
 * results (the gallery does), or `designRegistry` for the full picture.
 */
export function groupDesignEntries(
  entries: readonly DesignRegistryEntry[] = designRegistry,
): DesignGroup[] {
  const buckets = new Map<string, DesignRegistryEntry[]>();
  for (const def of DESIGN_GROUP_DEFS) buckets.set(def.id, []);
  const other: DesignRegistryEntry[] = [];

  for (const entry of entries) {
    const def = DESIGN_GROUP_DEFS.find((g) => g.tags.some((t) => entry.tags.includes(t)));
    if (def) buckets.get(def.id)!.push(entry);
    else other.push(entry);
  }

  const groups: DesignGroup[] = DESIGN_GROUP_DEFS.map((def) => ({
    def,
    entries: buckets.get(def.id)!,
  })).filter((g) => g.entries.length > 0);

  if (other.length > 0) groups.push({ def: FALLBACK_GROUP_DEF, entries: other });
  return groups;
}
