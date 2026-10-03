/**
 * The sitemap's groups for a live query — moved verbatim out of
 * AppComponent's filteredNavigationGroups computed, which now only supplies
 * its signals. An empty query returns the full sitemap (with overflow links);
 * otherwise the matching pages are regrouped and truncated the same way.
 */
import { NavigationGroup, NavigationItem, NavigationService } from '../services/navigation.service';

export function sitemapGroupsFor(
  navigationService: NavigationService,
  rawQuery: string,
  translate: (key: string) => string,
): NavigationGroup[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return navigationService.getNavigationGroupsWithOverflow();
  }
  const matches = navigationService.filterPages(query).filter((p) => !p.isShowAllLink);
  const groups = new Map<string, NavigationGroup>();
  for (const item of matches) {
    const key = item.group ?? 'misc';
    const label = item.groupLabel ?? translate('app.nav.group.misc');
    let group = groups.get(key);
    if (!group) {
      group = { key, label, items: [] };
      groups.set(key, group);
    }
    group.items.push(item);
  }
  // Apply the same overflow truncation as the unfiltered view so the
  // result for a wide-matching query (e.g. "data" in lessons) doesn't
  // explode the sitemap height. Groups without an overflow config
  // (e.g. "misc") render in full.
  return [...groups.values()].map((group) => {
    const config = navigationService.getGroupConfig(group.key);
    if (!config || group.items.length <= config.maxItems) {
      return group;
    }
    const limitedItems = group.items.slice(0, config.maxItems);
    const showAllLink: NavigationItem = {
      label: translate(config.labelKey) || `... alle ${group.items.length} →`,
      route: config.hubRoute,
      icon: 'pi pi-arrow-right',
      group: group.key,
      isShowAllLink: true,
      totalCount: group.items.length,
      pageId: config.hubPageId,
    };
    return { ...group, items: [...limitedItems, showAllLink] };
  });
}
