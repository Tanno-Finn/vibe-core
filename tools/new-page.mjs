#!/usr/bin/env node
/**
 * new-page.mjs — scaffold a portal page or an interactive demo (kit tool `new-page`).
 *
 * WHAT: follows docs/how-to/add-a-page.md so nothing is reconstructed from memory. It
 * CREATES the standalone component (`src/app/pages/<slug>/<slug>.component.ts`: `@if`, an
 * `isPlatformBrowser` guard and the pages' `t()` helper) and its `.spec.ts`, and one i18n
 * module `<namespace>.json` per configured language and Easy variant, filled from
 * --strings. It EDITS `angular.json` (the spec into the `test.include` allowlist, without
 * which it never runs), `app.nav.<namespace>` in every `app.json`, and for --kind demo
 * `src/assets/data/core/demos/index.json` (with `milestones`: one checkpoint
 * `<slug>-checkpoints`/`main`, what finishes the demo on /progress). It PRINTS, with file
 * and anchor, the three edits
 * to hand-maintained TypeScript and JavaScript — the route in `src/app/app.routes.ts`, for
 * a demo `RenderMode.Client` in `src/app/app.routes.server.ts`, for a page its prerender
 * entry in `scripts/generate-prerender-routes.js` — for the agent to paste: inserting into
 * those files without a syntax tree is the fragile part.
 *
 * HOW: --strings is a JSON object `{ "<locale>": { "title": …, "description": … }, … }`
 * with every configured locale, Easy variants included (src/config/languages.json). A
 * missing locale is exit 2: a placeholder in the wrong language would ship silently. The
 * namespace is the slug in camelCase (`my-page` → `myPage`). The page id (the 4-character
 * short URL) is --page-id or derived from the slug, and must not be taken by another page
 * id or route path in app.routes.ts. An existing component folder, module, nav key, route
 * or demo entry is exit 2; nothing is overwritten. Every check runs before the first file
 * is written, and a write that fails (a read-only file) undoes the ones before it (exit 3).
 * --dry-run prints the plan and writes nothing.
 *
 * WHAT IT CANNOT SEE: whether the pasted snippets landed in the right place — after
 * pasting, run `node scripts/check-i18n-keys.mjs` and `node scripts/verify-harness.mjs`
 * (check 11: the spec allowlist), then `npm run build:prod` proves the page prerenders.
 *
 * Run:  node tools/new-page.mjs my-page --kind page --strings strings.json [--dry-run]
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXIT, ToolError, inputFile, outputPath, readText, rel, runTool } from './lib/cli.mjs';

const KEYS = ['title', 'description'];
const DEFAULT_GROUP = { page: 'portal', demo: 'interaktiveDemos' };

const camel = (slug) => slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const pascal = (slug) => camel(slug).replace(/^[a-z]/, (c) => c.toUpperCase());
const readJson = (file) => JSON.parse(readText(file));
const json = (v) => JSON.stringify(v, null, 2) + '\n';

/** Page ids and route paths already used in app.routes.ts. */
function routesInfo(routesTs) {
  return {
    pageIds: new Set([...routesTs.matchAll(/pageId:\s*'([^']+)'/g)].map((m) => m[1])),
    paths: new Set([...routesTs.matchAll(/path:\s*'([^']*)'/g)].map((m) => m[1])),
  };
}

/** The first free 4-character id from the slug's letters and digits. */
function derivePageId(slug, taken) {
  const s = slug.replace(/[^a-z0-9]/g, '');
  const parts = slug.split('-');
  const candidates = [s.slice(0, 4)];
  for (let i = 4; i < s.length; i++) candidates.push(s.slice(0, 3) + s[i]);
  if (parts.length > 1) candidates.push((parts.map((p) => p[0]).join('') + s).slice(0, 4));
  for (let d = 0; d < 10; d++) candidates.push(s.slice(0, 3).padEnd(3, '0') + d);
  for (let d = 10; d < 100; d++) candidates.push(s.slice(0, 2).padEnd(2, '0') + d);
  return candidates.find((c) => c.length === 4 && !taken(c));
}

/** The path of the last route in app.routes.ts that belongs to `group` (the paste anchor). */
function lastRouteOfGroup(routesTs, group) {
  let last = null;
  for (const m of routesTs.matchAll(new RegExp(`group:\\s*'${group}'`, 'g'))) {
    const before = routesTs.slice(0, m.index);
    const p = [...before.matchAll(/path:\s*'([^']*)'/g)].pop();
    if (p) last = p[1];
  }
  return last;
}

// The title sits in a block comment: a "*/" in it would end the comment and turn the rest into code.
const componentTs = ({ slug, ns, cls, title }) => `/**
 * ${title.replace(/\*\//g, '*\\/')} (/${slug})
 *
 * Scaffolded by tools/new-page.mjs. Replace this comment with what the page is for and how
 * it is built.
 *
 * All copy lives in the \`${ns}.*\` i18n namespace
 * (src/assets/i18n/modules/<lang>/${ns}.json, one module per language and Easy variant).
 *
 * SSR-safe: the page is rendered under Node too. Anything that touches window, document,
 * localStorage or navigator goes behind \`isBrowser\`.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslationService } from '../../services/translation.service';
import { ArticleComponent } from '../../components/shared/article.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';

@Component({
  selector: 'app-${slug}',
  standalone: true,
  imports: [ArticleComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <app-article width="page" [transparentBackground]="true">
      <app-page-header titleKey="${ns}.title" />
      <p class="page-lead">{{ t('${ns}.description') }}</p>
      @if (isBrowser) {
        <!-- Browser-only parts (canvas, animation, stored state) go here. -->
      }
    </app-article>
  \`,
  styles: [
    \`
      .page-lead {
        font-size: 1.1rem;
        line-height: 1.6;
      }
    \`,
  ],
})
export class ${cls} {
  private readonly translationService = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** False while the page is prerendered under Node: guard every browser global behind it. */
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Track the current language so computed() and t() re-evaluate on a language change.
  private readonly currentLanguage = computed(() => this.translationService.currentLanguage);

  constructor() {
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => this.cdr.detectChanges());
  }

  /** Reactive translate helper — reads currentLanguage so the value tracks language switches. */
  t(key: string): string {
    this.currentLanguage();
    return this.translationService.translate(key);
  }
}
`;

const specTs = ({ slug, ns, cls }) => `/**
 * ${cls} spec
 *
 * Scaffolded by tools/new-page.mjs: the page builds, reads its texts through the translation
 * service and knows it runs in a browser. Add a test for everything the page does beyond that.
 *
 * Only the component class is under test: the template is replaced by an empty one.
 */
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ${cls} } from './${slug}.component';
import { TranslationService } from '../../services/translation.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage = 'en';
  translate(key: string): string {
    return \`[\${key}]\`;
  }
}

function create(): ${cls} {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [${cls}],
    providers: [{ provide: TranslationService, useClass: TranslationServiceStub }],
  });
  TestBed.overrideComponent(${cls}, { set: { template: '', imports: [] } });
  return TestBed.createComponent(${cls}).componentInstance;
}

describe('${cls}', () => {
  it('reads its texts through the translation service', () => {
    expect(create().t('${ns}.description')).toBe('[${ns}.description]');
  });

  it('knows it runs in a browser under the test runner', () => {
    expect(create().isBrowser).toBe(true);
  });
});
`;

const routeSnippet = ({ slug, ns, cls, kind, group, pageId }) =>
  [
    '  {',
    `    path: '${slug}',`,
    `    titleKey: 'app.nav.${ns}',`,
    `    icon: '${kind === 'demo' ? 'pi pi-play' : 'pi pi-file'}',`,
    `    group: '${group}',`,
    `    groupTitleKey: 'app.nav.group.${group}',`,
    `    pageId: '${pageId}',`,
    '    showByDefault: true,',
    `    loadComponent: () => import('./pages/${slug}/${slug}.component').then((m) => m.${cls}),`,
    `    descriptionKey: '${ns}.description',`,
    ...(kind === 'demo'
      ? [
          "    contentType: 'demo',",
          "    category: 'fundamentals',",
          "    estimatedTime: '10min',",
          '    interactive: true,',
        ]
      : []),
    '  },',
  ].join('\n');

await runTool({
  id: 'new-page',
  summary: 'scaffold a portal page or demo: component, spec, texts in every language, registrations',
  usage: 'node tools/new-page.mjs <slug> --kind page|demo --strings <file.json> [options]',
  description: [
    'Creates the page component, its test and its texts in every configured language, adds the',
    'test to the allowlist and the page to the navigation texts, and prints the three code',
    'snippets (route, server render mode or prerender list) to paste, with file and place.',
  ],
  options: {
    kind: {
      type: 'string',
      arg: 'page|demo',
      help: 'a normal page, or an interactive demo',
      choices: ['page', 'demo'],
    },
    strings: {
      type: 'string',
      arg: '<file.json>',
      help: 'title and description per locale: { "de": { "title": …, "description": … }, "de-easy": … }',
    },
    'page-id': {
      type: 'string',
      arg: '<xxxx>',
      help: 'the 4-character short URL (letters, digits)',
      defaultText: 'derived from the slug',
    },
    group: {
      type: 'string',
      arg: '<nav-group>',
      help: 'navigation group (a key of app.nav.group)',
      defaultText: 'portal for a page, interaktiveDemos for a demo',
    },
    'dry-run': { type: 'boolean', help: 'print the plan, write nothing' },
  },
  examples: [
    'node tools/new-page.mjs water-cycle --kind page --strings tmp/water-cycle.json --dry-run',
    'node tools/new-page.mjs sorting-demo --kind demo --strings tmp/sorting-demo.json',
  ],
  async run({ values, positionals, report, root }) {
    if (positionals.length !== 1) throw new ToolError(EXIT.USAGE, 'give one slug, e.g. water-cycle.');
    const slug = positionals[0];
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(slug)) {
      throw new ToolError(EXIT.USAGE, `slug "${slug}" must be small letters, digits and single hyphens (water-cycle).`);
    }
    if (!values.kind) throw new ToolError(EXIT.USAGE, 'give --kind page or --kind demo.');
    if (!values.strings)
      throw new ToolError(EXIT.USAGE, 'give --strings <file.json> with the title and description per language.');
    const kind = values.kind;
    const ns = camel(slug);
    const cls = `${pascal(slug)}Component`;
    const group = values.group ?? DEFAULT_GROUP[kind];

    // Languages and strings
    const languages = readJson(join(root, 'src', 'config', 'languages.json'));
    const locales = (languages.languages || []).flatMap((l) => [l.code, l.easyCode].filter(Boolean));
    const keySource = languages.keySourceLanguage;
    let strings;
    try {
      strings = readJson(inputFile(root, values.strings, { exts: ['.json'] }));
    } catch (err) {
      if (err instanceof ToolError) throw err;
      throw new ToolError(EXIT.USAGE, `--strings is not valid JSON: ${err.message}`);
    }
    const missing = locales.filter((l) => !strings?.[l]);
    if (missing.length) {
      throw new ToolError(
        EXIT.USAGE,
        `--strings has no texts for ${missing.join(', ')} — every configured language and Easy variant needs its own (${locales.join(', ')}).`,
      );
    }
    for (const l of Object.keys(strings)) {
      if (!locales.includes(l))
        throw new ToolError(EXIT.USAGE, `--strings names "${l}", which is not configured (${locales.join(', ')}).`);
      for (const k of Object.keys(strings[l])) {
        if (!KEYS.includes(k))
          throw new ToolError(EXIT.USAGE, `--strings.${l} has "${k}"; only ${KEYS.join(' and ')} are scaffolded.`);
      }
      for (const k of KEYS) {
        if (typeof strings[l][k] !== 'string' || !strings[l][k].trim()) {
          throw new ToolError(EXIT.USAGE, `--strings.${l}.${k} is missing or empty.`);
        }
      }
    }

    // Existing names
    const routesFile = join(root, 'src', 'app', 'app.routes.ts');
    const routesTs = readFileSync(routesFile, 'utf8');
    const { pageIds, paths } = routesInfo(routesTs);
    if (paths.has(slug)) throw new ToolError(EXIT.USAGE, `app.routes.ts already has a route with path '${slug}'.`);
    const demosFile = join(root, 'src', 'assets', 'data', 'core', 'demos', 'index.json');
    const demos = kind === 'demo' ? readJson(demosFile) : null;
    for (const d of demos || []) {
      if (d.id === slug || d.path === slug) throw new ToolError(EXIT.USAGE, `demos/index.json already has "${slug}".`);
      pageIds.add(d.pageId);
    }
    const taken = (id) => pageIds.has(id) || paths.has(id);
    let pageId = values['page-id'];
    if (pageId !== undefined) {
      if (!/^[a-z0-9]{4}$/.test(pageId))
        throw new ToolError(EXIT.USAGE, `--page-id must be 4 small letters or digits, not "${pageId}".`);
      if (taken(pageId))
        throw new ToolError(EXIT.USAGE, `page id "${pageId}" is already used in app.routes.ts — choose another.`);
    } else {
      pageId = derivePageId(slug, taken);
      if (!pageId) throw new ToolError(EXIT.USAGE, 'could not derive a free page id — pass --page-id <xxxx>.');
    }
    const modulesDir = join(root, 'src', 'assets', 'i18n', 'modules');
    const groups = readJson(join(modulesDir, keySource, 'app.json')).nav?.group ?? {};
    if (!Object.hasOwn(groups, group)) {
      throw new ToolError(
        EXIT.USAGE,
        `--group "${group}" is not a navigation group (${Object.keys(groups).join(', ')}).`,
      );
    }
    const pageDir = join(root, 'src', 'app', 'pages', slug);
    if (existsSync(pageDir)) throw new ToolError(EXIT.USAGE, `${rel(root, pageDir)}/ already exists.`);
    const appJson = {};
    for (const l of locales) {
      const moduleFile = join(modulesDir, l, `${ns}.json`);
      if (existsSync(moduleFile)) throw new ToolError(EXIT.USAGE, `${rel(root, moduleFile)} already exists.`);
      const file = join(modulesDir, l, 'app.json');
      if (!existsSync(file)) throw new ToolError(EXIT.USAGE, `${rel(root, file)} is missing — is ${l} set up?`);
      appJson[l] = readJson(file);
      if (appJson[l].nav?.[ns] !== undefined)
        throw new ToolError(EXIT.USAGE, `app.nav.${ns} already exists in ${l}/app.json.`);
    }
    const angularFile = join(root, 'angular.json');
    const angular = readFileSync(angularFile, 'utf8');
    const specPath = `src/app/pages/${slug}/${slug}.component.spec.ts`;
    const testAt = angular.indexOf('"test": {');
    const includeAt = testAt < 0 ? -1 : angular.indexOf('"include": [', testAt);
    const closeAt = includeAt < 0 ? -1 : angular.indexOf(']', includeAt);
    if (closeAt < 0) throw new ToolError(EXIT.USAGE, 'angular.json has no test → options → include list.');
    if (angular.slice(includeAt, closeAt).includes(`"${specPath}"`))
      throw new ToolError(EXIT.USAGE, `${specPath} is already in angular.json.`);

    // The plan
    const title = strings[keySource]?.title ?? strings[locales[0]].title;
    const creates = [
      [join(pageDir, `${slug}.component.ts`), componentTs({ slug, ns, cls, title })],
      [join(pageDir, `${slug}.component.spec.ts`), specTs({ slug, ns, cls })],
      ...locales.map((l) => [
        join(modulesDir, l, `${ns}.json`),
        json({ title: strings[l].title, description: strings[l].description }),
      ]),
    ];
    const lastEntry = angular.lastIndexOf('"', closeAt);
    const indent = /\n([ \t]*)"[^"\n]*"\s*$/.exec(angular.slice(includeAt, lastEntry + 1))?.[1] ?? '              ';
    const angularNew = `${angular.slice(0, lastEntry + 1)},\n${indent}"${specPath}"${angular.slice(lastEntry + 1)}`;
    try {
      JSON.parse(angularNew);
    } catch {
      throw new ToolError(
        EXIT.USAGE,
        `angular.json: could not add the spec to test → include (an empty list?). Add "${specPath}" by hand.`,
      );
    }
    const edits = [
      [angularFile, angularNew],
      ...locales.map((l) => {
        const app = appJson[l];
        app.nav = { ...app.nav, [ns]: strings[l].title };
        return [join(modulesDir, l, 'app.json'), json(app)];
      }),
    ];
    if (kind === 'demo') {
      demos.push({
        id: slug,
        path: slug,
        titleKey: `${ns}.title`,
        descriptionKey: `${ns}.description`,
        category: 'fundamentals',
        estimatedTime: '10min',
        difficulty: 'beginner',
        featured: false,
        icon: 'pi pi-play',
        pageId,
        tags: [],
        related: {},
        // What finishes the demo on /progress (src/app/services/milestones.types.ts): one
        // checkpoint, which the demo shows with <app-checkpoint> (printed below).
        milestones: [{ type: 'checkpoint', storageKey: `${slug}-checkpoints`, checkpointId: 'main' }],
      });
      edits.push([demosFile, json(demos)]);
    }
    const anchor = lastRouteOfGroup(routesTs, group);
    const snippets = [
      {
        file: 'src/app/app.routes.ts',
        anchor: anchor
          ? `inside the routes array, right after the route with path '${anchor}' (the last one of the group '${group}')`
          : `inside the routes array, before the comment "Page ID redirects"`,
        code: routeSnippet({ slug, ns, cls, kind, group, pageId }),
      },
      kind === 'demo'
        ? {
            file: 'src/app/app.routes.server.ts',
            anchor: 'inside DEMO_ROUTES, after the other interactive demos (demos are rendered in the browser only)',
            code: `  { path: '${slug}', renderMode: RenderMode.Client },`,
          }
        : {
            file: 'scripts/generate-prerender-routes.js',
            anchor: 'at the end of TIER_1_ROUTES (build:prod then proves the page renders under Node)',
            code: `  '${slug}',`,
          },
    ];

    report.say(
      `${values['dry-run'] ? 'Plan (dry run, nothing written)' : 'Scaffold'}: ${kind} /${slug} — ${cls}, namespace ${ns}, page id ${pageId}, group ${group}`,
    );
    if (values['dry-run']) {
      for (const [f] of creates) report.say(`  would create ${rel(root, f)}`);
      for (const [f] of edits) report.say(`  would edit   ${rel(root, f)}`);
    } else {
      // Every path is checked before the first write; a write that fails undoes the ones before it.
      const plan = [
        ...creates.map(([f, content]) => [outputPath(root, f), content, null]),
        ...edits.map(([f, content]) => [outputPath(root, f, { force: true }), content, readFileSync(f)]),
      ];
      const done = [];
      try {
        for (const [f, content, before] of plan) {
          report.write(f, content);
          done.push([f, before]);
        }
      } catch (err) {
        for (const [f, before] of done.reverse()) {
          if (before) writeFileSync(f, before);
          else rmSync(f, { force: true });
        }
        rmSync(pageDir, { recursive: true, force: true });
        report.outputs.length = 0;
        throw new ToolError(EXIT.ENV, `writing failed (${err.message}) — everything written before it was undone.`);
      }
    }
    report.say('');
    report.say(`Paste these ${snippets.length} snippets by hand (the tool does not edit TypeScript):`);
    for (const s of snippets) {
      report.say('');
      report.say(`--- ${s.file} — ${s.anchor}`);
      report.say(s.code);
    }
    if (kind === 'demo') {
      report.say('');
      report.say(
        `The demos index entry says the demo is finished once its checkpoint is ticked: show it in the demo with`,
      );
      report.say(
        `  <app-checkpoint storageKey="${slug}-checkpoints" checkpointId="main" [items]="…" /> (see src/app/pages/example-demo).`,
      );
    }
    report.say('');
    report.say('Then run: node scripts/check-i18n-keys.mjs  and  node scripts/verify-harness.mjs');
    report.data.slug = slug;
    report.data.kind = kind;
    report.data.namespace = ns;
    report.data.component = cls;
    report.data.pageId = pageId;
    report.data.group = group;
    report.data.creates = creates.map(([f]) => rel(root, f));
    report.data.edits = edits.map(([f]) => rel(root, f));
    report.data.snippets = snippets;
    report.notChecked.push(
      'whether the snippets were pasted in the right place: run check-i18n-keys and verify-harness afterwards',
      'whether the page renders under Node: npm run build:prod',
      'the texts themselves: they were copied from --strings as given',
    );
  },
});
