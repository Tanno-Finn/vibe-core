import type { Type } from '@angular/core';

/**
 * Guide-article registry — the single source of truth for the agentic
 * "Guides" design-system layer (SPEC N5, Guides extension).
 *
 * A GUIDE is a long-form, tab-structured article ABOUT how to build UI with a
 * library primitive (`library`), a cross-cutting foundation (`foundations`), or
 * a page/layout pattern (`layouts`). It is the counterpart to the component
 * REGISTRY (`design-registry.ts`): the component registry documents the kit's
 * own reusable primitives one canonical doc each; the guide registry documents
 * how to WIELD library + layout building blocks the kit does not itself own.
 *
 * Each entry drives, with no manual upkeep:
 *   - a lazy child route `dev/design/guide/<id>` (generated in dev.routes.ts),
 *   - a tile in the `/dev/design` gallery "Guides" sections (by category),
 *   - a group in the detail/shell component quick-switch (switch-options.ts),
 *   - a row in the `/dev/agents` guides index table,
 *   - a token-cheap CLI entry (`scripts/design-guides.mjs list`).
 *
 * The canonical agent doc (`agentDocPath`) is the machine-readable twin: the
 * same file an agent opens on disk, the shell's Agent tab fetches, and the CLI
 * prints. English-canonical (one source for humans + agents, no i18n drift).
 *
 * PARSER CONTRACT: the gate `scripts/check-design-guides.mjs` reads this file as
 * TEXT (it is dependency-free and cannot run ts-node). Keep every entry's field
 * order exactly `id, title, category, tags, summary, related, agentDocPath,
 * loadComponent`, with each scalar a SINGLE-QUOTED string literal, `tags` and
 * `related` each a single-quoted array on ONE logical line, and `loadComponent`
 * a ONE-LINE arrow with a single-quoted `import('...')` path — so the gate's
 * regex can extract id / category / tags / related / agentDocPath / import path.
 * Do not reflow entries across these shapes.
 */
export interface ArticleRegistryEntry {
  /** URL-safe id; the route literal (`dev/design/guide/<id>`) and the doc stem. */
  id: string;
  /** Human-readable display name (gallery tile, quick-switch, table). */
  title: string;
  /** Which guides shelf this belongs to (drives category grouping). */
  category: 'library' | 'foundations' | 'layouts';
  /** Keyword tags for the gallery filter + quick-switch search (non-empty). */
  tags: string[];
  /** One-sentence essence — "when do I reach for this". */
  summary: string;
  /**
   * Ids of sibling guides worth reading next (kebab-case). Forward references
   * are allowed — an id may name a guide not built yet, so the backlog can point
   * ahead — but they carry the `planned:` prefix (`'planned:multiselect'`), in
   * this list AND in the agent doc's frontmatter, and the gate rejects a bare id
   * that resolves to nothing: from the outside, an intended forward reference
   * and a typo look identical.
   *
   * The shell renders a card only for ids that resolve; `design-guides.mjs
   * bundle` filters the rest and reports them as a note. `list` still shows the
   * list verbatim — it is the index, not a resolver.
   *
   * The graph is read UNDIRECTED by `bundle`: authors name what is worth reading
   * next from where they stand, and about a third of the edges point one way
   * only. Cross-cutting `foundations` guides need no entry here at all — the CLI
   * relates every `library` guide to every `foundations` guide by category rule.
   */
  related: string[];
  /** Browser-asset URL of the canonical agent doc (shell fetch + CLI + gate). */
  agentDocPath: string;
  /** Lazy component factory for the article's route. */
  loadComponent: () => Promise<Type<unknown>>;
}

export const articleRegistry: ArticleRegistryEntry[] = [
  {
    id: 'button',
    title: 'Button',
    category: 'library',
    tags: ['action', 'form', 'cta'],
    summary: 'Trigger an action or submit a form — one primary per view, a verb-first label.',
    related: ['select', 'selectbutton', 'toggleswitch', 'tags-and-chips', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/button.agent.md',
    loadComponent: () => import('./button/button-article.component').then((m) => m.ButtonArticleComponent),
  },
  {
    id: 'select',
    title: 'Select',
    category: 'library',
    tags: ['form', 'choice', 'overlay'],
    summary: 'Pick one value from a known list — and the honest table for when a dropdown is the wrong control.',
    related: ['button', 'selectbutton', 'multiselect', 'autocomplete', 'scroller'],
    agentDocPath: 'assets/design-system/guides/select.agent.md',
    loadComponent: () => import('./select/select-article.component').then((m) => m.SelectArticleComponent),
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    category: 'library',
    tags: ['form', 'choice', 'boolean'],
    summary: 'Zero-to-many independent choices — and the honest limits of checkbox groups and the indeterminate state.',
    related: ['radiobutton', 'toggleswitch', 'select', 'button'],
    agentDocPath: 'assets/design-system/guides/checkbox.agent.md',
    loadComponent: () => import('./checkbox/checkbox-article.component').then((m) => m.CheckboxArticleComponent),
  },
  {
    id: 'toggleswitch',
    title: 'Toggle Switch',
    category: 'library',
    tags: ['form', 'boolean', 'settings'],
    summary: 'An on/off state that takes effect the instant it moves — and the line between a switch and a checkbox.',
    related: ['checkbox', 'selectbutton', 'button', 'select'],
    agentDocPath: 'assets/design-system/guides/toggleswitch.agent.md',
    loadComponent: () => import('./toggleswitch/toggleswitch-article.component').then((m) => m.ToggleSwitchArticleComponent),
  },
  {
    id: 'slider',
    title: 'Slider',
    category: 'library',
    tags: ['form', 'numeric', 'a11y'],
    summary: 'Drag a number when "about here" is the answer — and the honest cost of that choice for keyboard and screen-reader users.',
    related: ['button', 'select', 'inputnumber', 'selectbutton', 'image'],
    agentDocPath: 'assets/design-system/guides/slider.agent.md',
    loadComponent: () => import('./slider/slider-article.component').then((m) => m.SliderArticleComponent),
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    category: 'library',
    tags: ['loading', 'feedback', 'layout'],
    summary: 'Hold the layout open while data is in flight — and the honest choice between a skeleton, a spinner, a progress bar, and nothing at all.',
    related: ['button', 'progress', 'select', 'timeline'],
    agentDocPath: 'assets/design-system/guides/skeleton.agent.md',
    loadComponent: () => import('./skeleton/skeleton-article.component').then((m) => m.SkeletonArticleComponent),
  },
  {
    id: 'dialog',
    title: 'Dialog',
    category: 'library',
    tags: ['overlay', 'modal', 'a11y'],
    summary: 'Interrupt the user with a modal window — rarely the right answer, and the focus and naming mechanics that decide whether it is usable at all.',
    related: ['drawer', 'popover', 'confirmdialog', 'button', 'image'],
    agentDocPath: 'assets/design-system/guides/dialog.agent.md',
    loadComponent: () => import('./dialog/dialog-article.component').then((m) => m.DialogArticleComponent),
  },
  {
    id: 'tags-and-chips',
    title: 'Tags and Chips',
    category: 'library',
    tags: ['status', 'label', 'collection'],
    summary: 'A tag is something the system says about an item; a chip is an item — the line the two components are constantly swapped across.',
    related: ['button', 'selectbutton', 'badge', 'avatar'],
    agentDocPath: 'assets/design-system/guides/tags-and-chips.agent.md',
    loadComponent: () => import('./tags-and-chips/tags-and-chips-article.component').then((m) => m.TagsAndChipsArticleComponent),
  },
  {
    id: 'accordion',
    title: 'Accordion',
    category: 'library',
    tags: ['layout', 'disclosure', 'a11y'],
    summary: 'Stacked disclosure panels that survive 360px — a header with no heading semantics, content that is hidden but never unmounted, and a root keyboard layer that swallows arrow keys.',
    related: ['tabs', 'card', 'panelmenu', 'a11y-guidelines', 'stepper'],
    agentDocPath: 'assets/design-system/guides/accordion.agent.md',
    loadComponent: () => import('./accordion/accordion-article.component').then((m) => m.AccordionArticleComponent),
  },
  {
    id: 'tabs',
    title: 'Tabs',
    category: 'library',
    tags: ['navigation', 'layout', 'a11y'],
    summary: 'Parallel views of one subject — and the four questions that decide between tabs, an accordion, a stepper, and separate routes.',
    related: ['accordion', 'stepper', 'select', 'button'],
    agentDocPath: 'assets/design-system/guides/tabs.agent.md',
    loadComponent: () => import('./tabs/tabs-article.component').then((m) => m.TabsArticleComponent),
  },
  {
    id: 'selectbutton',
    title: 'Select Button',
    category: 'library',
    tags: ['form', 'choice', 'segmented'],
    summary: 'Two to four exclusive options, all visible at once — and the four questions that keep it from being tabs, a switch, a radio group, or a select.',
    related: ['select', 'toggleswitch', 'tabs', 'radiobutton', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/selectbutton.agent.md',
    loadComponent: () => import('./selectbutton/selectbutton-article.component').then((m) => m.SelectButtonArticleComponent),
  },
  {
    id: 'radiobutton',
    title: 'Radio Button',
    category: 'library',
    tags: ['form', 'choice', 'exclusive'],
    summary: 'Exactly one of a visible set — assembled from single radios, a shared name, and a fieldset, because the library ships no group.',
    related: ['checkbox', 'selectbutton', 'select', 'toggleswitch'],
    agentDocPath: 'assets/design-system/guides/radiobutton.agent.md',
    loadComponent: () => import('./radiobutton/radiobutton-article.component').then((m) => m.RadioButtonArticleComponent),
  },
  {
    id: 'text-inputs',
    title: 'Text Inputs',
    category: 'library',
    tags: ['form', 'text', 'input'],
    summary: 'Free text the system cannot enumerate — one line, many lines, or welded to an addon, and the boundaries between the three.',
    related: ['select', 'autocomplete', 'inputnumber', 'button', 'constrained-inputs', 'input-labels'],
    agentDocPath: 'assets/design-system/guides/text-inputs.agent.md',
    loadComponent: () => import('./text-inputs/text-inputs-article.component').then((m) => m.TextInputsArticleComponent),
  },
  {
    id: 'progress',
    title: 'Progress',
    category: 'library',
    tags: ['loading', 'feedback', 'a11y'],
    summary: 'Say how much longer — a determinate bar when the work is countable, a spinner or an indeterminate strip when it is not.',
    related: ['skeleton', 'button', 'feedback-messages'],
    agentDocPath: 'assets/design-system/guides/progress.agent.md',
    loadComponent: () => import('./progress/progress-article.component').then((m) => m.ProgressArticleComponent),
  },
  {
    id: 'autocomplete',
    title: 'AutoComplete',
    category: 'library',
    tags: ['form', 'search', 'suggestions'],
    summary: 'Type-ahead for an answer space too large, too remote, or too open for a dropdown — and the price of a control that shows nothing at rest.',
    related: ['select', 'text-inputs', 'multiselect', 'tags-and-chips'],
    agentDocPath: 'assets/design-system/guides/autocomplete.agent.md',
    loadComponent: () => import('./autocomplete/autocomplete-article.component').then((m) => m.AutoCompleteArticleComponent),
  },
  {
    id: 'multiselect',
    title: 'MultiSelect',
    category: 'library',
    tags: ['form', 'selection', 'multiple', 'filter'],
    summary: 'Pick a set from a known list in one compact field — a checkbox listbox behind a combobox trigger, a summary label that collapses past three selections, and a filter that ships switched on; in the list a selected row carries both a checked checkbox and a highlight tint.',
    related: ['select', 'autocomplete', 'checkbox', 'tags-and-chips'],
    agentDocPath: 'assets/design-system/guides/multiselect.agent.md',
    loadComponent: () => import('./multiselect/multiselect-article.component').then((m) => m.MultiselectArticleComponent),
  },
  {
    id: 'inputnumber',
    title: 'InputNumber',
    category: 'library',
    tags: ['form', 'number', 'spinner', 'locale'],
    summary: 'A number the reader types or nudges — a real text input with role spinbutton, locale-aware formatting through Intl.NumberFormat, and optional spin buttons that are pointer-only decoration; the locale defaults to the browser, not the page.',
    related: ['slider', 'text-inputs', 'select'],
    agentDocPath: 'assets/design-system/guides/inputnumber.agent.md',
    loadComponent: () => import('./inputnumber/inputnumber-article.component').then((m) => m.InputnumberArticleComponent),
  },
  {
    id: 'drawer',
    title: 'Drawer',
    category: 'library',
    tags: ['overlay', 'panel', 'a11y'],
    summary: 'A panel pinned to an edge of the screen — the container for a side surface the page behind must stay visible for, and the focus work the library leaves to you.',
    related: ['dialog', 'popover', 'menubar', 'button'],
    agentDocPath: 'assets/design-system/guides/drawer.agent.md',
    loadComponent: () => import('./drawer/drawer-article.component').then((m) => m.DrawerArticleComponent),
  },
  {
    id: 'popover',
    title: 'Popover',
    category: 'library',
    tags: ['overlay', 'anchored', 'a11y'],
    summary: 'A panel anchored to the thing the user just clicked, with the page still live behind it — and a dialog role that promises modality it does not deliver.',
    related: ['dialog', 'drawer', 'tooltip', 'menu'],
    agentDocPath: 'assets/design-system/guides/popover.agent.md',
    loadComponent: () => import('./popover/popover-article.component').then((m) => m.PopoverArticleComponent),
  },
  {
    id: 'table',
    title: 'Table',
    category: 'library',
    tags: ['data', 'collection', 'a11y'],
    summary: 'Records compared column by column — a harness around a table you write yourself, with correct sort state and a selection nobody can hear.',
    related: ['select', 'checkbox', 'button', 'paginator', 'skeleton', 'timeline'],
    agentDocPath: 'assets/design-system/guides/table.agent.md',
    loadComponent: () => import('./table/table-article.component').then((m) => m.TableArticleComponent),
  },
  {
    id: 'card',
    title: 'Card',
    category: 'library',
    tags: ['container', 'layout', 'surface'],
    summary: 'A surface with a shadow around self-contained content — six divs with no role, no heading, and no name, and the boundary work that leaves you.',
    related: ['skeleton', 'table', 'tabs', 'button', 'timeline', 'carousel'],
    agentDocPath: 'assets/design-system/guides/card.agent.md',
    loadComponent: () => import('./card/card-article.component').then((m) => m.CardArticleComponent),
  },
  {
    id: 'timeline',
    title: 'Timeline',
    category: 'library',
    tags: ['layout', 'collection', 'a11y'],
    summary: 'A rail of markers with content beside it — six divs of pure geometry that ship no role, no name, and no keyboard, and an alternating layout with no narrow-screen answer.',
    related: ['card', 'table', 'skeleton'],
    agentDocPath: 'assets/design-system/guides/timeline.agent.md',
    loadComponent: () => import('./timeline/timeline-article.component').then((m) => m.TimelineArticleComponent),
  },
  {
    id: 'menubar',
    title: 'Menubar',
    category: 'library',
    tags: ['navigation', 'menu', 'a11y'],
    summary: 'A bar of menus for commands — one tab stop, arrow keys inside, a second branch below a breakpoint, and the role question deciding whether it belongs in a site header.',
    related: ['tabs', 'drawer', 'menu', 'panelmenu', 'button'],
    agentDocPath: 'assets/design-system/guides/menubar.agent.md',
    loadComponent: () => import('./menubar/menubar-article.component').then((m) => m.MenubarArticleComponent),
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumb',
    category: 'library',
    tags: ['navigation', 'a11y', 'hierarchy'],
    summary: 'A trail saying where the page sits in a hierarchy — the nav landmark the library already renders, the aria-current it already sets, and a last crumb that stays a tab stop with nowhere to go.',
    related: ['menubar', 'tabs', 'ui-pattern-selection', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/breadcrumb.agent.md',
    loadComponent: () => import('./breadcrumb/breadcrumb-article.component').then((m) => m.BreadcrumbArticleComponent),
  },
  {
    id: 'feedback-messages',
    title: 'Feedback Messages',
    category: 'library',
    tags: ['feedback', 'status', 'a11y'],
    summary: 'Tell the user what just happened — an inline message that stays with the thing it is about, or a toast that leaves on its own before anyone has read it.',
    related: ['dialog', 'progress', 'text-inputs', 'skeleton'],
    agentDocPath: 'assets/design-system/guides/feedback-messages.agent.md',
    loadComponent: () => import('./feedback-messages/feedback-messages-article.component').then((m) => m.FeedbackMessagesArticleComponent),
  },
  {
    id: 'design-tokens',
    title: 'Design Tokens',
    category: 'foundations',
    tags: ['tokens', 'theming', 'css-variables'],
    summary: 'Every color, space, and radius is a CSS custom property written by four layers that all target the same names — read them with var(), override at the layer that owns the value, and know which layer wins.',
    related: ['color-system', 'typography', 'a11y-guidelines', 'i18n-localization', 'button', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/design-tokens.agent.md',
    loadComponent: () => import('./design-tokens/design-tokens-article.component').then((m) => m.DesignTokensArticleComponent),
  },
  {
    id: 'color-system',
    title: 'Color System',
    category: 'foundations',
    tags: ['color', 'contrast', 'accessibility', 'theming'],
    summary: 'Kit role tokens per visual style and mode, ten accent palettes, and the Aura widget tokens re-pointed at them — one gate measures every pair in every style, mode, and accent, so which color may sit on which ground is a quoted number.',
    related: ['design-tokens', 'typography', 'a11y-guidelines', 'i18n-localization', 'ui-pattern-selection'],
    agentDocPath: 'assets/design-system/guides/color-system.agent.md',
    loadComponent: () => import('./color-system/color-system-article.component').then((m) => m.ColorSystemArticleComponent),
  },
  {
    id: 'typography',
    title: 'Typography',
    category: 'foundations',
    tags: ['typography', 'fonts', 'readability', 'tokens'],
    summary: 'Three scales and seven family names, generously declared and sparsely applied — the global stylesheet sets a family on body and on headings but no unscoped size rule on prose, so heading sizes come from the user agent, type never moves with the viewport, and only two of the nine weight tokens have a real face behind them.',
    related: ['design-tokens', 'color-system', 'a11y-guidelines', 'i18n-localization', 'ui-pattern-selection', 'article-layout'],
    agentDocPath: 'assets/design-system/guides/typography.agent.md',
    loadComponent: () => import('./typography/typography-article.component').then((m) => m.TypographyArticleComponent),
  },
  {
    id: 'a11y-guidelines',
    title: 'Accessibility Guidelines',
    category: 'foundations',
    tags: ['accessibility', 'a11y', 'wcag', 'focus', 'keyboard'],
    summary: 'Four global mechanisms and a set of conventions — one universal reduced-motion catch-all, one kit focus ring for every focusable Optimus UI part, one hidden-text class, and an app shell with a skip link — every other control is accessible here because its author wired the name, the ring, and the announcement.',
    related: ['design-tokens', 'color-system', 'typography', 'i18n-localization', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/a11y-guidelines.agent.md',
    loadComponent: () => import('./a11y-guidelines/a11y-guidelines-article.component').then((m) => m.A11yGuidelinesArticleComponent),
  },
  {
    id: 'i18n-localization',
    title: 'I18n & Localization',
    category: 'foundations',
    tags: ['i18n', 'localization', 'translation', 'easy-language'],
    summary: 'One JSON module per namespace per language, split into a small core bundle plus lazy chunks and read by a lookup that neither interpolates nor pluralizes — every miss walks a fallback chain ending in English, and a key missing there renders as itself.',
    related: ['a11y-guidelines', 'typography', 'design-tokens', 'color-system', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/i18n-localization.agent.md',
    loadComponent: () => import('./i18n-localization/i18n-localization-article.component').then((m) => m.I18nLocalizationArticleComponent),
  },
  {
    id: 'ui-pattern-selection',
    title: 'UI Pattern Selection',
    category: 'foundations',
    tags: ['patterns', 'decisions', 'reuse', 'components'],
    summary: 'Choose the layer before the control — five needs are answered by the kit itself before the library is reached, a documented library component states its own boundaries in its own guide, and what is left over is plain HTML.',
    related: ['color-system', 'typography', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/ui-pattern-selection.agent.md',
    loadComponent: () => import('./ui-pattern-selection/ui-pattern-selection-article.component').then((m) => m.UiPatternSelectionArticleComponent),
  },
  {
    id: 'forms',
    title: 'Forms',
    category: 'foundations',
    tags: ['forms', 'validation', 'errors', 'submit'],
    summary: 'Compose controls into a submit flow — a signal per field with a split ngModel binding, validation as a pure function whose errors gate on touched-or-submit, and an invalid state you compute yourself, because neither layer validates for you.',
    related: ['text-inputs', 'input-labels', 'checkbox', 'select', 'button', 'feedback-messages', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/forms.agent.md',
    loadComponent: () => import('./forms/forms-article.component').then((m) => m.FormsArticleComponent),
  },
  {
    id: 'article-layout',
    title: 'Article Layout',
    category: 'layouts',
    tags: ['layout', 'article', 'composition', 'headings'],
    summary: 'One template owns the page frame and the author owns the middle — a fixed reading order from lead to checkpoint, heading levels the blocks decide rather than hand-written tags, and one column that clips whatever it cannot fit.',
    related: ['ui-pattern-selection', 'typography', 'a11y-guidelines', 'design-tokens', 'i18n-localization', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/article-layout.agent.md',
    loadComponent: () => import('./article-layout/article-layout-article.component').then((m) => m.ArticleLayoutArticleComponent),
  },
  {
    id: 'demo-layout',
    title: 'Demo Layout',
    category: 'layouts',
    tags: ['layout', 'demo', 'canvas', 'controls'],
    summary: 'A demo is a page built from the kit blueprint, not a template — the stage comes before the controls in the document, the two-column switch queries the width of the demo itself rather than the viewport, and one live region announces discrete changes.',
    related: ['article-layout', 'ui-pattern-selection', 'a11y-guidelines', 'design-tokens', 'i18n-localization', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/demo-layout.agent.md',
    loadComponent: () => import('./demo-layout/demo-layout-article.component').then((m) => m.DemoLayoutArticleComponent),
  },
  {
    id: 'chart',
    title: 'Chart',
    category: 'library',
    tags: ['chart', 'canvas', 'a11y', 'bundle'],
    summary: 'A thin wrapper around a chart.js canvas the kit installs but never renders — 208 kB of dependency that has to stay lazy, a redraw that fires only when data or options change identity, and one opaque canvas that says nothing to a screen reader until a data table stands beside it.',
    related: ['table', 'demo-layout', 'a11y-guidelines', 'color-system', 'ui-pattern-selection'],
    agentDocPath: 'assets/design-system/guides/chart.agent.md',
    loadComponent: () => import('./chart/chart-article.component').then((m) => m.ChartArticleComponent),
  },
  {
    id: 'divider',
    title: 'Divider',
    category: 'library',
    tags: ['divider', 'separator', 'layout', 'a11y', 'tokens'],
    summary: 'A one-pixel rule on a host that is always role="separator" — content projected into the line lands inside a role whose children are presentational, a vertical divider has no height of its own, and the border style needs both its classes to appear.',
    related: ['card', 'tabs', 'menubar', 'design-tokens', 'ui-pattern-selection', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/divider.agent.md',
    loadComponent: () => import('./divider/divider-article.component').then((m) => m.DividerArticleComponent),
  },
  {
    id: 'rating',
    title: 'Rating',
    category: 'library',
    tags: ['rating', 'stars', 'radio', 'forms', 'a11y'],
    summary: 'A star strip that is not one control but a set of native radio inputs clipped to a pixel — no group role and no name of its own, a read-only mode that changes nothing an assistive technology can see, star labels that come from the shared library config rather than your template, and a re-selection that clears the value.',
    related: ['radiobutton', 'selectbutton', 'slider', 'forms', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/rating.agent.md',
    loadComponent: () => import('./rating/rating-article.component').then((m) => m.RatingArticleComponent),
  },
  {
    id: 'hub-layout',
    title: 'Hub Layout',
    category: 'layouts',
    tags: ['layout', 'hub', 'grid', 'cards'],
    summary: 'An overview page is a page-wide grid of registry-fed cards — one template ships for it and takes no projected content, the grid answers the viewport because the hub owns the page, and the state that replaces the cards has to say whether nothing matched or nothing loaded.',
    related: ['article-layout', 'demo-layout', 'ui-pattern-selection', 'a11y-guidelines', 'design-tokens', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/hub-layout.agent.md',
    loadComponent: () => import('./hub-layout/hub-layout-article.component').then((m) => m.HubLayoutArticleComponent),
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    category: 'library',
    tags: ['overlay', 'hint', 'directive', 'a11y'],
    summary: 'An attribute directive that builds a detached role="tooltip" node on show and deletes it on hide — nothing ties it to the trigger, the default binding is pointer-only, and on touch it lasts as long as the press.',
    related: ['popover', 'button', 'ui-pattern-selection', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/tooltip.agent.md',
    loadComponent: () => import('./tooltip/tooltip-article.component').then((m) => m.TooltipArticleComponent),
  },
  {
    id: 'confirmdialog',
    title: 'Confirm Dialog and Confirm Popup',
    category: 'library',
    tags: ['overlay', 'confirmation', 'destructive', 'a11y'],
    summary: 'One service drives two surfaces — a modal alertdialog and an anchored one — and they disagree about focus, about what a dismissal reports, and about whether the message is escaped.',
    related: ['dialog', 'popover', 'button', 'feedback-messages'],
    agentDocPath: 'assets/design-system/guides/confirmdialog.agent.md',
    loadComponent: () => import('./confirmdialog/confirmdialog-article.component').then((m) => m.ConfirmdialogArticleComponent),
  },
  {
    id: 'badge',
    title: 'Badge, pBadge, and Overlay Badge',
    category: 'library',
    tags: ['status', 'count', 'indicator', 'a11y'],
    summary: 'Three deliveries of one span, and the number inside it is bare text that names nothing — so where the badge node lands, and where the fact is said instead, is the whole decision.',
    related: ['tags-and-chips', 'button', 'feedback-messages', 'a11y-guidelines', 'avatar'],
    agentDocPath: 'assets/design-system/guides/badge.agent.md',
    loadComponent: () => import('./badge/badge-article.component').then((m) => m.BadgeArticleComponent),
  },
  {
    id: 'stepper',
    title: 'Stepper and Steps',
    category: 'library',
    tags: ['wizard', 'process', 'navigation', 'a11y'],
    summary: 'One holds the content and decides the order, the other only draws where you are — and neither ever says "done" or "3 of 5", so every state a step bar seems to show is state you have to state yourself.',
    related: ['tabs', 'forms', 'progress', 'ui-pattern-selection', 'a11y-guidelines', 'carousel'],
    agentDocPath: 'assets/design-system/guides/stepper.agent.md',
    loadComponent: () => import('./stepper/stepper-article.component').then((m) => m.StepperArticleComponent),
  },
  {
    id: 'togglebutton',
    title: 'Toggle Button',
    category: 'library',
    tags: ['form', 'boolean', 'toggle', 'group'],
    summary: 'A button that stays pressed — its state lives in aria-pressed, and its label must not move with it; grouping belongs to the toolbar guide.',
    related: ['selectbutton', 'toggleswitch', 'checkbox', 'button', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/togglebutton.agent.md',
    loadComponent: () => import('./togglebutton/togglebutton-article.component').then((m) => m.ToggleButtonArticleComponent),
  },
  {
    id: 'fieldset',
    title: 'Fieldset and Panel',
    category: 'library',
    tags: ['container', 'grouping', 'disclosure', 'a11y'],
    summary: 'Two boxes that look alike and are not — one renders a native fieldset and legend that names its group, the other a bold span that names nothing, and collapsing either hides the content without removing it.',
    related: ['card', 'accordion', 'forms', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/fieldset.agent.md',
    loadComponent: () => import('./fieldset/fieldset-article.component').then((m) => m.FieldsetArticleComponent),
  },
  {
    id: 'menu',
    title: 'Menu, TieredMenu, and ContextMenu',
    category: 'library',
    tags: ['navigation', 'menu', 'overlay', 'a11y'],
    summary: 'Three vertical menus that share one MenuItem model and agree on almost nothing else — where focus lands, what a keyboard can reach, and who restores the trigger differs in each.',
    related: ['menubar', 'panelmenu', 'popover', 'drawer', 'a11y-guidelines', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/menu.agent.md',
    loadComponent: () => import('./menu/menu-article.component').then((m) => m.MenuArticleComponent),
  },
  {
    id: 'datepicker',
    title: 'DatePicker',
    category: 'library',
    tags: ['form', 'date', 'overlay'],
    summary: 'A text field welded to a calendar dialog — which half your users can actually reach, and which strings the kit never translates.',
    related: ['text-inputs', 'forms', 'select', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/datepicker.agent.md',
    loadComponent: () => import('./datepicker/datepicker-article.component').then((m) => m.DatePickerArticleComponent),
  },
  {
    id: 'tree',
    title: 'Tree, TreeTable, and TreeSelect',
    category: 'library',
    tags: ['data', 'hierarchy', 'a11y'],
    summary: 'Hierarchy in three shapes — a tree, a tree in a grid, and a tree in a form field, each with its own keyboard owner and its own naming gap.',
    related: ['table', 'select', 'multiselect', 'checkbox', 'a11y-guidelines', 'scroller'],
    agentDocPath: 'assets/design-system/guides/tree.agent.md',
    loadComponent: () => import('./tree/tree-article.component').then((m) => m.TreeArticleComponent),
  },
  {
    id: 'editor',
    title: 'Editor',
    category: 'library',
    tags: ['form', 'rich-text', 'quill', 'a11y'],
    summary: 'A rich-text field whose engine is a peer library the kit does not install — so the first question is not how to configure it, but whether it runs at all.',
    related: ['text-inputs', 'forms', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/editor.agent.md',
    loadComponent: () => import('./editor/editor-article.component').then((m) => m.EditorArticleComponent),
  },
  {
    id: 'fileupload',
    title: 'File Upload',
    category: 'library',
    tags: ['forms', 'upload', 'feedback', 'a11y'],
    summary: 'An upload queue with a drop area, a progress bar, and its own validation messages — and a failure path that shows the user nothing unless you build it.',
    related: ['progress', 'feedback-messages', 'button', 'forms', 'dragdrop'],
    agentDocPath: 'assets/design-system/guides/fileupload.agent.md',
    loadComponent: () => import('./fileupload/fileupload-article.component').then((m) => m.FileUploadArticleComponent),
  },
  {
    id: 'dataview',
    title: 'DataView, OrderList, and PickList',
    category: 'library',
    tags: ['collection', 'reorder', 'transfer', 'a11y'],
    summary: 'Three list arrangements that share only their data shape — one renders cards you write yourself, two move rows for you, and none of them says out loud that a move happened.',
    related: ['table', 'paginator', 'multiselect', 'select', 'button', 'a11y-guidelines', 'dragdrop'],
    agentDocPath: 'assets/design-system/guides/dataview.agent.md',
    loadComponent: () => import('./dataview/dataview-article.component').then((m) => m.DataviewArticleComponent),
  },
  {
    id: 'listbox',
    title: 'Listbox, MegaMenu, and CascadeSelect',
    category: 'library',
    tags: ['selection', 'navigation', 'aria', 'overlay'],
    summary: 'Three components named after three ARIA roles — one keeps its promise with a hardcoded contradiction inside it, one keeps it but cannot say its own name, and one keeps it by declaring itself a tree.',
    related: ['select', 'multiselect', 'menubar', 'autocomplete', 'a11y-guidelines', 'scroller'],
    agentDocPath: 'assets/design-system/guides/listbox.agent.md',
    loadComponent: () => import('./listbox/listbox-article.component').then((m) => m.ListboxArticleComponent),
  },
  {
    id: 'constrained-inputs',
    title: 'Constrained Inputs',
    category: 'library',
    tags: ['form', 'input', 'validation', 'security'],
    summary: 'Text fields that refuse the wrong keystroke — a fixed format, a one-time code, a secret, or a character class — and what each refusal costs.',
    related: ['text-inputs', 'forms', 'inputnumber', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/constrained-inputs.agent.md',
    loadComponent: () => import('./constrained-inputs/constrained-inputs-article.component').then((m) => m.ConstrainedInputsArticleComponent),
  },
  {
    id: 'input-labels',
    title: 'Input Labels',
    category: 'library',
    tags: ['form', 'label', 'a11y'],
    summary: 'The two hulls that move a label into the field — one that lifts on focus, one that never moves — neither of which ships a label, names your field, or leaves the label clickable.',
    related: ['forms', 'text-inputs', 'select', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/input-labels.agent.md',
    loadComponent: () => import('./input-labels/input-labels-article.component').then((m) => m.InputLabelsArticleComponent),
  },
  {
    id: 'paginator',
    title: 'Paginator',
    category: 'library',
    tags: ['navigation', 'collection', 'paging', 'a11y'],
    summary: 'The page bar Table and DataView embed, and the one you stand up yourself — buttons in no landmark, a page link whose accessible name is a bare digit, and a slot order no input can change.',
    related: ['table', 'dataview', 'select', 'i18n-localization', 'scroller'],
    agentDocPath: 'assets/design-system/guides/paginator.agent.md',
    loadComponent: () => import('./paginator/paginator-article.component').then((m) => m.PaginatorArticleComponent),
  },
  {
    id: 'panelmenu',
    title: 'PanelMenu',
    category: 'library',
    tags: ['navigation', 'menu', 'disclosure', 'a11y'],
    summary: 'A stack of collapsible panels whose headers are disclosure buttons and whose bodies are ARIA trees — two focus models in one widget, and expansion state that lives in your model objects.',
    related: ['menu', 'menubar', 'accordion', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/panelmenu.agent.md',
    loadComponent: () => import('./panelmenu/panelmenu-article.component').then((m) => m.PanelmenuArticleComponent),
  },
  {
    id: 'avatar',
    title: 'Avatar and AvatarGroup',
    category: 'library',
    tags: ['people', 'image', 'identity', 'a11y'],
    summary: 'A box of initials, an icon, or a portrait on a host with no role — the picture ships without alt text, a name on the bare host is not dependable, and the group is an overlapping row that says nothing about who is in it.',
    related: ['tags-and-chips', 'badge', 'skeleton', 'timeline', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/avatar.agent.md',
    loadComponent: () => import('./avatar/avatar-article.component').then((m) => m.AvatarArticleComponent),
  },
  {
    id: 'image',
    title: 'Image and ImageCompare',
    category: 'library',
    tags: ['image', 'media', 'alt-text', 'overlay', 'a11y'],
    summary: 'An image that passes your alt text through and can open a preview modal with no name and no alt on the enlarged picture, and a before/after slider that the keyboard can move but no screen reader can follow.',
    related: ['avatar', 'dialog', 'slider', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/image.agent.md',
    loadComponent: () => import('./image/image-article.component').then((m) => m.ImageArticleComponent),
  },
  {
    id: 'dragdrop',
    title: 'Drag and Drop',
    category: 'library',
    tags: ['interaction', 'pointer', 'sorting', 'a11y'],
    summary: 'Two directives that wrap the native drag events and add no role, no focus, and no key — ship a button path and a spoken result beside every drag.',
    related: ['dataview', 'button', 'fileupload', 'feedback-messages'],
    agentDocPath: 'assets/design-system/guides/dragdrop.agent.md',
    loadComponent: () => import('./dragdrop/dragdrop-article.component').then((m) => m.DragdropArticleComponent),
  },
  {
    id: 'carousel',
    title: 'Carousel and Galleria',
    category: 'library',
    tags: ['collection', 'media', 'motion', 'a11y'],
    summary: 'Mostly a guide on when not to hide content behind slides — and, where you do, the names, button types, and rotation controls the two components leave to you.',
    related: ['card', 'stepper', 'dataview', 'button'],
    agentDocPath: 'assets/design-system/guides/carousel.agent.md',
    loadComponent: () => import('./carousel/carousel-article.component').then((m) => m.CarouselArticleComponent),
  },
  {
    id: 'toolbar',
    title: 'Toolbar, Button Group, and Split Button',
    category: 'library',
    tags: ['action', 'group', 'menu', 'a11y'],
    summary: 'Buttons side by side — a toolbar role whose arrow keys you must add, a group nobody can name, and a split button whose menu drops focus on close.',
    related: ['button', 'togglebutton', 'menu', 'selectbutton'],
    agentDocPath: 'assets/design-system/guides/toolbar.agent.md',
    loadComponent: () => import('./toolbar/toolbar-article.component').then((m) => m.ToolbarArticleComponent),
  },
  {
    id: 'scroller',
    title: 'Scroller',
    category: 'library',
    tags: ['list', 'performance', 'a11y'],
    summary: 'Virtual scrolling for long uniform lists — and the honest cost: find-in-page, list size, and focus stop at the edge of the rendered slice.',
    related: ['listbox', 'select', 'paginator', 'tree'],
    agentDocPath: 'assets/design-system/guides/scroller.agent.md',
    loadComponent: () => import('./scroller/scroller-article.component').then((m) => m.ScrollerArticleComponent),
  },
];

/** Lookup by id (shell resolves its entry from an `[entryId]` input). */
export function findArticle(id: string): ArticleRegistryEntry | undefined {
  return articleRegistry.find((a) => a.id === id);
}

/** Ordered guide categories (drives gallery sections + quick-switch groups). */
export const GUIDE_CATEGORIES: ArticleRegistryEntry['category'][] = ['library', 'foundations', 'layouts'];

export interface GuideCategoryBucket {
  id: ArticleRegistryEntry['category'];
  entries: ArticleRegistryEntry[];
}

/**
 * Partition the registry into its categories in fixed order; empty categories
 * are dropped so a shelf with no guides yet never renders an empty section.
 */
export function groupGuidesByCategory(
  entries: readonly ArticleRegistryEntry[] = articleRegistry,
): GuideCategoryBucket[] {
  return GUIDE_CATEGORIES.map((id) => ({
    id,
    entries: entries.filter((e) => e.category === id),
  })).filter((b) => b.entries.length > 0);
}
