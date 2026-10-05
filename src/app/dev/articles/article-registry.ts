import type { Type } from '@angular/core';
import { LANGUAGE_RULES } from '../../../config/languages';

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
 * prints. The agent doc stays English: it is the contract for AI agents.
 *
 * The ARTICLE a human reads ships twice: the English canonical component and a
 * German twin (`<id>-article.de.component.ts`, ADR-0018) that extends it. The
 * route renders the twin when the base language is `de` (de, de-easy) and the
 * English component otherwise; `titleDe` / `summaryDe` carry the German
 * display strings for every entry (`localizedGuide()` picks the pair).
 *
 * PARSER CONTRACT: the gate `scripts/check-design-guides.mjs` reads this file as
 * TEXT (it is dependency-free and cannot run ts-node). Keep every entry's field
 * order exactly `id, title, titleDe, category, tags, summary, summaryDe, related,
 * agentDocPath, loadComponent`, with each scalar a SINGLE-QUOTED string literal, `tags` and
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
  /** German display name (shown when the base language is `de`). */
  titleDe: string;
  /** Which guides shelf this belongs to (drives category grouping). */
  category: 'library' | 'foundations' | 'layouts';
  /** Keyword tags for the gallery filter + quick-switch search (non-empty). */
  tags: string[];
  /** One-sentence essence — "when do I reach for this". */
  summary: string;
  /** German one-sentence essence (shown when the base language is `de`). */
  summaryDe: string;
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
    titleDe: 'Button',
    category: 'library',
    tags: ['action', 'form', 'cta'],
    summary: 'Trigger an action or submit a form — one primary per view, a verb-first label.',
    summaryDe: 'Eine Aktion auslösen oder ein Formular absenden — ein primärer Button pro Ansicht, ein Label, das mit dem Verb beginnt.',
    related: ['select', 'selectbutton', 'toggleswitch', 'tags-and-chips', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/button.agent.md',
    loadComponent: () => import('./button/button-article.component').then((m) => m.ButtonArticleComponent),
  },
  {
    id: 'select',
    title: 'Select',
    titleDe: 'Select',
    category: 'library',
    tags: ['form', 'choice', 'overlay'],
    summary: 'Pick one value from a known list — and the honest table for when a dropdown is the wrong control.',
    summaryDe: 'Einen Wert aus einer bekannten Liste wählen — und die ehrliche Tabelle dafür, wann ein Dropdown das falsche Steuerelement ist.',
    related: ['button', 'selectbutton', 'multiselect', 'autocomplete', 'scroller'],
    agentDocPath: 'assets/design-system/guides/select.agent.md',
    loadComponent: () => import('./select/select-article.component').then((m) => m.SelectArticleComponent),
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    titleDe: 'Checkbox',
    category: 'library',
    tags: ['form', 'choice', 'boolean'],
    summary: 'Zero-to-many independent choices — and the honest limits of checkbox groups and the indeterminate state.',
    summaryDe: 'Null bis viele unabhängige Entscheidungen — und die ehrlichen Grenzen von Checkbox-Gruppen und dem Zustand „indeterminate“.',
    related: ['radiobutton', 'toggleswitch', 'select', 'button'],
    agentDocPath: 'assets/design-system/guides/checkbox.agent.md',
    loadComponent: () => import('./checkbox/checkbox-article.component').then((m) => m.CheckboxArticleComponent),
  },
  {
    id: 'toggleswitch',
    title: 'Toggle Switch',
    titleDe: 'Toggle Switch',
    category: 'library',
    tags: ['form', 'boolean', 'settings'],
    summary: 'An on/off state that takes effect the instant it moves — and the line between a switch and a checkbox.',
    summaryDe: 'Ein An/Aus-Zustand, der im Moment des Umschaltens wirkt — und die Grenze zwischen Switch und Checkbox.',
    related: ['checkbox', 'selectbutton', 'button', 'select'],
    agentDocPath: 'assets/design-system/guides/toggleswitch.agent.md',
    loadComponent: () => import('./toggleswitch/toggleswitch-article.component').then((m) => m.ToggleSwitchArticleComponent),
  },
  {
    id: 'slider',
    title: 'Slider',
    titleDe: 'Slider',
    category: 'library',
    tags: ['form', 'numeric', 'a11y'],
    summary: 'Drag a number when "about here" is the answer — and the honest cost of that choice for keyboard and screen-reader users.',
    summaryDe: 'Eine Zahl ziehen, wenn „ungefähr hier“ die Antwort ist — und was diese Wahl Tastatur- und Screenreader-Nutzer ehrlich kostet.',
    related: ['button', 'select', 'inputnumber', 'selectbutton', 'image'],
    agentDocPath: 'assets/design-system/guides/slider.agent.md',
    loadComponent: () => import('./slider/slider-article.component').then((m) => m.SliderArticleComponent),
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    titleDe: 'Skeleton',
    category: 'library',
    tags: ['loading', 'feedback', 'layout'],
    summary: 'Hold the layout open while data is in flight — and the honest choice between a skeleton, a spinner, a progress bar, and nothing at all.',
    summaryDe: 'Das Layout offen halten, während Daten unterwegs sind — und die ehrliche Wahl zwischen Skeleton, Spinner, Fortschrittsbalken und gar nichts.',
    related: ['button', 'progress', 'select', 'timeline'],
    agentDocPath: 'assets/design-system/guides/skeleton.agent.md',
    loadComponent: () => import('./skeleton/skeleton-article.component').then((m) => m.SkeletonArticleComponent),
  },
  {
    id: 'dialog',
    title: 'Dialog',
    titleDe: 'Dialog',
    category: 'library',
    tags: ['overlay', 'modal', 'a11y'],
    summary: 'Interrupt the user with a modal window — rarely the right answer, and the focus and naming mechanics that decide whether it is usable at all.',
    summaryDe: 'Den Nutzer mit einem modalen Fenster unterbrechen — selten die richtige Antwort, und die Fokus- und Benennungsmechanik, die entscheidet, ob es überhaupt benutzbar ist.',
    related: ['drawer', 'popover', 'confirmdialog', 'button', 'image'],
    agentDocPath: 'assets/design-system/guides/dialog.agent.md',
    loadComponent: () => import('./dialog/dialog-article.component').then((m) => m.DialogArticleComponent),
  },
  {
    id: 'tags-and-chips',
    title: 'Tags and Chips',
    titleDe: 'Tags und Chips',
    category: 'library',
    tags: ['status', 'label', 'collection'],
    summary: 'A tag is something the system says about an item; a chip is an item — the line the two components are constantly swapped across.',
    summaryDe: 'Ein Tag ist etwas, das das System über ein Element sagt; ein Chip ist ein Element — die Grenze, über die hinweg die beiden Komponenten ständig vertauscht werden.',
    related: ['button', 'selectbutton', 'badge', 'avatar'],
    agentDocPath: 'assets/design-system/guides/tags-and-chips.agent.md',
    loadComponent: () => import('./tags-and-chips/tags-and-chips-article.component').then((m) => m.TagsAndChipsArticleComponent),
  },
  {
    id: 'accordion',
    title: 'Accordion',
    titleDe: 'Accordion',
    category: 'library',
    tags: ['layout', 'disclosure', 'a11y'],
    summary: 'Stacked disclosure panels that survive 360px — a header with no heading semantics, content that is hidden but never unmounted, and a root keyboard layer that swallows arrow keys.',
    summaryDe: 'Gestapelte Aufklapp-Panels, die 360px überstehen — ein Header ohne Überschriften-Semantik, Inhalt, der versteckt, aber nie ausgehängt wird, und eine Tastaturebene an der Wurzel, die Pfeiltasten schluckt.',
    related: ['tabs', 'card', 'panelmenu', 'a11y-guidelines', 'stepper'],
    agentDocPath: 'assets/design-system/guides/accordion.agent.md',
    loadComponent: () => import('./accordion/accordion-article.component').then((m) => m.AccordionArticleComponent),
  },
  {
    id: 'tabs',
    title: 'Tabs',
    titleDe: 'Tabs',
    category: 'library',
    tags: ['navigation', 'layout', 'a11y'],
    summary: 'Parallel views of one subject — and the four questions that decide between tabs, an accordion, a stepper, and separate routes.',
    summaryDe: 'Parallele Ansichten eines Themas — und die vier Fragen, die zwischen Tabs, Accordion, Stepper und getrennten Routen entscheiden.',
    related: ['accordion', 'stepper', 'select', 'button'],
    agentDocPath: 'assets/design-system/guides/tabs.agent.md',
    loadComponent: () => import('./tabs/tabs-article.component').then((m) => m.TabsArticleComponent),
  },
  {
    id: 'selectbutton',
    title: 'Select Button',
    titleDe: 'Select Button',
    category: 'library',
    tags: ['form', 'choice', 'segmented'],
    summary: 'Two to four exclusive options, all visible at once — and the four questions that keep it from being tabs, a switch, a radio group, or a select.',
    summaryDe: 'Zwei bis vier sich ausschließende Optionen, alle gleichzeitig sichtbar — und die vier Fragen, die verhindern, dass daraus Tabs, ein Switch, eine Radio-Gruppe oder ein Select werden.',
    related: ['select', 'toggleswitch', 'tabs', 'radiobutton', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/selectbutton.agent.md',
    loadComponent: () => import('./selectbutton/selectbutton-article.component').then((m) => m.SelectButtonArticleComponent),
  },
  {
    id: 'radiobutton',
    title: 'Radio Button',
    titleDe: 'Radio Button',
    category: 'library',
    tags: ['form', 'choice', 'exclusive'],
    summary: 'Exactly one of a visible set — assembled from single radios, a shared name, and a fieldset, because the library ships no group.',
    summaryDe: 'Genau eine Option aus einer sichtbaren Menge — zusammengesetzt aus einzelnen Radios, einem gemeinsamen Namen und einem Fieldset, weil die Bibliothek keine Gruppe mitliefert.',
    related: ['checkbox', 'selectbutton', 'select', 'toggleswitch'],
    agentDocPath: 'assets/design-system/guides/radiobutton.agent.md',
    loadComponent: () => import('./radiobutton/radiobutton-article.component').then((m) => m.RadioButtonArticleComponent),
  },
  {
    id: 'text-inputs',
    title: 'Text Inputs',
    titleDe: 'Texteingaben',
    category: 'library',
    tags: ['form', 'text', 'input'],
    summary: 'Free text the system cannot enumerate — one line, many lines, or welded to an addon, and the boundaries between the three.',
    summaryDe: 'Freitext, den das System nicht aufzählen kann — eine Zeile, viele Zeilen oder mit einem Addon verschweißt, und die Grenzen zwischen den dreien.',
    related: ['select', 'autocomplete', 'inputnumber', 'button', 'constrained-inputs', 'input-labels'],
    agentDocPath: 'assets/design-system/guides/text-inputs.agent.md',
    loadComponent: () => import('./text-inputs/text-inputs-article.component').then((m) => m.TextInputsArticleComponent),
  },
  {
    id: 'progress',
    title: 'Progress',
    titleDe: 'Fortschritt',
    category: 'library',
    tags: ['loading', 'feedback', 'a11y'],
    summary: 'Say how much longer — a determinate bar when the work is countable, a spinner or an indeterminate strip when it is not.',
    summaryDe: 'Sagen, wie lange es noch dauert — ein determinierter Balken, wenn die Arbeit zählbar ist, ein Spinner oder ein unbestimmter Streifen, wenn nicht.',
    related: ['skeleton', 'button', 'feedback-messages'],
    agentDocPath: 'assets/design-system/guides/progress.agent.md',
    loadComponent: () => import('./progress/progress-article.component').then((m) => m.ProgressArticleComponent),
  },
  {
    id: 'autocomplete',
    title: 'AutoComplete',
    titleDe: 'AutoComplete',
    category: 'library',
    tags: ['form', 'search', 'suggestions'],
    summary: 'Type-ahead for an answer space too large, too remote, or too open for a dropdown — and the price of a control that shows nothing at rest.',
    summaryDe: 'Vorschläge beim Tippen für einen Antwortraum, der zu groß, zu weit entfernt oder zu offen für ein Dropdown ist — und der Preis eines Steuerelements, das im Ruhezustand nichts zeigt.',
    related: ['select', 'text-inputs', 'multiselect', 'tags-and-chips'],
    agentDocPath: 'assets/design-system/guides/autocomplete.agent.md',
    loadComponent: () => import('./autocomplete/autocomplete-article.component').then((m) => m.AutoCompleteArticleComponent),
  },
  {
    id: 'multiselect',
    title: 'MultiSelect',
    titleDe: 'MultiSelect',
    category: 'library',
    tags: ['form', 'selection', 'multiple', 'filter'],
    summary: 'Pick a set from a known list in one compact field — a checkbox listbox behind a combobox trigger, a summary label that collapses past three selections, and a filter that ships switched on; in the list a selected row carries both a checked checkbox and a highlight tint.',
    summaryDe: 'Eine Auswahl aus einer bekannten Liste in einem kompakten Feld treffen — eine Checkbox-Listbox hinter einem Combobox-Auslöser, ein Zusammenfassungs-Label, das ab drei Auswahlen zusammenklappt, und ein Filter, der eingeschaltet ausgeliefert wird; in der Liste trägt eine ausgewählte Zeile sowohl eine angehakte Checkbox als auch eine Hervorhebungsfarbe.',
    related: ['select', 'autocomplete', 'checkbox', 'tags-and-chips'],
    agentDocPath: 'assets/design-system/guides/multiselect.agent.md',
    loadComponent: () => import('./multiselect/multiselect-article.component').then((m) => m.MultiselectArticleComponent),
  },
  {
    id: 'inputnumber',
    title: 'InputNumber',
    titleDe: 'InputNumber',
    category: 'library',
    tags: ['form', 'number', 'spinner', 'locale'],
    summary: 'A number the reader types or nudges — a real text input with role spinbutton, locale-aware formatting through Intl.NumberFormat, and optional spin buttons that are pointer-only decoration; the locale defaults to the browser, not the page.',
    summaryDe: 'Eine Zahl, die der Leser tippt oder schrittweise verändert — ein echtes Texteingabefeld mit role spinbutton, Locale-abhängige Formatierung über Intl.NumberFormat und optionale Spin-Buttons, die reine Zeiger-Dekoration sind; die Locale folgt standardmäßig dem Browser, nicht der Seite.',
    related: ['slider', 'text-inputs', 'select'],
    agentDocPath: 'assets/design-system/guides/inputnumber.agent.md',
    loadComponent: () => import('./inputnumber/inputnumber-article.component').then((m) => m.InputnumberArticleComponent),
  },
  {
    id: 'drawer',
    title: 'Drawer',
    titleDe: 'Drawer',
    category: 'library',
    tags: ['overlay', 'panel', 'a11y'],
    summary: 'A panel pinned to an edge of the screen — the container for a side surface the page behind must stay visible for, and the focus work the library leaves to you.',
    summaryDe: 'Ein Panel, das an einer Bildschirmkante festgemacht ist — der Container für eine Seitenfläche, bei der die Seite dahinter sichtbar bleiben muss, und die Fokusarbeit, die die Bibliothek dir überlässt.',
    related: ['dialog', 'popover', 'menubar', 'button'],
    agentDocPath: 'assets/design-system/guides/drawer.agent.md',
    loadComponent: () => import('./drawer/drawer-article.component').then((m) => m.DrawerArticleComponent),
  },
  {
    id: 'popover',
    title: 'Popover',
    titleDe: 'Popover',
    category: 'library',
    tags: ['overlay', 'anchored', 'a11y'],
    summary: 'A panel anchored to the thing the user just clicked, with the page still live behind it — and a dialog role that promises modality it does not deliver.',
    summaryDe: 'Ein Panel, verankert an dem Element, das der Nutzer gerade angeklickt hat, während die Seite dahinter bedienbar bleibt — und eine dialog-Rolle, die eine Modalität verspricht, die sie nicht liefert.',
    related: ['dialog', 'drawer', 'tooltip', 'menu'],
    agentDocPath: 'assets/design-system/guides/popover.agent.md',
    loadComponent: () => import('./popover/popover-article.component').then((m) => m.PopoverArticleComponent),
  },
  {
    id: 'table',
    title: 'Table',
    titleDe: 'Table',
    category: 'library',
    tags: ['data', 'collection', 'a11y'],
    summary: 'Records compared column by column — a harness around a table you write yourself, with correct sort state and a selection nobody can hear.',
    summaryDe: 'Datensätze Spalte für Spalte vergleichen — ein Gerüst um eine Tabelle, die du selbst schreibst, mit korrektem Sortierzustand und einer Auswahl, die niemand hören kann.',
    related: ['select', 'checkbox', 'button', 'paginator', 'skeleton', 'timeline'],
    agentDocPath: 'assets/design-system/guides/table.agent.md',
    loadComponent: () => import('./table/table-article.component').then((m) => m.TableArticleComponent),
  },
  {
    id: 'card',
    title: 'Card',
    titleDe: 'Card',
    category: 'library',
    tags: ['container', 'layout', 'surface'],
    summary: 'A surface with a shadow around self-contained content — six divs with no role, no heading, and no name, and the boundary work that leaves you.',
    summaryDe: 'Eine Fläche mit Schatten um in sich geschlossenen Inhalt — sechs divs ohne Rolle, ohne Überschrift und ohne Namen, und die Abgrenzungsarbeit, die bei dir bleibt.',
    related: ['skeleton', 'table', 'tabs', 'button', 'timeline', 'carousel'],
    agentDocPath: 'assets/design-system/guides/card.agent.md',
    loadComponent: () => import('./card/card-article.component').then((m) => m.CardArticleComponent),
  },
  {
    id: 'timeline',
    title: 'Timeline',
    titleDe: 'Timeline',
    category: 'library',
    tags: ['layout', 'collection', 'a11y'],
    summary: 'A rail of markers with content beside it — six divs of pure geometry that ship no role, no name, and no keyboard, and an alternating layout with no narrow-screen answer.',
    summaryDe: 'Eine Schiene aus Markern mit Inhalt daneben — sechs divs reiner Geometrie ohne Rolle, ohne Namen und ohne Tastaturbedienung, und ein abwechselndes Layout ohne Antwort für schmale Bildschirme.',
    related: ['card', 'table', 'skeleton'],
    agentDocPath: 'assets/design-system/guides/timeline.agent.md',
    loadComponent: () => import('./timeline/timeline-article.component').then((m) => m.TimelineArticleComponent),
  },
  {
    id: 'menubar',
    title: 'Menubar',
    titleDe: 'Menubar',
    category: 'library',
    tags: ['navigation', 'menu', 'a11y'],
    summary: 'A bar of menus for commands — one tab stop, arrow keys inside, a second branch below a breakpoint, and the role question deciding whether it belongs in a site header.',
    summaryDe: 'Eine Leiste aus Menüs für Befehle — ein Tab-Stopp, Pfeiltasten im Inneren, ein zweiter Zweig unterhalb eines Breakpoints, und die Rollenfrage, die entscheidet, ob sie in einen Seitenkopf gehört.',
    related: ['tabs', 'drawer', 'menu', 'panelmenu', 'button'],
    agentDocPath: 'assets/design-system/guides/menubar.agent.md',
    loadComponent: () => import('./menubar/menubar-article.component').then((m) => m.MenubarArticleComponent),
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumb',
    titleDe: 'Breadcrumb',
    category: 'library',
    tags: ['navigation', 'a11y', 'hierarchy'],
    summary: 'A trail saying where the page sits in a hierarchy — the nav landmark the library already renders, the aria-current it already sets, and a last crumb that stays a tab stop with nowhere to go.',
    summaryDe: 'Eine Spur, die zeigt, wo die Seite in einer Hierarchie sitzt — die nav-Landmark, die die Bibliothek schon rendert, das aria-current, das sie schon setzt, und ein letzter Krümel, der ein Tab-Stopp ohne Ziel bleibt.',
    related: ['menubar', 'tabs', 'ui-pattern-selection', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/breadcrumb.agent.md',
    loadComponent: () => import('./breadcrumb/breadcrumb-article.component').then((m) => m.BreadcrumbArticleComponent),
  },
  {
    id: 'feedback-messages',
    title: 'Feedback Messages',
    titleDe: 'Rückmeldungen',
    category: 'library',
    tags: ['feedback', 'status', 'a11y'],
    summary: 'Tell the user what just happened — an inline message that stays with the thing it is about, or a toast that leaves on its own before anyone has read it.',
    summaryDe: 'Dem Nutzer sagen, was gerade passiert ist — eine Inline-Meldung, die bei der Sache bleibt, um die es geht, oder ein Toast, der von selbst verschwindet, bevor ihn jemand gelesen hat.',
    related: ['dialog', 'progress', 'text-inputs', 'skeleton'],
    agentDocPath: 'assets/design-system/guides/feedback-messages.agent.md',
    loadComponent: () => import('./feedback-messages/feedback-messages-article.component').then((m) => m.FeedbackMessagesArticleComponent),
  },
  {
    id: 'design-tokens',
    title: 'Design Tokens',
    titleDe: 'Design-Tokens',
    category: 'foundations',
    tags: ['tokens', 'theming', 'css-variables'],
    summary: 'Every color, space, and radius is a CSS custom property written by four layers that all target the same names — read them with var(), override at the layer that owns the value, and know which layer wins.',
    summaryDe: 'Jede Farbe, jeder Abstand und jeder Radius ist eine CSS Custom Property, geschrieben von vier Schichten, die alle dieselben Namen ansprechen — lies sie mit var(), überschreibe sie in der Schicht, der der Wert gehört, und wisse, welche Schicht gewinnt.',
    related: ['color-system', 'typography', 'a11y-guidelines', 'i18n-localization', 'button', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/design-tokens.agent.md',
    loadComponent: () => import('./design-tokens/design-tokens-article.component').then((m) => m.DesignTokensArticleComponent),
  },
  {
    id: 'color-system',
    title: 'Color System',
    titleDe: 'Farbsystem',
    category: 'foundations',
    tags: ['color', 'contrast', 'accessibility', 'theming'],
    summary: 'Kit role tokens per visual style and mode, ten accent palettes, and the Aura widget tokens re-pointed at them — one gate measures every pair in every style, mode, and accent, so which color may sit on which ground is a quoted number.',
    summaryDe: 'Rollen-Tokens des Kits pro visuellem Stil und Modus, zehn Akzentpaletten und die Aura-Widget-Tokens, die auf sie umgelenkt sind — ein Gate misst jedes Paar in jedem Stil, Modus und Akzent, sodass die Frage, welche Farbe auf welchem Grund stehen darf, mit einer zitierten Zahl beantwortet ist.',
    related: ['design-tokens', 'typography', 'a11y-guidelines', 'i18n-localization', 'ui-pattern-selection'],
    agentDocPath: 'assets/design-system/guides/color-system.agent.md',
    loadComponent: () => import('./color-system/color-system-article.component').then((m) => m.ColorSystemArticleComponent),
  },
  {
    id: 'typography',
    title: 'Typography',
    titleDe: 'Typografie',
    category: 'foundations',
    tags: ['typography', 'fonts', 'readability', 'tokens'],
    summary: 'Three scales and seven family names, generously declared and sparsely applied — the global stylesheet sets a family on body and on headings but no unscoped size rule on prose, so heading sizes come from the user agent, type never moves with the viewport, and only two of the nine weight tokens have a real face behind them.',
    summaryDe: 'Drei Skalen und sieben Familiennamen, großzügig deklariert und sparsam angewandt — das globale Stylesheet setzt eine Schriftfamilie auf body und auf Überschriften, aber keine ungescopte Größenregel für Fließtext, darum kommen Überschriftengrößen vom User Agent, Schrift bewegt sich nie mit dem Viewport, und nur zwei der neun Gewichts-Tokens haben einen echten Schnitt dahinter.',
    related: ['design-tokens', 'color-system', 'a11y-guidelines', 'i18n-localization', 'ui-pattern-selection', 'article-layout'],
    agentDocPath: 'assets/design-system/guides/typography.agent.md',
    loadComponent: () => import('./typography/typography-article.component').then((m) => m.TypographyArticleComponent),
  },
  {
    id: 'a11y-guidelines',
    title: 'Accessibility Guidelines',
    titleDe: 'Richtlinien zur Barrierefreiheit',
    category: 'foundations',
    tags: ['accessibility', 'a11y', 'wcag', 'focus', 'keyboard'],
    summary: 'Four global mechanisms and a set of conventions — one universal reduced-motion catch-all, one kit focus ring for every focusable Optimus UI part, one hidden-text class, and an app shell with a skip link — every other control is accessible here because its author wired the name, the ring, and the announcement.',
    summaryDe: 'Vier globale Mechanismen und eine Reihe von Konventionen — ein universeller Auffang für reduzierte Bewegung, ein Fokus-Ring des Kits für jedes fokussierbare Optimus-UI-Teil, eine Klasse für versteckten Text und eine App-Shell mit Skip-Link — jedes andere Steuerelement ist hier nur barrierefrei, weil sein Autor Namen, Ring und Ansage verdrahtet hat.',
    related: ['design-tokens', 'color-system', 'typography', 'i18n-localization', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/a11y-guidelines.agent.md',
    loadComponent: () => import('./a11y-guidelines/a11y-guidelines-article.component').then((m) => m.A11yGuidelinesArticleComponent),
  },
  {
    id: 'i18n-localization',
    title: 'I18n & Localization',
    titleDe: 'I18n & Lokalisierung',
    category: 'foundations',
    tags: ['i18n', 'localization', 'translation', 'easy-language'],
    summary: 'One JSON module per namespace per language, split into a small core bundle plus lazy chunks and read by a lookup that neither interpolates nor pluralizes — every miss walks a fallback chain ending in English, and a key missing there renders as itself.',
    summaryDe: 'Ein JSON-Modul pro Namespace und Sprache, aufgeteilt in ein kleines Kern-Bundle plus Lazy Chunks und gelesen von einem Lookup, der weder interpoliert noch pluralisiert — jeder Fehltreffer läuft eine Fallback-Kette entlang, die bei Englisch endet, und ein Key, der auch dort fehlt, erscheint als er selbst.',
    related: ['a11y-guidelines', 'typography', 'design-tokens', 'color-system', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/i18n-localization.agent.md',
    loadComponent: () => import('./i18n-localization/i18n-localization-article.component').then((m) => m.I18nLocalizationArticleComponent),
  },
  {
    id: 'ui-pattern-selection',
    title: 'UI Pattern Selection',
    titleDe: 'UI-Muster wählen',
    category: 'foundations',
    tags: ['patterns', 'decisions', 'reuse', 'components'],
    summary: 'Choose the layer before the control — five needs are answered by the kit itself before the library is reached, a documented library component states its own boundaries in its own guide, and what is left over is plain HTML.',
    summaryDe: 'Wähle die Schicht vor dem Steuerelement — fünf Bedürfnisse beantwortet das Kit selbst, bevor die Bibliothek ins Spiel kommt, eine dokumentierte Bibliothekskomponente nennt ihre Grenzen in ihrem eigenen Guide, und was übrig bleibt, ist schlichtes HTML.',
    related: ['color-system', 'typography', 'article-layout', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/ui-pattern-selection.agent.md',
    loadComponent: () => import('./ui-pattern-selection/ui-pattern-selection-article.component').then((m) => m.UiPatternSelectionArticleComponent),
  },
  {
    id: 'forms',
    title: 'Forms',
    titleDe: 'Formulare',
    category: 'foundations',
    tags: ['forms', 'validation', 'errors', 'submit'],
    summary: 'Compose controls into a submit flow — a signal per field with a split ngModel binding, validation as a pure function whose errors gate on touched-or-submit, and an invalid state you compute yourself, because neither layer validates for you.',
    summaryDe: 'Steuerelemente zu einem Absende-Ablauf zusammensetzen — ein Signal pro Feld mit aufgeteiltem ngModel-Binding, Validierung als reine Funktion, deren Fehler erst nach Berühren oder Absenden greifen, und ein ungültiger Zustand, den du selbst berechnest, weil keine der beiden Schichten für dich validiert.',
    related: ['text-inputs', 'input-labels', 'checkbox', 'select', 'button', 'feedback-messages', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/forms.agent.md',
    loadComponent: () => import('./forms/forms-article.component').then((m) => m.FormsArticleComponent),
  },
  {
    id: 'article-layout',
    title: 'Article Layout',
    titleDe: 'Artikel-Layout',
    category: 'layouts',
    tags: ['layout', 'article', 'composition', 'headings'],
    summary: 'One template owns the page frame and the author owns the middle — a fixed reading order from lead to checkpoint, heading levels the blocks decide rather than hand-written tags, and one column that clips whatever it cannot fit.',
    summaryDe: 'Ein Template besitzt den Seitenrahmen, der Autor besitzt die Mitte — eine feste Lesereihenfolge vom Lead bis zum Checkpoint, Überschriftenebenen, die die Blöcke festlegen statt handgeschriebener Tags, und eine Spalte, die abschneidet, was nicht hineinpasst.',
    related: ['ui-pattern-selection', 'typography', 'a11y-guidelines', 'design-tokens', 'i18n-localization', 'demo-layout', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/article-layout.agent.md',
    loadComponent: () => import('./article-layout/article-layout-article.component').then((m) => m.ArticleLayoutArticleComponent),
  },
  {
    id: 'demo-layout',
    title: 'Demo Layout',
    titleDe: 'Demo-Layout',
    category: 'layouts',
    tags: ['layout', 'demo', 'canvas', 'controls'],
    summary: 'A demo is a page built from the kit blueprint, not a template — the stage comes before the controls in the document, the two-column switch queries the width of the demo itself rather than the viewport, and one live region announces discrete changes.',
    summaryDe: 'Eine Demo ist eine Seite, gebaut nach dem Blueprint des Kits, kein Template — die Bühne steht im Dokument vor den Steuerelementen, der Wechsel auf zwei Spalten fragt die Breite der Demo selbst ab statt des Viewports, und eine Live-Region kündigt einzelne Änderungen an.',
    related: ['article-layout', 'ui-pattern-selection', 'a11y-guidelines', 'design-tokens', 'i18n-localization', 'hub-layout'],
    agentDocPath: 'assets/design-system/guides/demo-layout.agent.md',
    loadComponent: () => import('./demo-layout/demo-layout-article.component').then((m) => m.DemoLayoutArticleComponent),
  },
  {
    id: 'chart',
    title: 'Chart',
    titleDe: 'Chart',
    category: 'library',
    tags: ['chart', 'canvas', 'a11y', 'bundle'],
    summary: 'A thin wrapper around a chart.js canvas the kit installs but never renders — 208 kB of dependency that has to stay lazy, a redraw that fires only when data or options change identity, and one opaque canvas that says nothing to a screen reader until a data table stands beside it.',
    summaryDe: 'Ein dünner Wrapper um ein chart.js-Canvas, das das Kit installiert, aber nie rendert — 208 kB Abhängigkeit, die lazy bleiben muss, ein Neuzeichnen, das nur feuert, wenn Daten oder Optionen ihre Identität wechseln, und ein undurchsichtiges Canvas, das einem Screenreader nichts sagt, bis eine Datentabelle danebensteht.',
    related: ['table', 'demo-layout', 'a11y-guidelines', 'color-system', 'ui-pattern-selection'],
    agentDocPath: 'assets/design-system/guides/chart.agent.md',
    loadComponent: () => import('./chart/chart-article.component').then((m) => m.ChartArticleComponent),
  },
  {
    id: 'divider',
    title: 'Divider',
    titleDe: 'Divider',
    category: 'library',
    tags: ['divider', 'separator', 'layout', 'a11y', 'tokens'],
    summary: 'A one-pixel rule on a host that is always role="separator" — content projected into the line lands inside a role whose children are presentational, a vertical divider has no height of its own, and the border style needs both its classes to appear.',
    summaryDe: 'Eine Ein-Pixel-Linie auf einem Host, der immer role="separator" ist — Inhalt, der in die Linie projiziert wird, landet in einer Rolle, deren Kinder präsentational sind, ein vertikaler Divider hat keine eigene Höhe, und der Rahmenstil braucht beide Klassen, um zu erscheinen.',
    related: ['card', 'tabs', 'menubar', 'design-tokens', 'ui-pattern-selection', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/divider.agent.md',
    loadComponent: () => import('./divider/divider-article.component').then((m) => m.DividerArticleComponent),
  },
  {
    id: 'rating',
    title: 'Rating',
    titleDe: 'Rating',
    category: 'library',
    tags: ['rating', 'stars', 'radio', 'forms', 'a11y'],
    summary: 'A star strip that is not one control but a set of native radio inputs clipped to a pixel — no group role and no name of its own, a read-only mode that changes nothing an assistive technology can see, star labels that come from the shared library config rather than your template, and a re-selection that clears the value.',
    summaryDe: 'Eine Sternleiste, die nicht ein Steuerelement ist, sondern eine Menge nativer Radio-Inputs, auf ein Pixel zugeschnitten — keine Gruppenrolle und kein eigener Name, ein Nur-Lese-Modus, der nichts ändert, was eine assistive Technologie sehen kann, Stern-Labels aus der gemeinsamen Bibliothekskonfiguration statt aus deinem Template, und eine erneute Auswahl, die den Wert löscht.',
    related: ['radiobutton', 'selectbutton', 'slider', 'forms', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/rating.agent.md',
    loadComponent: () => import('./rating/rating-article.component').then((m) => m.RatingArticleComponent),
  },
  {
    id: 'hub-layout',
    title: 'Hub Layout',
    titleDe: 'Hub-Layout',
    category: 'layouts',
    tags: ['layout', 'hub', 'grid', 'cards'],
    summary: 'An overview page is a page-wide grid of registry-fed cards — one template ships for it and takes no projected content, the grid answers the viewport because the hub owns the page, and the state that replaces the cards has to say whether nothing matched or nothing loaded.',
    summaryDe: 'Eine Übersichtsseite ist ein seitenbreites Raster aus Karten, die die Registry speist — dafür gibt es ein Template, das keinen projizierten Inhalt annimmt, das Raster reagiert auf den Viewport, weil der Hub die Seite besitzt, und der Zustand, der die Karten ersetzt, muss sagen, ob nichts gepasst hat oder nichts geladen wurde.',
    related: ['article-layout', 'demo-layout', 'ui-pattern-selection', 'a11y-guidelines', 'design-tokens', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/hub-layout.agent.md',
    loadComponent: () => import('./hub-layout/hub-layout-article.component').then((m) => m.HubLayoutArticleComponent),
  },
  {
    id: 'tooltip',
    title: 'Tooltip',
    titleDe: 'Tooltip',
    category: 'library',
    tags: ['overlay', 'hint', 'directive', 'a11y'],
    summary: 'An attribute directive that builds a detached role="tooltip" node on show and deletes it on hide — nothing ties it to the trigger, the default binding is pointer-only, and on touch it lasts as long as the press.',
    summaryDe: 'Eine Attribut-Direktive, die beim Anzeigen einen losgelösten role="tooltip"-Knoten baut und ihn beim Ausblenden löscht — nichts verbindet ihn mit dem Auslöser, die Standardbindung funktioniert nur mit dem Zeiger, und auf Touch-Geräten hält er genau so lange wie der Druck.',
    related: ['popover', 'button', 'ui-pattern-selection', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/tooltip.agent.md',
    loadComponent: () => import('./tooltip/tooltip-article.component').then((m) => m.TooltipArticleComponent),
  },
  {
    id: 'confirmdialog',
    title: 'Confirm Dialog and Confirm Popup',
    titleDe: 'Confirm Dialog und Confirm Popup',
    category: 'library',
    tags: ['overlay', 'confirmation', 'destructive', 'a11y'],
    summary: 'One service drives two surfaces — a modal alertdialog and an anchored one — and they disagree about focus, about what a dismissal reports, and about whether the message is escaped.',
    summaryDe: 'Ein Service steuert zwei Oberflächen — einen modalen alertdialog und einen verankerten — und die beiden sind sich uneinig über den Fokus, darüber, was ein Schließen meldet, und darüber, ob die Nachricht escaped wird.',
    related: ['dialog', 'popover', 'button', 'feedback-messages'],
    agentDocPath: 'assets/design-system/guides/confirmdialog.agent.md',
    loadComponent: () => import('./confirmdialog/confirmdialog-article.component').then((m) => m.ConfirmdialogArticleComponent),
  },
  {
    id: 'badge',
    title: 'Badge, pBadge, and Overlay Badge',
    titleDe: 'Badge, pBadge und Overlay Badge',
    category: 'library',
    tags: ['status', 'count', 'indicator', 'a11y'],
    summary: 'Three deliveries of one span, and the number inside it is bare text that names nothing — so where the badge node lands, and where the fact is said instead, is the whole decision.',
    summaryDe: 'Drei Auslieferungen desselben span, und die Zahl darin ist nackter Text, der nichts benennt — wo der Badge-Knoten landet und wo die Tatsache stattdessen ausgesprochen wird, ist die ganze Entscheidung.',
    related: ['tags-and-chips', 'button', 'feedback-messages', 'a11y-guidelines', 'avatar'],
    agentDocPath: 'assets/design-system/guides/badge.agent.md',
    loadComponent: () => import('./badge/badge-article.component').then((m) => m.BadgeArticleComponent),
  },
  {
    id: 'stepper',
    title: 'Stepper and Steps',
    titleDe: 'Stepper und Steps',
    category: 'library',
    tags: ['wizard', 'process', 'navigation', 'a11y'],
    summary: 'One holds the content and decides the order, the other only draws where you are — and neither ever says "done" or "3 of 5", so every state a step bar seems to show is state you have to state yourself.',
    summaryDe: 'Das eine hält den Inhalt und bestimmt die Reihenfolge, das andere zeichnet nur, wo du bist — und keines von beiden sagt je „erledigt“ oder „3 von 5“, also ist jeder Zustand, den eine Schrittleiste zu zeigen scheint, einer, den du selbst aussprechen musst.',
    related: ['tabs', 'forms', 'progress', 'ui-pattern-selection', 'a11y-guidelines', 'carousel'],
    agentDocPath: 'assets/design-system/guides/stepper.agent.md',
    loadComponent: () => import('./stepper/stepper-article.component').then((m) => m.StepperArticleComponent),
  },
  {
    id: 'togglebutton',
    title: 'Toggle Button',
    titleDe: 'Toggle Button',
    category: 'library',
    tags: ['form', 'boolean', 'toggle', 'group'],
    summary: 'A button that stays pressed — its state lives in aria-pressed, and its label must not move with it; grouping belongs to the toolbar guide.',
    summaryDe: 'Ein Button, der gedrückt bleibt — sein Zustand lebt in aria-pressed, und sein Label darf sich nicht mit ihm ändern; Gruppierung gehört in den Toolbar-Guide.',
    related: ['selectbutton', 'toggleswitch', 'checkbox', 'button', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/togglebutton.agent.md',
    loadComponent: () => import('./togglebutton/togglebutton-article.component').then((m) => m.ToggleButtonArticleComponent),
  },
  {
    id: 'fieldset',
    title: 'Fieldset and Panel',
    titleDe: 'Fieldset und Panel',
    category: 'library',
    tags: ['container', 'grouping', 'disclosure', 'a11y'],
    summary: 'Two boxes that look alike and are not — one renders a native fieldset and legend that names its group, the other a bold span that names nothing, and collapsing either hides the content without removing it.',
    summaryDe: 'Zwei Kästen, die sich ähneln und es nicht sind — der eine rendert ein natives fieldset mit legend, das seine Gruppe benennt, der andere einen fetten span, der nichts benennt, und beide verstecken beim Zuklappen den Inhalt, ohne ihn zu entfernen.',
    related: ['card', 'accordion', 'forms', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/fieldset.agent.md',
    loadComponent: () => import('./fieldset/fieldset-article.component').then((m) => m.FieldsetArticleComponent),
  },
  {
    id: 'menu',
    title: 'Menu, TieredMenu, and ContextMenu',
    titleDe: 'Menu, TieredMenu und ContextMenu',
    category: 'library',
    tags: ['navigation', 'menu', 'overlay', 'a11y'],
    summary: 'Three vertical menus that share one MenuItem model and agree on almost nothing else — where focus lands, what a keyboard can reach, and who restores the trigger differs in each.',
    summaryDe: 'Drei vertikale Menüs, die ein MenuItem-Modell teilen und sich sonst in fast nichts einig sind — wo der Fokus landet, was eine Tastatur erreichen kann und wer den Auslöser wiederherstellt, ist bei jedem anders.',
    related: ['menubar', 'panelmenu', 'popover', 'drawer', 'a11y-guidelines', 'toolbar'],
    agentDocPath: 'assets/design-system/guides/menu.agent.md',
    loadComponent: () => import('./menu/menu-article.component').then((m) => m.MenuArticleComponent),
  },
  {
    id: 'datepicker',
    title: 'DatePicker',
    titleDe: 'DatePicker',
    category: 'library',
    tags: ['form', 'date', 'overlay'],
    summary: 'A text field welded to a calendar dialog — which half your users can actually reach, and which strings the kit never translates.',
    summaryDe: 'Ein Textfeld, verschweißt mit einem Kalenderdialog — welche Hälfte deine Nutzer tatsächlich erreichen und welche Strings das Kit nie übersetzt.',
    related: ['text-inputs', 'forms', 'select', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/datepicker.agent.md',
    loadComponent: () => import('./datepicker/datepicker-article.component').then((m) => m.DatePickerArticleComponent),
  },
  {
    id: 'tree',
    title: 'Tree, TreeTable, and TreeSelect',
    titleDe: 'Tree, TreeTable und TreeSelect',
    category: 'library',
    tags: ['data', 'hierarchy', 'a11y'],
    summary: 'Hierarchy in three shapes — a tree, a tree in a grid, and a tree in a form field, each with its own keyboard owner and its own naming gap.',
    summaryDe: 'Hierarchie in drei Formen — ein Baum, ein Baum in einem Grid und ein Baum in einem Formularfeld, jeder mit eigenem Tastatur-Besitzer und eigener Benennungslücke.',
    related: ['table', 'select', 'multiselect', 'checkbox', 'a11y-guidelines', 'scroller'],
    agentDocPath: 'assets/design-system/guides/tree.agent.md',
    loadComponent: () => import('./tree/tree-article.component').then((m) => m.TreeArticleComponent),
  },
  {
    id: 'editor',
    title: 'Editor',
    titleDe: 'Editor',
    category: 'library',
    tags: ['form', 'rich-text', 'quill', 'a11y'],
    summary: 'A rich-text field whose engine is a peer library the kit does not install — so the first question is not how to configure it, but whether it runs at all.',
    summaryDe: 'Ein Rich-Text-Feld, dessen Engine eine Peer-Bibliothek ist, die das Kit nicht installiert — die erste Frage ist also nicht, wie man es konfiguriert, sondern ob es überhaupt läuft.',
    related: ['text-inputs', 'forms', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/editor.agent.md',
    loadComponent: () => import('./editor/editor-article.component').then((m) => m.EditorArticleComponent),
  },
  {
    id: 'fileupload',
    title: 'File Upload',
    titleDe: 'Datei-Upload',
    category: 'library',
    tags: ['forms', 'upload', 'feedback', 'a11y'],
    summary: 'An upload queue with a drop area, a progress bar, and its own validation messages — and a failure path that shows the user nothing unless you build it.',
    summaryDe: 'Eine Upload-Warteschlange mit Ablagebereich, Fortschrittsbalken und eigenen Validierungsmeldungen — und ein Fehlerpfad, der dem Nutzer nichts zeigt, solange du ihn nicht baust.',
    related: ['progress', 'feedback-messages', 'button', 'forms', 'dragdrop'],
    agentDocPath: 'assets/design-system/guides/fileupload.agent.md',
    loadComponent: () => import('./fileupload/fileupload-article.component').then((m) => m.FileUploadArticleComponent),
  },
  {
    id: 'dataview',
    title: 'DataView, OrderList, and PickList',
    titleDe: 'DataView, OrderList und PickList',
    category: 'library',
    tags: ['collection', 'reorder', 'transfer', 'a11y'],
    summary: 'Three list arrangements that share only their data shape — one renders cards you write yourself, two move rows for you, and none of them says out loud that a move happened.',
    summaryDe: 'Drei Listenanordnungen, die nur ihre Datenform teilen — eine rendert Karten, die du selbst schreibst, zwei verschieben Zeilen für dich, und keine sagt laut, dass eine Verschiebung passiert ist.',
    related: ['table', 'paginator', 'multiselect', 'select', 'button', 'a11y-guidelines', 'dragdrop'],
    agentDocPath: 'assets/design-system/guides/dataview.agent.md',
    loadComponent: () => import('./dataview/dataview-article.component').then((m) => m.DataviewArticleComponent),
  },
  {
    id: 'listbox',
    title: 'Listbox, MegaMenu, and CascadeSelect',
    titleDe: 'Listbox, MegaMenu und CascadeSelect',
    category: 'library',
    tags: ['selection', 'navigation', 'aria', 'overlay'],
    summary: 'Three components named after three ARIA roles — one keeps its promise with a hardcoded contradiction inside it, one keeps it but cannot say its own name, and one keeps it by declaring itself a tree.',
    summaryDe: 'Drei Komponenten, benannt nach drei ARIA-Rollen — eine hält ihr Versprechen mit einem fest eingebauten Widerspruch, eine hält es, kann aber ihren eigenen Namen nicht sagen, und eine hält es, indem sie sich zum Baum erklärt.',
    related: ['select', 'multiselect', 'menubar', 'autocomplete', 'a11y-guidelines', 'scroller'],
    agentDocPath: 'assets/design-system/guides/listbox.agent.md',
    loadComponent: () => import('./listbox/listbox-article.component').then((m) => m.ListboxArticleComponent),
  },
  {
    id: 'constrained-inputs',
    title: 'Constrained Inputs',
    titleDe: 'Eingeschränkte Eingaben',
    category: 'library',
    tags: ['form', 'input', 'validation', 'security'],
    summary: 'Text fields that refuse the wrong keystroke — a fixed format, a one-time code, a secret, or a character class — and what each refusal costs.',
    summaryDe: 'Textfelder, die den falschen Tastendruck verweigern — ein festes Format, ein Einmalcode, ein Geheimnis oder eine Zeichenklasse — und was jede Verweigerung kostet.',
    related: ['text-inputs', 'forms', 'inputnumber', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/constrained-inputs.agent.md',
    loadComponent: () => import('./constrained-inputs/constrained-inputs-article.component').then((m) => m.ConstrainedInputsArticleComponent),
  },
  {
    id: 'input-labels',
    title: 'Input Labels',
    titleDe: 'Feldbeschriftungen',
    category: 'library',
    tags: ['form', 'label', 'a11y'],
    summary: 'The two hulls that move a label into the field — one that lifts on focus, one that never moves — neither of which ships a label, names your field, or leaves the label clickable.',
    summaryDe: 'Die zwei Hüllen, die ein Label ins Feld verlegen — eine, die beim Fokus nach oben wandert, eine, die sich nie bewegt —, und keine davon liefert ein Label mit, benennt dein Feld oder lässt das Label anklickbar.',
    related: ['forms', 'text-inputs', 'select', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/input-labels.agent.md',
    loadComponent: () => import('./input-labels/input-labels-article.component').then((m) => m.InputLabelsArticleComponent),
  },
  {
    id: 'paginator',
    title: 'Paginator',
    titleDe: 'Paginator',
    category: 'library',
    tags: ['navigation', 'collection', 'paging', 'a11y'],
    summary: 'The page bar Table and DataView embed, and the one you stand up yourself — buttons in no landmark, a page link whose accessible name is a bare digit, and a slot order no input can change.',
    summaryDe: 'Die Seitenleiste, die Table und DataView einbetten, und die, die du selbst aufstellst — Buttons in keiner Landmark, ein Seitenlink, dessen zugänglicher Name eine nackte Ziffer ist, und eine Slot-Reihenfolge, die kein Input ändern kann.',
    related: ['table', 'dataview', 'select', 'i18n-localization', 'scroller'],
    agentDocPath: 'assets/design-system/guides/paginator.agent.md',
    loadComponent: () => import('./paginator/paginator-article.component').then((m) => m.PaginatorArticleComponent),
  },
  {
    id: 'panelmenu',
    title: 'PanelMenu',
    titleDe: 'PanelMenu',
    category: 'library',
    tags: ['navigation', 'menu', 'disclosure', 'a11y'],
    summary: 'A stack of collapsible panels whose headers are disclosure buttons and whose bodies are ARIA trees — two focus models in one widget, and expansion state that lives in your model objects.',
    summaryDe: 'Ein Stapel aufklappbarer Panels, deren Header Disclosure-Buttons und deren Inhalte ARIA-Bäume sind — zwei Fokusmodelle in einem Widget und ein Aufklappzustand, der in deinen Modellobjekten lebt.',
    related: ['menu', 'menubar', 'accordion', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/panelmenu.agent.md',
    loadComponent: () => import('./panelmenu/panelmenu-article.component').then((m) => m.PanelmenuArticleComponent),
  },
  {
    id: 'avatar',
    title: 'Avatar and AvatarGroup',
    titleDe: 'Avatar und AvatarGroup',
    category: 'library',
    tags: ['people', 'image', 'identity', 'a11y'],
    summary: 'A box of initials, an icon, or a portrait on a host with no role — the picture ships without alt text, a name on the bare host is not dependable, and the group is an overlapping row that says nothing about who is in it.',
    summaryDe: 'Ein Kasten mit Initialen, einem Icon oder einem Porträt auf einem Host ohne Rolle — das Bild kommt ohne Alt-Text, ein Name auf dem nackten Host ist nicht verlässlich, und die Gruppe ist eine überlappende Reihe, die nichts darüber sagt, wer darin ist.',
    related: ['tags-and-chips', 'badge', 'skeleton', 'timeline', 'a11y-guidelines'],
    agentDocPath: 'assets/design-system/guides/avatar.agent.md',
    loadComponent: () => import('./avatar/avatar-article.component').then((m) => m.AvatarArticleComponent),
  },
  {
    id: 'image',
    title: 'Image and ImageCompare',
    titleDe: 'Image und ImageCompare',
    category: 'library',
    tags: ['image', 'media', 'alt-text', 'overlay', 'a11y'],
    summary: 'An image that passes your alt text through and can open a preview modal with no name and no alt on the enlarged picture, and a before/after slider that the keyboard can move but no screen reader can follow.',
    summaryDe: 'Ein Bild, das deinen Alt-Text durchreicht und ein Vorschau-Modal öffnen kann, ohne Namen und ohne Alt-Text am vergrößerten Bild, und ein Vorher-nachher-Slider, den die Tastatur bewegen, aber kein Screenreader verfolgen kann.',
    related: ['avatar', 'dialog', 'slider', 'a11y-guidelines', 'i18n-localization'],
    agentDocPath: 'assets/design-system/guides/image.agent.md',
    loadComponent: () => import('./image/image-article.component').then((m) => m.ImageArticleComponent),
  },
  {
    id: 'dragdrop',
    title: 'Drag and Drop',
    titleDe: 'Drag & Drop',
    category: 'library',
    tags: ['interaction', 'pointer', 'sorting', 'a11y'],
    summary: 'Two directives that wrap the native drag events and add no role, no focus, and no key — ship a button path and a spoken result beside every drag.',
    summaryDe: 'Zwei Direktiven, die die nativen Drag-Events umhüllen und keine Rolle, keinen Fokus und keine Taste hinzufügen — liefere neben jedem Ziehen einen Weg per Button und ein gesprochenes Ergebnis mit.',
    related: ['dataview', 'button', 'fileupload', 'feedback-messages'],
    agentDocPath: 'assets/design-system/guides/dragdrop.agent.md',
    loadComponent: () => import('./dragdrop/dragdrop-article.component').then((m) => m.DragdropArticleComponent),
  },
  {
    id: 'carousel',
    title: 'Carousel and Galleria',
    titleDe: 'Carousel und Galleria',
    category: 'library',
    tags: ['collection', 'media', 'motion', 'a11y'],
    summary: 'Mostly a guide on when not to hide content behind slides — and, where you do, the names, button types, and rotation controls the two components leave to you.',
    summaryDe: 'Vor allem ein Guide darüber, wann du Inhalte nicht hinter Slides verstecken solltest — und, wo du es doch tust, über die Namen, Button-Typen und Rotationssteuerungen, die die beiden Komponenten dir überlassen.',
    related: ['card', 'stepper', 'dataview', 'button'],
    agentDocPath: 'assets/design-system/guides/carousel.agent.md',
    loadComponent: () => import('./carousel/carousel-article.component').then((m) => m.CarouselArticleComponent),
  },
  {
    id: 'toolbar',
    title: 'Toolbar, Button Group, and Split Button',
    titleDe: 'Toolbar, Button Group und Split Button',
    category: 'library',
    tags: ['action', 'group', 'menu', 'a11y'],
    summary: 'Buttons side by side — a toolbar role whose arrow keys you must add, a group nobody can name, and a split button whose menu drops focus on close.',
    summaryDe: 'Buttons nebeneinander — eine toolbar-Rolle, deren Pfeiltasten du selbst ergänzen musst, eine Gruppe, die niemand benennen kann, und ein Split Button, dessen Menü beim Schließen den Fokus fallen lässt.',
    related: ['button', 'togglebutton', 'menu', 'selectbutton'],
    agentDocPath: 'assets/design-system/guides/toolbar.agent.md',
    loadComponent: () => import('./toolbar/toolbar-article.component').then((m) => m.ToolbarArticleComponent),
  },
  {
    id: 'scroller',
    title: 'Scroller',
    titleDe: 'Scroller',
    category: 'library',
    tags: ['list', 'performance', 'a11y'],
    summary: 'Virtual scrolling for long uniform lists — and the honest cost: find-in-page, list size, and focus stop at the edge of the rendered slice.',
    summaryDe: 'Virtuelles Scrollen für lange, gleichförmige Listen — und der ehrliche Preis: Suchen auf der Seite, Listengröße und Fokus enden am Rand des gerenderten Ausschnitts.',
    related: ['listbox', 'select', 'paginator', 'tree'],
    agentDocPath: 'assets/design-system/guides/scroller.agent.md',
    loadComponent: () => import('./scroller/scroller-article.component').then((m) => m.ScrollerArticleComponent),
  },
];

/** Lookup by id (shell resolves its entry from an `[entryId]` input). */
export function findArticle(id: string): ArticleRegistryEntry | undefined {
  return articleRegistry.find((a) => a.id === id);
}

/**
 * Title and summary in the reader's language: the German pair when the base
 * language of `language` is `de` (de, de-easy), the English one otherwise.
 * Pass the full language code (`TranslationService.currentLanguage$()`), so a
 * computed() around the call follows a language switch.
 */
export function localizedGuide(entry: ArticleRegistryEntry, language: string): { title: string; summary: string } {
  return LANGUAGE_RULES.baseLanguageOf(language) === 'de'
    ? { title: entry.titleDe, summary: entry.summaryDe }
    : { title: entry.title, summary: entry.summary };
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
