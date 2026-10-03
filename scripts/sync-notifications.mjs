#!/usr/bin/env node
/**
 * scripts/sync-notifications.mjs
 *
 * Aggregates per-file notification entries from
 *   src/assets/data/notifications/*.json   (one entry per file)
 * into a single
 *   src/assets/data/notifications.compiled.json
 * that the NotificationService fetches at runtime.
 *
 * Entries older than 6 months move out of the live bundle and into
 * src/assets/data/notifications-archive.compiled.json, which the /news page
 * reads when "Mit Archiv anzeigen" is toggled.
 *
 * REPORT BY DEFAULT, DELETE ONLY ON REQUEST
 * -----------------------------------------
 * Retiring an entry on disk — appending it to the committed
 * src/assets/data/notifications/_archive.json and removing its per-file source —
 * happens ONLY with the explicit `--archive` flag. Without it the script just
 * names the files that are due and leaves them alone.
 *
 * The reason: this script runs inside `prebuild`, i.e. on every `npm start` and
 * every build. A source file silently disappearing as a side effect of starting
 * the dev server is a deletion nobody asked for and nobody sees. The compiled
 * output is byte-identical either way, so the build never depends on the flag —
 * only the on-disk move does.
 *
 * Schema reference: src/app/models/notification.model.ts
 *
 * Usage: node scripts/sync-notifications.mjs            # compile + report what is due
 *        node scripts/sync-notifications.mjs --archive  # also retire due sources on disk
 *        npm run notifications:build                    # the reporting form (prebuild)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const NOTIFICATIONS_DIR = path.join(PROJECT_ROOT, 'src', 'assets', 'data', 'notifications');
const ARCHIVE_FILE = path.join(NOTIFICATIONS_DIR, '_archive.json');
const COMPILED_LIVE = path.join(PROJECT_ROOT, 'src', 'assets', 'data', 'notifications.compiled.json');
const COMPILED_ARCHIVE = path.join(PROJECT_ROOT, 'src', 'assets', 'data', 'notifications-archive.compiled.json');

// Six months as a sliding window. Approximate (30d * 6) — exact month math is
// not worth the complexity here; the bell shows ~6 months either way.
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

// Opt-in: only with --archive does a due source file actually get retired on disk.
// See the header — the default has to be safe because prebuild runs this constantly.
const ARCHIVE_MODE = process.argv.slice(2).includes('--archive');

const VALID_TYPES = new Set([
  'launch',
  'feature',
  'release',
  'bugfix',
  'article',
  'blog',
  'demo',
  'glossary',
  'timeline',
  'tool',
  'language',
  'quality',
  'maintenance',
]);
const VALID_PRIORITIES = new Set(['high', 'normal', 'low']);

function fail(msg) {
  console.error(`[sync-notifications] ERROR: ${msg}`);
  process.exit(1);
}

function rel(p) {
  return path.relative(PROJECT_ROOT, p).split(path.sep).join('/');
}

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    fail(`${rel(file)}: invalid JSON — ${e.message}`);
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function validateEntry(entry, source) {
  for (const field of ['id', 'publishedAt', 'type', 'titleKey', 'descriptionKey']) {
    if (typeof entry[field] !== 'string' || entry[field].length === 0) {
      fail(`${source}: missing or invalid required field "${field}"`);
    }
  }
  if (!VALID_TYPES.has(entry.type)) {
    fail(`${source}: invalid type "${entry.type}". Allowed: ${[...VALID_TYPES].join(', ')}`);
  }
  if (entry.priority !== undefined && !VALID_PRIORITIES.has(entry.priority)) {
    fail(`${source}: invalid priority "${entry.priority}". Allowed: ${[...VALID_PRIORITIES].join(', ')}`);
  }
  if (entry.pinned !== undefined && typeof entry.pinned !== 'boolean') {
    fail(`${source}: "pinned" must be boolean`);
  }
  if (Number.isNaN(Date.parse(entry.publishedAt))) {
    fail(`${source}: publishedAt "${entry.publishedAt}" is not a valid ISO 8601 date`);
  }
  if (entry.linkQueryParams !== undefined) {
    if (
      entry.linkQueryParams === null ||
      typeof entry.linkQueryParams !== 'object' ||
      Array.isArray(entry.linkQueryParams)
    ) {
      fail(`${source}: "linkQueryParams" must be a flat string map`);
    }
    for (const [k, v] of Object.entries(entry.linkQueryParams)) {
      if (typeof v !== 'string') {
        fail(`${source}: linkQueryParams.${k} must be a string`);
      }
    }
  }
  if (entry.linkFragment !== undefined && typeof entry.linkFragment !== 'string') {
    fail(`${source}: "linkFragment" must be a string`);
  }
}

function main() {
  if (!fs.existsSync(NOTIFICATIONS_DIR)) {
    console.warn(`[sync-notifications] Source dir missing: ${rel(NOTIFICATIONS_DIR)} — writing empty bundles.`);
    writeJson(COMPILED_LIVE, []);
    writeJson(COMPILED_ARCHIVE, []);
    return;
  }

  const sourceFiles = fs
    .readdirSync(NOTIFICATIONS_DIR)
    .filter((f) => f.endsWith('.json') && f !== '_archive.json')
    .map((f) => path.join(NOTIFICATIONS_DIR, f));

  const seenIds = new Set();
  const candidates = [];
  for (const file of sourceFiles) {
    const entry = readJson(file);
    validateEntry(entry, rel(file));
    if (seenIds.has(entry.id)) {
      fail(`Duplicate id "${entry.id}" — present in multiple per-file sources`);
    }
    seenIds.add(entry.id);
    candidates.push({ entry, sourceFile: file });
  }

  let archive = [];
  if (fs.existsSync(ARCHIVE_FILE)) {
    archive = readJson(ARCHIVE_FILE);
    if (!Array.isArray(archive)) {
      fail(`${rel(ARCHIVE_FILE)}: must be a JSON array`);
    }
    for (const e of archive) {
      validateEntry(e, rel(ARCHIVE_FILE));
      if (seenIds.has(e.id)) {
        fail(`Duplicate id "${e.id}" — exists in both _archive.json and a live per-file source`);
      }
      seenIds.add(e.id);
    }
  }

  // Split live vs newly-archivable entries.
  const cutoff = Date.now() - SIX_MONTHS_MS;
  const live = [];
  const newlyArchived = [];
  for (const c of candidates) {
    const ts = Date.parse(c.entry.publishedAt);
    if (ts < cutoff) {
      newlyArchived.push(c);
    } else {
      live.push(c.entry);
    }
  }

  // Entries past the cutoff always leave the live bundle (that is a compile-time
  // decision, and the output is the same either way). Whether they also leave DISK
  // is a separate, destructive decision that needs `--archive`.
  if (newlyArchived.length > 0) {
    archive.push(...newlyArchived.map((x) => x.entry));
    archive.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

    if (ARCHIVE_MODE) {
      writeJson(ARCHIVE_FILE, archive);
      for (const { sourceFile } of newlyArchived) {
        fs.rmSync(sourceFile);
        console.log(`[sync-notifications] Retired ${rel(sourceFile)} -> ${rel(ARCHIVE_FILE)} (older than 6 months)`);
      }
    } else {
      console.log(
        `[sync-notifications] ${newlyArchived.length} source file(s) are older than 6 months and are served from the archive bundle:`,
      );
      for (const { sourceFile } of newlyArchived) {
        console.log(`[sync-notifications]   ${rel(sourceFile)}`);
      }
      console.log(
        '[sync-notifications] They are left on disk. To move them into _archive.json and delete the sources, run this script with --archive.',
      );
    }
  }

  // Sort live: pinned first, then publishedAt desc.
  live.sort((a, b) => {
    const ap = a.pinned ? 1 : 0;
    const bp = b.pinned ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  const archiveSorted = [...archive].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  writeJson(COMPILED_LIVE, live);
  writeJson(COMPILED_ARCHIVE, archiveSorted);

  console.log(`[sync-notifications] Wrote ${live.length} live entries -> ${rel(COMPILED_LIVE)}`);
  console.log(`[sync-notifications] Wrote ${archiveSorted.length} archived entries -> ${rel(COMPILED_ARCHIVE)}`);
  if (newlyArchived.length > 0) {
    console.log(
      ARCHIVE_MODE
        ? `[sync-notifications] Retired on disk this run: ${newlyArchived.length}`
        : `[sync-notifications] Due for retirement (kept on disk, use --archive): ${newlyArchived.length}`,
    );
  }
}

main();
