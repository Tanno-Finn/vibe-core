---
name: Text Container
selector: app-text-container
tags: [container, text, reading, layout]
status: documented
---

# Text Container (`app-text-container`)

## Purpose

A reading-optimized wrapper around `app-standard-container` for long-form HTML article content. It adds a header with reading-time and word-count metadata, a scroll-driven reading-progress bar (only for texts over a configurable word threshold), a "back to top" footer action, and print/typography styling (justified text, hyphenation, heading scale) tuned for prose rather than UI chrome.

## When to use

- Rendering a full article, guide section, or long lesson body supplied as an HTML string.
- Content where showing estimated reading time and word count adds value to the reader.
- Long pages where a "jump to top" affordance and a reading-progress indicator help orientation.

## When not to use

- Short callouts, examples, or single paragraphs — use `app-example-box` or plain markup; the reading-time/progress chrome is overkill.
- Content that isn't HTML-string-based (e.g. structured/interactive content) — use `app-standard-container` directly with projected content.
- Sidebar reference material (links/sources/books) — use `app-info-box`.

## API

| Input | Type | Default | Meaning |
|---|---|---|---|
| `title` | `string` (required) | — | Article title, shown in the custom header |
| `content` | `string` (required) | — | HTML content, rendered via `[innerHTML]` |
| `icon` | `string` | `'pi pi-file-text'` | Header icon class |
| `type` | `ContainerType` | `'primary'` | Passed through to the underlying standard-container |
| `elevation` | `'none'\|'sm'\|'md'\|'lg'` | `'sm'` | Passed through |
| `showMetadata` | `boolean` | `true` | Shows the reading-time/word-count header row |
| `showReadingTime` | `boolean` | `true` | Toggles the reading-time chip |
| `showWordCount` | `boolean` | `true` | Toggles the word-count chip |
| `showProgressIndicator` | `boolean` | `true` | Shows a scroll-based progress bar, only when text is "long" |
| `showFooterStats` | `boolean` | `true` | Shows the "back to top" footer button |
| `collapsible` | `boolean` | `true` | Always forced to `true` internally regardless of value |
| `initiallyExpanded` | `boolean` | `true` | Initial expand state |
| `wordsPerMinute` | `number` | `200` | Reading-speed assumption for the time estimate |
| `longTextThreshold` | `number` | `500` | Word count above which the progress bar activates |

No `@Output()`s. No `<ng-content>` — body content is passed as the `content` string input, not projected.

## Example

```html
<app-text-container
  title="What is supervised learning?"
  content="<p>Supervised learning trains a model on labeled examples, pairing
    each input with the correct output ...</p>"
  icon="pi pi-book">
</app-text-container>
```

## Accessibility

- `content` is rendered via `[innerHTML]` — the caller is responsible for supplying trusted/sanitized HTML; there is no built-in sanitization.
- Headings inside the article HTML get `scroll-margin-top` so anchor navigation doesn't hide them under sticky headers.
- The progress bar has an `ariaLabel` built from a translated string plus the current percentage.
- Scroll listeners are guarded with `isPlatformBrowser` and cleaned up in `ngOnDestroy` — SSR-safe.
- Respects `prefers-reduced-motion` for the progress-bar fill transition.
