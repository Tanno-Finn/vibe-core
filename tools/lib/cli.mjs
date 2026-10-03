/**
 * cli.mjs — the one command-line convention every kit tool follows (tools/README.md).
 *
 * WHAT: `runTool(spec)` parses the arguments strictly (node:util parseArgs; an unknown
 * flag is exit 2 with the usage line), answers `--help` without touching a file or
 * starting a browser, runs the tool, and ends with the summary: human text on stdout,
 * or with `--json` exactly one JSON object on stdout and the human text on stderr.
 * The path helpers keep every input and output inside the project, refuse `.git/`,
 * `.claude/` and `node_modules/` as outputs, and replace an existing output only with
 * `--force`.
 *
 * Exit codes: 0 done, nothing blocking · 1 the check found a problem or a limit was
 * exceeded · 2 usage error, missing or unsafe input, output exists without --force ·
 * 3 environment missing (no browser, no build, dependency not installed) — and, with
 * the stack printed, an unexpected failure of the tool itself.
 *
 * Node core only, so `--help` works before `npm install`.
 */
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export const EXIT = { OK: 0, FINDING: 1, USAGE: 2, ENV: 3 };

/** A failure with a fixed exit code and a message a person can act on. */
export class ToolError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/**
 * The project root: the folder holding kit.json, found upward from this file.
 * KIT_TOOLS_ROOT replaces it — for tests only, which point it at a fixture root.
 */
export function projectRoot() {
  if (process.env.KIT_TOOLS_ROOT) return realpathSync(resolve(process.env.KIT_TOOLS_ROOT));
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    if (existsSync(join(dir, 'kit.json'))) return realpathSync(dir);
    const up = dirname(dir);
    if (up === dir) throw new ToolError(EXIT.ENV, 'no kit.json found above tools/ — is this a kit checkout?');
    dir = up;
  }
}

const fold = (p) => (process.platform === 'win32' ? p.toLowerCase() : p);
/** Whether the (already resolved) path `p` is `root` or below it. */
export const isInside = (root, p) => {
  const rel = relative(fold(root), fold(p));
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
};

/**
 * The real path of `p`, or of its nearest existing ancestor with the rest appended (symlinks
 * resolved). A link that points at nothing (yet) is exit 2: writing through it would land
 * wherever it points, which no check has seen.
 */
function realish(p) {
  let head = p;
  const tail = [];
  while (!existsSync(head)) {
    let dangling = false;
    try {
      dangling = lstatSync(head).isSymbolicLink();
    } catch {
      /* nothing there at all: keep walking up */
    }
    if (dangling)
      throw new ToolError(EXIT.USAGE, `${head} is a link that points at nothing — tools do not write through it.`);
    const up = dirname(head);
    if (up === head) break;
    tail.unshift(head.slice(up.length).replace(/^[\\/]/, ''));
    head = up;
  }
  return join(realpathSync(head), ...tail);
}

/** `p` relative to the project, forward slashes — for messages and JSON (no absolute paths in outputs). */
export const rel = (root, p) => relative(root, p).split(sep).join('/');

/**
 * A text file as a string, without the byte-order mark that Windows PowerShell 5.1 and
 * some editors put in front: left in, it breaks JSON.parse, a Markdown heading on line 1
 * and an HTML doctype.
 */
export const readText = (file) => readFileSync(file, 'utf8').replace(/^\uFEFF/, '');

/** An existing file inside the project; exit 2 otherwise. `exts` limits the extensions. */
export function inputFile(root, p, { exts } = {}) {
  if (!p) throw new ToolError(EXIT.USAGE, 'no input file given.');
  const abs = resolve(p);
  if (!existsSync(abs)) throw new ToolError(EXIT.USAGE, `input not found: ${abs}`);
  const real = realpathSync(abs);
  if (!isInside(root, real))
    throw new ToolError(EXIT.USAGE, `input ${real} is outside the project (${root}); tools only read files inside it.`);
  if (!statSync(real).isFile()) throw new ToolError(EXIT.USAGE, `input ${real} is not a file.`);
  if (exts && !exts.some((e) => real.toLowerCase().endsWith(e))) {
    throw new ToolError(EXIT.USAGE, `input ${real} must end in ${exts.join(' or ')}.`);
  }
  return real;
}

/**
 * An existing folder inside the project, relative to the current folder like every other
 * path; exit 2 otherwise (exit 3 with `missing` as the fix, if given).
 */
export function inputDir(root, p, { missing } = {}) {
  const abs = resolve(p);
  if (!existsSync(abs)) {
    if (missing) throw new ToolError(EXIT.ENV, `${abs} does not exist — ${missing}`);
    throw new ToolError(EXIT.USAGE, `folder not found: ${abs}`);
  }
  const real = realpathSync(abs);
  if (!isInside(root, real)) throw new ToolError(EXIT.USAGE, `folder ${real} is outside the project (${root}).`);
  return real;
}

const FORBIDDEN = ['.git', '.claude', 'node_modules'];

/**
 * Checks an output path: inside the project, not in .git/.claude/node_modules, not the
 * `input` it is made from, absent unless `force`.
 */
export function outputPath(root, p, { force = false, input } = {}) {
  const abs = realish(resolve(p));
  if (input && fold(abs) === fold(input))
    throw new ToolError(EXIT.USAGE, `output ${abs} is the input file — choose another --out.`);
  if (!isInside(root, abs))
    throw new ToolError(EXIT.USAGE, `output ${abs} is outside the project (${root}); tools only write inside it.`);
  const first = rel(root, abs).split('/')[0];
  if (FORBIDDEN.some((f) => fold(f) === fold(first))) {
    throw new ToolError(EXIT.USAGE, `output ${abs} is inside ${first}/ — tools never write there.`);
  }
  if (existsSync(abs) && !force)
    throw new ToolError(EXIT.USAGE, `output ${abs} already exists — pass --force to replace it.`);
  return abs;
}

/**
 * Collects what a run did and prints it. Keys of the JSON object are fixed:
 * { tool, ok, exitCode, outputs, findings, warnings, notChecked }.
 */
export class Report {
  constructor(tool, { json }) {
    this.tool = tool;
    this.json = json;
    this.outputs = [];
    this.findings = [];
    this.warnings = [];
    this.notChecked = [];
    this.exitCode = EXIT.OK;
    this.data = {};
  }
  /** Human text: stdout normally, stderr under --json. */
  say(line = '') {
    (this.json ? process.stderr : process.stdout).write(line + '\n');
  }
  warn(message) {
    this.warnings.push(message);
    this.say(`  warning: ${message}`);
  }
  /** A finding. `blocking` findings set exit 1. */
  finding(f, { blocking = false } = {}) {
    this.findings.push({ ...f, blocking });
    if (blocking) this.fail(EXIT.FINDING);
  }
  fail(code) {
    this.exitCode = Math.max(this.exitCode, code);
  }
  /** Writes a file (parents created) and records its absolute path. */
  write(abs, data) {
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, data);
    this.outputs.push(abs);
    this.say(`  wrote ${abs}`);
  }
  /** Prints the summary once; a long-running tool (preview) calls it early, runTool's call is then a no-op. */
  finish() {
    if (this.finished) return;
    this.finished = true;
    if (this.notChecked.length) {
      this.say('');
      this.say('Not checked (look at these yourself):');
      for (const n of this.notChecked) this.say(`  - ${n}`);
    }
    if (this.json) {
      const out = {
        tool: this.tool,
        ok: this.exitCode === EXIT.OK,
        exitCode: this.exitCode,
        outputs: this.outputs,
        findings: this.findings,
        warnings: this.warnings,
        notChecked: this.notChecked,
        ...this.data,
      };
      process.stdout.write(JSON.stringify(out, null, 2) + '\n');
    }
    process.exitCode = this.exitCode;
  }
}

/** The --help text, from the spec's fields. */
function helpText(spec) {
  const rows = Object.entries(spec.options).map(([name, o]) => {
    const flag = `${o.short ? `-${o.short}, ` : ''}--${name}${o.type === 'string' ? ` ${o.arg || '<value>'}` : ''}`;
    const def =
      o.default !== undefined ? ` (default: ${o.default})` : o.defaultText ? ` (default: ${o.defaultText})` : '';
    return [flag, `${o.help}${def}${o.multiple ? ' — may be repeated' : ''}`];
  });
  rows.push(['--json', 'print one JSON object on stdout; human text goes to stderr']);
  rows.push(['-h, --help', 'show this help and exit']);
  const width = Math.max(...rows.map(([f]) => f.length)) + 2;
  return [
    `${spec.id} — ${spec.summary}`,
    '',
    `Usage: ${spec.usage}`,
    '',
    ...(spec.description ? [...spec.description, ''] : []),
    'Options:',
    ...rows.map(([f, h]) => `  ${f.padEnd(width)}${h}`),
    '',
    'Example:',
    ...spec.examples.map((e) => `  ${e}`),
    '',
    'Exit codes: 0 done · 1 found a problem or a limit was exceeded · 2 usage error, unsafe',
    'or missing input, output exists without --force · 3 environment missing (browser,',
    'build, dependency) — the message says how to fix it.',
  ].join('\n');
}

/** A usage error before the tool runs: the message on stderr, and under --json the one object too. */
function usageError(spec, message, json) {
  process.stderr.write(`${spec.id}: ${message}\nUsage: ${spec.usage}\nRun with --help for every option.\n`);
  if (!json) {
    process.exitCode = EXIT.USAGE;
    return;
  }
  const report = new Report(spec.id, { json });
  report.fail(EXIT.USAGE);
  report.finish();
}

/**
 * Runs a tool. `spec` = { id, summary, usage, description?, options, examples, run }.
 * `run({ values, positionals, report, root })` does the work; it throws ToolError for a
 * clean stop with an exit code and may set report.exitCode through findings.
 */
export async function runTool(spec) {
  const parseOptions = { json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } };
  for (const [name, o] of Object.entries(spec.options)) {
    parseOptions[name] = {
      type: o.type,
      ...(o.short ? { short: o.short } : {}),
      ...(o.multiple ? { multiple: true } : {}),
    };
  }
  let parsed;
  try {
    parsed = parseArgs({ args: process.argv.slice(2), options: parseOptions, allowPositionals: true, strict: true });
  } catch (err) {
    usageError(spec, err.message, process.argv.slice(2).includes('--json'));
    return;
  }
  const { values, positionals } = parsed;
  if (values.help) {
    process.stdout.write(helpText(spec) + '\n');
    process.exitCode = EXIT.OK;
    return;
  }
  for (const [name, o] of Object.entries(spec.options)) {
    if (values[name] === undefined && o.default !== undefined) values[name] = o.default;
    if (o.choices && values[name] !== undefined && !o.choices.includes(values[name])) {
      usageError(spec, `--${name} must be one of ${o.choices.join(', ')}, not "${values[name]}".`, !!values.json);
      return;
    }
  }
  let report;
  try {
    const root = projectRoot();
    report = new Report(spec.id, { json: !!values.json });
    await spec.run({ values, positionals, report, root });
  } catch (err) {
    report ??= new Report(spec.id, { json: !!values.json });
    if (err instanceof ToolError) {
      report.say(`${spec.id}: ${err.message}`);
      report.fail(err.code);
    } else if (err?.name === 'BrowserUnavailableError') {
      report.say(`${spec.id}: ${err.message}`);
      report.say(`  fix: ${err.hint}`);
      report.fail(EXIT.ENV);
    } else {
      report.say(`${spec.id}: unexpected failure — ${err?.stack || err}`);
      report.fail(EXIT.ENV);
    }
  }
  report.finish();
}

/** Parses a positive integer option; exit 2 otherwise. */
export function positiveInt(name, v) {
  if (v === undefined) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1)
    throw new ToolError(EXIT.USAGE, `--${name} must be a whole number of 1 or more, not "${v}".`);
  return n;
}

/** Imports an installed dependency, or stops with exit 3 and the fix. */
export async function requireDep(name) {
  try {
    return await import(name);
  } catch (err) {
    throw new ToolError(
      EXIT.ENV,
      `the package "${name}" is not installed (${err.message.split('\n')[0]}) — run \`npm install\` in the project folder.`,
    );
  }
}
