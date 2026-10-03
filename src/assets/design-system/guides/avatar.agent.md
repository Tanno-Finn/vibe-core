---
id: avatar
title: Avatar and AvatarGroup
category: library
tags: [people, image, identity, a11y]
summary: A box of initials, an icon, or a portrait on a host with no role — the picture ships without alt text, a name on the bare host is not dependable, and the group is an overlapping row that says nothing about who is in it.
related: [tags-and-chips, badge, skeleton, timeline, a11y-guidelines]
covers: [avatar, avatargroup]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Content kinds, shapes and sizes, a byline, a named standalone avatar, a named group, and a live image-error fallback
  usage: Naming-pattern table and three Do/Don't pairs — initials as name, click handler, overlapping group of people
  design: Aura token chain, corner radius per visual style, computed contrast, image stretching, narrow screens, motion
  development: Inputs and output, the group wrapper, the fallback recipe, SSR, checklist
  i18n: No library strings, why initials do not travel, translated names, RTL overlap
  history: Document changelog
---

## When to use
- A person (author, reviewer, contributor) needs a recognizable mark **next to their name**: bylines, comment heads, timeline entries.
- `p-avatar-group` — a stack of people that means **one fact** ("edited by 7 people"), not a roster.

## When not to use
- The avatar would be the **only** carrier of who someone is → show the name as text.
- A clickable profile → a real `<a>`/`<button>` with the avatar inside; the avatar has no focus, role, or keys.
- Each person in a stack matters (reviewers, speakers) → a list with names, not an overlapping group.
- A generic picture or icon that is not a person → `<img alt>` or an icon; a status dot on a picture → `p-overlaybadge` (badge guide).

## Key API
`AvatarModule` (`@openng/optimus-ui/avatar`), `AvatarGroupModule` (`…/avatargroup`), Optimus UI 2.0.2, standalone.
- Avatar inputs (`openng-optimus-ui-avatar.mjs:89-135`): `label`, `icon` (icon classes; the kit loads `@openng/icons`), `image` (URL), `size` (`'normal'` | `'large'` | `'xlarge'`: 2 · 3 · 4rem), `shape` (`'square'` | `'circle'`), `ariaLabel`, `ariaLabelledBy`, `styleClass` (`@deprecated` — write `class`). Output `onImageError` (the `<img>` error event).
- **Precedence** (`:170-179`): `label` wins over `icon`, `icon` over `image`; `<ng-content>` renders first, always.
- Pass-through sections: `host`, `root`, `label`, `icon`, `image`.
- Group (`openng-optimus-ui-avatargroup.mjs:62`): selectors `p-avatarGroup` / `p-avatar-group` / `p-avatargroup`; inputs `styleClass`, `style`; template is `<ng-content>` only. No count, no overflow logic — the "+N" avatar is yours. Its CSS lives in the avatar sheet.

## Accessibility
- **No role on either host** (`openng-optimus-ui-avatar.mjs:184-189`, `openng-optimus-ui-avatargroup.mjs:62`). A custom element maps to `generic`, which WAI-ARIA 1.2 forbids naming: `ariaLabel` on a bare host is not a dependable name.
- **The image has no `alt`** (`openng-optimus-ui-avatar.mjs:177`): `<img [src] [attr.aria-label]="ariaLabel">`. Without `ariaLabel` it is an unnamed image.
- **The label is plain text**: initials "AE" are read as letters.
- Icon span: no `aria-hidden`, no text alternative.
- Three patterns, nothing else:
  - Name visible beside it → `aria-hidden="true"` on the avatar.
  - Standalone → static `role="img"` + `ariaLabel` with the full name (children become presentational, announced once).
  - Group as one fact → `role="img"` + `[attr.aria-label]` with the sentence on `p-avatar-group`; members presentational.
- Not interactive: no `tabindex`, no key handling. Never `(click)` on `p-avatar`.
- Contrast: label text 8.40:1 light (`#334155` on `#e2e8f0`), 10.44:1 dark, every style — gated (CONTRAST.MD "avatar"). Box vs card 1.23:1 light — informational, not gated; an avatar is not a control.
- No motion: no transition or animation in the sheet.

## Pitfalls
- `label` and `image` both set → only the label shows. The fallback is exactly that: set `label` in `onImageError`.
- No built-in fallback: a broken URL leaves an empty `{content.border.color}` box.
- `.p-avatar img` is `width/height: 100%`, **no `object-fit`**: non-square portraits are squashed. `[pt]="{ image: { style: { 'object-fit': 'cover' } } }"` or crop at the source.
- Group overlap `-0.75rem` (lg `-1rem`, xl `-1.5rem`) covers the end of every avatar but the last; group ring is 2px `{content.background}` (stock `#ffffff` / `#18181b`), visible on the kit page ground.
- Square radius follows the visual style (`{content.border.radius}` → `border.radius.md`: werkbund 0, lernwerkstatt 12px, skizzenbuch 10px, blaupause 2px); `shape="circle"` ignores the style.
- The group never wraps (`display: flex`, no `flex-wrap`): a long group overflows narrow screens.
- `ariaLabel` in the image branch is written twice (host and `<img>`); only `role="img"` on the host makes the name count once.

## Sources
- WAI-ARIA 1.2 `img`: https://www.w3.org/TR/wai-aria-1.2/#img — nameable, children presentational.
- HTML-AAM: https://www.w3.org/TR/html-aam-1.0/ — custom elements map to `generic`, which may not be named.
- WCAG 2.2 SC 1.1.1: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html — text alternative or decorative.
- W3C Images Tutorial, decorative: https://www.w3.org/WAI/tutorials/images/decorative/ — a picture next to its own caption.
- Optimus UI: https://optimus.openng.org/avatar — vendor API, verified against the shipped source (2.0.2).

## Semantic mapping
| Intent | Reach for |
| --- | --- |
| Byline, name visible | `p-avatar aria-hidden="true"` + name text |
| Standalone person mark | `p-avatar role="img" ariaLabel="Full Name"` |
| Profile link | `<a>` containing hidden avatar + name |
| "N people did X" | `p-avatar-group role="img" [attr.aria-label]` + "+N" avatar |
| Roster | `<ul>` of hidden avatars + names |
| Image failed | `(onImageError)` → set `label` |

## Rules
- MUST: hide the avatar when the name is visible text, or give it `role="img"` and the full name.
- MUST: put an interactive avatar inside a native link or button.
- MUST: handle `onImageError` with a label fallback on every image avatar.
- MUST: use synthetic portraits and names in examples (PRIV-001).
- SHOULD: crop portraits square, or set `object-fit: cover` through `pt`.
- SHOULD: cap a group's visible members and end with a "+N" avatar.
- NEVER: rely on `ariaLabel` alone on a host without a role.
- NEVER: let initials be the accessible name.

## Default snippet
```html
<p class="byline">
  <p-avatar [image]="author.photo" [label]="failed() ? author.initials : undefined"
            shape="circle" aria-hidden="true" (onImageError)="failed.set(true)" />
  <span>{{ author.name }}</span>
</p>

<p-avatar-group role="img" [attr.aria-label]="editedBy()">
  @for (p of shown(); track p.id) { <p-avatar [label]="p.initials" shape="circle" /> }
  <p-avatar [label]="'+' + more()" shape="circle" />
</p-avatar-group>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
