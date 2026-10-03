#!/usr/bin/env node
/**
 * index.mjs — the list of kit tools (`npm run tools`).
 *
 * WHAT: prints every tool registered in kit.json → `tools`: its id, what it is for and
 * the command that runs it. With --json, the registry entries as one JSON array. The
 * list is read from the contract, not from the folder, so what it shows is what skills
 * and agents find; scripts/verify-harness.mjs (check 17) keeps the two in step.
 *
 * Run:  npm run tools        node tools/index.mjs --json
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { EXIT, projectRoot } from './lib/cli.mjs';

let values;
try {
  ({ values } = parseArgs({
    options: { json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } },
    strict: true,
  }));
} catch (err) {
  process.stderr.write(`tools: ${err.message}\nUsage: node tools/index.mjs [--json]\n`);
  process.exit(EXIT.USAGE);
}
if (values.help) {
  process.stdout.write(
    'tools — list the kit tools registered in kit.json\n\nUsage: node tools/index.mjs [--json]   (npm run tools)\n',
  );
  process.exit(EXIT.OK);
}

const tools = JSON.parse(readFileSync(join(projectRoot(), 'kit.json'), 'utf8')).tools ?? [];
if (values.json) {
  process.stdout.write(JSON.stringify(tools, null, 2) + '\n');
} else {
  console.log(`Kit tools (${tools.length}) — each one checks or builds one thing, offline, inside this project.\n`);
  for (const t of tools) {
    console.log(`${t.id}${t.provides.length ? `  [${t.provides.join(', ')}]` : ''}`);
    console.log(`  ${t.description}`);
    console.log(`  ${t.run}\n`);
  }
  console.log('Every tool explains itself: <run> --help   (e.g. node tools/pdf.mjs --help)');
}
