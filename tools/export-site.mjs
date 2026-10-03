#!/usr/bin/env node
/**
 * export-site.mjs — the built portal as one zip for a school server (kit tool
 * `export-site`, capability `file:site-export`).
 *
 * WHAT: packs a verified build (`dist/vibecore/browser`, or --dist) into one zip,
 * default `out/site/vibecore-<kitVersion>.zip`, and writes `SERVER-SETUP.md` next to it:
 * where the files go, why a page that was not prerendered needs a fallback to
 * index.html, the Apache and nginx rules for that (those of docs/how-to/deploy.md: `/` and
 * `/<lang>/` redirect to the prerendered `/<lang>/home/`, a folder without an index.html
 * gets the app shell instead of a 403), and that v1 supports the site root only.
 * --apache also puts that `.htaccess` into the zip.
 *
 * HOW: refuses (exit 1) a build whose `.build-manifest.json` lacks
 * `verification.passed: true`, unless --allow-unverified, which the summary then says.
 * The manifest itself is build evidence, not part of the site, and stays out of the zip.
 * The zip is deterministic (scripts/lib/zip.mjs: sorted entries, forward slashes, the
 * fixed date 1980-01-01): the same build gives the same bytes. Uploading it is your step;
 * the tool opens no connection.
 *
 * WHAT IT CANNOT SEE: the school server itself (its web root, whether it honours
 * .htaccess, HTTPS) and a deployment into a subfolder (not supported in v1).
 *
 * Run:  node tools/export-site.mjs [--apache]   (--help for all)
 */
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { writeZip } from '../scripts/lib/zip.mjs';
import { EXIT, ToolError, inputDir, outputPath, rel, runTool } from './lib/cli.mjs';
import { DEFAULT_DIST } from './lib/target.mjs';

const MANIFEST = '.build-manifest.json';

/**
 * The site's language codes and the one `/` falls back to, from src/config/languages.json
 * (the build was made from it); `de`/`en` when it cannot be read. The server rules below
 * redirect `/` and every `/<lang>/` to `/<lang>/home/`, which is prerendered for every
 * language whatever start page site.json names.
 */
function siteLanguages(root) {
  try {
    const config = JSON.parse(readFileSync(join(root, 'src', 'config', 'languages.json'), 'utf8'));
    const codes = (config.languages ?? []).map((l) => l.code).filter((c) => /^[a-z]{2,3}(?:-[a-z0-9]+)*$/.test(c));
    if (codes.length)
      return { codes, fallback: codes.includes(config.defaultLanguage) ? config.defaultLanguage : codes[0] };
  } catch {
    /* no readable config: the kit's own two languages */
  }
  return { codes: ['de', 'en'], fallback: 'de' };
}

/**
 * The Apache rules of docs/how-to/deploy.md ("Folders are the trap"), for these languages.
 * Not `FallbackResource /index.html`: it only answers paths that do not exist, so a folder
 * without an index.html of its own (`/de/`, `/en/`, `/de/articles/`) went to mod_dir and
 * mod_autoindex, which answer it with 403 under `Options -Indexes` (or list the folder).
 */
function htaccess({ codes, fallback }) {
  const browserChoice = codes
    .filter((c) => c !== fallback)
    .flatMap((c) => [`RewriteCond %{HTTP:Accept-Language} ^\\s*${c} [NC]`, `RewriteRule ^$ /${c}/home/ [R=302,L]`]);
  return [
    '# Written by the kit tool export-site (--apache), as in docs/how-to/deploy.md.',
    'RewriteEngine On',
    'Options -Indexes',
    'DirectoryIndex index.html',
    '',
    '# SPA fallback: only GET/HEAD; unknown paths get the app shell.',
    'RewriteCond %{REQUEST_METHOD} !^(GET|HEAD)$',
    'RewriteCond %{REQUEST_FILENAME} !-f',
    'RewriteCond %{REQUEST_FILENAME} !-d',
    'RewriteRule ^ - [R=405,L]',
    '',
    '# Entry points go to a prerendered start page: /<lang>/ is a folder without an',
    '# index.html (403, or a parking page on some hosts), / gets the browser language.',
    ...browserChoice,
    `RewriteRule ^$ /${fallback}/home/ [R=302,L]`,
    `RewriteRule ^(${codes.join('|')})/?$ /$1/home/ [R=302,L]`,
    '',
    '# A folder only counts as a page when it holds an index.html; any other folder',
    '# (e.g. /de/articles/) gets the app shell instead of a 403.',
    'RewriteCond %{REQUEST_FILENAME} !-f',
    'RewriteCond %{REQUEST_FILENAME}/index.html !-f',
    'RewriteCond %{REQUEST_URI} !\\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|json|xml|txt)$',
    'RewriteRule ^ /index.html [L]',
    '',
  ].join('\n');
}

/**
 * The same rules for nginx. Not `try_files $uri $uri/ /index.html`: `$uri/` matches every
 * existing folder, and a folder without an index.html then gets 403 from the index module
 * ("directory index … is forbidden"). `$uri/index.html` serves a prerendered page and lets
 * every other folder fall through to the app shell.
 */
function nginxRules({ codes, fallback }) {
  const browserChoice = codes
    .filter((c) => c !== fallback)
    .map((c) => `  if ($http_accept_language ~* "^\\s*${c}") { return 302 /${c}/home/; }`);
  return [
    'location = / {',
    ...browserChoice,
    `  return 302 /${fallback}/home/;`,
    '}',
    `location ~ ^/(${codes.join('|')})/?$ {`,
    '  return 302 /$1/home/;',
    '}',
    'location / {',
    '  limit_except GET HEAD { deny all; }',
    '  try_files $uri $uri/index.html /index.html;',
    '}',
  ].join('\n');
}

/**
 * Every file below `dir`, as paths relative to it with forward slashes, sorted. A link
 * (symlink or junction) is exit 2: it may point outside the project, and a build has none.
 */
function listFiles(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    const st = lstatSync(abs);
    if (st.isSymbolicLink())
      throw new ToolError(
        EXIT.USAGE,
        `${abs} is a link; a built site has none, and the zip would carry whatever it points at.`,
      );
    if (st.isDirectory()) listFiles(abs, base, out);
    else if (st.isFile()) out.push(relative(base, abs).split(sep).join('/'));
  }
  return out.sort();
}

/**
 * Why the build in `dist` is not shippable, or null. The same verdict verify-build.js
 * gives at the end of build:prod: verification passed, the test gate passed, and both
 * describe this index.html (the manifest is written even when the test gate then fails
 * the build, so `verification.passed` alone would ship an untested build).
 */
function unverified(manifest, dist) {
  if (!manifest) return `it has no ${MANIFEST}`;
  if (manifest.verification?.passed !== true) return 'its verification did not pass';
  if (manifest.tests?.gate !== 'passed') return `its test gate is "${manifest.tests?.gate ?? 'missing'}", not "passed"`;
  const index = createHash('sha256')
    .update(readFileSync(join(dist, 'index.html')))
    .digest('hex');
  if (manifest.tests.build?.indexSha256 !== index)
    return 'its manifest describes an earlier build (index.html changed since)';
  return null;
}

/** A code block inside a numbered list item: three spaces in front of every non-empty line. */
const indent = (text) =>
  text
    .trimEnd()
    .split('\n')
    .map((line) => (line ? `   ${line}` : ''))
    .join('\n');

const setupText = ({ zipName, files, apache, languages }) => `# Server setup — ${zipName}

${files} files. Built and checked by the kit; the tool export-site packed them. Uploading
them is your step: the kit never uploads anything.

## Deutsch

1. **Wohin:** Den *Inhalt* der ZIP-Datei in das Wurzelverzeichnis der Website kopieren
   (dorthin, wo \`https://ihre-schule.example/\` hinzeigt), nicht in einen Unterordner.
   Diese Version unterstützt nur das Wurzelverzeichnis.
2. **Warum eine Umleitung nötig ist:** Die meisten Seiten liegen fertig als
   \`<sprache>/<seite>/index.html\` vor. Einige Seiten (die interaktiven Demos) entstehen
   erst im Browser. Ruft jemand so eine Adresse direkt auf, findet der Server keine Datei
   und muss stattdessen \`/index.html\` ausliefern. Ohne diese Regel zeigt er „404“.
   Ordner wie \`/de/\` oder \`/de/articles/\` haben keine eigene \`index.html\`; dort
   antwortet ein Server ohne die Regeln unten mit „403“ (manche Anbieter zeigen eine
   Parkseite). Darum leiten die Regeln \`/\` und \`/<sprache>/\` auf \`/<sprache>/home/\` um.
3. **Apache:** ${apache ? 'Die ZIP-Datei enthält schon eine `.htaccess` mit diesen Regeln. Sie wirkt, wenn der Server `.htaccess`-Dateien erlaubt (`AllowOverride`).' : 'Eine Datei `.htaccess` im Wurzelverzeichnis mit diesen Zeilen (oder `export-site --apache`, dann liegt sie schon in der ZIP-Datei):'}

   \`\`\`apache
${indent(htaccess(languages))}
   \`\`\`

4. **nginx:** im \`server\`-Block:

   \`\`\`nginx
${indent(nginxRules(languages))}
   \`\`\`

5. **Prüfen:** Die Startseite öffnen, dann eine Unterseite direkt aufrufen (zum Beispiel
   \`/de/glossary\`) und einmal neu laden. Beides muss die Seite zeigen, nicht „404“.
   \`/\`, \`/de/\` und \`/en/\` müssen auf eine Seite \`…/home/\` springen, und ein Ordner wie
   \`/de/articles/\` muss die Website zeigen, keine Fehlerseite.

Der Server braucht keine Programmiersprache und keine Datenbank: Es sind nur Dateien.
HTTPS sollte eingeschaltet sein.

## English

1. **Where:** copy the *contents* of the zip into the web root of the site (where
   \`https://your-school.example/\` points), not into a subfolder. This version supports
   the site root only.
2. **Why a fallback is needed:** most pages are ready-made files
   (\`<language>/<page>/index.html\`). Some pages (the interactive demos) are built in the
   browser. When someone opens such an address directly, the server finds no file and must
   send \`/index.html\` instead. Without that rule it answers "404".
   Folders such as \`/de/\` or \`/de/articles/\` hold no \`index.html\` of their own; there a
   server without the rules below answers "403" (some hosts show a parking page). That is
   why the rules redirect \`/\` and \`/<language>/\` to \`/<language>/home/\`.
3. **Apache:** ${apache ? 'the zip already holds a `.htaccess` with these rules. It works when the server allows `.htaccess` files (`AllowOverride`).' : 'a file `.htaccess` in the web root with these lines (or run `export-site --apache`, which puts it into the zip):'}

   \`\`\`apache
${indent(htaccess(languages))}
   \`\`\`

4. **nginx:** inside the \`server\` block:

   \`\`\`nginx
${indent(nginxRules(languages))}
   \`\`\`

5. **Check:** open the home page, then open a subpage directly (for example
   \`/en/glossary\`) and reload it. Both must show the page, not "404". \`/\`, \`/de/\` and
   \`/en/\` must redirect to a \`…/home/\` page, and a folder like \`/de/articles/\` must show
   the site, not an error page.

The server needs no programming language and no database: these are plain files. HTTPS
should be on.
`;

await runTool({
  id: 'export-site',
  summary: 'the built portal as one zip for a school server',
  usage: 'node tools/export-site.mjs [--dist <dir>] [--out <file.zip>] [--apache] [--allow-unverified] [--force]',
  description: [
    'Packs a verified build of the portal into one zip and writes SERVER-SETUP.md next to it',
    '(German and English): where the files go and the server rules they need.',
  ],
  options: {
    dist: { type: 'string', arg: '<dir>', help: 'the built site to pack', defaultText: DEFAULT_DIST },
    out: {
      type: 'string',
      arg: '<file.zip>',
      help: 'where to write the zip',
      defaultText: 'out/site/vibecore-<version>.zip',
    },
    apache: { type: 'boolean', help: 'also put a .htaccess with the server rules into the zip' },
    'allow-unverified': {
      type: 'boolean',
      help: 'pack a build that did not pass its verification (said in the summary)',
    },
    force: { type: 'boolean', help: 'replace an existing zip and SERVER-SETUP.md' },
  },
  examples: ['node tools/export-site.mjs --apache', 'node tools/export-site.mjs --out out/site/test.zip --force'],
  async run({ values, positionals, report, root }) {
    if (positionals.length) throw new ToolError(EXIT.USAGE, 'export-site takes no input file; use --dist <dir>.');
    const dist = inputDir(root, values.dist ?? join(root, DEFAULT_DIST), {
      missing: 'run `npm run build:prod` first.',
    });
    if (!existsSync(join(dist, 'index.html')))
      throw new ToolError(EXIT.ENV, `${dist} has no index.html — run \`npm run build:prod\` first.`);

    const kitVersion = JSON.parse(readFileSync(join(root, 'kit.json'), 'utf8')).kitVersion ?? '0.0.0';
    const out = outputPath(root, values.out ?? join(root, 'out', 'site', `vibecore-${kitVersion}.zip`), {
      force: values.force,
    });
    if (!out.toLowerCase().endsWith('.zip')) throw new ToolError(EXIT.USAGE, `--out must end in .zip (got ${out}).`);
    const setup = outputPath(root, join(dirname(out), 'SERVER-SETUP.md'), { force: values.force });

    let manifest = null;
    try {
      manifest = JSON.parse(readFileSync(join(dist, MANIFEST), 'utf8'));
    } catch {
      /* missing or unreadable: unverified */
    }
    const why = unverified(manifest, dist);
    const verified = !why;
    if (!verified) {
      if (!values['allow-unverified']) {
        report.finding({ kind: 'unverified', message: `the build in ${dist}: ${why}` }, { blocking: true });
        report.say(`  FAIL: the build in ${dist}: ${why}.`);
        report.say('  Run `npm run build:prod` (it verifies the build), or pass --allow-unverified on purpose.');
        return;
      }
      report.warn(`packing an UNVERIFIED build (${why}) because --allow-unverified was given`);
    }

    const names = listFiles(dist).filter((n) => n !== MANIFEST && !(values.apache && n === '.htaccess'));
    const entries = names.map((name) => ({ name, data: readFileSync(join(dist, ...name.split('/'))) }));
    const languages = siteLanguages(root);
    if (values.apache) entries.push({ name: '.htaccess', data: htaccess(languages) });
    const zip = writeZip(entries);
    report.write(out, zip);
    report.write(
      setup,
      setupText({ zipName: rel(dirname(out), out), files: entries.length, apache: !!values.apache, languages }),
    );
    report.data.files = entries.length;
    report.data.bytes = zip.length;
    report.data.verified = verified;
    report.say(
      `${entries.length} files, ${(zip.length / 1024 / 1024).toFixed(1)} MB${verified ? ', verified build' : ', UNVERIFIED build'}`,
    );
    report.notChecked.push(
      'the school server: its web root, whether it allows .htaccess, HTTPS',
      'a site in a subfolder of the server (v1 supports the site root only)',
    );
  },
});
