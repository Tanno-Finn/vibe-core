#!/usr/bin/env node
/**
 * preview.mjs — look at the built site, or any folder inside the project, in a browser
 * (kit tool `preview`).
 *
 * WHAT: serves `dist/vibecore/browser` (the default, with the single-page-app fallback
 * that answers a deep route with index.html) or a folder you name, on 127.0.0.1 only.
 * The built site is what learners would get; the dev server (`npm start`, port 2000) is
 * not. Prints the address and runs until Ctrl+C. No browser window is opened.
 *
 * HOW: without --port it takes the first free port from 2100 to 2199 (a number you can
 * remember beats a random one); with --port it uses exactly that one and stops with
 * exit 2 when it is taken. A request for a path outside the folder (`/..%2f…`) is 403.
 * With --json the one JSON object (with `url`) is printed as soon as the server listens;
 * nothing else follows on stdout.
 *
 * WHAT IT CANNOT SEE: how a real school server is set up (see export-site and its
 * SERVER-SETUP.md) — this server is for looking, on this computer only.
 *
 * Run:  node tools/preview.mjs            node tools/preview.mjs out/teacher --no-spa
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { serve, originOf } from '../scripts/lib/static-server.mjs';
import { EXIT, ToolError, inputDir, runTool } from './lib/cli.mjs';
import { DEFAULT_DIST } from './lib/target.mjs';

const FIRST = 2100;
const LAST = 2199;

await runTool({
  id: 'preview',
  summary: 'serve the built site (or a folder) on this computer',
  usage: 'node tools/preview.mjs [<dir>] [--port <n>] [--no-spa]',
  description: [
    'Serves the built portal (or a folder inside the project) on 127.0.0.1 and prints the',
    'address to open in your browser. Runs until you press Ctrl+C.',
  ],
  options: {
    port: { type: 'string', arg: '<n>', help: 'use exactly this port', defaultText: `first free one from ${FIRST}` },
    'no-spa': { type: 'boolean', help: 'answer unknown paths with 404 instead of index.html' },
  },
  examples: ['node tools/preview.mjs', 'node tools/preview.mjs out/teacher --no-spa'],
  async run({ values, positionals, report, root }) {
    if (positionals.length > 1) throw new ToolError(EXIT.USAGE, 'give at most one folder.');
    const dir = positionals.length
      ? inputDir(root, positionals[0])
      : inputDir(root, join(root, DEFAULT_DIST), {
          missing: 'run `npm run build:prod` first, or name a folder to serve.',
        });
    const spa = !values['no-spa'];
    if (spa && !positionals.length && !existsSync(join(dir, 'index.html'))) {
      throw new ToolError(EXIT.ENV, `${dir} has no index.html — run \`npm run build:prod\` first.`);
    }

    let server;
    if (values.port !== undefined) {
      const port = Number(values.port);
      if (!Number.isInteger(port) || port < 1 || port > 65535)
        throw new ToolError(EXIT.USAGE, `--port must be a whole number from 1 to 65535, not "${values.port}".`);
      try {
        server = await serve(dir, { spa, port });
      } catch (err) {
        if (err.code === 'EADDRINUSE')
          throw new ToolError(EXIT.USAGE, `port ${port} is taken — leave --port out to get a free one.`);
        throw err;
      }
    } else {
      for (let port = FIRST; port <= LAST && !server; port++) {
        try {
          server = await serve(dir, { spa, port });
        } catch (err) {
          if (err.code !== 'EADDRINUSE') throw err;
        }
      }
      if (!server) throw new ToolError(EXIT.ENV, `every port from ${FIRST} to ${LAST} is taken — pass --port <n>.`);
    }

    const url = `${originOf(server)}/`;
    report.data.url = url;
    report.data.folder = dir;
    report.data.spa = spa;
    report.say(`Serving ${dir}`);
    report.say(`  open ${url}${spa ? '' : '   (no SPA fallback: unknown paths are 404)'}`);
    report.say('  stop with Ctrl+C');
    report.notChecked.push('how a real school server is set up: see export-site and its SERVER-SETUP.md');
    report.finish();

    await new Promise((stop) => {
      const quit = () => {
        server.closeAllConnections();
        server.close(() => stop());
      };
      process.once('SIGINT', quit);
      process.once('SIGTERM', quit);
    });
  },
});
