---
name: Prompt Example
selector: app-prompt-example
tags: [prompt, code, example, didactic]
status: documented
---

# Prompt Example (`app-prompt-example`)

## Purpose

A code/prompt display box purpose-built for showing example prompts, with `good`/`bad`/`neutral`/`demo` color-coded variants, an optional header label + auto icon, plain single-block code display, or a tag-segmented layout for structured prompt frameworks (e.g. a RACE prompt broken into `[ROLE]`/`[ACTION]`/`[CONTEXT]`/`[EXPECTATION]` sections), and an optional copy-to-clipboard button.

## When to use

- Showing a single example prompt with good/bad/neutral framing.
- Displaying a structured prompt framework broken into labeled, colored segments via `tags`.
- Any prompt snippet the user should be able to copy verbatim (`copyable`).

## When not to use

- General non-prompt good/bad comparisons (UI copy, code style) — use `app-example-box`.
- Mathematical formulas — use `app-formula-block`.
- A sidebar list of multiple prompt snippets — use `app-info-box`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `type` | `'good'\|'bad'\|'neutral'\|'demo'` | `'neutral'` | Drives border/background color and default header icon |
| `code` / `codeKey` | `string?` | — | Single-block content, shown in `<code>`; used only when `tags` is empty |
| `label` / `labelKey` | `string?` | — | Header label text |
| `showIcon` | `boolean` | `true` | Shows the type icon in the header |
| `copyable` | `boolean` | `false` | Shows a floating copy-to-clipboard button |
| `tags` | `PromptTag[]?` | — | Segmented display: `{ label, color?, contentKey?, content? }`; presence switches the component out of single-code-block mode |

`PromptTag.color`: `'blue'\|'green'\|'orange'\|'purple'\|'teal'\|'pink'`.

No `@Output()`s. No content projection — content comes only from `code`/`codeKey` or `tags`.

## Example

```html
<app-prompt-example type="good" label="Good prompt" [copyable]="true"
  code="Explain gradient descent to a high-school student using a hiking analogy, in under 100 words.">
</app-prompt-example>
```

## Accessibility

- The copy button has a translated `aria-label` (`common.copy`) and becomes visible on hover, focus-within, or its own `:focus-visible`.
- Header icons carry `aria-hidden="true"`.
- Tag colors are decorative accents on top of the tag's own label text, not the sole signal.
- `copyToClipboard()` gives transient (2s) visible feedback on the copy button — the icon swaps to a green check on success or a red cross on failure — backed by an `aria-live="polite"` status region (`role="status"`) that announces "copied"/"copy failed" to screen readers. The clipboard call is guarded with `isPlatformBrowser` (and a `navigator.clipboard` presence check), so it is SSR-safe and reports an error state instead of throwing when the API is unavailable.
