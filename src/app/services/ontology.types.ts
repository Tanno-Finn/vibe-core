/**
 * Ontology Types — Cross-Ref Knowledge Graph
 *
 * The portal's content is modeled as an UNDIRECTED graph with four
 * node kinds (article, glossary, timeline, source) and a single edge
 * relation today ("related"). Edges are deduped via canonical ordering:
 * the consolidator guarantees `key(a) <= key(b)` on each edge, so the
 * graph cannot accidentally store both `A↔B` and `B↔A`.
 *
 * V1 scope: 4 node kinds. Schema is open — adding `demo`, `tool`,
 * `resource`, etc. is a list-nodes script change only.
 *
 * Design: an internal design note.
 */

/** Node kind. Singular by convention (the kind of a node, not a group). */
export type OntologyNodeType = 'article' | 'demo' | 'glossary' | 'timeline' | 'source';

/** Reference to a single node, language-neutral. */
export interface OntologyNodeRef {
  type: OntologyNodeType;
  id: string;
}

/**
 * Edge kind. V1 has only "related"; future expansions will add semantic
 * edges (explains, based-on, precedes-in-time, ...) without schema changes.
 */
export type EdgeKind = 'related';

/**
 * Consolidated edge — canonical-ordered (`key(a) <= key(b)`).
 * This is the only form the Frontend ever sees: the consolidator
 * guarantees the invariant at build time.
 */
export interface OntologyEdge {
  a: OntologyNodeRef;
  b: OntologyNodeRef;
  kind: EdgeKind;
}

/**
 * Per-source file format — what authors write into edges/<type>/<id>.json.
 * The `with` partner is *unordered* against `node`; the consolidator
 * canonicalizes and deduplicates at build time.
 */
export interface OntologyEdgeFile {
  node: OntologyNodeRef;
  edges: Array<{
    with: OntologyNodeRef;
    kind: EdgeKind;
  }>;
}

/**
 * Build artifact loaded by the OntologyService at runtime.
 */
export interface ConsolidatedOntology {
  version: 1;
  generatedAt: string;
  nodeCount: Record<OntologyNodeType, number>;
  edgeCount: number;
  edges: OntologyEdge[];
}

/**
 * Build artifact emitted by list-nodes.mjs.
 * Used by validators and helper scripts to verify node IDs exist.
 */
export interface NodesIndex {
  version: 1;
  generatedAt: string;
  nodes: Record<OntologyNodeType, string[]>;
}

/**
 * Subgraph returned by OntologyService.getSubgraph() — used by the
 * ontology-map for focus-mode rendering.
 */
export interface OntologySubgraph {
  focus: OntologyNodeRef;
  nodes: OntologyNodeRef[];
  edges: OntologyEdge[];
}

/**
 * Canonical key for a node — used to compare for ordering and Map keys.
 */
export function nodeKey(n: OntologyNodeRef): string {
  return n.type + ':' + n.id;
}

/** Every ontology node kind. */
export const ONTOLOGY_NODE_TYPES: OntologyNodeType[] = ['article', 'demo', 'glossary', 'timeline', 'source'];

/**
 * Mapping from Ontology singular type → Related-Refs plural group key.
 * Used by RelatedRefsService when consuming ontology edges for the
 * existing `<app-related-refs>` API.
 */
export const ONTOLOGY_TO_REF_GROUP: Record<
  OntologyNodeType,
  'articles' | 'demos' | 'glossary' | 'timeline' | 'sources'
> = {
  article: 'articles',
  demo: 'demos',
  glossary: 'glossary',
  timeline: 'timeline',
  source: 'sources',
};
