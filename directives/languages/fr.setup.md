<!-- base -->
# lang-fr — French (français) — setup & sources

> **The translation guide itself is [`fr.md`](fr.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Support here is
**strong**: the core authorities were fetched with verbatim quotes.

- **Académie française** — the historical normative body (founded 1635); its self-described
  mission is to give rules to the language and compile its dictionary. Verbatim: *"La principale
  fonction de l'Académie sera de travailler … à donner des règles certaines à notre langue et à
  la rendre pure, éloquente et capable de traiter les arts et les sciences."*
  <https://www.academie-francaise.fr/linstitution/les-missions>
- **Commission d'enrichissement de la langue française / FranceTerme** — the French State
  terminology authority; officially recommended French equivalents of foreign (esp. English)
  technical terms are published in the *Journal officiel* and delivered via FranceTerme. This is
  the anchor for the §6 AI terminology (e.g. the AI vocabulary of December 9, 2018).
  <https://culture.fr/franceterme/terme/INFO948> ·
  <https://culture.fr/franceterme/En-francais-dans-le-texte/Intelligence-artificielle-une-nouvelle-generation-de-termes>
- **Office québécois de la langue française (OQLF) — Vitrine linguistique / *Grand dictionnaire
  terminologique* (GDT)** — the Québec authority; the GDT is heavily used across the whole
  francophone tech-writing world and flags anglicisms as *déconseillé*. Confirms several §6 terms
  and the *faire du sens* anglicism ruling.
  <https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/26552500/apprentissage-automatique>
- **Clés de la rédaction (Government of Canada, nos-langues.canada.ca)** — the federal French
  editorial reference; the source for the §5 date rules (verbatim quotes).
  <https://www.nos-langues.canada.ca/cles-de-la-redaction/date-regles-decriture>
- **The Unicode Standard — Latin ranges.** French letters live in **Basic Latin (U+0000–U+007F)**
  and **Latin-1 Supplement (U+0080–U+00FF)**, except **œ/Œ (U+0153/U+0152)** and **Ÿ (U+0178)** in
  **Latin Extended-A (U+0100–U+017F)**; the signature spaces are **U+202F** (narrow no-break) and
  **U+00A0** (no-break). ⚠ code-point assignments are standard Unicode, **not separately fetched
  by the dossier** — verify against the official chart when it matters. <https://www.unicode.org/charts/>
- **FALC / Unapei** — the French plain-language standard and its maintaining organization (§8).
  <https://falc.unapei.org/quest-ce-que-le-falc/les-regles-du-falc/>

**Widely-used style references (⚠ editorial synthesis).** French digital editors in practice lean
on the *Lexique des règles typographiques en usage à l'Imprimerie nationale* (cited via the
Wikipedia typography articles — *"Lexique des règles typographiques en usage à l'imprimerie
nationale (2002, 6th edition)"*), *Le Bon Usage* (Grevisse), and the online dictionaries
*Le Robert* / *Larousse*. This synthesis is editorial; only the Imprimerie-nationale citation is
sourced (via the Espace-fine-insécable page).

**Provenance caveats (carried honestly from the dossier).**
- **403-blocked, rerouted:** **education.gouv.fr** (the primary *Journal officiel* AI-vocabulary
  page) returned **403 Forbidden** — worked around via **culture.fr/franceterme**.
  **dictionnaire.lerobert.com** (guillemets/punctuation page) also returned **403** — worked
  around via **fr.wikipedia (Guillemet)**. So the §3 typography rules rest on **community-tier
  Wikipedia**, not on Le Robert or the Imprimerie nationale directly.
- **noslangues → nos-langues.canada.ca** was a 301 redirect, not a block (re-fetched successfully).

Sources: <https://www.academie-francaise.fr/linstitution/les-missions> ·
<https://culture.fr/franceterme/terme/INFO948> ·
<https://culture.fr/franceterme/En-francais-dans-le-texte/Intelligence-artificielle-une-nouvelle-generation-de-termes> ·
<https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/26552500/apprentissage-automatique> ·
<https://www.nos-langues.canada.ca/cles-de-la-redaction/date-regles-decriture> ·
<https://www.unicode.org/charts/> · <https://falc.unapei.org/quest-ce-que-le-falc/les-regles-du-falc/>
(education.gouv.fr and dictionnaire.lerobert.com returned 403 and were rerouted as described above —
they are named, not cited as evidence.)

---

## 3. Script & typography

Support here is **community-tier**: the punctuation-spacing and guillemet rules were fetched from
**fr.wikipedia**, because the authoritative Le Robert page was 403-blocked (§2). The rules are
standard and widely taught, but a native-speaker/authority confirmation pass is still pending.

**Character inventory & Unicode range.** French uses the Latin alphabet plus diacritics: acute
(é), grave (à è ù), circumflex (â ê î ô û), tréma/diaeresis (ë ï ü ÿ), and the cedilla (ç). It
also uses the ligature **œ** (*cœur*, *œuvre*) and, rarely, **æ**. Almost everything sits in
**Basic Latin** and **Latin-1 Supplement (U+0080–U+00FF)**; the exceptions are **œ/Œ (U+0153/
U+0152)** and **Ÿ (U+0178)** in **Latin Extended-A**. A web font for French must therefore cover
Latin-1 Supplement *and* those Latin Extended-A code points — a font limited to Basic Latin drops
œ and Ÿ. **Romanization is not applicable** (native Latin script).

**The signature rule — a space *before* high/double punctuation.** French inserts a space *before*
`;`, `:`, `?`, `!` (and inside guillemets), unlike English. The recommended character is the
**narrow no-break space U+202F (NNBSP)**. From fr.wikipedia (Espace fine insécable): *"le code
typographique français recommande une espace fine insécable devant les signes de ponctuation
doubles (point-virgule, point d'interrogation, point d'exclamation — sauf devant deux-points,
en France, selon certaines références typographiques)"* — note the source itself carries the
colon caveat picked up below — and, on the code point,
*"Le caractère du jeu Unicode correspondant à l'espace fine insécable est le U+202F … espace
insécable étroite (abrégé NNBSP)."* The page also records the historical fallback (why old text
often used a plain space or none): *"elle a longtemps été remplacée soit par une espace (en
France), soit par une absence d'espace (au Québec et en Suisse)."*

- ✅ `Vous êtes prêt ?` · `Attention !` · `un point-virgule ; puis la suite` · `le résultat : voici`
  — each with **U+202F** immediately before the mark (and before `:`).
- ❌ `Vous êtes prêt?` / `Attention!` — English-style, no space (a naive pipeline strips it).
- ❌ `Vous êtes prêt ?` with an **ordinary space** — it can wrap the `?` to the next line; the
  whole point of U+202F is that it does **not** break.

**The colon is the classic exception (⚠ contested).** The *Lexique de l'Imprimerie nationale*
tradition puts a **full no-break space U+00A0** before `:` (a wider space than before `; ? !`),
while modern PAO practice tends to use **U+202F everywhere**. **Project recommendation:** for an
ed-tech platform, using **U+202F uniformly before `; : ? !`** and inside « » is defensible and
simplest — but note the traditional distinction. (Source: Espace-fine-insécable + the dossier's
search-summary note; ⚠ the exact colon convention is genuinely disputed between references.)

**Guillemets « ».** French quotation marks are chevrons, separated from the enclosed text by a
no-break space **on the inside**. From fr.wikipedia (Guillemet): *"on sépare les guillemets
typographiques ou français (« ») de l'expression qu'ils mettent en exergue par une espace
insécable."*

**The nested (second-level) pair is “…” — the *guillemets anglais*, “ U+201C and ” U+201D, not the
ASCII `"`.** The dossier said "English double quotes" and this guide previously rendered that as an
ASCII `"`, which demonstrates nothing — ASCII is exactly the flattening the rule warns against. The
same fr.wikipedia page (Guillemet), re-fetched this session, states the level rule; it is hedged,
and the hedge is kept: *"Selon certains typographes, les guillemets anglais (“ ”) peuvent être
employés comme guillemets de second niveau et, en troisième niveau, on peut utiliser des
apostrophes"*. ⚠ **Divergence on record:** the CLDR `fr` locale data, read codepoint-by-codepoint
from the pinned **CLDR 48.2** release this session, gives **no distinct second level at all** —
`alternateQuotationStart` = **« U+00AB**, `alternateQuotationEnd` = **» U+00BB**, identical to the
outer pair. Software left to its defaults will therefore nest chevrons inside chevrons; this guide
prescribes the typographers' “…” and records that the locale data does not back it.

- ✅ `« Bonjour »` — chevrons with an inside **narrow no-break space (U+202F)**, per
  the project recommendation stated just above.
- ❌ `« Bonjour »` — visually identical, but the inside space is an **ordinary U+0020**: it wraps,
  which is the one thing the rule exists to prevent. (This is what the previous revision of this
  guide shipped as its ✅ example — the showcase string violated the guide's own rule.)
- ✅ Nested: `« L’ouvreuse m’a dit : “Donnez-moi votre ticket.” »` (guillemets anglais as the
  inner level — the dossier's own example, with the inner marks written as real codepoints,
  every inside space a U+202F, and the elisions on the typographic apostrophe).
- ❌ Nested flattened to ASCII: `« L’ouvreuse m’a dit : "Donnez-moi votre ticket." »`
- ❌ `"Bonjour"` — English straight quotes standing in for guillemets in body copy.
- ❌ `«Bonjour»` — guillemets with no inside space.

**The apostrophe is typographic — ’ (U+2019), not the ASCII `'` (U+0027).** French elides
constantly (*l’ouvreuse*, *m’a*, *c’est*, *d’IA*), so the apostrophe is one of the most frequent
non-ASCII characters in French display text — and the easiest to lose, because ASCII `'` looks
close enough to pass review. The companion research pass lists the **typographic apostrophe**
among the characters a French web font must cover, alongside Latin Extended characters,
guillemets, and diacritics; an earlier revision of this guide dropped that item from the
font-coverage list and stated no apostrophe rule at all.

- ✅ `l’ouvreuse` · `c’est` · `d’IA`
- ❌ `l'ouvreuse` · `c'est` · `d'IA` — ASCII typewriter apostrophe. Acceptable only as a fallback
  where U+2019 is genuinely unavailable, and in slugs/identifiers; never as shipped display text.

⚠ Scope note: the ASCII apostrophes inside this guide's **verbatim quotations and cited work
titles** are
left exactly as transcribed — the source pages were not re-read at codepoint level for this, and
silently "correcting" a quotation is worse than an inconsistent-looking one.

**The ligature œ is orthography, not decoration.** *cœur*, *œuvre*, *sœur*, *bœuf* are spelled
with **œ**; the split digraph *oe* is a fallback, not the correct display form.

- ✅ `cœur` · `œuvre` · `sœur`
- ❌ `coeur` · `oeuvre` · `soeur` (acceptable only as an ASCII fallback where œ is truly
  unavailable — never as the shipped display text).

**Accented capitals are mandatory in French, not optional.** É À È Ç Û etc. carry their accents
even in all-caps or sentence-initial position; cheap fonts and lazy pipelines drop them.

- ✅ `État` · `À bientôt` · `Ça` · `ÉCOLE`
- ❌ `Etat` · `A bientôt` · `Ca` · `ECOLE`

**Whitespace, line-breaking, hyphenation.** The no-break spaces above are **load-bearing**:
U+202F / U+00A0 must **not** break at end of line — that is their whole purpose (keeping `prêt`
with its `?`, a number with its unit or `€`, or a guillemet with its text). Words are
whitespace-separated, so standard tokenization works. For line-end hyphenation set `lang="fr"`
so the browser applies French syllable-based hyphenation dictionaries (`hyphens: auto`).
⚠ CSS/line-break behavior is general knowledge, **not separately fetched** by the dossier.

**Font coverage note (⚠ editorial).** Because U+202F is a relatively recent typographic default,
older or minimal web fonts may lack a glyph for it (it still functions as whitespace but may fall
back visibly). Verify the shipped font covers **U+202F, U+00A0, « / » (U+00AB/U+00BB), œ/Œ, Ÿ**,
the **typographic apostrophe ’ (U+2019)**, and **all accented capitals (É À Ç …)** — cheap fonts
sometimes omit these. (The apostrophe item is the companion research pass's own font-coverage
list, sourced there to a public-sector "writing in French" web style guide.)

Sources: <https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable> ·
<https://fr.wikipedia.org/wiki/Guillemet> (outer guillemets *and* the second-level “…” rule —
both verbatim, re-fetched this session; the second-level statement is attributed on the page to
"certains typographes", not to an academy) · <https://www.unicode.org/charts/> ·
<https://www.unicode.org/cldr/charts/latest/summary/fr.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (the `fr` delimiter fields were read
codepoint-by-codepoint from the pinned CLDR 48.2 release of the locale data behind that chart;
CLDR declares no distinct second level for `fr`) ·
<https://www2.gov.bc.ca/gov/content/governments/services-for-government/service-experience-digital-delivery/web-content-development-guides/web-style-guide/writing-in-french>
(font coverage incl. the **typographic apostrophe** — the URL the companion research pass cites for
that claim; ⚠ not re-fetched here) ·
(Le Robert punctuation page was **403-blocked** — these rules are community-tier fr.wikipedia,
confirmation pending; ⚠ Unicode code-point assignments and CSS hyphenation not separately fetched)

---

## 10. Technical integration checklist

- **`lang` / `dir` attributes.** `lang="fr"` (base) and `lang="fr-easy"` (simplified variant,
  subject to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and
  per foreign passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA).
- **Fonts to ship.** A web font that covers **Latin-1 Supplement**, **œ/Œ (U+0153/U+0152)**,
  **Ÿ (U+0178)**, **guillemets « » (U+00AB/U+00BB)**, the **narrow no-break space U+202F**, the
  **no-break space U+00A0**, the **typographic apostrophe ’ (U+2019)**, and **all accented capitals
  (É À È Ç Û …)**. **Noto Sans** /
  **Noto Serif** (open, broad Latin coverage) are safe defaults —
  <https://fonts.google.com/noto>. Test that U+202F actually renders as a thin gap (older/minimal
  fonts may fall back), and that œ and accented caps are present (cheap fonts drop them, §3).
- **No-break spaces are load-bearing.** U+202F before `; : ? !`, inside « », and as the thousands
  separator; U+00A0 before `€` and inside date components. Build steps, trimmers, and
  "normalizers" must **not** strip or collapse them to ordinary spaces — that both breaks French
  typography and lets punctuation/prices wrap. (Uniform U+202F before `; : ? !` per the §3
  project recommendation; U+00A0 acceptable before the colon per tradition.)
- **Punctuation autoreplace.** If the pipeline auto-converts quotes, target **« … »** with inside
  no-break spaces, not `"…"`; do not "correct" œ to *oe* or strip accents from capitals.
- **Numbers & currency.** Render per §5: comma decimal, **U+202F** thousands, `€` **after** the
  amount with a no-break space. Keep Western digits (French uses 0–9). Drive concrete formats from
  **live CLDR `fr` data**, not the community-tier values quoted in §5.
- **Dates.** `d MMMM y` → `9 janvier 2026`, lowercase month, no comma, `1er` for the first;
  protect day+month+year from wrapping (§5).
- **Line-breaking / hyphenation.** Set `lang="fr"` for French syllable hyphenation
  (`hyphens: auto`); rely on the no-break spaces above to prevent bad breaks. ⚠ CSS behavior not
  separately fetched.
- **Index alphabet for glossary navigation.** Standard **A–Z** Latin index; accented letters
  (é, è, à, ç, œ) collate with their base letter (e, e, a, c, oe) per French/CLDR `fr` collation
  — do not create separate index buckets for accented forms. ⚠ drive from CLDR `fr` collation
  data rather than a hard-coded list.
- **Tokenization / highlighting.** Whitespace word separation works — standard word tokenizers and
  word-boundary highlighting apply. Watch that a tokenizer does **not** treat U+202F/U+00A0 as a
  word boundary in a way that splits `12,50 €` or `prêt ?`.

Sources: <https://fonts.google.com/noto> · <https://www.unicode.org/charts/> ·
<https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable> ·
<https://www.nos-langues.canada.ca/cles-de-la-redaction/date-regles-decriture> ·
(CSS hyphenation & CLDR `fr` collation ⚠ not separately fetched — confirm against live data)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script ratio.** `fr` content is Latin — the check is not "is it French script" but
  **forbidden-substitute** and **formatting** conformance below. A high ratio of ASCII-only text
  where accents are expected (no é/è/à/ç at all in a long passage) signals **stripped diacritics**.
- **Punctuation-spacing check.** Every `;` `:` `?` `!` in body copy is preceded by **U+202F**
  (project rule; U+00A0 tolerated before `:` per tradition) — flag a bare mark (`prêt?`) or an
  **ordinary breaking space** before it. Inside guillemets, flag `«Bonjour»` (no inside space)
  and `« Bonjour »` written with an ordinary space.
- **Guillemet check.** Direct-speech / term quoting uses **« »**, not `"…"` or `“…”`, in French
  body copy at the **outer** level. The *guillemets anglais* **“…”** (U+201C / U+201D) are correct
  **only** as the nested second level (§3) — and an ASCII `"` is never correct at either level.
- **Forbidden substitutes.**
  - No **oe/OE digraph** standing in for **œ/Œ** in display text (`coeur`, `oeuvre` → defects;
    allowed only in slugs/identifiers).
  - No **unaccented capitals** where French requires the accent (`Etat`, `A bientôt`, `ECOLE`
    → defects).
  - No **ASCII apostrophe** where French elision needs the typographic ’ (U+2019) in display
    copy (`l'ouvreuse`, `c'est` → defects; allowed in slugs/identifiers and inside transcribed
    verbatim quotations, §3).
  - No **English straight/curly quotes** or **English number/date formatting** in French copy.
- **Number/currency formatting.** Decimal is a **comma**; thousands separator is **U+202F**
  (flag `1,234.56` and `1.234,56`); `€` sits **after** the amount with a no-break space
  (flag `€12,50`).
- **Date formatting.** Month lowercase, no comma between month and year, `1er` for the first
  (flag `9 Janvier 2026`, `9 janvier, 2026`, `janvier 9`, `1 mars`).
- **Register consistency (vous, §4).** Scan second-person copy for stray **tu / te / ton / toi**
  and *-es/-e* familiar verb endings — a drift to *tu* against the recorded **vous** default is a
  register defect (unless a child/teen build is decided and recorded as such).
- **False-friend leak scan (EN → FR).** Flag likely calques: **actuellement** (for *actually*),
  **éventuellement** (for *eventually*), **librairie** (for *library*), **sensible** (for
  *sensible*), **faire du sens** (for *make sense*) — each is a §4 trap.
- **Source-language leak scan (EN/DE → FR).** Left-in English function words (the, and, you,
  please), German umlauts/ß, or adjective-before-noun order (`une rouge voiture`) surfacing in
  French sentences.

Sources: <https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable> ·
<https://fr.wikipedia.org/wiki/Guillemet> · <https://localization.guide/country/fr> ·
<https://www.nos-langues.canada.ca/cles-de-la-redaction/date-regles-decriture> ·
<https://fr.wiktionary.org/wiki/Annexe:Faux-amis_anglais-fran%C3%A7ais>

---

*Provenance note:* this guide is built from external desk research on one brief — a main dossier
(research date 2026-07-25), **independently reviewed against its cited sources**, whose verbatim
quotes are trusted and whose own `⚠` markers are carried through unchanged, plus a **companion
pass** (research date 2026-07-24) merged on **2026-07-27**. Everything taken from the companion
pass is weaker evidence and is marked at point of use: the §Header speaker figure, four *list-level* §6
terminology rows, the §3 typographic-apostrophe font-coverage item, and the §8 note that the two
research passes contradict each other on *information / renseignement*. Section support
is uneven and marked per section: **strong** (§2 authorities, §5 dates, §6 terminology, §8 FALC —
verbatim from Académie / FranceTerme / OQLF / Canada.ca / Unapei) vs **community-tier / editorial**
(§3 typography and §9 regional from fr.wikipedia; §4 traps/register from Wiktionnaire/frello/OQLF
with the vous choice itself editorial; §5 number/currency **formatting** from localization.guide,
**not raw CLDR**). Two primary pages were **403-blocked** and
rerouted honestly: **education.gouv.fr** (→ culture.fr/franceterme) and **lerobert.com**
(→ fr.wikipedia). All `⚠` markers indicate claims the dossier could not source or that could not be
confirmed from the §2 authorities. The **vous** register is a **recorded project/editorial
decision (2026-07-24), not an academy ruling**. A native-speaker review against the §2 sources is
still outstanding (see Status in the header).

*Evidence pass (§7 idiom table, 2026-07-27).* The stock-phrase table arrived from the companion pass
with **no per-row citation** and shipped as blanket "research-tier". Every ✅ has now been taken back
to a source and carries a tier — Le Robert, the OQLF *Grand dictionnaire terminologique*, the
Wiktionnaire, French MDN — and the tier decides whether a row may inform a §11 check. Note that
**dictionnaire.lerobert.com was reachable this pass**, unlike the earlier 403 recorded above; the
reroute note stands for the pages it describes, not for Le Robert as a whole. The wrong-calque
column stayed the weak half and is now labeled **craft** rather than implied to be documented:
exactly one row (*faire du sens*) has an authority ruling behind it. Three cells were **removed or
softened** because they condemned correct French — *étape par étape* (ordinary educational French),
*sous le capot* (a Le Robert figurative locution and a Wiktionnaire (Informatique) headword glossing
"under the hood", so the row was **inverted** and both forms now sit in ✅ with the distinction
spelled out), and *depuis zéro* (attested in the same sense). *Règle du pouce* was softened from
error to non-idiomatic calque, since no OQLF *emprunt déconseillé* fiche exists for it.
