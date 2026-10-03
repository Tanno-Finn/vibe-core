import type { TranslationService } from '../services/translation.service';
import { designRegistry } from './design-registry';
import { groupDesignEntries } from './design-groups';
import { articleRegistry, groupGuidesByCategory } from './articles/article-registry';

/**
 * Shared quick-switch derivation (SPEC N5, Guides extension).
 *
 * ONE source for the grouped `p-select` that jumps between design-system pages,
 * consumed by BOTH the component detail page (`dev-design-detail.component.ts`)
 * AND the guide article shell (`articles/article-shell.component.ts`). It folds
 * two option families into a single grouped list:
 *   - COMPONENT groups — the kit's reusable primitives, grouped by the shared
 *     tag→task-group map (`design-groups.ts`); value = the registry `slug`.
 *   - GUIDE groups — the long-form articles, grouped by category (primeng /
 *     foundations / layouts); value = `guide:<id>` (namespaced so it never
 *     collides with a component slug and so the current guide's ngModel value
 *     stays distinct).
 *
 * `resolveSwitchRoute(value)` maps a chosen value back to a router path array:
 * a bare slug → `/dev/design/<slug>`, a `guide:<id>` → `/dev/design/guide/<id>`.
 * Group labels are i18n, so callers rebuild the list on language switch.
 */
export interface SwitchOption {
  label: string;
  /** Routing token: a component slug, or `guide:<id>` for a guide article. */
  value: string;
  /** Folded selector + tags (components) / tags + category (guides) for filter. */
  search: string;
}

export interface SwitchOptionGroup {
  label: string;
  items: SwitchOption[];
}

const GUIDE_VALUE_PREFIX = 'guide:';

/** The quick-switch value that marks a guide article as the current selection. */
export function guideSwitchValue(id: string): string {
  return `${GUIDE_VALUE_PREFIX}${id}`;
}

/**
 * Build the full grouped option list: every component group followed by every
 * non-empty guide category group. Labels resolve through the passed
 * TranslationService so the result is language-reactive.
 */
export function buildSwitchGroups(i18n: TranslationService): SwitchOptionGroup[] {
  const componentGroups: SwitchOptionGroup[] = groupDesignEntries(designRegistry).map((g) => ({
    label: i18n.translate(g.def.titleKey),
    items: g.entries.map((e) => ({
      label: e.name,
      value: e.slug,
      search: `${e.selector} ${e.tags.join(' ')}`,
    })),
  }));

  const guideGroups: SwitchOptionGroup[] = groupGuidesByCategory(articleRegistry).map((bucket) => ({
    label: i18n.translate(`devWorkshop.guides.category.${bucket.id}`),
    items: bucket.entries.map((a) => ({
      label: a.title,
      value: guideSwitchValue(a.id),
      search: `${a.tags.join(' ')} ${a.category}`,
    })),
  }));

  return [...componentGroups, ...guideGroups];
}

/** Map a chosen quick-switch value to a router-navigate path array. */
export function resolveSwitchRoute(value: string): string[] {
  return value.startsWith(GUIDE_VALUE_PREFIX)
    ? ['/dev/design/guide', value.slice(GUIDE_VALUE_PREFIX.length)]
    : ['/dev/design', value];
}
