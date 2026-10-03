<!-- kit -->
**Deutsch:** [Diese Seite auf Deutsch](../de/how-to/make-it-yours.md)

# Make the kit your own portal

Goal: the kit stops being the kit's showcase and becomes your portal. It carries your name
and a short description of what it is about. It names you as the operator in the imprint.
It opens on the page you choose and shows only the parts you use. And the kit's sample
content is gone, so you, your agent and any translator only deal with what is really yours.
One tool does all of it in three commands. Nothing is committed without you, and every step
can be undone.

**If you are driving an agent:** say *"Make this kit my own portal, following
docs/how-to/make-it-yours.md."* The agent asks you for the name, the description in every
language, the start page, the parts you do not need and your imprint details, then runs the
commands below. You look at the result in the browser and decide whether to keep it.

## What stays: the blueprints

The kit ships two kinds of content. **Samples** are there to look at: 15 articles, 44
glossary terms, 119 sources and 5 learning paths about working with AI agents. They go.
**Blueprints** show how each kind of page is built: the seed article, the example demo, five
glossary terms, three timeline events, two learning paths, one source, one tool and one
resource, all named `seed-…` or `example-…`. They stay, because your agent copies them when
it writes your own content. They also keep every "this list must not be empty" check of the
build green. While a part of the site is switched on, its blueprints are visible there, so
replace or reword them before you go live.

## 1 · See where you stand

```powershell
node tools/make-it-yours.mjs
```

This only reads. It tells you, in plain sentences:

- the site's name and start page, and which parts are on or off,
- how much sample content is left,
- which imprint details are still placeholders (a build for a real web address refuses to
  run while they are there),
- how many texts a new language would need to translate, and
- the next step.

## 2 · Name, description, start page, parts, operator

Your agent writes your answers into a small file inside the project, for example
`tmp/answers.json`:

```json
{
  "name": "Mathe mit Frau Schulz",
  "shortName": "Mathe",
  "logoIcon": "pi pi-calculator",
  "startPage": "home",
  "features": { "news": false, "roadmap": false },
  "operator": {
    "name": "Anna Schulz",
    "address": "Schulstraße 1, 12345 Musterstadt, Germany",
    "email": "anna.schulz@example.org"
  },
  "description": {
    "de": "Übungen und Erklärungen für den Matheunterricht der 7b.",
    "de-easy": "Hier übst du Mathe. Für die Klasse 7b.",
    "en": "Exercises and explanations for class 7b's math lessons.",
    "en-easy": "Here you practice math. For class 7b."
  }
}
```

Then it looks at the plan and writes it:

```powershell
node tools/make-it-yours.mjs --site tmp/answers.json --dry-run
node tools/make-it-yours.mjs --site tmp/answers.json
```

What each answer does:

- **`name`** appears in the header, the footer, every page title, the printout and search
  results. `shortName` is an optional shorter name for the header logo: when you set it, the
  header shows it instead of `name` on every screen size, while the footer, page titles and
  search results keep `name`. `logoIcon` is an optional
  [PrimeIcons](https://primeng.org/icons) class for the logo.
- **`description`** is one or two sentences per language, Easy Language included. A new
  name needs one in every language your site has. It is what search engines and link
  previews show.
- **`startPage`** is the page a visitor lands on (`home`, `glossary`, `learn` …). It must be
  a page of the site that is switched on.
- **`features`** switches parts off: `glossary`, `timeline`, `catalog`, `sources`, `learn`,
  `news`, `roadmap`, `progress`, `feedback`, `demos`. A part you do not list stays on.
- **`operator`** is who runs the site, as the imprint and the privacy notice need it (name,
  postal address, e-mail, and `supervisoryAuthority` with the data-protection authority's
  name, address and website). Fields you leave out keep their current value.

The tool writes `src/config/site.json` and the description of every language. When you
give a name or a description, it also updates the two files that are read before the site
starts: the page title and link-preview tags in `src/index.html`, and the title of the
preview image `src/assets/images/og-image.svg`. Answers with only your operator details
leave those two files alone. A wrong answer (an unknown part, a start page that does
not exist or is switched off, a missing language) stops it before it writes anything, and
it says what to fix.

## 3 · Remove the sample content

This step deletes hundreds of files, so it needs **git** as a safety net. It refuses to run
while your folder has changes git has not saved yet. Commit those first, so the removal
stands alone and one command undoes it.

```powershell
node tools/make-it-yours.mjs --remove-samples --dry-run
node tools/make-it-yours.mjs --remove-samples
```

The dry run lists everything that would go and changes nothing. Before the real run
deletes anything, the tool checks three things:

- the text check (`node scripts/check-i18n-keys.mjs`) is green,
- the list of samples (`src/config/samples.json`) still matches the files, and
- nothing that stays (a blueprint, a page, a menu text) still points to a sample.

If one of them fails, it says what is wrong and changes nothing. If writing fails halfway,
it puts every file back.

It then deletes the sample articles, glossary terms, sources and learning paths, in every
language folder, a half-finished extra language included. It also removes their routes,
their index entries, the interface texts only they used, and their Easy-Language previews.
Measured on a throwaway copy of the kit (2026-09-28): **667 files deleted, 20 edited**.
The interface texts per language went from 3,863 to 1,476. For a new language like
Italian, `node tools/lang-status.mjs it` counted 1,504 interface texts with 8,861 words
to translate instead of 3,921 texts with 63,961 words, and 302 words of content instead
of 8,053. Run the tool a second time and it finds nothing left to remove.

## Save it, or undo it

The tool never commits. Look at the site first (`npm start`), then save the removal as one
commit, with the lines the tool printed:

```powershell
git add -u -- src/app src/assets src/config
git diff --cached --name-only
git commit -m "chore(content): remove the kit's sample content"
```

To undo it after the commit: `git revert HEAD`. Your agent can do this for you.

## Then: your own content, your own language

- **Your own content:** ask your agent for an article, a glossary entry or a timeline event
  (`/new-content`). It builds on the blueprints. Give your own articles an id that does not
  start with `art-` while the kit's samples are still there, or list them under
  `notSamples` in `src/config/samples.json`.
- **Another language:** [Add a language](add-a-language.md). Switch off the parts you do not
  need and remove the samples first, because then only a fraction of the texts is left to
  translate.
- **Before you go live:** the imprint still needs your site's subject ("[Thema der
  Website]") in `src/assets/i18n/modules/<language>/impressum.json`, and the preview picture
  `src/assets/images/og-image.png` is made from the SVG with `node scripts/render-og.mjs`.
  Then follow [Deploy the built site](deploy.md).
- **Statements about how you work:** the accessibility statement and the Easy-Language notice
  say that a person has read the texts, in Easy Language and the German and English versions
  ("ein Mensch hat sie durchgelesen", "Ein Mensch liest die Texte danach durch", "a person
  has read them through", "A person reads the texts afterwards"), and that there is no
  editorial review. That is how the kit's demo works, not necessarily how you work. Keep
  these sentences only if they are true for your site; otherwise rewrite them in
  `src/assets/i18n/modules/<language>/accessibility.json` (`limitLanguageText`,
  `limitTranslationsText`) and `easyLanguage.json` (`dialog.fullPortalNotice`).
  `node scripts/check-imprint.mjs` lists each one that is still in the kit's wording, and
  stronger claims of the same kind too, which promise an editorial review ("redaktionell
  begleitet", "Menschen prüfen die Texte", "reviewed editorially", "People check the
  texts"); it only points, it never stops a build.

## What the tool does not check

Whether your texts fit your site, whether your imprint is legally complete (only that no kit
placeholder is left), and whether every page still renders. For that, run
`npm run build:prod`. Components that only the sample articles used stay in the project.
They are unused and do not end up in the website.
