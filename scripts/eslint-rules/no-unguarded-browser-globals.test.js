/**
 * RuleTester cases for no-unguarded-browser-globals. Run by `npm run lint`.
 * Each valid case is a guard shape the rule must accept; each invalid case is an
 * access the rule must still catch — a rule that accepted everything would pass lint.
 */
'use strict';

const { RuleTester } = require('eslint');
const tseslint = require('typescript-eslint');
const rule = require('./no-unguarded-browser-globals.js');

const tester = new RuleTester({ languageOptions: { parser: tseslint.parser } });
const err = (name) => ({ messageId: 'unguarded', data: { name } });

tester.run('no-unguarded-browser-globals', rule, {
  valid: [
    "if (typeof window !== 'undefined') { window.scrollTo(0, 0); }",
    "if (typeof document === 'undefined') return; document.title = 'x';",
    'if (isPlatformBrowser(id)) { localStorage.getItem("k"); }',
    'class A { isBrowser = true; f() { if (this.isBrowser) { navigator.clipboard; } } }',
    'class A { f() { if (!this.isBrowser) return; window.print(); } }',
    'class A { f() { if (!isPlatformBrowser(this.id) || !this.el) { return; } document.body.focus(); } }',
    'if (isPlatformServer(id)) { x(); } else { sessionStorage.clear(); }',
    'const w = isBrowser ? window.innerWidth : 0;',
    'const w = isBrowser && window.innerWidth;',
    'afterNextRender(() => { window.scrollTo(0, 0); });',
    "class A { @HostListener('window:resize') onResize() { window.innerWidth; } }",
    'class A {\n  // browser-only: click handler, never runs during prerender.\n  onClick() { window.open("x"); }\n}',
    'class A {\n  /**\n   * Opens it.\n   * browser-only: click handler, never runs during prerender.\n   */\n  open() { document.activeElement; }\n}',
    'function f(window) { return window.x; }',
  ],
  invalid: [
    { code: 'window.scrollTo(0, 0);', errors: [err('window')] },
    { code: 'class A { f() { document.getElementById("x"); } }', errors: [err('document')] },
    { code: 'if (ready) { localStorage.setItem("k", "v"); }', errors: [err('localStorage')] },
    { code: 'if (isBrowser) { x(); } else { navigator.userAgent; }', errors: [err('navigator')] },
    { code: 'if (!this.isBrowser) { sessionStorage.clear(); }', errors: [err('sessionStorage')] },
    { code: 'class A {\n  // browser-only:\n  f() { window.print(); }\n}', errors: [err('window')] },
    { code: 'class A { f() { window.print(); if (!this.isBrowser) return; } }', errors: [err('window')] },
  ],
});

console.log('no-unguarded-browser-globals: RuleTester PASS');
