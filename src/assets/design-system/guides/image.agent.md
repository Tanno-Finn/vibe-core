---
id: image
title: Image and ImageCompare
category: library
tags: [image, media, alt-text, overlay, a11y]
summary: An image that passes your alt text through and can open a preview modal with no name and no alt on the enlarged picture, and a before/after slider that the keyboard can move but no screen reader can follow.
related: [avatar, dialog, slider, a11y-guidelines, i18n-localization]
covers: [image, imagecompare]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Informative, previewed, and decorative images; a named, visible ImageCompare; the markup the preview renders
  usage: Alt-text table, when preview and ImageCompare earn their place, three Do/Don't pairs
  design: Token chain, shipped focus indicators with computed contrast, the CSS and dt fixes, narrow screens, motion
  development: Inputs, the preview key by key, the pt and focus-return recipe, ImageCompare internals, SSR, checklist
  i18n: Alt text as content, the five library strings the kit leaves English, text in pictures, RTL
  history: Document changelog
---

## When to use
- **`p-image`** — a content image that may need a larger view (photo, screenshot): `preview` adds a full-screen overlay with rotate and zoom.
- **`p-imagecompare`** — a before/after pair (colorization, denoising, upscaling) as a **visual enhancement** over a text statement of the difference.

## When not to use
- A plain image with no preview → `<img alt>` or `NgOptimizedImage`; `p-image` adds nothing.
- Small print or a dense diagram → make it legible in place; the preview zooms to 140% at most, with no pan.
- ImageCompare when the difference is the message and must reach everyone, the two images differ in size or framing (both are stretched to 16:9), or the detail needs zoom → two captioned figures side by side (stacked on narrow screens) plus one sentence naming the change.
- A person's picture → `p-avatar` (avatar guide).

## Key API
`ImageModule` (`@openng/optimus-ui/image`), `ImageCompareModule` (`…/imagecompare`), Optimus UI 2.0.2.
- Image inputs (`openng-optimus-ui-image.mjs:128-232`): `src`, `srcSet`, `sizes`, `alt`, `width`, `height`, `loading`, `imageClass`, `imageStyle`, `preview` (boolean), `previewImageSrc`/`SrcSet`/`Sizes`, `appendTo` (default `'self'`), transition/motion options. Outputs `onShow`, `onHide`, `onImageError`. Templates `#image`, `#preview`, `#indicator`, five icon templates.
- `width`/`height` also become the preview button's inline size as `value + 'px'` (`:530`).
- Pass-through: `image`, `previewMask`, `previewIcon`, `mask`, `toolbar`, five button sections, `original`.
- ImageCompare (`openng-optimus-ui-imagecompare.mjs:136-140`): inputs `tabindex`, `ariaLabel`, `ariaLabelledby` — **all on the host**; templates `#left` (base layer, end side of the handle) and `#right` (top layer, revealed from the start edge); then `<input type="range" min="0" max="100" value="50">`. Pass-through `slider`. No value input, no output.

## Accessibility
- **Alt:** `[attr.alt]="alt"` (`openng-optimus-ui-image.mjs:516`) — unset means **no attribute**, not empty. Informative → the point in one sentence; decorative → `alt=""` and no preview; chart → short finding + data as text.
- **Preview button:** invisible `<button>` over the image, named from config `aria.zoomImage` (the kit pushes it in the page language), identical for every image. The library's `outline: 0 none` is overridden: the kit's one 2px `--primary-color-fg` ring (`src/styles.scss`).
- **Overlay:** `role="dialog"` `aria-modal="true"`, **no name**; focus moves to Close after 25ms (`:438-440`); `pFocusTrap` cycles the five toolbar buttons; body scroll blocked. Enlarged `<img>` has **no alt** (`:590-598`).
- **Zoom:** buttons only (no keys, wheel, or pan); step 0.1, effective range 0.5–1.4 (float sums, `:327-338`); a button at its limit becomes `disabled` under focus, and focus falls to the body (next Tab: Close).
- **Closing:** Escape closes and refocuses the preview button (`:399-411`); Close and backdrop close **without** focus return (`:393-398`, `:483-485`).
- Fix: `[pt]` → `mask: { 'aria-label' }`, `original: { alt }`, `previewMask: { 'aria-describedby': captionId }`; `(onHide)` refocuses `.p-image-preview-mask`. Both rings are the kit's already — add no ring rule or `dt`.
- **ImageCompare is keyboard-operable** (native range: Tab, arrows by 1, Home/End) **but unnamed**: `ariaLabel` lands on the role-less host. Name via `[pt]="{ slider: { 'aria-label': … } }"`. Value announced as a bare number (no `aria-valuetext`). Screen readers get two alts and a slider that changes nothing perceivable — the difference must be in text.
- **Toolbar (kit, gated):** a 60% black plate — icons 10.38–19.75:1, hovered 8.06:1+ (CONTRAST.MD "image preview"); each button rings 2px in its icon ink. **Not gated:** the compare thumb and its 1px ring are 30% white — 1.00:1 over white, 2.46:1 over black.
- Motion: 150–300ms fades/scales; the kit's global reduced-motion block cuts them to 0.01ms.

## Pitfalls
- Preview with `width`/`height` inputs on a fluid image: the button keeps the fixed px. Leave them unset; size via `imageStyle` (`width: 100%`, `height: auto`, `aspect-ratio`) on a block-level host. Strings like `"100%"` become `"100%px"`.
- Zoomed past the viewport, the picture is clipped — no scroll, no pan.
- After a toolbar click, the first backdrop click only resets a flag; the second closes (`:393-398`, `:480-482`).
- `pt` `aria-label` on `previewMask` fights the library binding — describe it, do not rename it.
- ImageCompare `#right` must render exactly one `<img>` right before the input (`img + img` clip, `previousElementSibling` in `onSlide`, `:107-116`). A wrapper breaks the clip.
- ImageCompare `tabindex` adds a second, useless tab stop on the host.
- Both ImageCompare images are `100% × 100%` of a 16:9 box, no `object-fit`: other ratios distort.
- The Firefox thumb rule reads `handle.border.style`, which Aura does not define — set it in `dt` with the border.

## Sources
- W3C alt decision tree: https://www.w3.org/WAI/tutorials/images/decision-tree/ — the five alt cases.
- WCAG 2.2 SC 1.1.1: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html — text alternatives, decoration.
- APG Dialog (Modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ — name, initial focus, trap, focus return.
- WCAG 2.2 SC 2.4.7 / 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html — the rings, and the compare handle as shipped.
- HTML range state: https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range) — native keyboard support.
- Optimus UI: https://optimus.openng.org/image , https://optimus.openng.org/imagecompare — vendor API, verified against the shipped source (2.0.2).

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| Content image | `p-image [alt]` (or plain `<img alt>`) |
| Decorative image | `alt=""`, no `preview` |
| Larger view | `[preview]="true"` + `pt` names + `(onHide)` focus return |
| Chart or diagram | image + short alt + data in caption or table |
| Before/after | two captioned figures + sentence; `p-imagecompare` on top, named via `pt.slider` |

## Rules
- MUST: set `alt` on every `p-image` — a sentence, or `""` for decoration.
- MUST: with `preview`, name the mask, give `original` its alt, describe the button by the caption, and return focus in `onHide`.
- MUST: name the ImageCompare slider through `pt.slider` and restyle its handle through `dt` for contrast on light and dark pictures.
- MUST: state the before/after difference in text next to an ImageCompare.
- SHOULD: keep text out of pictures.
- NEVER: set `tabindex` or `ariaLabel` on `p-imagecompare`, or rely on the preview to make small print legible.

## Default snippet
```html
<figure>
  <span #zoomHost>
    <p-image [src]="src" [alt]="alt()" [preview]="true"
             [imageStyle]="{ width: '100%', height: 'auto', aspectRatio: '16 / 9' }"
             [pt]="{ mask: { 'aria-label': enlargedName() }, original: { alt: alt() },
                     previewMask: { 'aria-describedby': 'fig-cap' } }"
             (onHide)="restoreFocus(zoomHost)" />
  </span>
  <figcaption id="fig-cap">{{ caption() }}</figcaption>
</figure>
<!-- restoreFocus(h: HTMLElement) { h.querySelector<HTMLButtonElement>('.p-image-preview-mask')?.focus(); } -->
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
