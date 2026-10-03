import {
  MAX_DEFINED_TERMS,
  buildArticleSchema,
  buildDefinedTermSet,
  operatorAsPerson,
  serializeJsonLd,
} from './structured-data.service';
import type { GlossaryEntry } from './glossary.service';

/**
 * JSON-LD is written into a `<script type="application/ld+json">` element, and
 * the prerenderer emits script text unescaped. These cases pin the one property
 * that matters: no content string can close the element, while the JSON itself
 * still parses back to exactly what went in.
 */
describe('serializeJsonLd', () => {
  // Built from code points so the source file holds no invisible characters.
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);

  const hostile = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Tom & Jerry </script><script>alert(1)</script> <!-- x -->',
    description: `line${LS}separator${PS}paragraph`,
  };

  it('cannot close the surrounding script element', () => {
    const out = serializeJsonLd(hostile);
    expect(out).not.toMatch(/<\/script/i);
    expect(out).not.toContain('<');
    expect(out).not.toContain('>');
  });

  it('escapes &, U+2028 and U+2029 as backslash-u sequences', () => {
    const out = serializeJsonLd(hostile);
    expect(out).not.toContain('&');
    expect(out).not.toContain(LS);
    expect(out).not.toContain(PS);
    expect(out).toContain('\\u003c/script\\u003e');
    expect(out).toContain('\\u0026');
    expect(out).toContain('\\u2028');
    expect(out).toContain('\\u2029');
  });

  it('round-trips to the same data', () => {
    expect(JSON.parse(serializeJsonLd(hostile))).toEqual(hostile);
  });

  it('leaves ordinary content unchanged', () => {
    const plain = { '@context': 'https://schema.org', '@type': 'Thing', name: 'Glossar' };
    expect(serializeJsonLd(plain)).toBe(JSON.stringify(plain, null, 2));
  });
});

/**
 * Glossary translation files as the content build reads them
 * (`assets/data/translations/glossary/<lang>/<id>.json`), written inline so the
 * spec does not depend on which sample terms the kit ships.
 */
const agentLoopEn = {
  term: 'Agent Loop',
  alternativeNames: ['Agent Cycle', 'Perceive-Plan-Act Cycle'],
  description: 'The control cycle an AI agent runs through: observe, plan, act, integrate the result, repeat.',
};
const agentLoopDe = {
  term: 'Agentenschleife',
  alternativeNames: ['Agent-Zyklus', 'Perceive-Plan-Act-Zyklus'],
  description: 'Der Regelkreis, den ein KI-Agent durchläuft: beobachten, planen, handeln, Ergebnis einbauen, von vorn.',
};
const agentEn = {
  term: 'AI Agent',
  alternativeNames: [],
  description: 'A software system that works toward a goal on its own and uses tools to act.',
};

/** A glossary entry as the content bundle carries it (the per-language translation file + id). */
function entry(id: string, file: { term: string; description: string; alternativeNames?: string[] }): GlossaryEntry {
  return {
    id,
    term: file.term,
    definition: file.description,
    alternativeNames: file.alternativeNames ?? [],
    category: 'basics',
  };
}

/** What a crawler reads: the script text, parsed back. */
const asCrawlerSeesIt = (data: unknown) => JSON.parse(serializeJsonLd(data));

/**
 * The glossary page's DefinedTermSet used to list three hard-coded English
 * sample terms in every language. It is now built from the real entries of the
 * current language.
 */
describe('buildDefinedTermSet', () => {
  const set = (inLanguage: string) => ({
    name: 'Glossary',
    description: 'Terms explained',
    inLanguage,
    url: 'https://kurs.schule.example/en/glossary/',
  });

  it('lists the real terms of the language it is given, sorted, with their definitions', () => {
    const json = asCrawlerSeesIt(
      buildDefinedTermSet(set('en'), [entry('agent-loop', agentLoopEn), entry('agent', agentEn)]),
    );

    expect(json['@type']).toBe('DefinedTermSet');
    expect(json.inLanguage).toBe('en');
    expect(json.hasDefinedTerm.map((t: { name: string }) => t.name)).toEqual(['Agent Loop', 'AI Agent']);
    expect(json.hasDefinedTerm[0]).toEqual({
      '@type': 'DefinedTerm',
      name: 'Agent Loop',
      description: agentLoopEn.description,
      alternateName: ['Agent Cycle', 'Perceive-Plan-Act Cycle'],
    });
    // No alternative names, no empty alternateName property.
    expect(json.hasDefinedTerm[1].alternateName).toBeUndefined();
  });

  it('carries the German term in German — no English sample terms anywhere', () => {
    const text = serializeJsonLd(buildDefinedTermSet(set('de'), [entry('agent-loop', agentLoopDe)]));

    expect(JSON.parse(text).hasDefinedTerm.map((t: { name: string }) => t.name)).toEqual(['Agentenschleife']);
    for (const sample of ['Machine Learning', 'Neural Network', 'Deep Learning']) {
      expect(text).not.toContain(sample);
    }
  });

  it('falls back to `description` when `definition` is empty, and drops entries without a term', () => {
    const json = asCrawlerSeesIt(
      buildDefinedTermSet(set('en'), [
        { ...entry('a', { term: 'Alpha', description: '' }), description: 'from description' },
        { ...entry('b', { term: '  ', description: 'no term' }) },
      ]),
    );

    expect(json.hasDefinedTerm).toEqual([{ '@type': 'DefinedTerm', name: 'Alpha', description: 'from description' }]);
  });

  it('is bounded: at most MAX_DEFINED_TERMS terms, the first ones alphabetically', () => {
    const many = Array.from({ length: MAX_DEFINED_TERMS + 5 }, (_, i) =>
      entry(`t${i}`, { term: `Term ${String(i).padStart(3, '0')}`, description: 'x' }),
    ).reverse();
    const terms = buildDefinedTermSet(set('en'), many)['hasDefinedTerm'] as { name: string }[];

    expect(terms).toHaveLength(MAX_DEFINED_TERMS);
    expect(terms[0].name).toBe('Term 000');
    expect(buildDefinedTermSet(set('en'), many, 2)['hasDefinedTerm']).toHaveLength(2);
  });

  it('keeps a hostile definition inside the script element', () => {
    const text = serializeJsonLd(
      buildDefinedTermSet(set('en'), [entry('x', { term: 'X', description: '</script><script>alert(1)</script>' })]),
    );

    expect(text).not.toMatch(/<\/script/i);
    expect(JSON.parse(text).hasDefinedTerm[0].description).toBe('</script><script>alert(1)</script>');
  });
});

describe('operatorAsPerson', () => {
  it('names nobody while site-operator.ts still holds the kit placeholder', () => {
    expect(operatorAsPerson('[NAME]')).toBeNull();
    expect(operatorAsPerson('  ')).toBeNull();
  });

  it('names the operator once it is filled in — and nothing invented beside the name', () => {
    expect(operatorAsPerson(' Erika Mustermann ')).toEqual({ '@type': 'Person', name: 'Erika Mustermann' });
  });
});

describe('buildArticleSchema', () => {
  const publisher = { name: 'Portal', url: 'https://kurs.schule.example' };
  const article = { title: 'Git', description: 'Intro', url: 'https://kurs.schule.example/en/articles/git/' };

  it('takes datePublished from the article’s publishDate and never invents a dateModified', () => {
    const json = asCrawlerSeesIt(buildArticleSchema({ ...article, publishDate: '2026-10-01' }, publisher, null));

    expect(json.datePublished).toBe('2026-10-01');
    expect(json.dateModified).toBeUndefined();
  });

  it('leaves datePublished out when the article has no publish date (the build date is not one)', () => {
    const json = asCrawlerSeesIt(buildArticleSchema(article, publisher, null));

    expect(json.datePublished).toBeUndefined();
    expect(json.dateModified).toBeUndefined();
    expect(buildArticleSchema({ ...article, publishDate: 'soon' }, publisher, null)['datePublished']).toBeUndefined();
  });

  it('names the operator as author, or no author at all — never a placeholder', () => {
    const named = asCrawlerSeesIt(buildArticleSchema(article, publisher, operatorAsPerson('Erika Mustermann')));
    const kit = serializeJsonLd(buildArticleSchema(article, publisher, operatorAsPerson('[NAME]')));

    expect(named.author).toEqual({ '@type': 'Person', name: 'Erika Mustermann' });
    expect(JSON.parse(kit).author).toBeUndefined();
    expect(kit).not.toContain('Your Name');
    expect(kit).not.toContain('[NAME]');
    expect(JSON.parse(kit).publisher).toEqual({ '@type': 'Organization', ...publisher });
  });
});
