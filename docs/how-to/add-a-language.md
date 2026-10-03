<!-- kit -->
# Add a language to the portal

Goal: the portal speaks one more language, for example Italian. It gets its own address
(`/it/…`), its own entry in the language picker, its own Easy-Language variant, and a green
production build. This is routine work, not a project: nearly everything hangs off one
configuration file. Most of the effort is the translating, and the setup does not have to
wait for it.

**Measured, not guessed.** Before this guide was written, Italian (`it`) was added to a
throwaway copy of the kit and taken all the way to a green `npm run build:prod`. The setup
took about **10 minutes** of wall-clock time. That covers four edited files, 369 copied text
files, two production builds (about 3 minutes each) and one test run. The only surprise was
a test that lists the languages by hand (step 6). Every step below comes from that run.

Worked example throughout: Italian, code `it`, Easy variant `it-easy`. For another language,
swap the code everywhere.

**If you are driving an agent:** say *"Add Italian to the portal, following
docs/how-to/add-a-language.md. Copy the English texts as placeholders for now."* The agent
does steps 1–7. You decide the three questions in step 0 and do the browser check in step 8.

## What a language needs

**Minimum** (the build is green, and the language is reachable and selectable):

- an entry in `src/config/languages.json` (step 1),
- its code in the bare-URL redirect in `src/index.html` (step 2),
- a complete set of UI text files for the language **and** its Easy variant, copied from
  English as placeholders if they are not translated yet (step 3),
- a translation file for every glossary, timeline, tool, resource and source entry, again
  copies are fine at first (step 4),
- the one test that lists the languages by hand, updated (step 6, only with `"seo": true`).

**Complete** (what readers should get in the end):

- every UI text and every content entry really translated, including the Easy-Language
  variant written to that language's own Easy-Language rules,
- the home page's translation notice (step 3) removed or reworded once nothing is English
  any more,
- optional polish: a flag drawing, the date format, a language guide (step 5).

## Switch off what you do not use, first

A new language needs the texts and content of the features your site uses, and nothing of
a feature you have switched off. The kit has ten features you can switch off in
`src/config/site.json`: glossary, timeline, catalog, sources, learn, news, roadmap,
progress, feedback and demos (`"features": { "news": false }`). So decide which of them your
site uses **before** anyone translates. Every feature you switch off first is text nobody
has to translate.

Measured on the kit as shipped (2026-09-28) with `node tools/lang-status.mjs it --json`,
for Italian:

- **Every feature on** (the kit's default): 3,921 UI keys with 63,961 words to translate,
  plus 8,053 words of content (glossary, timeline, tools, resources, sources).
- **Glossary, timeline, catalog, sources, news and roadmap off:** 3,447 UI keys with
  62,634 words, and no content at all.

Most of the words that remain belong to the kit's 15 sample articles (2,311 keys,
53,765 words). Articles are content, not a feature, so they stay on. Leave them out of the
count and the difference is plain: 1,610 keys and 18,249 words with every feature on,
1,136 keys and 8,869 words with those six features off, less than half. The Easy variant
`it-easy` shrinks the same way (content from 5,095 words to none).

The sample articles, glossary terms, sources and learning paths are the kit's showcase, not
your content, and one tool run removes them: [Make the kit your own portal](make-it-yours.md).
Measured on a throwaway copy (2026-09-28, every feature on): after
`node tools/make-it-yours.mjs --remove-samples`, Italian needs 1,504 UI keys with 8,861 words
(it-easy 8,431) and 302 words of content (it-easy 473). So remove the samples and switch off
what you do not use before anyone translates.

What switching off changes for a new language:

- `check-i18n-keys.mjs` does not ask the new language for the texts of a switched-off
  feature. English keeps them, because the feature's code is still there.
- `check-content-coverage.mjs` skips the content collections of a switched-off feature.
- `node tools/lang-status.mjs it` counts only what is on and names the features that are
  off.

Switch a feature back on later, and the build asks for its texts again and names the
missing ones. The dev workshop's texts (`devWorkshop.json`, used only while you develop)
are never needed in a new language: there the workshop shows English.

## 0 · Three decisions first

1. **The code.** Use the two-letter ISO code (`it`, `fr`, `pl`). The Easy variant is always
   `<code>-easy`. Every language has one, because the kit does not support a language
   without it.
2. **Public or beta?** `"seo": true` gives the language prerendered pages, sitemap entries
   and hreflang links, like German and English. `"seo": false` keeps it reachable and
   selectable but marks it as beta and leaves it out of search engines. Choose `false`
   while the texts are still placeholders, and switch to `true` when they are translated.
3. **Where the placeholder text comes from.** English is the source of the UI texts. For
   content (glossary, timeline and so on), German is the kit's most complete tree. Either
   works as a placeholder. Pick the one your translators read best.

## 1 · Register the language (`src/config/languages.json`)

This file is the single source of truth. The app, the language picker, the fallback
chains, the prerender list, the sitemap and hreflang all read it. Add one entry to
`languages`:

```json
{
  "code": "it",
  "easyCode": "it-easy",
  "name": "Italian",
  "nativeName": "Italiano",
  "easyName": "Easy Italian",
  "easyNativeName": "Italiano semplice",
  "flag": "it",
  "hreflang": "it",
  "locale": "it-IT",
  "seo": true,
  "prerenderTier": 1
}
```

The example shows the finished state, as the trial ran it. While the texts are still
placeholders, write `"seo": false` (step 0) and switch to `true` once they are translated.

`prerenderTier` only matters with `"seo": true`. `1` prerenders every page (home, hubs and
articles), `2` home and hubs, `3` home only. The trial used `1`, which gave 90 prerendered
pages instead of 60. Leave `defaultLanguage`, `keySourceLanguage` and
`contentReferenceLanguage` alone unless the new language should become the site default.
The comments at the top of the file explain the three.

## 2 · The bare-URL redirect (`src/index.html`)

A small script in `src/index.html` sends `/glossary` to `/de/glossary`. It runs before the
app loads, so it cannot read `languages.json`, and keeps its own list:

```js
var codes = ['de', 'en', 'it'];
```

Same order as `languages.json`. You do not have to remember this step, because
`check-i18n-keys.mjs` fails the build when the list and the config differ.

## 3 · UI texts: `src/assets/i18n/modules/<code>/` and `<code>-easy/`

Copy the whole English folders:

- `src/assets/i18n/modules/en/` → `src/assets/i18n/modules/it/`
- `src/assets/i18n/modules/en-easy/` → `src/assets/i18n/modules/it-easy/`

That is 69 files each. **Why copy instead of leaving them out:** the app *can* fall back
at runtime (`it` → English, `it-easy` → `it` → English), but the build does not allow it.
`check-i18n-keys.mjs` demands every key of the features that are on in every language,
because a missing key used to reach readers as a raw key or as the wrong language
unnoticed. The texts of switched-off features and `devWorkshop.json` may stay out; copying
everything is simpler and does no harm. A copied English file is
the honest placeholder: the build stays green, and you can see which files are still
English.

**Translate one text right away:** `translationNotice` in `home.json` (both folders). The
home page shows this notice in every language except German and English. Its English text
says *"This notice is not displayed in English …"*, which is wrong under an Italian flag.
The trial used *"La versione italiana è in lavorazione: alcune parti sono ancora in
inglese."* This notice is how the kit tells readers that parts are still untranslated.
While it is up, readers are warned.

Then translate at your own pace. A rough size, measured with every feature on: the site's
own UI is about 10,000 words. The 15 sample articles (`article*.json`) add about 54,000
more.
Those are the kit's sample content, which you will probably replace anyway. A page's Easy
preview lives in `easyLanguage.json`. If a page's preview is missing in any language, the
Easy button disappears on that page for everyone, so keep the file complete.

## 4 · Content: `src/assets/data/translations/<collection>/<code>/`

Glossary, timeline, tools, resources and sources are one core file per entry plus one
translation file per language. Copy the folders of the features that are on (with the
glossary off, `glossary` needs no folder):

| Collection | `it` | `it-easy` | Files each (kit) |
|---|---|---|---|
| `glossary` | copy | copy | 49 |
| `timeline` | copy | copy | 3 |
| `ai-tools` | copy | copy | 2 |
| `ai-resources` | copy | copy | 2 |
| `sources` | copy | **none** | 119 |

**Why every entry needs a file:** without one, an Italian reader would get German text
from the fallback chain. `check-content-coverage.mjs` treats that as a hard error ("wrong
language shipped"), and no override relaxes it. `sources` has no Easy folder by design,
because a title must name the work exactly. An `it-easy` entry that is missing falls back
to `it`, which the same gate counts as Easy-Language backlog. The kit's allowance for that
backlog is 0, so copy the `-easy` folders too. The alternative is raising the allowance on
purpose in the gate's `BASELINE`.

Content is about 8,000 words, mostly the glossary. The build prints a **LOCALE FALLBACK
REPORT** with counts per language. Look at it after every build.

## 5 · Optional polish

- **Flag:** `src/app/services/flags.ts`. Without a drawing, the picker shows a neutral
  badge with the code, which is fine. The trial added a three-band SVG in five lines.
- **Dates and numbers:** `src/app/utils/date-locale.ts` fixes the region for `de` and
  `en`. Other languages format under their bare code (`it` → *15/07/2026*,
  *15 luglio 2026*). Add
  `it: 'it-IT'` only if you need a specific region.
- **Citation style:** the sources page knows German and English citation labels. Every
  other language gets the English style (`src/app/pages/sources/citation-formats.ts`).
- **Language guide:** `directives/languages/<code>.md` plus `<code>.setup.md` holds
  grammar, typography and the Easy-Language rules for translators and agents. The kit
  already ships guides for 33 languages, including `it`. For a language without one,
  follow `directives/language-guide-authoring.md`. Translation quality rules:
  `directives/translation-quality.md`.

## 6 · The one test that lists languages by hand

`src/app/services/meta-seo.service.spec.ts` expects the hreflang list to be exactly
`de, en, x-default`. With a new `"seo": true` language, five of its tests fail, and so
does `build:prod`, because the build runs the test suite. Add the new language to the
expected lists: one extra line per list, and the length check from 3 to 4. With
`"seo": false` the list does not change and nothing needs doing.

## 7 · Build and gates

Run `npm run build:prod`. These gates must stay green, and all run inside it:

- `check-i18n-keys.mjs`: every UI key of the features that are on in every language, plus
  the redirect list from step 2.
- `check-content-coverage.mjs`: no wrong-language content, the Easy-Language backlog
  within its allowance (collections of switched-off features are skipped).
- the curated test suite (`check-test-baseline.mjs`), which is where step 6 shows up.
- `verify-build.js`: every `"seo": true` language actually prerendered ("3/3 SEO
  languages prerendered").

Then confirm `dist/vibecore/browser/.build-manifest.json` says `"passed": true` under
`verification`, and `dist/vibecore/browser/it/home/index.html` exists and starts with
`<html lang="it" …>`.

## 8 · Check in the browser

`npm start`, then open http://localhost:2000/it/home:

- The language picker lists *Italiano* and *Italiano semplice*, and switching works both
  ways.
- The address keeps `/it/` on every page you open, and a bare http://localhost:2000/glossary
  lands on `/it/glossary` once Italian is your stored choice.
- The page language is right. A screen reader should announce Italian: in the browser's
  developer tools, `<html lang="it">`. The Easy variant also uses `lang="it"`, because
  there is no separate code for Easy Italian.
- The translation notice shows on the home page, in Italian.
- The glossary, timeline and one article open without raw keys such as
  `home.hero.subtitle`.
- Turn on Easy-Language on the home page and on an article.

The trial checked the prerendered HTML (the `lang` attribute, the picker entry, the
notice), not a live browser session.

## Easy-Language

Every language has an Easy variant, and the kit expects it to be complete (steps 3 and 4).
At first it can be a copy of the base language, or of English Easy. It becomes real Easy
Italian once someone writes it to the rules in section 8 of the language guide (for Italian,
`directives/languages/it.md` §8). The German and English Easy trees show what the result
looks like.

## Effort, realistically

- **Setup (steps 0–7):** under an hour with an agent, including two production builds. The
  trial needed 10 minutes.
- **Translation:** the real work. The site's UI and the content come to about 18,000
  words with every feature on, and to less than half with the features you do not use
  switched off (see "Switch off what you do not use, first"). The 15 sample articles add
  about 54,000, and you will probably replace them instead. The Easy variant is the same again, only in simpler words.
  Machine translation gets a draft in minutes. A human review of the whole portal is days
  of work, and it can happen in the background while the language is live as beta
  (`"seo": false`) with the notice from step 3.
- **Your own count:** `node tools/lang-status.mjs it` counts the texts and content entries
  still missing for `it` and `it-easy`, and the words left ([Use the kit tools](use-the-kit-tools.md#see-how-far-a-language-is)).

## Where the new language is not covered yet

These are not blockers, but they are worth knowing:

- `check-house-style.mjs` checks German and English text only. Italian text gets no
  house-style check.
- `scripts/check-a11y.mjs` runs its browser audit for `de` and `en` only.
- The home page decides whether to show the translation notice from a fixed list
  (`de`, `de-easy`, `en`, `en-easy` in `src/app/pages/home/home.component.ts`), so the
  notice appears for every added language.
- Placeholder copies are English text marked as Italian (`lang="it"`), so a screen reader
  reads English with Italian pronunciation. That is one more reason to start with
  `"seo": false` and translate soon.

## Right-to-left languages (Arabic, Hebrew, Persian …)

**Not supported today.** The kit sets no `dir` attribute and ships no right-to-left styles,
so every layout stays left-to-right whatever the language is. The steps above would make
Arabic text appear, but it would be laid out wrongly. Supporting it means writing a
`dir="rtl"` writer next to the `lang` writer (`src/app/services/meta-seo.service.ts`) first,
then auditing every `left`/`right` in the component styles. That is a project of its own.
Plan it with the agent as a spec (`specs/`) before promising it to anyone.

Docs and the journal entry travel in the same commit (`base/BOOKKEEPING.md`).
