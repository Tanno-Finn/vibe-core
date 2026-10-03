#!/usr/bin/env node
/**
 * Belt-and-suspenders defense against accidental `ng build` runs that skip the
 * surrounding pipeline (content + i18n bundles beforehand, the CSR index swap and
 * the integrity gates afterwards) and produce a broken dist/.
 *
 * Intercepts `npm run ng -- build*` and refuses unless ALLOW_RAW_NG_BUILD=1.
 * For everything else (serve, generate, version, ...) it transparently
 * forwards to the real `ng` binary.
 *
 * "Is this a production build?" is answered from angular.json, not from the flags: with
 * `defaultConfiguration: "production"` a bare `ng build` IS a production build. The
 * `build` npm script goes through this guard too and names its configuration explicitly,
 * so it can no longer produce an ungated production dist/ by inheriting that default.
 *
 * Direct `ng build` (bypassing npm) cannot be intercepted from here — the build
 * manifest written by scripts/write-build-manifest.js and checked by
 * scripts/verify-build.js is what catches a stale or incomplete dist/ later.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const subcmd = args[0];

const isBuild = subcmd === 'build' || subcmd === 'b';

/** The `--configuration` / `-c` value on the command line, or null when none is given. */
function explicitConfiguration() {
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--prod') return 'production';
    const eq = /^(?:--configuration|-c)=(.+)$/.exec(a);
    if (eq) return eq[1];
    if (a === '--configuration' || a === '-c') return args[i + 1] ?? null;
  }
  return null;
}

/**
 * What `ng build` ACTUALLY builds when no --configuration is given: angular.json's
 * `defaultConfiguration` for the build target, which is "production" here. Reading it
 * is the whole point — the guard used to look only for an explicit production flag, so
 * a bare `npm run ng -- build` printed "running raw ng build (development config)",
 * which was false, and then forwarded: a full production dist/ with no prebuild, no
 * gates and no manifest, produced by the guard that exists to prevent exactly that.
 * Unreadable angular.json → assume production (fail closed, never wave through).
 */
function defaultConfiguration() {
  try {
    const ngJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'angular.json'), 'utf8'));
    const targets = Object.values(ngJson.projects ?? {})
      .map((p) => p.architect?.build ?? p.targets?.build)
      .filter(Boolean);
    const declared = targets.map((t) => t.defaultConfiguration).find((c) => typeof c === 'string');
    return declared ?? 'production';
  } catch {
    return 'production';
  }
}

const configuration = explicitConfiguration() ?? defaultConfiguration();
const isProduction = configuration === 'production';
const implicit = explicitConfiguration() === null;
const opted = process.env.ALLOW_RAW_NG_BUILD === '1';

if (isBuild && isProduction && !opted) {
  console.error(`
ng-guard: BLOCKED — this is a PRODUCTION build (${implicit ? `no --configuration given, so angular.json's defaultConfiguration "${configuration}" applies` : `--configuration ${configuration}`}),
          and a standalone one produces a broken dist/. It runs neither half of the
          pipeline around it:

            before  npm run prebuild:prod  — content + i18n bundles, notifications,
                                             build version, prerender routes, sitemap
            after   npm run dist:prepare:prod  — index.csr.html -> index.html
                    npm run build:verify         — design-system, i18n-key, genericity
                                                   and build-integrity gates
                    npm run build:manifest       — records what this dist/ contains

          Use:        npm run build:prod
          Override:   ALLOW_RAW_NG_BUILD=1 npm run ng -- build --configuration production
                      (then run \`npm run dist:prepare:prod && npm run build:verify\` yourself)

          Background: README.md -> "Building & deploying"; scripts/verify-build.js
`);
  process.exit(2);
}

if (isBuild && !isProduction) {
  console.warn(`
ng-guard: WARNING — running raw \`ng build --configuration ${configuration}\`. This skips
          npm run prebuild and the post-build steps. Fine for local SSR/prerender
          testing; for anything shippable ALWAYS:  npm run build:prod
`);
}

// Forward to the real ng. Run the CLI's own JS entry point with THIS node binary rather
// than the .bin shim: since Node 20.12 / 22 a `.cmd` file cannot be spawned without
// `shell: true` (CVE-2024-27980), so the previous `ng.cmd` spawn threw EINVAL on Windows
// — the guard crashed instead of forwarding — and `shell: true` would hand the arguments
// back to cmd.exe for a second round of parsing. Neither is needed here.
const ngJs = path.join(__dirname, '..', 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const useJs = fs.existsSync(ngJs);
const ngBin = useJs
  ? process.execPath
  : path.join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'ng.cmd' : 'ng');
const child = spawn(ngBin, useJs ? [ngJs, ...args] : args, { stdio: 'inherit', shell: false });
// A signal-killed child reports `code === null`. `code ?? 0` turned that into exit 0 —
// the guard announcing a killed build as a success. A signal is a failure: say so.
child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`ng-guard: ng was killed by ${signal} — treating as a failed build.`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
child.on('error', (err) => {
  console.error(`ng-guard: failed to spawn ng — ${err.message}`);
  process.exit(2);
});
