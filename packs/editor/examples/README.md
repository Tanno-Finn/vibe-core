<!-- pack -->
**Deutsch:** [Diese Seite auf Deutsch](README.de.md)

# `editor` pack — worked examples

Each of the six editor jobs was **run once** on the same input —
[`_input-wasserkreislauf.md`](./_input-wasserkreislauf.md): the fictional school-science text on
the water cycle that the teacher pack also uses, plus the two sources an author might bring with
them. The artifacts below are the **actual output** each job produces, so a reviewer (or an
author deciding whether to use the pack) can see the real thing rather than a promise.

Because these are six links of one chain, they build on each other: the draft's claim list is
what the source map wires, the map's gaps are what the pre-flight reports as open.

| Job | Output | Path |
|---|---|---|
| `article-draft` | Entwurf in didaktischer Anatomie + Aussagen-Liste A1–A7 | [`wasserkreislauf.entwurf.md`](./wasserkreislauf.entwurf.md) |
| `glossary-entry` | Glossar-Eintrag „Kondensation“ + Leichte-Sprache-Fassung + Paritätszeile | [`glossar-kondensation.md`](./glossar-kondensation.md) |
| `source-wiring` | Quellenkarte A1–A7 + generische Quellen-Datensätze | [`wasserkreislauf.quellenkarte.md`](./wasserkreislauf.quellenkarte.md) |
| `style-pass` | Vier Befunde im Feedback-File-Format + Protokoll-Tabelle | [`wasserkreislauf.review.md`](./wasserkreislauf.review.md) |
| `variants-brief` | de-easy-Adaption mit Paritätstabelle + Übersetzungs-Brief mit Term-Sheet | [`wasserkreislauf.varianten.md`](./wasserkreislauf.varianten.md) |
| `release-check` | Pre-Flight mit neun Punkten + News-Entwurf (ohne Entwurfsstempel — Report, kein Inhalt) | [`wasserkreislauf.preflight.md`](./wasserkreislauf.preflight.md) |

## What the examples deliberately show

**Two real sources, and honest gaps everywhere else.** The two quoted sentences come from pages
that were fetched and read on 2026-09-05 — the U.S. Geological Survey's Water Science School and
NASA's Precipitation Education page, both quoted verbatim, both with the access date as the only
reliable dating because neither page carries one. Everything the two sentences do *not* carry
(A5, A6, A7 — the last one split out of a sentence that would otherwise have passed as sourced —
and the general physical definition of condensation) is marked `[Quelle fehlt]` or MISSING with
the candidate that would close it. That is guardrail E1-A in action: the pack would rather
ship a visible hole than an invented citation.

**A red pre-flight.** `wasserkreislauf.preflight.md` says "not ready" on three of nine points.
That is the job working, not the job failing — it reports states, it does not create them. A
pre-flight that always came back green would be worthless.

**A review that does not rewrite.** `wasserkreislauf.review.md` proposes replacements inside
findings and leaves an empty protocol table for the author's decisions. Its findings are *not*
fixed in the draft on purpose — the naming drift between the text ("Rückfluss") and the claim
list ("Abfluss") is still there: the chain is shown with its open loops, the way a real
editorial week looks.

**Scrub note:** the topic and all teaching text are written from scratch — no curriculum, no
textbook passage, no real people, no product names. The two cited sources are genuine and
public; nothing else in these files is presented as evidence. These are demonstrations, not
published content: every artifact still carries its draft stamp, except the two report
artifacts — the review and the pre-flight — which the guardrails exempt by design.
