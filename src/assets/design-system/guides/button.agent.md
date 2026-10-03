---
id: button
title: Button
category: library
tags: [action, form, cta]
summary: Trigger an action or submit a form — one primary per view, a verb-first label.
related: [select, selectbutton, toggleswitch, tags-and-chips, toolbar]
covers: [button, ripple]
measured-against: '@openng/optimus-ui@2.0.2'
tabs:
  examples: Playground, then emphasis tiers, icons, icon-only, loading and disabled, the size scale and full-width-on-phone, each beside its markup
  usage: Button or link, one primary per view, verb-first labels, Do/Don't pairs, and the controls to reach for instead
  design: Anatomy, the size scale, the state layers per visual style, emphasis hierarchy, gate-cited contrast, icon placement, and mobile
  development: Inputs, outputs, template slots, CSS custom properties, the pRipple directive, pressed vs popup semantics, accessible-disabled
  i18n: Label keys and length tolerance, Easy-Language wording, and why iconPos is physical rather than logical under RTL
  history: Document changelog, one line per version
---

## When to use
- The user performs an action in place: save, delete, submit, open a dialog, run a demo step.
- You need the one primary call-to-action on a view (filled `p-button`).
- Supporting actions in a toolbar or form row (`severity="secondary" [outlined]="true"`).
- A form submit control — prefer the directive on a native submit button: `<button pButton type="submit">` with `pButtonLabel` content (see Key API).

## When not to use
- Navigating to a route or URL → use `<a routerLink>` / an anchor, not a button with `router.navigate` in the handler.
- Choosing one of a few mutually exclusive options in place → `p-selectbutton`.
- An on/off setting that applies immediately → `p-toggleswitch`; a deferred binary in a form → a checkbox.
- More than one filled primary per view → demote the rest to outlined/text.

## Key API
Import `ButtonModule` from `@openng/optimus-ui/button` (Optimus UI 2.0.2; exposes `<p-button>` plus the `pButton`, `pButtonLabel` and `pButtonIcon` directives).
- **On `<p-button>` only**: `label` (string — bind an i18n key, never hard-code), `icon` (PrimeIcons class, e.g. `pi pi-download`), `iconPos` = `'left' | 'right' | 'top' | 'bottom'` (default left), `ariaLabel` — REQUIRED for icon-only.
- **On the `pButton` directive, `label`/`icon` are `@deprecated` in Optimus** (`openng-optimus-ui-button.d.ts:227,234`) — they still compile and still stamp the spans (`openng-optimus-ui-button.mjs:490,498`), but write them as children instead: `<button pButton><i class="pi pi-check" pButtonIcon></i><span pButtonLabel>Save</span></button>` — the child directives stamp `.p-button-icon`/`.p-button-label`. Bare text inside `pButton` renders but skips the label styling (font-weight 500). `iconPos` is a live, non-deprecated directive input.
- On both: `severity` (`secondary` | `success` | `danger` | …) + `outlined` / `text` (booleans) — the emphasis tiers; `size` (`'small' | 'large'`, omit for default); `loading` (spinner + blocks clicks).
- `disabled` (boolean, `<p-button>`) — non-interactive; on the directive use the native `disabled` attribute.
- **Ripple**: `pRipple` (`RippleModule` / standalone `Ripple` from `@openng/optimus-ui/ripple`; no inputs, no outputs) adds the press ink. `<p-button>` has it built in (`openng-optimus-ui-button.mjs:842`); on `<button pButton>` add `pRipple` yourself. It renders only while the global `ripple` config is on — default `false` (`openng-optimus-ui-config.mjs:78`), the kit sets `ripple: true` in `app.config.ts`.

## Accessibility
- Every button needs an accessible name: visible `label` OR `ariaLabel` (mandatory for icon-only).
- It renders a native `<button>` — never attach a click to a `<div>`/`<span>` (no focus, no Enter/Space, no role).
- Focus: the kit's one ring — `.p-button:focus-visible` draws 2px `--primary-color-fg` at 2px offset (`!important`, over Aura's 1px ring); CONTRAST.MD `focus ring` ≥3.88:1. Never remove it.
- Label contrast: filled, severity, outlined, text/link (kit semantic inks) and contrast buttons meet 4.5:1 in every style × accent × mode (`docs/generated/CONTRAST.MD`, lowest 4.52:1). Touch target ≥ 24×24px — on phones use `styleClass="btn-mobile-full"`.
- Ripple: the `.p-ink` span is `aria-hidden` + `role="presentation"` (`openng-optimus-ui-ripple.mjs:143-144`); it reacts to `mousedown` only (`:77`), never to keyboard activation. Its 0.4s animation is cut to 0.01ms by the kit's global `prefers-reduced-motion` rule in `styles.scss`.

## Pitfalls
- Link-as-button: navigation dressed up as a `p-button` — breaks middle-click, open-in-new-tab, and semantics.
- Two primaries competing on one view — neither reads as primary.
- Vague labels (`OK`, `Submit`, `Yes`) — use verb-first outcomes (`Save changes`, `Delete account`).
- Fixed-width buttons truncating longer translations (German runs longer than English) — let them size to content and wrap.
- Hard-coded colors overriding the kit's button tokens — the ThemeService block forces fill, border, and label with `!important`; retint via the tokens in `ui-styles.ts`. The radius is per visual style, and werkbund pins `border-radius: 0` on non-text buttons.
- `pRipple` makes its host `position: relative; overflow: hidden` (`openng-optimus-ui-ripple.mjs:13-16`) — it clips children that overflow the host.
- Ripple as the only press feedback — keyboard users never see it.
- `danger` used decoratively — reserve it for destructive actions only.

## Sources
- Optimus UI — Button component: https://optimus.openng.org/button/ (fork of the PrimeNG 21 code base)
- Optimus UI — Ripple: https://optimus.openng.org/ripple (bundle `@openng/optimus-ui/ripple`; token `ripple.background` in `@openng/optimus-ui-themes/dist/aura/ripple/index.mjs`)
- WAI-ARIA Authoring Practices — Button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- WCAG 2.2 — Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

## Semantic mapping
Map the intent to props; do not invent new emphasis tiers.

| Intent | Props |
| --- | --- |
| Primary action (one per view) | filled `p-button` (default) + verb-first `label` |
| Secondary action | `severity="secondary"` `[outlined]="true"` |
| Low-emphasis / tertiary action | `[text]="true"` |
| Destructive action | `severity="danger"` (pair with a confirm step) |
| Success confirmation | `severity="success"` |
| Icon-only control | `icon` + `ariaLabel` (required), no `label` |
| Pending / in-flight | `[loading]="true"` |
| Submit a form | `pButton type="submit"` on a native button |
| Press ink on a directive button | `pButton pRipple` |

## Rules
- MUST: give every button an accessible name — a visible `label` or an `ariaLabel`.
- MUST: set `ariaLabel` on icon-only buttons.
- MUST: render a native `<button>` / `pButton`; never wire a click onto a `<div>` or `<span>`.
- MUST: bind `label` to an i18n key; never hard-code visible text.
- SHOULD: write verb-first labels naming the outcome (`Save changes`, not `OK`).
- SHOULD: let the button size to its content so longer translations wrap instead of truncating.
- SHOULD: use `pButtonLabel`/`pButtonIcon` children on the `pButton` directive — its `label`/`icon` inputs still work but are `@deprecated` in Optimus.
- NEVER: render more than one filled primary per view.
- NEVER: use a button for navigation — use `<a routerLink>` instead.
- NEVER: use `severity="danger"` decoratively; reserve it for destructive actions.
- SHOULD: add `pRipple` to a `pButton` that sits beside `<p-button>`s, so press feedback matches.
- NEVER: override the kit's button tokens with hard-coded colors.
- NEVER: rely on the ripple to signal state or success.

## Default snippet
```html
<!-- labels() is a computed() map resolved through the kit's TranslationService -->
<p-button [label]="labels().save" icon="pi pi-check" (onClick)="save()" />

<!-- Directive form: prefer icon/label as children over the deprecated inputs -->
<button pButton type="submit">
  <i class="pi pi-check" pButtonIcon aria-hidden="true"></i>
  <span pButtonLabel>{{ labels().save }}</span>
</button>
```

Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
