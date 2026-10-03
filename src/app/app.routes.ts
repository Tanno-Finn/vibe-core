import { Routes } from '@angular/router';

/**
 * Extended route interface with navigation metadata
 */
import { Route } from '@angular/router';
import { generatePageIdRedirects } from './utils/route-generator';
import { translationReadyGuard } from './guards/translation-ready.guard';
import { draftRouteGuard } from './guards/draft-route.guard';
import { demoReleaseGuard } from './guards/demo-release.guard';
import { featureGuard } from './guards/feature.guard';
import { SITE } from '../config/site';
// Dev-only workshop routes (SPEC N5). In a production build this import resolves
// to dev.routes.prod.ts (exports []) via angular.json `fileReplacements`, so the
// spread below contributes nothing and the whole src/app/dev/ tree is stripped.
import { devRoutes } from './dev/dev.routes';

// Extend the Angular Route interface with our custom properties
export interface ExtendedRoute extends Route {
  titleKey?: string; // Translation key for the page title
  icon?: string; // Icon to display in navigation
  group?: string; // Group this route belongs to
  groupTitleKey?: string; // Translation key for the group title
  hidden?: boolean; // Whether to hide this route from navigation
  devOnly?: boolean; // Hide from navigation in production / simulated-prod. NOT a guard: the page stays reachable by URL.
  // Workshop routes are safe because dev.routes.ts is swapped out of the prod build; a devOnly route
  // declared here must carry adminDebugGuard (enforced by app.routes.dev-only.spec.ts).
  pageId?: string; // Unique 4-letter ID for the page
  showByDefault?: boolean; // Whether to show this route when dropdown is open without filter
  // i18n namespaces the page needs beyond the core bundle and the namespaces of its
  // titleKey/descriptionKey, which translationReadyGuard loads anyway. See
  // src/config/i18n-bundles.json for which namespaces are lazy chunks.
  i18n?: string[];

  // Content-specific properties for Topics system
  descriptionKey?: string; // Translation key for description
  contentType?: 'demo' | 'article' | 'tutorial'; // Type of content
  category?: string; // Content category (ml, nlp, cv, etc.)
  estimatedTime?: string; // Estimated time like "15min", "30min"
  prerequisites?: string[]; // List of prerequisite knowledge
  learningObjectives?: string[]; // What users will learn
  thumbnailUrl?: string; // Optional thumbnail image
  featured?: boolean; // Whether to feature this content
  interactive?: boolean; // Whether this is an interactive demo
  // draft status is managed solely by ArticlesService (index.json) — single source of truth

  // Inherited properties from Angular Route:
  // path: string
  // redirectTo?: string
  // pathMatch?: 'full' | 'prefix' | undefined
  // etc.
  children?: ExtendedRoute[];
}

/**
 * Where the site root, `defaultsite` and the retired paths below lead: `startPage`
 * in src/config/site.json ("home" as the kit ships). `/home` itself stays a page
 * whatever the start page is.
 */
const START_PAGE = SITE.startPage;

export const extendedRoutes: ExtendedRoute[] = [
  // Default route redirects to the start page (site.json)
  {
    path: '',
    redirectTo: START_PAGE,
    pathMatch: 'full',
    hidden: true,
  },

  // Default site redirect to the start page
  {
    path: 'defaultsite',
    redirectTo: START_PAGE,
    pathMatch: 'full',
    hidden: true,
  },

  // Portal Group — Startseite, Fahrplan, Quellen, Erfolge, Einstellungen, Statistik, Impressum
  {
    path: 'home',
    titleKey: 'app.nav.home',
    icon: 'pi pi-home',
    group: 'knowledge',
    groupTitleKey: 'app.nav.group.knowledge',
    pageId: 'home',
    showByDefault: true,
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },

  // Redirect old topics path to the start page (ai-topics removed)
  {
    path: 'topics',
    redirectTo: START_PAGE,
    pathMatch: 'full',
    hidden: true,
  },

  // AI Topics route removed - old route redirects to the start page
  {
    path: 'ai-topics',
    redirectTo: START_PAGE,
    pathMatch: 'full',
    hidden: true,
  },

  // News Page (chronological news feed — paired with /roadmap, see Header-Combo concept §4).
  // Listed BEFORE /roadmap so it appears above the roadmap entry in the nav group.
  {
    path: 'news',
    titleKey: 'news.page.title',
    icon: 'pi pi-megaphone',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'news',
    showByDefault: true,
    descriptionKey: 'news.page.description',
    loadComponent: () => import('./pages/news/news.component').then((m) => m.NewsComponent),
  },

  // Roadmap — release schedule, translation quality, news
  {
    path: 'roadmap',
    titleKey: 'roadmap.hero.title',
    icon: 'pi pi-map',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'rdmp',
    showByDefault: true,
    descriptionKey: 'roadmap.hero.description',
    loadComponent: () => import('./pages/roadmap/roadmap.component').then((m) => m.RoadmapComponent),
  },

  // Sources (Quellenverzeichnis) - unified sources system
  {
    path: 'sources',
    titleKey: 'sources.title',
    icon: 'pi pi-list',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'srcs',
    showByDefault: true,
    loadComponent: () => import('./pages/sources/sources.component').then((m) => m.SourcesComponent),
  },

  // Progress — a read-only view of how far the visitor has got through the kit's
  // content. Reads what the quiz and checkpoint components already stored; writes
  // nothing (specs/2026-08-24-progress-page/shape.md).
  {
    path: 'progress',
    titleKey: 'app.nav.progress',
    icon: 'pi pi-chart-bar',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'prgs',
    showByDefault: true,
    descriptionKey: 'progress.subtitle',
    loadComponent: () => import('./pages/progress/progress.component').then((m) => m.ProgressComponent),
  },

  // User Settings
  {
    path: 'user-settings',
    titleKey: 'app.nav.userSettings',
    icon: 'pi pi-cog',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'sets',
    showByDefault: true,
    loadComponent: () => import('./pages/user-settings/user-settings.component').then((m) => m.UserSettingsComponent),
  },

  // Feedback — routed long-form form page. Sibling of the feedback FAB dialog,
  // but standalone and linkable; stores locally because the kit ships no
  // feedback backend (specs/2026-08-20-feedback-page/shape.md).
  {
    path: 'feedback',
    titleKey: 'feedback.page.title',
    icon: 'pi pi-comment',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'fdbk',
    showByDefault: true,
    descriptionKey: 'feedback.page.subtitle',
    loadComponent: () => import('./pages/feedback/feedback.component').then((m) => m.FeedbackComponent),
  },

  // Impressum
  {
    path: 'impressum',
    titleKey: 'impressum.title',
    icon: 'pi pi-info-circle',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'impr',
    showByDefault: true,
    loadComponent: () => import('./pages/impressum/impressum.component').then((m) => m.ImpressumComponent),
  },

  // Accessibility statement (Erklärung zur Barrierefreiheit) — voluntary,
  // self-assessed statement for this private educational portal. Linked from
  // the footer next to Impressum. SPA-served (T3, like impressum),
  // listed in the sitemap.
  {
    path: 'accessibility',
    titleKey: 'accessibility.title',
    icon: 'pi pi-check-square',
    group: 'portal',
    groupTitleKey: 'app.nav.group.portal',
    pageId: 'accs',
    showByDefault: true,
    loadComponent: () =>
      import('./pages/accessibility/accessibility-statement.component').then((m) => m.AccessibilityStatementComponent),
  },

  // Glossary (terms and definitions) - first in the knowledge group
  {
    path: 'glossary',
    titleKey: 'app.nav.glossary',
    icon: 'pi pi-book',
    group: 'knowledge',
    groupTitleKey: 'app.nav.group.knowledge',
    pageId: 'glsr',
    showByDefault: true,
    loadComponent: () => import('./pages/glossary/glossary.component').then((m) => m.GlossaryComponent),
  },

  // Timeline (historical events) - second in the knowledge group
  {
    path: 'ai-timeline',
    titleKey: 'app.nav.aiTimeline',
    icon: 'pi pi-clock',
    group: 'knowledge',
    groupTitleKey: 'app.nav.group.knowledge',
    pageId: 'time',
    showByDefault: true,
    loadComponent: () => import('./pages/ai-timeline/ai-timeline.component').then((m) => m.AiTimelineComponent),
  },

  // Catalog (tools and resources in one list) - fourth in the knowledge group
  {
    path: 'catalog',
    titleKey: 'app.nav.catalog',
    icon: 'pi pi-th-large',
    group: 'knowledge',
    groupTitleKey: 'app.nav.group.knowledge',
    pageId: 'ctlg',
    showByDefault: true,
    loadComponent: () => import('./pages/catalog/catalog.component').then((m) => m.CatalogComponent),
  },

  // Legacy redirects: old paths → catalog
  {
    path: 'ai-resources',
    redirectTo: 'catalog',
    pathMatch: 'full',
    hidden: true,
  },
  {
    path: 'ai-tools',
    redirectTo: 'catalog',
    pathMatch: 'full',
    hidden: true,
  },
  // Legacy pageId redirects
  {
    path: 'rsrc',
    redirectTo: 'catalog',
    pathMatch: 'full',
    hidden: true,
  },
  {
    path: 'tool',
    redirectTo: 'catalog',
    pathMatch: 'full',
    hidden: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LERNBEREICH (Unified Learning Area Hub)
  // Replaces /demos, /guides, /learning-paths with a single entry point
  // ═══════════════════════════════════════════════════════════════════

  // Lernbereich - Unified hub with Lernpfade + Inhalte views
  {
    path: 'learn',
    titleKey: 'lernbereich.title',
    icon: 'pi pi-graduation-cap',
    group: 'knowledge',
    groupTitleKey: 'app.nav.group.knowledge',
    pageId: 'lern',
    showByDefault: true,
    loadComponent: () => import('./pages/lernbereich/lernbereich.component').then((m) => m.LernbereichComponent),
  },

  // Legacy redirect: /lernen → /learn
  {
    path: 'lernen',
    redirectTo: 'learn',
    pathMatch: 'full',
    hidden: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LESSONS (Lektionen) - Guides + Articles combined for users
  // Internally: guides and articles remain separate (different templates)
  // Old hub - kept functional but hidden from navigation
  // ═══════════════════════════════════════════════════════════════════

  // Legacy: /guides redirects to /learn?view=content
  {
    path: 'guides',
    redirectTo: 'learn',
    pathMatch: 'full',
    hidden: true,
  },

  // ARTICLES (Artikel) - Now part of Lessons, hub hidden
  // Articles are shown in the /learn hub; article routes stay hidden:true
  // (reached via learning path, /learn tiles, or the 4-char page id).
  // ═══════════════════════════════════════════════════════════════════

  // Seed article — the self-documenting article template ("this is how an
  // article page is built"). Copy this route + component pair for new articles.
  // Meta/related refs: assets/data/core/articles/{index,seed-article-1}.json.
  {
    path: 'articles/seed-article-1',
    titleKey: 'seedArticle.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'sda1',
    hidden: true,
    descriptionKey: 'seedArticle.description',
    contentType: 'article',
    category: 'fundamentals',
    estimatedTime: '5min',
    loadComponent: () =>
      import('./pages/articles/seed-article-1/seed-article-1.component').then((m) => m.SeedArticle1Component),
  },

  // Short-ID redirect for the seed article — demonstrates the 4-char page-id
  // mechanic (/article/<pageId> → full path) used for print/QR-code deep links.
  // Hidden routes are skipped by generatePageIdRedirects, hence explicit.
  {
    path: 'article/sda1',
    redirectTo: 'articles/seed-article-1',
    pathMatch: 'full',
    hidden: true,
  },

  // SAMPLE ARTICLES (src/config/samples.json). Each sample's routes stand between
  // `// sample:begin <id>` and `// sample:end <id>`: `node tools/make-it-yours.mjs
  // --remove-samples` cuts exactly those lines, and check-site-config.mjs keeps the
  // markers and the manifest in step. Your own articles go outside the markers.

  // sample:begin art-git-intro
  // Version control with Git — a worked article built on the seed blueprint.
  // Meta/related refs: assets/data/core/articles/{index,art-git-intro}.json.
  {
    path: 'articles/art-git-intro',
    titleKey: 'articleGitIntro.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'giti',
    hidden: true,
    descriptionKey: 'articleGitIntro.hero.subtitle',
    contentType: 'article',
    category: 'fundamentals',
    estimatedTime: '12min',
    loadComponent: () =>
      import('./pages/articles/art-git-intro/art-git-intro.component').then((m) => m.ArtGitIntroComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/giti',
    redirectTo: 'articles/art-git-intro',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-git-intro

  // sample:begin art-terminal-intro
  // The terminal — graphical interface vs command line, paths, first commands.
  // Meta/related refs: assets/data/core/articles/{index,art-terminal-intro}.json.
  {
    path: 'articles/art-terminal-intro',
    titleKey: 'articleTerminalIntro.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'trml',
    hidden: true,
    descriptionKey: 'articleTerminalIntro.hero.subtitle',
    contentType: 'article',
    category: 'fundamentals',
    estimatedTime: '13min',
    loadComponent: () =>
      import('./pages/articles/art-terminal-intro/art-terminal-intro.component').then(
        (m) => m.ArtTerminalIntroComponent,
      ),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/trml',
    redirectTo: 'articles/art-terminal-intro',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-terminal-intro

  // sample:begin art-networking-apis
  // The internet and APIs — client and server, addresses, interfaces.
  // Meta/related refs: assets/data/core/articles/{index,art-networking-apis}.json.
  {
    path: 'articles/art-networking-apis',
    titleKey: 'articleNetworkingApis.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'napi',
    hidden: true,
    descriptionKey: 'articleNetworkingApis.hero.subtitle',
    contentType: 'article',
    category: 'fundamentals',
    estimatedTime: '14min',
    loadComponent: () =>
      import('./pages/articles/art-networking-apis/art-networking-apis.component').then(
        (m) => m.ArtNetworkingApisComponent,
      ),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/napi',
    redirectTo: 'articles/art-networking-apis',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-networking-apis

  // sample:begin art-vibecoding
  // Programming in natural language — the shift, the autonomy levels, the traps.
  // Meta/related refs: assets/data/core/articles/{index,art-vibecoding}.json.
  {
    path: 'articles/art-vibecoding',
    titleKey: 'articleVibecoding.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'vibe',
    hidden: true,
    descriptionKey: 'articleVibecoding.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '10min',
    loadComponent: () =>
      import('./pages/articles/art-vibecoding/art-vibecoding.component').then((m) => m.ArtVibecodingComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/vibe',
    redirectTo: 'articles/art-vibecoding',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-vibecoding

  // sample:begin art-context-engineering
  // Context engineering — what the agent already knows before you ask.
  // Meta/related refs: assets/data/core/articles/{index,art-context-engineering}.json.
  {
    path: 'articles/art-context-engineering',
    titleKey: 'articleContextEngineering.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'ctxe',
    hidden: true,
    descriptionKey: 'articleContextEngineering.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '5min',
    loadComponent: () =>
      import('./pages/articles/art-context-engineering/art-context-engineering.component').then(
        (m) => m.ArtContextEngineeringComponent,
      ),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/ctxe',
    redirectTo: 'articles/art-context-engineering',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-context-engineering

  // sample:begin art-apis-mcp
  // Using interfaces — model APIs, the MCP standard, and the agent loop.
  // Meta/related refs: assets/data/core/articles/{index,art-apis-mcp}.json.
  {
    path: 'articles/art-apis-mcp',
    titleKey: 'articleApisMcp.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'amcp',
    hidden: true,
    descriptionKey: 'articleApisMcp.hero.subtitle',
    contentType: 'article',
    category: 'architecture',
    estimatedTime: '10min',
    loadComponent: () =>
      import('./pages/articles/art-apis-mcp/art-apis-mcp.component').then((m) => m.ArtApisMcpComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/amcp',
    redirectTo: 'articles/art-apis-mcp',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-apis-mcp

  // sample:begin art-harness-engineering
  // Harness engineering — the engineered environment around a coding agent
  // (workshop, gates, rights) and what it measurably does. Released in the
  // kit without a date: the kit and the content workshop publish independently.
  // Meta/related refs: assets/data/core/articles/{index,art-harness-engineering}.json.
  {
    path: 'articles/art-harness-engineering',
    titleKey: 'articleHarnessEngineering.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'harn',
    hidden: true,
    descriptionKey: 'articleHarnessEngineering.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '11min',
    loadComponent: () =>
      import('./pages/articles/art-harness-engineering/art-harness-engineering.component').then(
        (m) => m.ArtHarnessEngineeringComponent,
      ),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/harn',
    redirectTo: 'articles/art-harness-engineering',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-harness-engineering

  // sample:begin art-agent-tests
  // Reading a test the agent wrote - what green and coverage prove, and the
  // softening trap when the agent owns both the code and the checks on it.
  // Released in the kit without a date: the kit and the content workshop
  // publish independently.
  // Meta/related refs: assets/data/core/articles/{index,art-agent-tests}.json.
  {
    path: 'articles/art-agent-tests',
    titleKey: 'articleAgentTests.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'tsts',
    hidden: true,
    descriptionKey: 'articleAgentTests.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '14min',
    loadComponent: () =>
      import('./pages/articles/art-agent-tests/art-agent-tests.component').then((m) => m.ArtAgentTestsComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/tsts',
    redirectTo: 'articles/art-agent-tests',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-agent-tests

  // sample:begin art-quality-gates
  // The row of machine checks between "the agent says it is finished" and "the
  // change is actually in" - advice versus gate, what a red board is worth, and
  // what a documented exception looks like.
  // Released in the kit without a date: the kit and the content workshop
  // publish independently.
  // Meta/related refs: assets/data/core/articles/{index,art-quality-gates}.json.
  {
    path: 'articles/art-quality-gates',
    titleKey: 'articleQualityGates.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'gate',
    hidden: true,
    descriptionKey: 'articleQualityGates.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '18min',
    loadComponent: () =>
      import('./pages/articles/art-quality-gates/art-quality-gates.component').then((m) => m.ArtQualityGatesComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/gate',
    redirectTo: 'articles/art-quality-gates',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-quality-gates

  // sample:begin art-code-review-basics
  // What a person who cannot read code can still check when an agent reports
  // "finished" — the measurable shape of a diff, three questions whose answers
  // can be held against an artifact, and the case that has to fail.
  // Released in the kit without a date: the kit and the content workshop
  // publish independently.
  // Meta/related refs: assets/data/core/articles/{index,art-code-review-basics}.json.
  {
    path: 'articles/art-code-review-basics',
    titleKey: 'articleCodeReviewBasics.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'revw',
    hidden: true,
    descriptionKey: 'articleCodeReviewBasics.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '19min',
    loadComponent: () =>
      import('./pages/articles/art-code-review-basics/art-code-review-basics.component').then(
        (m) => m.ArtCodeReviewBasicsComponent,
      ),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/revw',
    redirectTo: 'articles/art-code-review-basics',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-code-review-basics

  // sample:begin art-secrets-security
  // Secrets and security — what must never enter a repository: recognizing a
  // secret, why deleting it takes nothing back, and the one step without a way
  // back that stays with the reader.
  // Released in the kit without a date: the kit and the content workshop
  // publish independently.
  // Meta/related refs: assets/data/core/articles/{index,art-secrets-security}.json.
  {
    path: 'articles/art-secrets-security',
    titleKey: 'articleSecretsSecurity.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'secr',
    hidden: true,
    descriptionKey: 'articleSecretsSecurity.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '12min',
    loadComponent: () =>
      import('./pages/articles/art-secrets-security/art-secrets-security.component').then(
        (m) => m.ArtSecretsSecurityComponent,
      ),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/secr',
    redirectTo: 'articles/art-secrets-security',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-secrets-security

  // sample:begin art-dev-environment
  // Setting up a development environment — editor, terminal, runtime and version
  // control, each introduced by the question it answers, plus the cloud shortcut.
  // Released in the kit without a date: the kit and the content workshop publish
  // independently.
  // Meta/related refs: assets/data/core/articles/{index,art-dev-environment}.json.
  {
    path: 'articles/art-dev-environment',
    titleKey: 'articleDevEnvironment.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'edtr',
    hidden: true,
    descriptionKey: 'articleDevEnvironment.hero.subtitle',
    contentType: 'article',
    category: 'fundamentals',
    estimatedTime: '15min',
    loadComponent: () =>
      import('./pages/articles/art-dev-environment/art-dev-environment.component').then(
        (m) => m.ArtDevEnvironmentComponent,
      ),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/edtr',
    redirectTo: 'articles/art-dev-environment',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-dev-environment

  // sample:begin art-second-brain
  // A second brain is a procedure, not a store — the asymmetry inside capture,
  // organize, distill and express, why access feels like understanding, and what
  // changes once an assistant can be pointed at one's own notes.
  // Released in the kit without a date: the kit and the content workshop
  // publish independently.
  // Meta/related refs: assets/data/core/articles/{index,art-second-brain}.json.
  {
    path: 'articles/art-second-brain',
    titleKey: 'articleSecondBrain.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'sbrn',
    hidden: true,
    descriptionKey: 'articleSecondBrain.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '11min',
    loadComponent: () =>
      import('./pages/articles/art-second-brain/art-second-brain.component').then((m) => m.ArtSecondBrainComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/sbrn',
    redirectTo: 'articles/art-second-brain',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-second-brain

  // sample:begin art-digital-twins
  // Digital-twins lesson, imported from the content workshop (art-digital-twins).
  // Released in the kit without a date: the kit and the content workshop
  // publish independently.
  // Meta/related refs: assets/data/core/articles/{index,art-digital-twins}.json.
  {
    path: 'articles/art-digital-twins',
    titleKey: 'articleDigitalTwins.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'dtwn',
    hidden: true,
    descriptionKey: 'articleDigitalTwins.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '11min',
    loadComponent: () =>
      import('./pages/articles/art-digital-twins/art-digital-twins.component').then((m) => m.ArtDigitalTwinsComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/dtwn',
    redirectTo: 'articles/art-digital-twins',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-digital-twins

  // sample:begin art-tour
  // The tour: ten stations through this repository itself, opening the
  // under-the-hood path (art-tour). Written in the kit rather than imported.
  // Released in the kit without a date: the kit shows what is there.
  // Meta/related refs: assets/data/core/articles/{index,art-tour}.json.
  {
    path: 'articles/art-tour',
    titleKey: 'articleTour.hero.title',
    icon: 'pi pi-book',
    group: 'lessons',
    groupTitleKey: 'app.nav.group.lessons',
    pageId: 'tour',
    hidden: true,
    descriptionKey: 'articleTour.hero.subtitle',
    contentType: 'article',
    category: 'concepts',
    estimatedTime: '12min',
    loadComponent: () => import('./pages/articles/art-tour/art-tour.component').then((m) => m.ArtTourComponent),
  },

  // Short-ID redirect (print / QR deep link). Hidden routes are skipped by
  // generatePageIdRedirects, hence explicit.
  {
    path: 'article/tour',
    redirectTo: 'articles/art-tour',
    pathMatch: 'full',
    hidden: true,
  },
  // sample:end art-tour

  // Redirect /lektionen to /learn (legacy route)
  {
    path: 'lektionen',
    redirectTo: 'learn',
    pathMatch: 'full',
    hidden: true,
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEARNING PATHS (Lernpfade)
  // ═══════════════════════════════════════════════════════════════════

  // Legacy redirect: /learning-paths → /learn (component is still used as embedded child of /learn)
  {
    path: 'learning-paths',
    redirectTo: 'learn',
    pathMatch: 'full',
    hidden: true,
  },

  // =================================================================
  // Schaubilder-Picker-Routes wurden 2026-05-28 entfernt — Pick-
  // Pipeline ist abgeschlossen, Composite-Picker + 19 Lernpfad-Picker-Pages
  // brauchen wir nicht mehr im Bundle. Die Picker-Seiten selbst sind nicht Teil
  // dieses Kits; der zugehörige Service und der Wrapper wurden mit den übrigen
  // referenzlosen Komponenten entfernt.
  // Restore: git revert oder Routes wieder einfügen aus älterem Commit.
  // =================================================================

  // =================================================================
  // PLANNED ARTICLE/GUIDE ROUTES (Curriculum V2)
  // Routes added as articles progress through the pipeline.
  // The article set this kit ships lives in src/assets/data/core/articles/ with
  // one component per article under src/app/pages/articles/.
  // =================================================================

  // Demos Overview Hub - hidden, replaced by /lernen?view=content
  {
    path: 'demos',
    titleKey: 'demos.title',
    icon: 'pi pi-play',
    group: 'knowledge',
    groupTitleKey: 'app.nav.group.knowledge',
    pageId: 'demo',
    showByDefault: false,
    hidden: true,
    loadComponent: () =>
      import('./pages/demos-overview/demos-overview.component').then((m) => m.DemosOverviewComponent),
  },

  // Example Demo — placeholder demo that shows and explains the structure
  // ("blueprint") of an interactive demo. Copy this page to build your own.
  {
    path: 'example-demo',
    titleKey: 'exampleDemo.title',
    icon: 'pi pi-circle',
    group: 'interaktiveDemos',
    groupTitleKey: 'app.nav.group.interaktiveDemos',
    pageId: 'sdmo',
    showByDefault: true,
    loadComponent: () => import('./pages/example-demo/example-demo.component').then((m) => m.ExampleDemoComponent),
    descriptionKey: 'exampleDemo.description',
    contentType: 'demo',
    category: 'ml',
    estimatedTime: '10min',
    interactive: true,
    featured: true,
  },

  // Unsupervised Learning Demo (Legacy - now redirects to the start page)
  {
    path: 'unsupervised-learning-demo',
    redirectTo: START_PAGE,
    pathMatch: 'full',
    hidden: true,
  },

  // Page ID redirects - auto-generated from page IDs
  // Note: These routes will be added programmatically below

  // Dev-only workshop routes (SPEC N5). Spread in BEFORE the wildcard so they
  // resolve; each carries devOnly + hidden so it never surfaces in navigation,
  // sitemap, or prerender. Empty array in production (see import note above).
  ...devRoutes,

  // Wildcard route for any unmatched routes - keep this last
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    hidden: true,
  },
];

const baseRoutes: ExtendedRoute[] = extendedRoutes;

/**
 * Apply TranslationReadyGuard to all routes that load components
 * This prevents FOUC (Flash of Untranslated Content) by ensuring
 * translations are loaded before any component renders.
 *
 * A route that src/config/features.json assigns to a feature also gets
 * featureGuard (canMatch): while site.json switches that feature off, the
 * route does not match and the visitor lands on the start page.
 */
function applyGuards(routes: ExtendedRoute[]): ExtendedRoute[] {
  return routes.map((route) => {
    // Only apply guards to routes that actually load components (not redirects)
    if (route.loadComponent && !route.redirectTo) {
      const ownedByFeature = SITE.featureOfRoute(route.path ?? '', route.group) !== undefined;
      return {
        ...route,
        ...(ownedByFeature ? { canMatch: [featureGuard, ...(route.canMatch || [])] } : {}),
        canActivate: [translationReadyGuard, draftRouteGuard, demoReleaseGuard, ...(route.canActivate || [])],
      };
    }
    return route;
  });
}

// Apply translation guards to base routes
const guardedRoutes = applyGuards(baseRoutes);

// Generate pageId redirect routes
const pageIdRedirects = generatePageIdRedirects(guardedRoutes);

// Create full routes array with pageId redirects inserted before the wildcard route
const fullRoutes: ExtendedRoute[] = [
  // Add all routes except the wildcard route
  ...guardedRoutes.slice(0, guardedRoutes.length - 1),

  // Add all pageId redirects
  ...pageIdRedirects,

  // Add the wildcard route at the end
  guardedRoutes[guardedRoutes.length - 1],
];

// Export standard Angular routes (without the extended metadata)
// This is what Angular router will use
export const routes: Routes = fullRoutes;
