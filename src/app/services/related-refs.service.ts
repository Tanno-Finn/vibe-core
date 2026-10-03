/**
 * RelatedRefsService
 *
 * Resolves cross-content references (articles / glossary / timeline / demos /
 * sources) to display-ready entries with titles and routes.
 *
 * Two entry points:
 *  - resolveGroups(refs) — explicit per-page RelatedRefs payload, for callers
 *    that want to pin a specific list (editorial override).
 *  - resolveForNode(type, id) — pulls the node's neighbors from
 *    OntologyService and converts them to display-ready groups.
 *
 * Both paths share the same per-type display-resolution logic so visual
 * output is identical regardless of source.
 *
 * Feature switches (src/config/site.json): a reference into a feature that is
 * switched off (glossary, timeline, sources, catalog, demos) is dropped, so an
 * article never shows a chip that would only land on the start page.
 *
 * Design: an internal design note.
 */
import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { ArticlesService } from './articles.service';
import { GlossaryService } from './glossary.service';
import { TimelineService } from './timeline.service';
import { DemosService } from './demos.service';
import { SourcesService } from './book-sources.service';
import { AiToolsService } from './ai-tools.service';
import { AiResourcesService } from './ai-resources.service';
import { TranslationService } from './translation.service';
import { OntologyService } from './ontology.service';
import { DevModeService } from './dev-mode.service';
import { SITE_CONFIG } from '../../config/site';
import { OntologyNodeRef, OntologyNodeType, ONTOLOGY_TO_REF_GROUP, nodeKey } from './ontology.types';
import {
  ExternalRef,
  NodeDisplayInfo,
  RELATED_REF_GROUP_ORDER,
  RELATED_REF_ICONS,
  RelatedRefType,
  RelatedRefs,
  ResolvedRef,
  ResolvedRefGroup,
} from './related-refs.types';

/**
 * The feature (src/config/features.json) whose page a reference of each type
 * links into. Articles and external links belong to no feature: always on.
 */
const FEATURE_OF_REF_TYPE: Partial<Record<RelatedRefType | OntologyNodeType, string>> = {
  glossary: 'glossary',
  timeline: 'timeline',
  sources: 'sources',
  source: 'sources',
  demos: 'demos',
  demo: 'demos',
  tools: 'catalog',
  resources: 'catalog',
};

@Injectable({ providedIn: 'root' })
export class RelatedRefsService {
  private articles = inject(ArticlesService);
  private glossary = inject(GlossaryService);
  private timeline = inject(TimelineService);
  private demos = inject(DemosService);
  private sources = inject(SourcesService);
  private tools = inject(AiToolsService);
  private resources = inject(AiResourcesService);
  private ontology = inject(OntologyService);
  private translationService = inject(TranslationService);
  private devMode = inject(DevModeService);
  private site = inject(SITE_CONFIG);

  /**
   * Does a reference of this type lead anywhere? False while site.json switches
   * its feature off: such references are dropped, not linked to a page that
   * would redirect to the start page.
   */
  isTypeOn(type: RelatedRefType | OntologyNodeType): boolean {
    const feature = FEATURE_OF_REF_TYPE[type];
    return feature === undefined || this.site.isFeatureOn(feature);
  }

  /**
   * Effective-prod state as a stream so resolveGroups/resolveDisplay re-emit
   * when the "simulate prod" toggle flips — pre-release demos / draft articles
   * appear/disappear from related-content live. Created once here (injection
   * context); the methods reuse it.
   */
  private isProd$ = toObservable(this.devMode.isEffectivelyProd);

  /**
   * Resolve a RelatedRefs payload into grouped, display-ready entries.
   * Dangling IDs are silently dropped — the build-time validator is the
   * authoritative check.
   */
  resolveGroups(
    refs: RelatedRefs | undefined | null,
    excludeSelf?: { type: RelatedRefType; id: string },
  ): Observable<ResolvedRefGroup[]> {
    if (!refs) return of([]);
    return combineLatest([
      this.articles.getAll(),
      this.glossary.getAllEntries(),
      this.timeline.entries$,
      this.demos.getAllDemos(),
      this.sources.entries$,
      this.tools.entries$,
      this.resources.entries$,
      this.isProd$,
    ]).pipe(
      map(([articles, glossary, timelineEvents, demos, sources, tools, resources, isProd]) => {
        const articleById = new Map(articles.map((a) => [a.id, a]));
        const glossaryById = new Map(glossary.map((e) => [e.id, e]));
        const timelineById = new Map(timelineEvents.map((e) => [e.id, e]));
        const demoById = new Map(demos.map((d) => [d.id, d]));
        const sourceById = new Map(sources.map((s) => [s.id, s]));
        const toolById = new Map(tools.map((t) => [t.id, t]));
        const resourceById = new Map(resources.map((r) => [r.id, r]));

        const groups: ResolvedRefGroup[] = [];

        for (const type of RELATED_REF_GROUP_ORDER) {
          // External is the only type whose entries are inline objects, not
          // IDs. All other types resolve through their respective service map.
          if (type === 'external') {
            const items: ResolvedRef[] = (refs.external ?? [])
              .map((ext) => this.resolveExternal(ext))
              .filter((r): r is ResolvedRef => r !== null);
            if (items.length > 0) groups.push({ type, items });
            continue;
          }

          // `catalogue` is a pseudo-type emitted only by mergeCatalogueGroups
          // — it has no RelatedRefs key. Defensive guard keeps the loop type-safe.
          if (type === 'catalogue') continue;
          if (!this.isTypeOn(type)) continue; // its feature is switched off (site.json)
          const ids = ((refs[type] as string[] | undefined) ?? []).filter(
            (id: string) => !(excludeSelf?.type === type && excludeSelf.id === id),
          );
          if (ids.length === 0) continue;

          const items: ResolvedRef[] = ids
            .map((id: string) => {
              switch (type) {
                case 'articles': {
                  const a = articleById.get(id);
                  if (!a) return null;
                  if (isProd && !this.articles.isVisibleInProd(a)) return null; // toggle-aware
                  return {
                    id,
                    type,
                    title: this.translate(a.titleKey),
                    route: '/' + a.path,
                    icon: RELATED_REF_ICONS.articles,
                    description: a.descriptionKey ? this.translate(a.descriptionKey) : undefined,
                    difficulty: a.difficulty,
                    estimatedTime: a.estimatedTime,
                  } as ResolvedRef;
                }
                case 'glossary': {
                  const e = glossaryById.get(id);
                  if (!e) return null;
                  return {
                    id,
                    type,
                    title: e.term || id,
                    route: '/glossary',
                    icon: RELATED_REF_ICONS.glossary,
                  } as ResolvedRef;
                }
                case 'timeline': {
                  const e = timelineById.get(id);
                  if (!e) return null;
                  return {
                    id,
                    type,
                    title: e.title || id,
                    route: '/ai-timeline',
                    icon: RELATED_REF_ICONS.timeline,
                  } as ResolvedRef;
                }
                case 'demos': {
                  const d = demoById.get(id);
                  if (!d) return null;
                  if (isProd && !this.demos.isPublished(d)) return null; // toggle-aware
                  // Demos haben fertige descriptionKey/difficulty/estimatedTime
                  // wie Articles — expose sie so dass die Card-Render-Pipeline
                  // (renderAsCards + .related-refs-card template) sie nutzt.
                  return {
                    id,
                    type,
                    title: this.translate(d.titleKey),
                    route: '/' + d.path,
                    icon: RELATED_REF_ICONS.demos,
                    description: d.descriptionKey ? this.translate(d.descriptionKey) : undefined,
                    difficulty: d.difficulty,
                    estimatedTime: d.estimatedTime,
                  } as ResolvedRef;
                }
                case 'sources': {
                  const s = sourceById.get(id);
                  if (!s) return null;
                  return {
                    id,
                    type,
                    title: s.title || s.authors || id,
                    route: '/sources',
                    icon: RELATED_REF_ICONS.sources,
                    description: [s.authors, s.year, s.publication].filter(Boolean).join(' · ') || undefined,
                  } as ResolvedRef;
                }
                case 'tools': {
                  const t = toolById.get(id);
                  if (!t) return null;
                  // Catalog deep-link convention: ?tool=<id>. Matches the
                  // existing legacy redirect `/ai-tools` -> `/catalog`.
                  return {
                    id,
                    type,
                    title: t.name || id,
                    route: '/catalog?tool=' + id,
                    icon: RELATED_REF_ICONS.tools,
                  } as ResolvedRef;
                }
                case 'resources': {
                  const r = resourceById.get(id);
                  if (!r) return null;
                  // AIResource exposes the resolved title at top level (the
                  // bundle loader has already merged the active translation).
                  return {
                    id,
                    type,
                    title: r.title || r.source || id,
                    route: '/catalog?resource=' + id,
                    icon: RELATED_REF_ICONS.resources,
                  } as ResolvedRef;
                }
              }
              return null;
            })
            // Safety net: a route that belongs to a switched-off feature (site.json).
            .filter((r): r is ResolvedRef => r !== null && this.site.isRouteOn(r.route));

          if (items.length > 0) groups.push({ type, items });
        }

        // Merge tools + resources into a single "catalogue" pseudo-group so
        // the UI renders ONE header "Catalog" with both kinds of items
        // (chips still show individual icon + identical cyan color). The
        // group order in RELATED_REF_GROUP_ORDER places tools before resources
        // so the items remain sorted by kind within the merged group.
        return this.mergeCatalogueGroups(groups);
      }),
    );
  }

  /**
   * Collapse adjacent `tools` and `resources` groups into one `catalogue`
   * group. Done at resolver level rather than in the template so the merge
   * is consistent across all density modes and any future mounts.
   */
  private mergeCatalogueGroups(groups: ResolvedRefGroup[]): ResolvedRefGroup[] {
    const tools = groups.find((g) => g.type === 'tools');
    const resources = groups.find((g) => g.type === 'resources');
    if (!tools && !resources) return groups;
    const merged: ResolvedRefGroup = {
      type: 'catalogue',
      items: [...(tools?.items ?? []), ...(resources?.items ?? [])],
    };
    const out: ResolvedRefGroup[] = [];
    let inserted = false;
    for (const g of groups) {
      if (g.type === 'tools' || g.type === 'resources') {
        if (!inserted) {
          out.push(merged);
          inserted = true;
        }
        continue;
      }
      out.push(g);
    }
    return out;
  }

  /**
   * Resolve an `ExternalRef` into a `ResolvedRef`. The translation keys
   * survive across the portal's 56 language variants, so the curated
   * wording stays accurate per-language. Description is optional.
   */
  private resolveExternal(ext: ExternalRef): ResolvedRef | null {
    if (!ext?.url || !ext?.titleKey) return null;
    return {
      id: ext.url, // URL doubles as ID — externals have no portal-side identifier
      type: 'external',
      title: this.translate(ext.titleKey),
      route: ext.url, // Absolute URL; component renders as <a target="_blank">
      icon: RELATED_REF_ICONS.external,
      description: ext.descriptionKey ? this.translate(ext.descriptionKey) : undefined,
      isExternal: true,
    };
  }

  /**
   * Resolve refs from the ontology graph for a single node.
   * The focus node is automatically excluded from results.
   *
   * Implementation: queries OntologyService for neighbors, maps singular
   * ontology types → plural ref-group types, then funnels through the
   * existing resolveGroups pipeline so visual output is identical to the
   * editorial-override path.
   */
  resolveForNode(type: OntologyNodeType, id: string): Observable<ResolvedRefGroup[]> {
    return this.resolveForNodeWithEditorial(type, id, null);
  }

  /**
   * Hybrid resolution: ontology neighbors UNION editorial pins.
   *
   * - V1 ontology types (articles, glossary, timeline, demos, sources):
   *   union of ontology + editorial, dedup. Editorial pins are simply
   *   "promote these to the top regardless of graph weight" hints, the
   *   ontology supplies the bulk.
   * - V2 types (tools, resources, external): editorial-only since they
   *   are deliberately not in the ontology by design. Without this
   *   path they would never render under [forNode] mounts (the article
   *   footer mounted from LessonTemplate, the most common case).
   *
   * Returns the same shape as resolveForNode/resolveGroups so the UI
   * doesn't care which entry point was used.
   */
  resolveForNodeWithEditorial(
    type: OntologyNodeType,
    id: string,
    editorial: RelatedRefs | null | undefined,
  ): Observable<ResolvedRefGroup[]> {
    return this.ontology.getNeighborsByType(type, id).pipe(
      map((groups) => {
        // Seed with editorial pins (preserves V2 types tools/resources/external).
        const refs: RelatedRefs = {
          articles: [...(editorial?.articles ?? [])],
          glossary: [...(editorial?.glossary ?? [])],
          timeline: [...(editorial?.timeline ?? [])],
          demos: [...(editorial?.demos ?? [])],
          sources: [...(editorial?.sources ?? [])],
          tools: [...(editorial?.tools ?? [])],
          resources: [...(editorial?.resources ?? [])],
          external: [...(editorial?.external ?? [])],
        };
        // Union with ontology neighbors (V1 types only — V2 types aren't in
        // the graph). Editorial IDs come first in the merged array to keep
        // curated picks visible above auto-derived edges.
        for (const [ontologyType, nodes] of Object.entries(groups) as [OntologyNodeType, { id: string }[]][]) {
          const refKey = ONTOLOGY_TO_REF_GROUP[ontologyType];
          const existing = new Set((refs[refKey] as string[]) ?? []);
          for (const n of nodes) {
            if (!existing.has(n.id)) {
              (refs[refKey] as string[]).push(n.id);
              existing.add(n.id);
            }
          }
        }
        return refs;
      }),
      switchMap((refs) => this.resolveGroups(refs)),
    );
  }

  /**
   * Resolve a list of ontology node refs into a `Map<"type:id", DisplayInfo>`.
   * Used by OntologyMapComponent for labels + click-navigation routes.
   * Unknown nodes are emitted with id as fallback title and no route — they
   * should not exist post-validation, but the map must remain robust under
   * stale build-artifacts.
   */
  resolveDisplay(refs: OntologyNodeRef[]): Observable<Map<string, NodeDisplayInfo>> {
    if (refs.length === 0) return of(new Map());
    return combineLatest([
      this.articles.getAll(),
      this.glossary.getAllEntries(),
      this.timeline.entries$,
      this.demos.getAllDemos(),
      this.sources.entries$,
      this.isProd$,
    ]).pipe(
      map(([articles, glossary, timelineEvents, demos, sources, isProd]) => {
        const articleById = new Map(articles.map((a) => [a.id, a]));
        const glossaryById = new Map(glossary.map((e) => [e.id, e]));
        const timelineById = new Map(timelineEvents.map((e) => [e.id, e]));
        const demoById = new Map(demos.map((d) => [d.id, d]));
        const sourceById = new Map(sources.map((s) => [s.id, s]));

        const out = new Map<string, NodeDisplayInfo>();
        for (const r of refs) {
          // A node of a switched-off feature (site.json) gets no key and no route.
          if (!this.isTypeOn(r.type)) continue;
          const k = nodeKey(r);
          let info: NodeDisplayInfo;
          switch (r.type) {
            case 'article': {
              const a = articleById.get(r.id);
              // Under effective-prod a draft/scheduled article is not
              // surfaced — skip the key so a deep-link pin (?focus=article:…) no-ops.
              if (isProd && a && !this.articles.isVisibleInProd(a)) continue;
              info = a ? { title: this.translate(a.titleKey), route: ['/' + a.path] } : { title: r.id, route: null };
              break;
            }
            case 'demo': {
              const d = demoById.get(r.id);
              // Under effective-prod a pre-release demo is not surfaced
              // — skip so the deep-link pin (?focus=demo:…) opens no detail pane.
              if (isProd && d && !this.demos.isPublished(d)) continue;
              info = d ? { title: this.translate(d.titleKey), route: ['/' + d.path] } : { title: r.id, route: null };
              break;
            }
            case 'glossary': {
              const e = glossaryById.get(r.id);
              info = {
                title: e?.term || r.id,
                route: ['/glossary'],
                queryParams: { search: 'exact:' + r.id },
              };
              break;
            }
            case 'timeline': {
              const e = timelineById.get(r.id);
              info = {
                title: e?.title || r.id,
                route: ['/ai-timeline'],
                queryParams: { search: 'exact:' + r.id },
              };
              break;
            }
            case 'source': {
              const s = sourceById.get(r.id);
              info = {
                title: s?.title || s?.authors || r.id,
                route: ['/sources'],
                fragment: r.id,
              };
              break;
            }
            default:
              info = { title: r.id, route: null };
          }
          out.set(k, info);
        }
        return out;
      }),
    );
  }

  private translate(key: string): string {
    return this.translationService.translate(key);
  }
}
