---
id: fileupload
title: File Upload
category: library
tags: [forms, upload, feedback, a11y]
summary: An upload queue with a drop area, a progress bar, and its own validation messages — and a failure path that shows the user nothing unless you build it.
related: [progress, feedback-messages, button, forms, dragdrop]
covers: [fileupload]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Both modes rendered against a custom-upload handler, the surface each mode provides, and the queue-row markup
  usage: Do/Don't on the missing failure path and on library labels, plus the annotated custom-upload source
  design: Aura token chain, the drag-over border against the compilat's rows, header overflow at narrow widths
  development: Output payloads with their emit sites, the two error paths side by side, file-limit accounting, quality checklist
  i18n: Which strings come from your template, which from the Optimus locale, the count that drops, the unlocalized size
  history: Document changelog
---

## When to use
- **The upload must be visible.** `mode="advanced"`: drop area, progress bar while files are queued, one row per file, Choose, and Upload/Cancel unless `auto` (`openng-optimus-ui-fileupload.mjs:997-1151`).
- **You own the transport.** `customUpload` + `uploadHandler`, which hands you `{ files }` only (`:736-744`).

## When not to use
- **One file in a form you already validate.** `mode="basic"` is messages, one button, and a label (`:1152-1198`); no queue, progress bar, or drop target.
- **Per-file, chunked, or resumable uploads.** The built-in path sends the whole queue as one `FormData` in one request (`:748-762`).

## Key API
`p-fileupload` (`:996`); `pt`/`dt`/`unstyled` from `BaseComponent` (`openng-optimus-ui-basecomponent.mjs:428`).
- **Transport** — `url`, `name`, `method`, `headers`, `withCredentials`, `auto`, `customUpload`.
- **Gatekeeping** — `multiple`, `accept`, `maxFileSize` (bytes), `fileLimit`.
- **Chrome** — `mode`, `chooseLabel`/`uploadLabel`/`cancelLabel`, `showUploadButton`, `showCancelButton`, `previewWidth`.
- **Messages** — six `invalidFile{Type,Size,Limit}Message{Summary,Detail}` inputs, English defaults (`:268-293`).
- **Outputs** — `onSelect`, `onBeforeUpload`, `onSend`, `onProgress`, `onUpload`, `onError`, `onClear`, `onRemove`, `onRemoveUploadedFile`, `uploadHandler`. **Methods** — `choose()`, `upload()`, `clear()`.
- **Templates** — `#header`, `#content`, `#toolbar`, `#file`, `#filelabel`, `#empty`, icons; `#content` replaces progress bar, messages **and** both file lists (`:1091-1146`).

## Accessibility
- **The Choose button is the control, not the input.** Every `input[type='file']` is `display: none` (`@openng/optimus-ui-styles/dist/fileupload/index.mjs:2-4`), so its `aria.browseFiles` label (`:998`, `:1186`) reaches nobody. The name is `chooseLabel`, else the locale's `choose` (`:969-971`).
- **Validation messages announce** — `p-message` hosts carry `role="alert"` (`openng-optimus-ui-message.mjs:247`).
- **The progress bar has a role but no name** (`openng-optimus-ui-progressbar.mjs:136`; FileUpload passes only `[value]`, `:1108`) — name it through the `pcProgressBar` pass-through.
- **Drag and drop is advanced-only and has no keyboard path** (`:1090`); the Choose button is the equivalent.
- **Enter on the advanced Choose button runs `choose()` twice** — `(keydown.enter)` (`:1008`) plus the click it produces (`:1007`); the basic button's handler prevents the default (`:954-962`).
- Drag-over border `{primary.color}` on the light panel (`#ffffff`): the compilat's `<accent>.primary.color` on `--surface-card` rows, 5.18:1–17.85:1 (SC 1.4.11, 3:1). Dark panel (`#18181b`) not measured directly; on every dark card the same rows give 4.75:1+ and the gate has no exceptions.

## Pitfalls
- **A failed request leaves the screen as it was.** The error callback sets `uploading = false` and emits `onError` (`:795-798`); progress, queue, and messages stay.
- **`onError` has two payloads**: `{ files }` (`:781`) and `{ files, error }` (`:797`, the one `HttpClient` takes); treat `error` as optional.
- **`onClear` is not Cancel.** `clear()` ends every response (`:784`) after moving the files to Completed (`:783`), success badge included, whatever the status.
- **`auto` ignores `fileLimit` in basic mode** (`:663`).
- **Used-up slots never come back**: `uploadedFileCount` grows (`:776`, `:738` under `customUpload`) and never shrinks (`:841-845`, `:859`).
- **Basic mode has no upload trigger** without `auto`: its button always chooses (`:1163`); call `upload()` yourself.
- **Sizes print `toFixed(3)`** (`:144-154`) — `1.234 MB` on a German page, where the kit writes a decimal comma (`numberLocaleFor`, `src/app/utils/date-locale.ts`). Localize through a `#file` template.
- **Object URLs are never revoked and `onImageError` never fires** — created at `:527`, `:654`; `onImageLoad` (`:728`) and `imageError` (`:963`) are bound by no template.

## Sources
- `@openng/optimus-ui/fesm2022/openng-optimus-ui-fileupload.mjs` — both mode templates, validation, the upload subscription.
- `@openng/optimus-ui/types/openng-optimus-ui-types-fileupload.d.ts:230-239` — `error` is optional.
- `@openng/optimus-ui-styles/dist/fileupload/index.mjs` — hides the inputs; no media query.
- `openng-optimus-ui-config.mjs:132-137`, `:174-175`, `:246-249` — locale defaults and `setTranslation`.
- `openng-optimus-ui-message.mjs:247`, `openng-optimus-ui-progressbar.mjs:136` — the host ARIA of the two components it renders.
- WCAG 2.2 SC 1.4.11 https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — the 3:1 the drag-over border owes as the only armed signal.
- WCAG 2.2 SC 3.3.1 https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html — what a failed upload owes in text.

## Semantic mapping
| Intent | Markup |
| --- | --- |
| Queue the user reviews before sending | `<p-fileupload mode="advanced" customUpload (uploadHandler)="…">` |
| One file, sent the moment it is picked | `<p-fileupload mode="basic" auto …>` |
| Attachment inside your own form | native `<input type="file">` with your label and errors |

## Rules
- MUST: render the failure yourself — in your handler under `customUpload`, from `onError` otherwise.
- MUST: set `name` with `url` — `formData.append(this.name, …)` (`:753`).
- MUST: validate on the server; `accept`, `maxFileSize`, `fileLimit` are comfort.
- MUST: pass translated `chooseLabel`/`uploadLabel`/`cancelLabel`, and push the locale keys via `Optimus.setTranslation` on language change.
- NEVER: drag-and-drop as the only route; `onClear` as cancellation; the Completed badge as "the server accepted it".

## Default snippet
```html
<p-fileupload
  mode="advanced" customUpload multiple
  accept="image/*,.pdf" [maxFileSize]="5000000" [fileLimit]="5"
  [chooseLabel]="t('your-module.choose')" [uploadLabel]="t('your-module.send')"
  [pt]="{ pcProgressBar: { root: { 'aria-label': t('your-module.progress') } } }"
  (uploadHandler)="send($event.files)" />
@if (failed()) { <p role="alert">{{ t('your-module.failed') }}</p> }  <!-- set in send() -->
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
