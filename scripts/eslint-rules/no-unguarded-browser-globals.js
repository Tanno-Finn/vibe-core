/**
 * no-unguarded-browser-globals — a browser global read outside a platform guard.
 *
 * The prerender build runs every component under Node, where `window`, `document`,
 * `localStorage`, `sessionStorage` and `navigator` do not exist. AGENTS.md asks for a
 * guard around each access; this rule makes that checkable. It reports a reference to
 * one of those globals unless one of these holds for it:
 *
 *   - it is the operand of `typeof` (`typeof window !== 'undefined'` is the guard);
 *   - it sits in the branch a browser guard selects: `if (guard) { … }`,
 *     `guard ? … : …`, `guard && …`, or the `else` / `||` side of a server guard;
 *   - an earlier statement in an enclosing block leaves it when not in a browser:
 *     `if (!guard) return;` (or `throw`, or `if (isPlatformServer(…)) return;`);
 *   - it is inside a callback given to afterNextRender / afterRender /
 *     afterEveryRender (browser-only by Angular's definition), or inside a method
 *     decorated with @HostListener (it only ever fires on a DOM event).
 *
 * A guard is `isPlatformBrowser(…)`, anything named like `isBrowser` / `browser`
 * (identifier or member, e.g. `this.isBrowser`), or `typeof <global> !== 'undefined'`;
 * a server guard is `isPlatformServer(…)`, a negated guard, or
 * `typeof <global> === 'undefined'`. `&&` / `||` combine them the obvious way.
 *
 * Anything else — an event handler bound from a template, code that is only reached
 * from a guarded caller — is invisible to a per-file rule. Such a method or function
 * carries a leading comment `browser-only: <reason>` (a line comment, or a line in its
 * JSDoc), which the rule accepts for everything inside it. That is one written-down
 * reason per method instead of an `eslint-disable-next-line` per access, and it stays
 * greppable: `grep -rn "browser-only:" src/app`. Prefer a real fix where one is cheap —
 * `inject(DOCUMENT)` or `element.ownerDocument` instead of the global `document` work
 * on the server too.
 */
'use strict';

const DEFAULT_GLOBALS = ['window', 'document', 'localStorage', 'sessionStorage', 'navigator'];
const GUARD_NAME = /^(is)?(platform)?browser$|^isBrowser|^inBrowser$/i;
const RENDER_HOOKS = new Set(['afterNextRender', 'afterRender', 'afterEveryRender']);
// `browser-only:` followed by a reason of at least a few words' worth of text.
const BROWSER_ONLY_NOTE = /(^|[\s*])browser-only:\s*\S.{9,}/m;

function calleeName(node) {
  if (node.type !== 'CallExpression') return null;
  const c = node.callee;
  if (c.type === 'Identifier') return c.name;
  if (c.type === 'MemberExpression' && !c.computed && c.property.type === 'Identifier') return c.property.name;
  return null;
}

function nameOf(node) {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier') {
    return node.property.name;
  }
  if (node.type === 'ChainExpression') return nameOf(node.expression);
  return null;
}

/** 'browser' when `test` being truthy implies a browser, 'server' when it implies not, else null. */
function guardKind(test, globals) {
  if (!test) return null;
  switch (test.type) {
    case 'UnaryExpression':
      if (test.operator === '!') {
        const inner = guardKind(test.argument, globals);
        return inner === 'browser' ? 'server' : inner === 'server' ? 'browser' : null;
      }
      return null;
    case 'CallExpression': {
      const n = calleeName(test);
      if (n === 'isPlatformBrowser') return 'browser';
      if (n === 'isPlatformServer') return 'server';
      if (n && GUARD_NAME.test(n)) return 'browser'; // this.isBrowser()
      return null;
    }
    case 'Identifier':
    case 'MemberExpression':
    case 'ChainExpression': {
      const n = nameOf(test);
      return n && GUARD_NAME.test(n) ? 'browser' : null;
    }
    case 'BinaryExpression': {
      const { left, right, operator } = test;
      const typeofSide =
        left.type === 'UnaryExpression' && left.operator === 'typeof'
          ? [left, right]
          : right.type === 'UnaryExpression' && right.operator === 'typeof'
            ? [right, left]
            : null;
      if (!typeofSide) return null;
      const [t, other] = typeofSide;
      const arg = t.argument;
      const root = arg.type === 'MemberExpression' ? arg.object : arg;
      if (!(root.type === 'Identifier' && globals.has(root.name))) return null;
      if (!(other.type === 'Literal' && other.value === 'undefined')) return null;
      if (operator === '!==' || operator === '!=') return 'browser';
      if (operator === '===' || operator === '==') return 'server';
      return null;
    }
    case 'LogicalExpression': {
      const l = guardKind(test.left, globals);
      const r = guardKind(test.right, globals);
      if (test.operator === '&&') return l === 'browser' || r === 'browser' ? 'browser' : null;
      if (test.operator === '||') return l === 'server' || r === 'server' ? 'server' : null;
      return null;
    }
    default:
      return null;
  }
}

/** Does `stmt` leave the enclosing block (return/throw/continue/break) when `test` is truthy? */
function exits(stmt) {
  if (!stmt) return false;
  if (['ReturnStatement', 'ThrowStatement', 'ContinueStatement', 'BreakStatement'].includes(stmt.type)) return true;
  if (stmt.type === 'BlockStatement') return stmt.body.length > 0 && exits(stmt.body[stmt.body.length - 1]);
  return false;
}

function isEarlyExitGuard(stmt, globals) {
  return (
    stmt.type === 'IfStatement' &&
    !stmt.alternate &&
    exits(stmt.consequent) &&
    guardKind(stmt.test, globals) === 'server'
  );
}

function hasHostListener(node) {
  return (node.decorators || []).some((d) => calleeName(d.expression) === 'HostListener');
}

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow browser globals outside a platform guard (they crash the prerender build).' },
    schema: [
      {
        type: 'object',
        properties: { globals: { type: 'array', items: { type: 'string' } } },
        additionalProperties: false,
      },
    ],
    messages: {
      unguarded:
        "'{{name}}' is a browser global and this access is not inside a platform guard. Wrap it in isPlatformBrowser(…), " +
        "return early when not in a browser, use inject(DOCUMENT), or give the method a leading 'browser-only: <reason>' comment.",
    },
  },
  create(context) {
    const globals = new Set(context.options[0]?.globals ?? DEFAULT_GLOBALS);
    const sourceCode = context.sourceCode;

    /** A leading comment `browser-only: <reason>` on the method/function (line or JSDoc). */
    function hasBrowserOnlyNote(node) {
      const target = node.parent?.type === 'ExportNamedDeclaration' ? node.parent : node;
      return sourceCode.getCommentsBefore(target).some((c) => BROWSER_ONLY_NOTE.test(c.value));
    }

    function isGuarded(node) {
      if (node.parent?.type === 'UnaryExpression' && node.parent.operator === 'typeof') return true;
      let child = node;
      for (let a = node.parent; a; child = a, a = a.parent) {
        switch (a.type) {
          case 'IfStatement':
          case 'ConditionalExpression': {
            if (child === a.test) break;
            const kind = guardKind(a.test, globals);
            if (child === a.consequent && kind === 'browser') return true;
            if (child === a.alternate && kind === 'server') return true;
            break;
          }
          case 'LogicalExpression':
            if (child === a.right) {
              const kind = guardKind(a.left, globals);
              if (a.operator === '&&' && kind === 'browser') return true;
              if (a.operator === '||' && kind === 'server') return true;
            }
            break;
          case 'BlockStatement':
          case 'Program':
          case 'StaticBlock': {
            const idx = a.body.indexOf(child);
            for (let i = 0; i < idx; i++) if (isEarlyExitGuard(a.body[i], globals)) return true;
            break;
          }
          case 'CallExpression': {
            const n = calleeName(a);
            if (n && RENDER_HOOKS.has(n) && a.arguments.includes(child)) return true;
            break;
          }
          case 'MethodDefinition':
          case 'PropertyDefinition':
            if (hasHostListener(a) || hasBrowserOnlyNote(a)) return true;
            break;
          case 'FunctionDeclaration':
            if (hasBrowserOnlyNote(a)) return true;
            break;
          default:
            break;
        }
      }
      return false;
    }

    return {
      'Program:exit'(program) {
        const scope = sourceCode.getScope(program);
        const seen = new Set();
        const report = (ref) => {
          const id = ref.identifier;
          if (!globals.has(id.name) || seen.has(id)) return;
          seen.add(id);
          if (!isGuarded(id)) context.report({ node: id, messageId: 'unguarded', data: { name: id.name } });
        };
        for (const v of scope.variables) if (globals.has(v.name) && v.defs.length === 0) v.references.forEach(report);
        scope.through.forEach(report);
      },
    };
  },
};
