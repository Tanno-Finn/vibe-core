// @ts-check
// ESLint flat config for the Portal-Angular source repo.
//
// Layers: typescript-eslint (TS rules) + angular-eslint (component/template rules).
// Prettier owns every stylistic decision, so eslint-config-prettier runs LAST and
// switches off all formatting-related lint rules.
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');
const globals = require('globals');
const noUnguardedBrowserGlobals = require('./scripts/eslint-rules/no-unguarded-browser-globals.js');

module.exports = tseslint.config(
  // ---------------------------------------------------------------------------
  // Global ignores. Generated output, vendored trees, docs, and the large
  // machine-maintained data bundles are never linted. Only the Angular app
  // (src/) and the build scripts (scripts/) carry lint-worthy source.
  // ---------------------------------------------------------------------------
  {
    ignores: [
      // Build output / caches
      '**/dist/**',
      'dist-content/**',
      'out-tsc/**',
      '.angular/**',
      'coverage/**',
      'node_modules/**',
      // Vendored / tooling / IDE
      '.claude/**',
      '.idea/**',
      '.vscode/**',
      '.chrome-test-profile/**',
      // Scratch / drafts / reports / non-app content trees
      'tmp/**',
      'docs/**',
      'public/**',
      // Large generated / bulk-translated data bundles inside the app tree
      'src/assets/data/**',
    ],
  },

  // ---------------------------------------------------------------------------
  // Angular application TypeScript (src/).
  // ---------------------------------------------------------------------------
  {
    files: ['src/**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      // Codebase convention: component selectors are `app-*` (kebab element),
      // directive selectors are `app*` (camelCase attribute).
      // See src/app/app.component.ts and src/app/directives/*.directive.ts.
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      // A parameter required by a signature (interface impl, callback shape) but
      // unused is marked with a leading underscore; genuinely dead locals and
      // imports must be removed, not silenced — so no varsIgnorePattern here.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      // Angular 22 made OnPush the default; the v22 migration pinned every
      // pre-existing component to ChangeDetectionStrategy.Eager. Those were
      // converted one by one (markForCheck or signals wherever state changes
      // outside a template event), so opting out of OnPush is now an error.
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      // Services are imported by relative path from their own file. The legacy
      // `@services` barrel and its tsconfig paths are gone; this keeps them gone.
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: '@services', message: 'Import the service by relative path from its own file.' }],
          patterns: [{ group: ['@services/*'], message: 'Import the service by relative path from its own file.' }],
        },
      ],
    },
  },

  // Browser globals (window, document, localStorage, sessionStorage, navigator)
  // crash the prerender build when touched outside a platform guard. The local
  // rule recognises the guard shapes the kit uses; a method that is browser-only
  // for a reason the rule cannot see (a click handler) says so in a leading
  // `browser-only: <reason>` comment. See scripts/eslint-rules/.
  {
    files: ['src/app/**/*.ts'],
    ignores: ['src/app/**/*.spec.ts'],
    plugins: { local: { rules: { 'no-unguarded-browser-globals': noUnguardedBrowserGlobals } } },
    rules: {
      'local/no-unguarded-browser-globals': 'error',
    },
  },

  // ---------------------------------------------------------------------------
  // Angular templates (external .html + inline templates via the processor).
  // ---------------------------------------------------------------------------
  {
    files: ['src/**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // Optimus UI's p-button component renders its `label` input as the button's
      // visible text, so a <p-button label="…"> is NOT empty — the rule just
      // can't see through the component. Accept `label` as content; a button
      // with neither content nor label still fails. (The pButton DIRECTIVE's label
      // input is deprecated in favour of pButtonLabel children, which the kit uses.)
      '@angular-eslint/template/elements-content': ['error', { allowList: ['label'] }],
    },
  },

  // ---------------------------------------------------------------------------
  // Node build/tooling scripts (TS + JS). CommonJS + Node globals, no Angular
  // rules. Kept intentionally light — these are internal, not shipped code.
  // ---------------------------------------------------------------------------
  {
    files: [
      'scripts/**/*.ts',
      'scripts/**/*.js',
      'scripts/**/*.cjs',
      'scripts/**/*.mjs',
      'tools/**/*.mjs',
      '*.js',
      '*.cjs',
      '*.mjs',
    ],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      // These are CommonJS Node scripts (sourceType: 'commonjs'); `require` is the
      // module system, not a code smell. Everything else stays on — internal
      // tooling is still held to the same type/dead-code bar as shipped code.
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },

  // ---------------------------------------------------------------------------
  // Prettier compatibility — MUST stay last.
  // ---------------------------------------------------------------------------
  prettier,
);
