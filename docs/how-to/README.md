<!-- base -->
**Deutsch:** [Diese Seite auf Deutsch](../de/how-to/README.md)

# How-to guides

These are **task recipes**: short, goal-oriented instructions for someone who already has the app
running and wants to get one specific thing done. Each guide assumes you know the basics and skips
straight to the steps.

That focus is deliberate. The documentation is split by what you need at the moment:

- **How-to** (this folder) — *"I want to accomplish X."* Practical recipes, no detours.
- **Tutorial** ([`docs/tutorial/`](../tutorial/getting-started.md)) — *"Teach me from scratch."*
  A guided first run that gets the app open in your browser.
- **Explanation** ([`docs/explanation/`](../explanation/the-pack-layer.md)) — *"Help me understand
  why."* The concepts and design decisions behind how the kit is put together.

If you're not sure a guide applies to you, read its first paragraph — each one states its goal up
front.

## Guides

- **[Make the kit your own portal](make-it-yours.md)** — the first step for your own site:
  its name, description, start page and operator in one go, the parts you do not need
  switched off, and the kit's sample content removed with one tool run while the blueprints
  stay. Nothing is committed without you; one command undoes it.
- **[Add a page](add-a-page.md)** — a new routed page: component, route entry, four i18n
  modules, prerender tier, sitemap decision, and the test-allowlist step that fails silently
  when skipped.
- **[Add a source](add-a-source.md)** — a bibliography entry an article can cite: the core
  record, its title, the two registrations (one fails quietly), and the verbatim quote that
  backs each claim.
- **[Add a language](add-a-language.md)** — one more portal language (Italian as the worked
  example): one config entry, the redirect list, placeholder copies of the texts, the one
  hand-written test list, and what stays untranslated at first. Setup measured at about
  10 minutes; translating is the real work.
- **[Use the kit tools](use-the-kit-tools.md)** — the tested helpers that ship with the kit: a
  PDF with a page count, an accessible Word file, an accessibility check of one file or page,
  and screenshots on desktop and phone. One command each, offline, and what the result means.
- **[Deploy the built site](deploy.md)** — produce a production build and put it online, with the
  one hosting requirement a single-page app depends on.
- **[Add a backend (if you need one)](add-a-backend.md)** — decide whether you actually need a
  server, and where the seams are if you do.
