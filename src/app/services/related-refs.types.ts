/**
 * Related-Refs Types
 *
 * Universal cross-link schema. Three axes of cross-reference:
 *
 *   1. Ontology types (V1, modeled in the explicit knowledge graph):
 *      articles, glossary, timeline, demos, sources
 *      — referenced by ID, resolvable via OntologyService [forNode] flow.
 *
 *   2. Portal-content types (catalog content, not yet in ontology):
 *      tools, resources
 *      — referenced by ID, resolved via AiToolsService / AiResourcesService.
 *        Editorial pin only (`[refs]` flow); NOT rendered in the concept-map
 *        by design.
 *
 *   3. Off-portal type:
 *      external
 *      — inline URL + i18n keys; not a portal entity, no ID. Editorial pin
 *        only. Rendered with target="_blank" + EXTERN indicator.
 *
 * Design: an internal design note.
 */

export type RelatedRefType =
  // V1 ontology
  | 'articles'
  | 'glossary'
  | 'timeline'
  | 'demos'
  | 'sources'
  // Portal-content (V2-ontology candidates, editorial pin today)
  | 'tools'
  | 'resources'
  // Display-only pseudo-type: merged group header for tools + resources.
  // Only emitted by RelatedRefsService.mergeCatalogueGroups, never used in
  // input RelatedRefs payloads.
  | 'catalogue'
  // Off-portal
  | 'external';

/**
 * Editorial reference to an off-portal URL. Title and description live as
 * translation keys so the curated wording survives across the portal's 56
 * language variants.
 */
export interface ExternalRef {
  url: string;
  titleKey: string;
  descriptionKey?: string;
}

export interface RelatedRefs {
  articles?: string[];
  glossary?: string[];
  timeline?: string[];
  demos?: string[];
  sources?: string[];
  /** Portal AI-tool IDs (from src/assets/data/core/ai-tools/). */
  tools?: string[];
  /** Portal AI-resource IDs (from src/assets/data/core/ai-resources/). */
  resources?: string[];
  /** Off-portal links. Inline objects (no ID — URL is the identifier). */
  external?: ExternalRef[];
}

export interface ResolvedRef {
  id: string;
  type: RelatedRefType;
  title: string;
  route: string;
  icon: string;
  /** Optional metadata used by the expansive density's card-style rendering */
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  /**
   * True for `type === 'external'`: route is an absolute URL, the component
   * renders an <a target="_blank" rel="noopener noreferrer"> with an EXTERN
   * indicator instead of a routerLink.
   */
  isExternal?: boolean;
}

/** Density modes for <app-related-refs> */
export type RelatedRefsDensity = 'expansive' | 'compact' | 'compact-inline';

export interface ResolvedRefGroup {
  type: RelatedRefType;
  items: ResolvedRef[];
}

/**
 * Stable group order used by the UI. Articles first (next-read CTA), then
 * supporting V1-ontology types, then portal-content (tools/resources), then
 * off-portal (external). Sources last — they're citations, lowest navigational
 * priority on article pages.
 */
/**
 * User-Vorgabe 2026-05-17: Articles first (CTA), dann External (kuratorisch
 * stark), dann Tools+Resources adjacent (Catalog-Content), dann Glossar /
 * Timeline / Demos (Auto-Derived-Bulk), Sources zuletzt (Zitate).
 */
export const RELATED_REF_GROUP_ORDER: RelatedRefType[] = [
  'articles',
  'demos',
  'external',
  'tools',
  'resources',
  'glossary',
  'timeline',
  'sources',
];

/** Optimus UI icon per type — kept here so resolver + UI agree */
export const RELATED_REF_ICONS: Record<RelatedRefType, string> = {
  articles: 'pi pi-file-edit',
  glossary: 'pi pi-bookmark',
  timeline: 'pi pi-calendar',
  demos: 'pi pi-play-circle',
  sources: 'pi pi-book',
  tools: 'pi pi-wrench',
  resources: 'pi pi-folder-open',
  catalogue: 'pi pi-th-large', // group-header only; per-item icons stay wrench/folder
  external: 'pi pi-external-link',
};

/**
 * Display info for a single ontology node — title plus routerLink components.
 * Used by OntologyMapComponent for label + click-navigation.
 */
export interface NodeDisplayInfo {
  title: string;
  /** routerLink path (array form). null if no route exists. */
  route: string[] | null;
  queryParams?: Record<string, string>;
  fragment?: string;
}
