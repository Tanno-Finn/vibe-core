<!-- kit -->
# Add a source

Goal: a new entry in the bibliography that an article or demo can cite, with the quote that
proves each claim resting on it kept next to the record. Four files change, and two of the
steps fail quietly if you skip them.

Worked example throughout: a made-up paper, id `doe-example-2024`. The author, URL, and quote
below are placeholders that show the shape. They are not a real source, so don't copy them
into content.

## 1 · The core record (`src/assets/data/core/sources/<id>.json`)

Language-neutral facts, one file per source. The id is `<author>-<topic>-<year>`, lowercase,
and the file name must match it.

```json
{
  "id": "doe-example-2024",
  "type": "paper",
  "authors": "Jane Doe, Max Mustermann",
  "year": "2024",
  "publication": "arXiv",
  "url": "https://example.org/abs/2401.00000",
  "doi": "",
  "accessed": "2026-09-23",
  "tags": ["testing", "llm"],
  "evidence": [
    {
      "claim": "Generated tests caught fewer regressions than hand-written ones in the study",
      "quote": "The copied sentence from the paper goes here, word for word.",
      "locator": "Section 5.2"
    }
  ]
}
```

| Field | Rule |
|---|---|
| `type` | `paper`, `book`, `article`, `website` or `other` in today's data. |
| `year` | The year as a **four-digit string**. If the source itself states no date, write `null`. Don't use `"n.d."`: the citation formatter prints "o. J." or "n.d." in the reader's language. |
| `doi` | The bare DOI (`10.xxxx/…`) with no `https://doi.org/` prefix, or `""`. An arXiv preprint always has one: `10.48550/arXiv.<id>`, with the id taken from its `arxiv.org/abs/<id>` URL. |
| `accessed` | The date you read it, `YYYY-MM-DD`. |
| `evidence` | Optional. A list of `{ claim, quote, locator? }`, one entry per claim the content makes on the strength of this source. See step 4. |

The title is not here. It is translated, so it goes in step 2.

## 2 · The title (`src/assets/data/translations/sources/<lang>/<id>.json`)

One file per language, holding only the title:

```json
{ "title": "An example paper about generated tests" }
```

Write `de` and `en`. Other languages fall back through the chain in
`src/config/languages.json`.

## 3 · Register it: `index.json` **and** `references.json`

- Add the id to `src/assets/data/core/sources/index.json`. The content build only reads
  records listed there, so an unlisted file never reaches the site.
- Add `"doe-example-2024": { "book": [], "portal": [] }` to
  `src/assets/data/core/sources/references.json`. **This one fails quietly:** the build fills
  `portal` in from the articles and demos that cite the source, but only for ids that already
  have an entry. Without it you get a `references unknown source` warning, and the source
  never shows up as cited.

Then cite it: add the id to the article's `sourceReferences` in
`src/assets/data/core/articles/<article-id>.json` (or to the demo's entry in
`src/assets/data/core/demos/index.json`).

## 4 · The evidence

[`directives/content-integrity.md`](../../directives/content-integrity.md) asks for the
verbatim sentence behind every claim. `evidence` is where that sentence is kept, so a
reviewer can check it without redoing the research.

- **`claim`**: what the content says, in the content's words.
- **`quote`**: copied from the source, never typed from memory, never translated. A German
  article citing an English paper keeps the English quote.
- **`locator`**: optional. A page, section, figure, or anchor, anything that helps someone
  find the sentence again.

`evidence` is for authors and reviewers only. The content build
(`scripts/build-unified-content.ts`) strips it, so it never reaches the runtime bundles
(`content.<lang>.json`) and no page can show it.

Evidence is **required for new claims.** The records that already existed before this field
have none, and nobody fills them in afterwards without re-reading the source. If you
can't find a sentence that states the claim, the claim is not supported. Soften it or drop
it. Don't write a quote that is merely close enough.

## 5 · Check

```bash
npm run validate:refs    # the record shape: id, year, doi, evidence
npm run content:build    # builds the bundles and fills references.json
```

`validate:refs` fails on a year that is not four digits or `null`, a DOI with a URL prefix, an
`evidence` entry without a `claim` or `quote`, and an unknown key inside an entry. It cannot
tell whether the quote really appears in the source. A reviewer checks that by reading the
source.
