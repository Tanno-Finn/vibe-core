<!-- base -->
# Use the kit tools

Your goal: turn a handout into a PDF or a Word file, check it for accessibility problems, take
screenshots of a page, pack a page into one file for e-mail or Moodle, or get the website onto a
school server, with the small tested helpers that ship with the kit. You do not need to
program. Each tool is one command, and your AI agent normally runs it for you. This page is for
when you want to run one yourself or understand what the agent did.

## What you need

- The kit installed once with `npm install` (see [Getting started](../tutorial/getting-started.md)).
  That also downloads the browser the tools use in the background; no window opens.
- A terminal in the project folder. On Windows use **PowerShell**. Git Bash changes arguments that
  start with `/`, which breaks `--route`.

Every tool works **offline** and only reads and writes files **inside the project folder**. It
never overwrites a file unless you add `--force`, and it never uploads anything.

If a tool says something is missing on this computer, run the check-up:

```powershell
node tools/doctor.mjs
```

It checks Node, the installed packages, the browser and write access, one line each, and says in
one sentence how to fix whatever is missing.

## See which tools there are

```powershell
npm run tools
```

This lists every tool with one line on what it does. Every tool explains itself:

```powershell
node tools/pdf.mjs --help
```

## Make a PDF of a handout and check it fits

```powershell
node tools/pdf.mjs out/teacher/worksheet.html --max-pages 1
```

The PDF lands next to the HTML file (`out/teacher/worksheet.pdf`). The tool says how many pages it
has. With `--max-pages 1` it reports a problem when the sheet runs onto a second page. It also
warns when a table or an image is too wide for the paper. Add `--bw-check` if the sheet will be
copied in black and white. It then lists coloured text and backgrounds that may turn into grey.

## Make a Word file that screen readers can use

```powershell
node tools/docx.mjs out/teacher/worksheet.html
```

This writes `out/teacher/worksheet.docx` with real headings, lists and tables, and with the
document language set, so a screen reader announces the structure and reads the text in the right
voice. The language comes from the HTML file (`<html lang="de">`). For a Markdown file, name it:
`--lang de`. A paragraph in another language (for example `<p lang="it">`) is marked as that
language. Images are not copied yet: the Word file shows their description in brackets, like
`[Bild: Wasserkreislauf]`.

Arabic, Persian, Hebrew and other right-to-left languages come out right to left: paragraphs,
tables and the page are mirrored. The tool sees this from the language (`<html lang="ar">`) or
from `dir="rtl"`.

## Translate a document into other languages

Ask the agent: *"Translate this worksheet into Turkish and Arabic"* (the `/translate` skill).
You get one HTML, PDF and Word file per language next to the original, each marked as an
unchecked draft. The agent checks the language marking, the layout and the page count with the
tools above. Whether the translation is right, only someone who speaks the language can tell:
have each version read before it goes out.

## Check a page for accessibility problems

```powershell
node tools/a11y.mjs out/teacher/learning-page.html
```

The page is checked in light and dark mode, by the same accessibility rules the kit uses for its
own website. If your page changes when someone clicks a button (showing answers, switching to Easy
Language), add one `--click` per button so that state is checked too:

```powershell
node tools/a11y.mjs out/teacher/learning-page.html --click "#show-answers"
```

`--tab-order 10` also lists the first ten stops a keyboard user reaches with the Tab key.

To check a page of the portal itself, build the site once (`npm run build:prod`) and name the page:

```powershell
node tools/a11y.mjs --route /de/demos
```

## Take screenshots

```powershell
node tools/shot.mjs out/teacher/learning-page.html --scheme both
```

You get pictures for a computer screen and a phone, in light and dark mode. They are saved in
`out/tools/shot/`, a folder that is not saved in git, never next to your material. The
tool prints where each picture is. For a portal page use `--route /de/home`, as above.

## Check how easy a text is to read

```powershell
node tools/reading-level.mjs out/teacher/learning-page.html --easy
```

For each section you get the number of sentences, how many words a sentence has on average and
at most, and a readability score (LIX: under 30 is very easy, above 60 very hard). Sentences that
are too long are listed: over 15 words with `--easy`, over 25 without. For German Easy Language it
also lists long words without a middle dot, such as *Wasserkreislauf* instead of
*Wasser·kreislauf*. This is advice. Numbers cannot prove that a text is easy. Only people from
your audience can tell you that.

The texts of the portal's own pages work too: `--i18n home --lang de-easy` checks the Easy German
texts of the home page.

## See how far a language is

Before you decide to add a language to the portal (for example Italian), count what it takes:

```powershell
node tools/lang-status.mjs it
```

You get the number of interface texts and content entries (glossary, timeline, sources …) that
already exist in that language, those that are still a copy of the source text, and the number of
words left to translate, for the language and its Easy variant. It also says whether the language
is set up yet. The steps to add one are in [Add a language](add-a-language.md).

## Start a new page of the portal

A new page of the website needs more than the page itself: its texts in every language, a test,
an entry in the menu. `new-page` sets all of that up the way the kit expects it. Your agent first
writes a small file with the title and a one-sentence description in every language, Easy
Language included, then runs:

```powershell
node tools/new-page.mjs water-cycle --kind page --strings tmp/water-cycle.json
```

For an interactive demo use `--kind demo`. The tool creates the files and prints two short pieces
of code that go into the route lists by hand. Add `--dry-run` to see the plan without changing
anything. The full recipe is in [Add a page](add-a-page.md).

## Make the kit your own portal

The kit arrives as a showcase: its own name, sample articles, a glossary about AI agents.
`make-it-yours` turns it into your site. Without options it only tells you where you stand
and what to do next:

```powershell
node tools/make-it-yours.mjs
```

With `--site answers.json` it writes your site's name, description, start page, the parts
you switch off and your imprint details. With `--remove-samples` it deletes the kit's sample
content and keeps the blueprints your agent builds on. Both accept `--dry-run`, and nothing
is committed without you. The steps and what to answer are in
[Make the kit your own portal](make-it-yours.md).

## Send one page by e-mail or put it on Moodle

A learning page often uses a stylesheet, pictures or a font from files next to it. Sent on its
own, it loses them. `bundle` packs everything into one file:

```powershell
node tools/bundle.mjs out/teacher/learning-page.html
```

You get `out/teacher/learning-page.single.html`, which works on its own. The tool lists anything
it could not pack in, for example a picture from the internet or a link to another page. In
**Moodle**, add the file as a **File** resource, not as a **Page**: a Moodle page removes the
buttons and quizzes that make the page interactive. Above 10 MB the tool warns you, because many
mail systems refuse such a file.

## Look at the website the way learners get it

`npm start` shows the website while you work on it. The finished website is what learners get.
Build it once, then look at it:

```powershell
npm run build:prod
node tools/preview.mjs
```

The tool prints an address such as `http://127.0.0.1:2100/`. Open it in your browser. It works
only on this computer. Press **Ctrl+C** to stop it.

## Put the website on a school server

```powershell
node tools/export-site.mjs
```

This packs the built website into one zip file in `out/site/` and writes `SERVER-SETUP.md` next
to it, in German and English, for whoever runs the school server: where the files go, and the one
rule the server needs so that every page opens. If the server is an Apache server, add `--apache`
and that rule is already in the zip. The tool refuses a website that did not pass the build's
checks. Run `npm run build:prod` again in that case. Uploading the zip is your step: the kit never
puts anything online by itself. Today the website must go into the main folder of the server
(the "web root"), not into a subfolder.

## What the result tells you

Each tool ends with an exit code. Your agent reads it; you see it as the last message:

| Code | Meaning | What to do |
|---|---|---|
| 0 | Done, nothing blocking. | Look at the result. |
| 1 | The check found a problem (too many pages, an accessibility rule broken). | Fix it and run the tool again. |
| 2 | The command was not right (file not found, file outside the project, the output exists). | Read the message; add `--force` to replace a file. |
| 3 | Something is missing on this computer (the browser, the built site). | The message says how to fix it in one sentence. |

Every tool also ends with **"Not checked"**: things a machine cannot judge, such as whether an
image description makes sense or whether Easy Language is really easy. Those stay your call, or
the call of someone from your audience.

The full reference for agents, with every option, is [`tools/README.md`](../../tools/README.md).
