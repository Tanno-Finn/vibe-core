import { classifyOntologyEdge } from './ontology-map.component';

/**
 * Specs für die in Phase I.37 extrahierte Edge-Klassifizierungs-Funktion.
 *
 * Die Funktion bestimmt, welche CSS-Klasse jede Cytoscape-Edge bekommt:
 *  - intra-cluster + cluster-${type} → Edge in Type-Farbe rendern
 *  - inter-cluster                    → neutrales Grau
 *
 * Pure Funktion, keine Service-Deps — schnell und deterministisch testbar.
 */
describe('classifyOntologyEdge', () => {
  describe('intra-cluster edges (useTypeClusters=true)', () => {
    it('returns intra-cluster + cluster-${type} when source and target share a type', () => {
      expect(classifyOntologyEdge('article:foo', 'article:bar', true)).toBe('intra-cluster cluster-article');
    });

    it('produces the correct cluster-* suffix per type', () => {
      expect(classifyOntologyEdge('demo:a', 'demo:b', true)).toBe('intra-cluster cluster-demo');
      expect(classifyOntologyEdge('glossary:a', 'glossary:b', true)).toBe('intra-cluster cluster-glossary');
      expect(classifyOntologyEdge('timeline:a', 'timeline:b', true)).toBe('intra-cluster cluster-timeline');
      expect(classifyOntologyEdge('source:a', 'source:b', true)).toBe('intra-cluster cluster-source');
    });

    it('handles compound ids with colons (only first segment is the type)', () => {
      // ids dürfen Doppelpunkte enthalten — wichtig dass nur das erste Segment
      // als Type verwendet wird.
      expect(classifyOntologyEdge('article:art:special', 'article:other', true)).toBe('intra-cluster cluster-article');
    });
  });

  describe('inter-cluster edges (useTypeClusters=true)', () => {
    it('returns plain inter-cluster when source and target have different types', () => {
      expect(classifyOntologyEdge('article:foo', 'glossary:bar', true)).toBe('inter-cluster');
      expect(classifyOntologyEdge('demo:a', 'timeline:b', true)).toBe('inter-cluster');
      expect(classifyOntologyEdge('source:x', 'article:y', true)).toBe('inter-cluster');
    });
  });

  describe('Subgraph/Preset-Modus (useTypeClusters=false)', () => {
    it('always returns inter-cluster (no cluster hierarchy exists)', () => {
      // Wenn das Component im Subgraph-Modus oder mit precomputed positions
      // läuft, gibt es keine Compound-Parents und damit keine sinnvolle
      // intra/inter-Unterscheidung. Alle Edges bekommen die neutrale
      // Klasse — Color-Tinting findet dann nicht statt.
      expect(classifyOntologyEdge('article:foo', 'article:bar', false)).toBe('inter-cluster');
      expect(classifyOntologyEdge('demo:x', 'glossary:y', false)).toBe('inter-cluster');
    });
  });

  describe('Edge-cases', () => {
    it('handles empty type prefix (e.g. ":bar")', () => {
      // Würde "" als Type extrahieren. Wenn beide Source/Target gleich
      // leer wären, technisch "intra-cluster". Regression-Guard für den
      // Fall dass irgendwo ein falsch-formatierter Key durchschlüpft.
      expect(classifyOntologyEdge(':a', ':b', true)).toBe('intra-cluster cluster-');
    });

    it('treats source/target order as irrelevant', () => {
      const ab = classifyOntologyEdge('article:foo', 'article:bar', true);
      const ba = classifyOntologyEdge('article:bar', 'article:foo', true);
      expect(ab).toBe(ba);
    });
  });
});
