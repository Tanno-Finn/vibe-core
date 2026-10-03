import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { easyAvailabilityFromModules } from '../../scripts/lib/i18n-split.mjs';
import { formatConfigJson } from '../lib/config-json.mjs';
import { ROOT, run, scratch } from './helpers.mjs';

/*
 * The fixture is a mini kit written by `kit()` below and put under git in a scratch folder:
 * one seed and one sample of each kind (article art-one, glossary term term-x, source src-x,
 * learning path path-x), four configured locales plus an unconfigured Italian draft, and the
 * kit's REAL i18n gate (scripts/check-i18n-keys.mjs and the libraries it reads, copied from
 * this repo), so the removal's "gate green before" pre-check and the "gate green after"
 * result are the gate's own verdict, not a stub's.
 */

const LOCALES = ['de', 'de-easy', 'en', 'en-easy'];
const GATE_FILES = [
  'scripts/check-i18n-keys.mjs',
  'scripts/lib/locale-fallback.mjs',
  'scripts/lib/i18n-split.mjs',
  'scripts/lib/feature-scope.mjs',
  'scripts/lib/site-config.mjs',
  'scripts/lib/i18n-orphans.mjs',
  'src/config/language-rules.mts',
  'src/config/site-rules.mts',
  'src/config/languages.json',
  'src/config/site.json',
];
const j = (v) => JSON.stringify(v, null, 2) + '\n';

const MODULES = {
  app: { nav: { home: 'Home' } },
  shared: { common: 'Common', onlyInSample: 'Only the sample reads this' },
  meta: { description: 'The kit description' },
  easyLanguage: { content: { home: { title: 'Home' }, artOne: { title: 'One' } } },
  articleOne: { hero: { title: 'One', subtitle: 'The one sample' }, body: 'Body' },
  seedArticle: { title: 'Seed', description: 'The seed article' },
  learningPaths: { seedPath1: { title: 'Seed path' }, pathX: { title: 'Path X' } },
  news: { title: 'News' },
};

const ROUTES = `export const extendedRoutes = [
  {
    path: 'home',
    titleKey: 'app.nav.home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'news',
    titleKey: 'news.title',
    loadComponent: () => import('./pages/news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'articles/seed-article-1',
    titleKey: 'seedArticle.title',
    descriptionKey: 'seedArticle.description',
    loadComponent: () => import('./pages/articles/seed-article-1/seed.component').then((m) => m.SeedComponent),
  },

  // sample:begin art-one
  // The one sample article.
  {
    path: 'articles/art-one',
    titleKey: 'articleOne.hero.title',
    descriptionKey: 'articleOne.hero.subtitle',
    loadComponent: () => import('./pages/articles/art-one/art-one.component').then((m) => m.ArtOneComponent),
  },

  {
    path: 'article/aone',
    redirectTo: 'articles/art-one',
  },
  // sample:end art-one

  {
    path: '**',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
];
`;

const INDEX_HTML = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>vibecore</title>
    <script>
      (function () {
        var codes = ['de', 'en'];
        var saved = null;
        var lang = codes.indexOf(saved) !== -1 ? saved : 'de';
      })();
    </script>
    <meta name="description" content="The kit description." />
    <meta property="og:site_name" content="vibecore" />
    <meta property="og:title" content="vibecore — kit" />
    <meta property="og:description" content="The kit description." />
    <meta name="twitter:title" content="vibecore — kit" />
    <meta name="twitter:description" content="The kit description." />
  </head>
  <body></body>
</html>
`;

const SAMPLES = {
  _comment: 'The mini kit’s samples.',
  articles: [{ id: 'art-one', pageId: 'aone', namespace: 'articleOne', folder: 'src/app/pages/articles/art-one' }],
  glossary: ['term-x'],
  sources: ['src-x'],
  learningPaths: ['path-x'],
  i18nKeys: ['easyLanguage.content.artOne', 'learningPaths.pathX'],
  notSamples: [],
};

function kitFiles() {
  const files = {
    'src/config/features.json': j({
      shellPages: ['home'],
      features: {
        news: {
          code: ['src/app/pages/news/'],
          routes: ['news'],
          i18n: ['news'],
          collections: [],
          prerenderTier: null,
          sitemap: false,
          a11yPages: [],
        },
      },
    }),
    'src/config/samples.json': formatConfigJson(SAMPLES),
    'src/config/easy-language-availability.json': j(
      easyAvailabilityFromModules(new Map(LOCALES.map((l) => [l, structuredClone(MODULES)]))),
    ),
    'src/index.html': INDEX_HTML,
    'src/assets/images/og-image.svg':
      '<svg xmlns="http://www.w3.org/2000/svg">\n  <text x="1">\n    vibecore\n  </text>\n  <text>Sub</text>\n</svg>\n',
    'src/app/app.routes.ts': ROUTES,
    'src/app/pages/home/home.component.ts':
      "export class HomeComponent {\n  title = translate('shared.common');\n  meta = translate('meta.description');\n  preview = (id: string) => translate('easyLanguage.content.' + id);\n}\n",
    'src/app/pages/home/home.component.spec.ts': "it('builds', () => {});\n",
    'src/app/pages/news/news.component.ts': "export class NewsComponent {\n  title = translate('news.title');\n}\n",
    'src/app/pages/articles/seed-article-1/seed.component.ts':
      "export class SeedComponent {\n  t = translate('seedArticle.title');\n}\n",
    'src/app/pages/articles/art-one/art-one.component.ts':
      "export class ArtOneComponent {\n  a = translate('articleOne.body');\n  b = translate('shared.onlyInSample');\n}\n",
    'src/app/pages/articles/art-one/art-one.component.spec.ts': "it('builds', () => {});\n",
    'src/assets/data/core/articles/index.json': j([
      { id: 'seed-article-1', path: 'articles/seed-article-1', pageId: 'sda1', related: { glossary: ['seed-term-1'] } },
      { id: 'art-one', path: 'articles/art-one', pageId: 'aone', related: { glossary: ['term-x'] } },
    ]),
    'src/assets/data/core/articles/seed-article-1.json': j({
      id: 'seed-article-1',
      sourceReferences: ['seed-source-1'],
      related: { glossary: ['seed-term-1'] },
    }),
    'src/assets/data/core/articles/art-one.json': j({ id: 'art-one', related: { glossary: ['term-x'] } }),
    'src/assets/data/core/glossary/index.json': j(['seed-term-1', 'term-x']),
    'src/assets/data/core/glossary/seed-term-1.json': j({ id: 'seed-term-1', related: { glossary: [] } }),
    'src/assets/data/core/glossary/term-x.json': j({ id: 'term-x', related: { glossary: ['seed-term-1'] } }),
    'src/assets/data/core/sources/index.json': j(['seed-source-1', 'src-x']),
    'src/assets/data/core/sources/seed-source-1.json': j({ id: 'seed-source-1', type: 'website' }),
    'src/assets/data/core/sources/src-x.json': j({ id: 'src-x', type: 'book' }),
    'src/assets/data/core/sources/references.json': j({
      'seed-source-1': { book: [], portal: [{ type: 'article', id: 'seed-article-1' }] },
      'src-x': { book: [], portal: [{ type: 'article', id: 'art-one' }] },
    }),
    'src/assets/data/core/learning-paths.json': j([
      {
        id: 'seed-path-1',
        titleKey: 'learningPaths.seedPath1.title',
        steps: [{ type: 'article', id: 'seed-article-1', route: '/articles/seed-article-1' }],
      },
      {
        id: 'path-x',
        titleKey: 'learningPaths.pathX.title',
        steps: [{ type: 'article', id: 'art-one', route: '/articles/art-one' }],
      },
    ]),
    'angular.json': j({
      projects: {
        kit: {
          architect: {
            test: {
              options: {
                include: [
                  'src/app/pages/home/home.component.spec.ts',
                  'src/app/pages/articles/art-one/art-one.component.spec.ts',
                ],
              },
            },
          },
        },
      },
    }),
  };
  for (const l of ['de', 'en']) {
    files[`src/assets/data/translations/glossary/${l}/seed-term-1.json`] = j({ term: 'Seed' });
    files[`src/assets/data/translations/glossary/${l}/term-x.json`] = j({ term: 'X' });
    files[`src/assets/data/translations/sources/${l}/seed-source-1.json`] = j({ title: 'Seed' });
    files[`src/assets/data/translations/sources/${l}/src-x.json`] = j({ title: 'X' });
  }
  files['src/assets/data/translations/glossary/it/term-x.json'] = j({ term: 'X (it)' });
  for (const l of LOCALES) {
    for (const [ns, v] of Object.entries(MODULES)) files[`src/assets/i18n/modules/${l}/${ns}.json`] = j(v);
  }
  // An Italian draft, not configured: the removal must clean it too.
  for (const ns of ['app', 'articleOne', 'shared']) files[`src/assets/i18n/modules/it/${ns}.json`] = j(MODULES[ns]);
  return files;
}

const git = (dir, ...args) => {
  const r = spawnSync('git', ['-c', 'user.name=kit-test', '-c', 'user.email=kit-test@example.invalid', ...args], {
    cwd: dir,
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, `git ${args.join(' ')}: ${r.stderr}`);
  return r.stdout;
};

/** A fresh mini kit in scratch, committed to its own git repository. `patch(files)` edits it first. */
function kit(t, patch = () => {}) {
  const dir = scratch(t);
  for (const f of GATE_FILES) {
    mkdirSync(dirname(join(dir, f)), { recursive: true });
    cpSync(join(ROOT, f), join(dir, f));
  }
  const files = kitFiles();
  patch(files);
  for (const [f, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, f)), { recursive: true });
    writeFileSync(join(dir, f), content);
  }
  git(dir, 'init', '-q');
  git(dir, 'config', 'core.fileMode', 'false');
  git(dir, 'config', 'core.autocrlf', 'false');
  git(dir, 'add', '.');
  git(dir, 'commit', '-q', '-m', 'mini kit');
  return dir;
}

const miy = (dir, args = []) => run('make-it-yours', [...args, '--json'], { env: { KIT_TOOLS_ROOT: dir } });
const read = (dir, f) => readFileSync(join(dir, f), 'utf8');
const exists = (dir, f) => existsSync(join(dir, f));
const clean = (dir) => git(dir, 'status', '--porcelain').trim() === '';

/** Every file below `dir` with its bytes (the .git folder left out) — to prove "nothing written". */
function snapshot(dir, sub = '') {
  const out = {};
  for (const name of readdirSync(join(dir, sub)).sort()) {
    if (name === '.git') continue;
    const p = sub ? `${sub}/${name}` : name;
    if (statSync(join(dir, p)).isDirectory()) Object.assign(out, snapshot(dir, p));
    else out[p] = readFileSync(join(dir, p), 'utf8');
  }
  return out;
}

const answersFile = (dir, answers) => {
  const f = join(dir, 'answers.json');
  writeFileSync(f, JSON.stringify(answers));
  return f;
};
const DESCRIPTION = {
  de: 'Mathe für die 7b',
  'de-easy': 'Mathe für die 7b. Einfach erklärt.',
  en: 'Maths for class 7b',
  'en-easy': 'Maths for class 7b. Easy words.',
};

test('make-it-yours: --help answers without touching a file', () => {
  const r = run('make-it-yours', ['--help']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /--remove-samples/);
  assert.match(r.stdout, /--site <answers\.json>/);
});

test('make-it-yours: the status says where the site stands and what comes next (JSON)', (t) => {
  const dir = kit(t);
  const r = miy(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const s = r.json();
  assert.equal(s.mode, 'status');
  assert.deepEqual(s.site, { name: 'vibecore', shortName: null, logoIcon: null, startPage: 'home', named: false });
  assert.deepEqual(s.features, { on: ['news'], off: [] });
  assert.deepEqual(s.samples, { articles: 1, glossary: 1, sources: 1, learningPaths: 1 });
  assert.ok(s.imprint.gaps.length >= 4, 'the operator placeholders of site.json are listed');
  assert.ok(s.newLanguage.uiKeys > 0, 'lang-status counted the interface texts');
  assert.equal(s.next, 'site');
  assert.ok(clean(dir), 'the status writes nothing');
  assert.equal(miy(dir, ['--dry-run']).status, 2, '--dry-run without a mode is a usage error');
});

test('make-it-yours: --site writes site.json, every meta description, index.html and the OG title — the same bytes twice', (t) => {
  const answers = {
    name: 'Mathe & mehr',
    shortName: 'Mathe',
    logoIcon: 'pi pi-calculator',
    features: { news: false },
    operator: { name: 'Anna Schulz', email: 'anna@schule.test' },
    description: DESCRIPTION,
  };
  const results = [];
  for (let n = 0; n < 2; n++) {
    const dir = kit(t);
    const r = miy(dir, ['--site', answersFile(dir, answers)]);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.deepEqual(r.json().changed.sort(), [
      'src/assets/i18n/modules/de-easy/meta.json',
      'src/assets/i18n/modules/de/meta.json',
      'src/assets/i18n/modules/en-easy/meta.json',
      'src/assets/i18n/modules/en/meta.json',
      'src/assets/images/og-image.svg',
      'src/config/site.json',
      'src/index.html',
    ]);
    const site = JSON.parse(read(dir, 'src/config/site.json'));
    assert.equal(site.name, 'Mathe & mehr');
    assert.equal(site.shortName, 'Mathe');
    assert.deepEqual(site.features, { news: false });
    assert.equal(site.operator.name, 'Anna Schulz');
    assert.equal(site.operator.address, 'Your Street 1, 12345 Your City, Germany', 'unanswered fields stay');
    assert.equal(read(dir, 'src/config/site.json'), formatConfigJson(site), 'the notes and blank lines stay');
    const keys = Object.keys(site);
    assert.equal(keys.indexOf('shortName'), keys.indexOf('_shortName') + 1, 'shortName sits under its note');
    assert.equal(
      JSON.parse(read(dir, 'src/assets/i18n/modules/en-easy/meta.json')).description,
      DESCRIPTION['en-easy'],
    );
    const html = read(dir, 'src/index.html');
    assert.match(html, /<title>Mathe &amp; mehr<\/title>/);
    assert.match(html, /<meta property="og:site_name" content="Mathe &amp; mehr" \/>/);
    assert.match(
      html,
      /<meta name="description" content="Mathe für die 7b" \/>/,
      'the default language (de) describes',
    );
    assert.match(read(dir, 'src/assets/images/og-image.svg'), /<text x="1">\n {4}Mathe &amp; mehr\n {2}<\/text>/);
    const again = miy(dir, ['--site', answersFile(dir, answers)]);
    assert.equal(again.status, 0);
    assert.deepEqual(again.json().changed, [], 'a second run with the same answers changes nothing');
    results.push(snapshot(dir));
  }
  assert.deepEqual(results[0], results[1], 'two fresh kits, the same answers: the same bytes');
});

test('make-it-yours: the formatter writes the kit’s own site.json and samples.json byte for byte', () => {
  for (const f of ['src/config/site.json', 'src/config/samples.json']) {
    const text = readFileSync(join(ROOT, f), 'utf8');
    assert.equal(formatConfigJson(JSON.parse(text)), text, f);
  }
});

test('make-it-yours: --site with an unknown feature, a bad start page, a missing language or no description is exit 2, nothing written', (t) => {
  const dir = kit(t);
  const before = snapshot(dir);
  const cases = [
    [{ features: { weather: false } }, /weather/],
    [{ startPage: 'article/aone' }, /start/i],
    [{ startPage: 'news', features: { news: false } }, /switch/],
    [{ name: 'Neu', description: { de: 'x', en: 'y', 'de-easy': 'z' } }, /no text for en-easy/],
    [{ name: 'Neu' }, /new name needs a new short description/],
    [{ colour: 'blue' }, /does not know: colour/],
  ];
  for (const [answers, message] of cases) {
    const r = miy(dir, ['--site', answersFile(dir, answers)]);
    assert.equal(r.status, 2, `${JSON.stringify(answers)}: ${r.stderr}`);
    assert.match(r.stderr, message);
  }
  const after = snapshot(dir);
  delete before['answers.json'];
  delete after['answers.json'];
  assert.deepEqual(after, before);
});

test('make-it-yours: --remove-samples refuses a folder with unsaved changes (exit 2)', (t) => {
  const dir = kit(t);
  writeFileSync(join(dir, 'src/app/pages/home/notes.txt'), 'draft');
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 2, r.stderr);
  assert.match(r.stderr, /has 1 change that git has not saved yet/);
  assert.ok(exists(dir, 'src/app/pages/articles/art-one/art-one.component.ts'));
});

test('make-it-yours: --remove-samples --dry-run lists what would go and writes nothing', (t) => {
  const dir = kit(t);
  const r = miy(dir, ['--remove-samples', '--dry-run']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j2 = r.json();
  assert.deepEqual(j2.outputs, []);
  assert.ok(j2.deleted.includes('src/app/pages/articles/art-one/art-one.component.ts'));
  assert.ok(j2.deleted.includes('src/assets/i18n/modules/it/articleOne.json'));
  assert.ok(clean(dir), 'nothing written');
});

test('make-it-yours: --remove-samples takes every sample out (the Italian draft too), keeps the seeds, and the i18n gate stays green', (t) => {
  const dir = kit(t);
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = r.json();
  assert.deepEqual(out.removed, { articles: 1, glossary: 1, sources: 1, learningPaths: 1 });
  assert.deepEqual(out.keys, { namespaces: 3, listed: 2, orphans: 1 });
  assert.equal(out.staging, 'git add -u -- angular.json src/app src/assets src/config');
  assert.equal(out.undo, 'git revert HEAD');
  // Gone
  for (const f of [
    'src/app/pages/articles/art-one',
    'src/assets/data/core/articles/art-one.json',
    'src/assets/data/core/glossary/term-x.json',
    'src/assets/data/translations/glossary/it/term-x.json',
    'src/assets/data/core/sources/src-x.json',
    'src/assets/data/translations/sources/de/src-x.json',
    ...[...LOCALES, 'it'].map((l) => `src/assets/i18n/modules/${l}/articleOne.json`),
  ])
    assert.ok(!exists(dir, f), `${f} is gone`);
  // Kept
  for (const f of [
    'src/app/pages/articles/seed-article-1/seed.component.ts',
    'src/assets/data/core/glossary/seed-term-1.json',
    'src/assets/data/core/sources/seed-source-1.json',
  ])
    assert.ok(exists(dir, f), `${f} stays`);
  const routes = read(dir, 'src/app/app.routes.ts');
  assert.ok(!/art-one|aone|sample:/.test(routes), 'the marker block is cut');
  assert.ok(!/\n\n\n/.test(routes), 'no double blank line left behind');
  assert.deepEqual(
    JSON.parse(read(dir, 'src/assets/data/core/articles/index.json')).map((a) => a.id),
    ['seed-article-1'],
  );
  assert.deepEqual(
    JSON.parse(read(dir, 'src/assets/data/core/learning-paths.json')).map((p) => p.id),
    ['seed-path-1'],
  );
  assert.deepEqual(Object.keys(JSON.parse(read(dir, 'src/assets/data/core/sources/references.json'))), [
    'seed-source-1',
  ]);
  assert.deepEqual(JSON.parse(read(dir, 'angular.json')).projects.kit.architect.test.options.include, [
    'src/app/pages/home/home.component.spec.ts',
  ]);
  for (const l of [...LOCALES, 'it']) {
    const shared = JSON.parse(read(dir, `src/assets/i18n/modules/${l}/shared.json`));
    assert.deepEqual(shared, { common: 'Common' }, `${l}: the key only the sample read is dropped`);
  }
  assert.deepEqual(JSON.parse(read(dir, 'src/assets/i18n/modules/de/easyLanguage.json')).content, {
    home: { title: 'Home' },
  });
  assert.deepEqual(JSON.parse(read(dir, 'src/assets/i18n/modules/en/learningPaths.json')), {
    seedPath1: { title: 'Seed path' },
  });
  assert.deepEqual(JSON.parse(read(dir, 'src/config/easy-language-availability.json')).ids, ['home']);
  const samples = JSON.parse(read(dir, 'src/config/samples.json'));
  assert.deepEqual(
    [samples.articles, samples.glossary, samples.sources, samples.learningPaths, samples.i18nKeys],
    [[], [], [], [], []],
  );
  assert.equal(samples._comment, SAMPLES._comment, 'the notes stay');
  // The kit's own i18n gate agrees with the result.
  const gate = spawnSync(process.execPath, ['scripts/check-i18n-keys.mjs'], { cwd: dir, encoding: 'utf8' });
  assert.equal(gate.status, 0, gate.stdout + gate.stderr);
  // Twice is safe: nothing left to remove, even before the removal is committed.
  const second = miy(dir, ['--remove-samples']);
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stderr, /Nothing to remove/);
});

test('make-it-yours: a seed that refers to a sample stops the removal (exit 3), nothing written', (t) => {
  const dir = kit(t, (files) => {
    files['src/assets/data/core/articles/seed-article-1.json'] = j({
      id: 'seed-article-1',
      related: { glossary: ['term-x'] },
    });
  });
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 3, r.stderr);
  assert.match(r.stderr, /seed-article-1\.json: lists the sample "term-x" under "related\.glossary"/);
  assert.ok(clean(dir));
});

test('make-it-yours: a sample folder that is not the article’s own page folder stops the removal (exit 3), nothing deleted', (t) => {
  for (const folder of ['src/app/pages/articles', 'src', '..']) {
    const dir = kit(t, (files) => {
      files['src/config/samples.json'] = formatConfigJson({
        ...SAMPLES,
        articles: [{ ...SAMPLES.articles[0], folder }],
      });
    });
    const r = miy(dir, ['--remove-samples']);
    assert.equal(r.status, 3, `${folder}: ${r.stderr}`);
    assert.match(r.stderr, /own page folder/);
    assert.ok(clean(dir), `${folder}: nothing written or deleted`);
  }
});

test('make-it-yours: a start page on a sample article stops the removal (exit 3), nothing written', (t) => {
  const dir = kit(t, (files) => {
    const site = JSON.parse(readFileSync(join(ROOT, 'src/config/site.json'), 'utf8'));
    files['src/config/site.json'] = formatConfigJson({ ...site, startPage: 'articles/art-one' });
  });
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 3, r.stderr);
  assert.match(r.stderr, /start page "articles\/art-one" is the sample article art-one/);
  assert.ok(clean(dir));
});

test('make-it-yours: --site takes a name with $ patterns literally', (t) => {
  const dir = kit(t);
  const name = 'Spar$$ & A$&B';
  const r = miy(dir, ['--site', answersFile(dir, { name, description: DESCRIPTION })]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const escaped = 'Spar$$ &amp; A$&amp;B';
  assert.ok(read(dir, 'src/index.html').includes(`<title>${escaped}</title>`));
  assert.ok(read(dir, 'src/assets/images/og-image.svg').includes(`\n    ${escaped}\n`));
  assert.equal(JSON.parse(read(dir, 'src/config/site.json')).name, name);
});

test('make-it-yours: --site with only an operator writes site.json and leaves index.html and the OG image alone', (t) => {
  const dir = kit(t);
  const htmlBefore = read(dir, 'src/index.html');
  const svgBefore = read(dir, 'src/assets/images/og-image.svg');
  const r = miy(dir, ['--site', answersFile(dir, { operator: { name: 'Anna Schulz' } })]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual(r.json().changed, ['src/config/site.json']);
  assert.equal(JSON.parse(read(dir, 'src/config/site.json')).operator.name, 'Anna Schulz');
  assert.equal(read(dir, 'src/index.html'), htmlBefore, 'og:title keeps its tagline, nothing else moves');
  assert.match(read(dir, 'src/index.html'), /<meta property="og:title" content="vibecore — kit" \/>/);
  assert.equal(read(dir, 'src/assets/images/og-image.svg'), svgBefore);
});

test('make-it-yours: unbalanced sample markers stop the removal (exit 3), nothing written', (t) => {
  const dir = kit(t, (files) => {
    files['src/app/app.routes.ts'] = ROUTES.replace('  // sample:end art-one\n', '');
  });
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 3, r.stderr);
  assert.match(r.stderr, /sample:begin art-one is never closed/);
  assert.ok(clean(dir));
});

test('make-it-yours: a red i18n gate stops the removal (exit 3), nothing written', (t) => {
  const dir = kit(t, (files) => {
    files['src/assets/i18n/modules/de/news.json'] = j({});
  });
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 3, r.stderr);
  assert.match(r.stderr, /i18n check is red/);
  assert.ok(clean(dir));
});

test('make-it-yours: code that stays reading a text the removal deletes turns the gate red after writing — every file put back (exit 3)', (t) => {
  // The home page (no sample) reads a key below a listed i18nKeys path: the pre-checks cannot
  // see that, only the real gate on the written tree can.
  const dir = kit(t, (files) => {
    files['src/app/pages/home/home.component.ts'] = files['src/app/pages/home/home.component.ts'].replace(
      '}\n',
      "  one = translate('easyLanguage.content.artOne.title');\n}\n",
    );
  });
  const before = snapshot(dir);
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 3, r.stdout + r.stderr);
  assert.match(r.stderr, /i18n check was red, so every deleted and written file was put back/);
  assert.match(r.stderr, /easyLanguage\.content\.artOne\.title/);
  assert.deepEqual(r.json().outputs, []);
  assert.deepEqual(snapshot(dir), before, 'every file is back, byte for byte');
  assert.ok(clean(dir));
});

test('make-it-yours: a write that fails (a read-only file) puts every deleted and written file back (exit 3)', (t) => {
  const dir = kit(t);
  const before = snapshot(dir);
  const target = join(dir, 'src/assets/data/core/learning-paths.json');
  chmodSync(target, 0o444);
  const r = miy(dir, ['--remove-samples']);
  assert.equal(r.status, 3, r.stdout + r.stderr);
  assert.match(r.stderr, /put back; nothing changed/);
  assert.deepEqual(r.json().outputs, []);
  assert.deepEqual(snapshot(dir), before, 'every file is back, byte for byte');
  assert.ok(clean(dir));
});
