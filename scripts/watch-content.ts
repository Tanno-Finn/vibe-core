#!/usr/bin/env node

/**
 * Content Watch Script
 *
 * Watches for changes in src/assets/data/ and rebuilds content bundles.
 * Used in development mode alongside ng serve.
 *
 * Usage: node scripts/watch-content.ts
 */

import * as chokidar from 'chokidar';
import { execSync } from 'child_process';
import * as path from 'path';

// ============================================================================
// Configuration
// ============================================================================

const WATCH_PATHS = [
  'src/assets/data/core/**/*.json',
  'src/assets/data/translations/**/*.json',
  'src/assets/data/achievements/**/*.json',
];

const DEBOUNCE_MS = 500;
const BUILD_COMMAND = 'node scripts/build-unified-content.ts';

// ============================================================================
// State
// ============================================================================

let debounceTimer: NodeJS.Timeout | null = null;
let isBuilding = false;
let pendingRebuild = false;

// ============================================================================
// Build Logic
// ============================================================================

function rebuild(): void {
  if (isBuilding) {
    pendingRebuild = true;
    return;
  }

  isBuilding = true;
  console.log('\n' + '='.repeat(60));
  console.log('  Content changed, rebuilding...');
  console.log('='.repeat(60));

  try {
    execSync(BUILD_COMMAND, { stdio: 'inherit' });
    console.log('  Rebuild complete.');
  } catch {
    console.error('  Rebuild FAILED');
  }

  isBuilding = false;

  // If changes happened during build, rebuild again
  if (pendingRebuild) {
    pendingRebuild = false;
    setTimeout(rebuild, 100);
  }
}

function scheduleRebuild(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(rebuild, DEBOUNCE_MS);
}

// ============================================================================
// Watch Setup
// ============================================================================

console.log('');
console.log('='.repeat(60));
console.log('  CONTENT WATCH MODE');
console.log('='.repeat(60));
console.log('');
console.log('  Watching for changes in:');
WATCH_PATHS.forEach((p) => console.log(`    - ${p}`));
console.log('');
console.log('  Press Ctrl+C to stop.');
console.log('');
console.log('='.repeat(60));
console.log('');

const watcher = chokidar.watch(WATCH_PATHS, {
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100,
  },
  ignored: ['**/node_modules/**', '**/dist-content/**'],
});

watcher.on('change', (filePath) => {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`  [CHANGE] ${relativePath}`);
  scheduleRebuild();
});

watcher.on('add', (filePath) => {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`  [ADD] ${relativePath}`);
  scheduleRebuild();
});

watcher.on('unlink', (filePath) => {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`  [DELETE] ${relativePath}`);
  scheduleRebuild();
});

watcher.on('error', (error) => {
  console.error('  Watch error:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n  Stopping content watcher...');
  watcher.close().then(() => {
    console.log('  Watcher stopped.');
    process.exit(0);
  });
});
