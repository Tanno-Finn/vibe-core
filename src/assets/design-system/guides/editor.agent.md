---
id: editor
title: Editor
category: library
tags: [form, rich-text, quill, a11y]
summary: A rich-text field whose engine is a peer library the kit does not install — so the first question is not how to configure it, but whether it runs at all.
related: [text-inputs, forms, a11y-guidelines, i18n-localization]
covers: [editor]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: What the component renders on its own, the toolbar markup it emits, and why no live editor is on the page
  usage: The install decision, Do/Don't on naming the editable region, and the value round-trip with its dead branch
  design: Aura token chain, the un-themed Quill remainder, contrast rows and gaps, height, and narrow viewport
  development: Input and output maps, the inert inherited inputs, the detached-write drop, SSR behavior
  i18n: The nine hardcoded English button labels, the five unlabeled selects, and what a translation layer can reach
  history: Document changelog
---

## When to use
- **The stored value is HTML the person typed** — headings, links, lists in one field — *and* you add and own the `quill` package yourself.
- **You need the engine.** `(onInit)` hands over the Quill instance (`openng-optimus-ui-editor.mjs:328-330`); `getQuill()` returns it later (`:243`).

## When not to use
- **`quill` is absent.** `@openng/optimus-ui@2.0.2` does not depend on it and this kit does not install it. The component `import('quill')`s at first render (`:255`) and swallows a failed load into `console.error` (`:260`): no instance, no `onInit`, no `contenteditable` — a toolbar over an empty `<div>` (`:404`).
- **One line, or plain prose** → `p-inputtext` / `p-textarea`.
- **The markup is shown to other people** — the bundle has no `sanitiz`, `DomSanitizer`, or `bypassSecurityTrust`; sanitize on your side.
- **The content must exist server-side.** Init returns under `isPlatformServer` (`:247`) inside `afterNextRender` (`:196`): a prerender ships the toolbar and an empty div.

## Key API
Standalone `p-editor` (`:410`), a `ControlValueAccessor` (`:62-66`) extending `BaseEditableHolder`.
- **Own inputs** (`:354`): `placeholder`, `formats`, `modules`, `bounds`, `scrollingContainer`, `debug`, `readonly`, `style` (`ngStyle` on the *content* div, `:404`), `styleClass` (deprecated).
- **Inherited form inputs** `required`, `invalid`, `disabled`, `name` (`openng-optimus-ui-baseeditableholder.mjs:58`): only `invalid()` is read, for `p-invalid` (`:20`). `[disabled]` and a disabled `FormControl` do not stop typing; `readonly` does (`:126-134`, `:274`).
- **`pt`** (`openng-optimus-ui-basecomponent.mjs:428`) reaches toolbar, groups, controls, and content div (`:362`, `:363`, `:376`, `:404`) — the only route to attributes on them.
- **Outputs**: `onInit` (property `onEditorInit`, so `(onEditorInit)` binds nothing), `onTextChange`, `onSelectionChange`, `onEditorChange`, `onFocus`, `onBlur`.
- **Toolbar**: a `<p-header>`, `#header`, or `pTemplate="header"` replaces the built-in one entirely (`:355-361`).

## Accessibility
- **The editable region has no name, and no input can give it one.** The content `<div>` (`:404`) has no `role`, `aria-label`, or `id`; the `contenteditable` element is Quill's `.ql-editor` inside it. Name it in `(onInit)` on `event.editor.root` (`:315`), then check the accessibility tree.
- **The toolbar is not a toolbar**: no `role`, no `tabindex`; its 14 controls precede the text in tab order. Add both through `pt`, plus APG arrow-key navigation.
- **Nine buttons carry hardcoded English `aria-label`s** (`:376-378`, `:385-386`, `:395-397`, `:400`); the five `<select>`s (`:364`, `:369`, `:381`, `:382`, `:387`) carry none.
- **No live region** — SC 4.1.3 for format changes is met only by a region you own.
- **Buttons are exactly 24 px high** (`@openng/optimus-ui-styles/dist/editor/index.mjs:303-313`): SC 2.5.8 with zero headroom. `.ql-editor { outline: none }` (`:33-37`) — SC 2.4.7 needs a ring your stylesheet adds.
- Contrast: no editor row in `docs/generated/CONTRAST.MD`; its "content panel" rows are the body-text pair (`{text.color}` on `{content.background}`: 10.35:1 light / 17.72:1 dark); the toolbar icon (`{text.muted.color}`) is 4.76:1 light (= `paginator.nav.button.color`) / 6.91:1 dark (computed). Frames and the literal `#444`/`#fff` link tooltip are not in the gate.

## Pitfalls
- **A value written while the editor is detached is dropped** — parked in `delayedCommand` (`:223-227`, `:234-238`), which nothing reads. A form patched in a closed dialog keeps the old text.
- **Edits through the instance never reach the form**: `onModelChange` runs only under `source === 'user'` (`:286`, `:298`).
- **"Empty" is one literal string**: `html` is nulled only for `'<p><br></p>'` (`:289-291`), and is `getSemanticHTML()` on Quill 2 but `innerHTML` on Quill 1 (`:287`). Decide emptiness on `textValue`.
- **`modules` merges shallowly over `{ toolbar }`** (`:269-270`): its own `toolbar` key leaves the rendered buttons dead.

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-editor.mjs` — every behavioral claim.
- `openng-optimus-ui-baseeditableholder.mjs:58`, `openng-optimus-ui-basecomponent.mjs:428` — the inherited inputs.
- `@openng/optimus-ui-styles/dist/editor/index.mjs` — a vendored Quill 1.3.3 snow sheet (`:2-7`) plus `.p-editor*` token rules (`:854-981`).
- `@openng/optimus-ui-themes/dist/aura/editor/index.mjs` — the token aliases.
- `@openng/optimus-ui/package.json` — its `dependencies` make the absence of `quill` a fact.
- WCAG 2.2 SC 2.5.8 https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — the 24×24 the buttons meet exactly.
- W3C APG Toolbar https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/ — the roving tabindex the bundle lacks.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Rich text, engine installed | `<p-editor formControlName="…" (onInit)="nameEditable($event)">` |
| Rich text, engine missing | `p-textarea` plus a plan, not a broken toolbar |
| Showing a stored value | your own sanitized element, not `readonly` `p-editor` |
| Custom or translated toolbar | `<p-editor><p-header>…</p-header></p-editor>` |

## Rules
- MUST: add `quill` to the app's dependencies before rendering `p-editor`, and fail loudly when it is missing.
- MUST: name the editable element in `(onInit)` on `event.editor.root`.
- MUST: read emptiness from `textValue`; sanitize the HTML wherever it is rendered back.
- MUST: give the content div a height through `[style]`.
- NEVER: lock editing with `[disabled]` or a disabled `FormControl` — use `readonly`.
- NEVER: change the value through `getQuill()` while a form control owns it.

## Default snippet
```html
<p-editor formControlName="body" [style]="{ height: '18rem' }" [readonly]="submitting()" (onInit)="nameEditable($event)" />
```
```ts
nameEditable(e: { editor: { root: HTMLElement } }): void {
  // labelKey is a key in your own i18n module.
  e.editor.root.setAttribute('aria-label', this.i18n.translate(this.labelKey));
}
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
