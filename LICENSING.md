**Deutsch:** [Diese Seite auf Deutsch](docs/de/LICENSING.md)

# Licensing

This project is dual-licensed: the code and the content it ships carry different
licenses, because they are different kinds of work.

## Source code — MIT

All source code — the Angular application, the build and tooling scripts, the agent
skills and hooks, and the configuration — is licensed under the **MIT License**. See
[`LICENSE`](LICENSE). In short: use it, modify it, ship it, commercially or not, as long
as you keep the copyright notice.

## Content, documentation & prose — CC BY 4.0

The written content — documentation under `docs/`, the directives and standards, any
example articles, glossary entries, or educational text that ships with the kit — is
licensed under the **Creative Commons Attribution 4.0 International** license
(**CC BY 4.0**): <https://creativecommons.org/licenses/by/4.0/>. In short: reuse and
adapt it, including commercially, as long as you credit the source, link the license,
and say if you changed anything. There is no share-alike condition — an adaptation may
be published under whatever terms suit the adapter, as long as the attribution stays
and the incorporated CC BY material is not itself placed under additional restrictions.
See [ADR-0012](docs/adr/0012-content-license-cc-by-not-sa.md) for why.

## Which applies to what

| If it is… | License |
|---|---|
| Code, scripts, config, skills, hooks | MIT |
| Documentation, directives, prose, example educational content | CC BY 4.0 |
| Images, illustrations, icons and other visual assets created for the kit | CC BY 4.0 |
| Content and translation data under `src/assets` (i18n, data) — code-shaped files holding prose | CC BY 4.0 |
| Bundled fonts | SIL Open Font License 1.1 (see [`docs/THIRD-PARTY-FONTS.md`](docs/THIRD-PARTY-FONTS.md); the license text ships with the build as `assets/fonts/LICENSES.txt`) |

When a file's type is ambiguous, the more specific notice in or next to the file wins. If
no notice is present, code-like files are MIT and prose-like files are CC BY 4.0.

### A note on the flag images

The flags next to the language names (`src/app/services/flags.ts`) are simplified SVG
drawings written for the kit, one per `flag` key in `src/config/languages.json` (today
Germany and the United Kingdom). They are original work covered by CC BY 4.0 like every
other visual asset here. A language without a drawing shows a text badge with its code
instead of a flag, so adding a language never pulls in a third-party image. (Until
2026-09 the kit shipped a flag sprite and inline flag icons of unknown origin; both were
removed rather than relicensed.)

### A note on the easy-language pictogram

`src/assets/images/leichte-sprache.svg` and the PNG baked from it are original work of
this project, drawn for the kit and covered by CC BY 4.0 like every other visual asset
here. It deliberately does **not** reproduce the established European easy-to-read
symbol, which is a protected mark held by its owner and licensed only on request — the
kit ships its own book-and-check motif instead, so that a clone carries no third-party
mark it has no license for.

## Third-party dependencies

Dependencies pulled in via `npm` keep their own licenses; this project's licenses cover
only the code and content in this repository, not its dependencies.
