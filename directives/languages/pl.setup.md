<!-- base -->
# lang-pl — Polish (polski) — setup & sources

> **The translation guide itself is [`pl.md`](pl.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these.

- **Rada Języka Polskiego PAN (RJP)** — the statutory advisory body on the Polish language,
  established under the *Ustawa o języku polskim* (1999-10-07). It is the
  "instytucją opiniodawczo-doradczą w zakresie używania języka polskiego"; "Zadania Rady określa
  Ustawa o języku polskim." Membership is interdisciplinary:
  "Członkami Rady oprócz językoznawców są przedstawiciele innych dyscyplin naukowych, a także
  ludzie kultury, mediów, wojska i oświaty." RJP maintains the consolidated spelling/punctuation
  rules (*"Zasady pisowni i interpunkcji polskiej"*, communiqué 11/25, 2025-11).
  <https://rjp.pan.pl/en/> ·
  <https://rjp.pan.pl/app/uploads/2025/11/2-zalacznik-do-komunikatu-11-25-wersja-jednolita.pdf>
- **Wydawnictwo Naukowe PWN** — the de-facto everyday reference for editors and translators: the
  online *Słownik języka polskiego PWN*, the codified *Zasady pisowni i interpunkcji*, and the
  free **Poradnia Językowa** (expert Q&A).
  <https://sjp.pwn.pl/zasady/Zasady-pisowni-i-interpunkcji;713485.html> ·
  <https://sjp.pwn.pl/poradnia/>
- **The Unicode CLDR — `pl` locale.** Number symbols, date/time formats. Values checked against
  **CLDR 48.2 (2026-03-17)** — the current stable maintenance release (48 = 2025-10-29,
  48.1 = 2026-01-08, 48.2 = 2026-03-17). The chart links are Unicode's version-agnostic *latest*
  permalinks, so they track the current release rather than freezing a version number. (This also
  supersedes the stale "v28" the brief warned about.)
  <https://www.unicode.org/cldr/charts/latest/by_type/numbers.symbols.html> ·
  <https://www.unicode.org/cldr/charts/latest/verify/dates/pl.html> ·
  <https://cldr.unicode.org/downloads/cldr-48>
- **gov.pl / Służba Cywilna — "Prosty język"** — the closest thing to a national digital-content
  house style, used across the Polish public sector; the anchor for §8.
  <https://www.gov.pl/web/sluzbacywilna/prosty-jezyk>
- **Pracownia Prostej Polszczyzny (Uniwersytet Wrocławski)** — the plain-language research unit
  and the only body in Poland that certifies plain language; the link to **ISO 24495-1** (§8).
  <https://prostapolszczyzna.uwr.edu.pl/>

**Non-primary / weak-provenance sources** the research also leaned on (kept only where a claim is
plausible, and marked at point of use): **Wikipedia** for the alphabet inventory
<https://en.wikipedia.org/wiki/Polish_alphabet>; **freeformatter** for number/date/currency
formatting <https://www.freeformatter.com/poland-standards-code-snippets.html> (corroborates
CLDR); **turing.pl** as an *industry* AI glossary (not an academy)
<https://turing.pl/wiedza/sztuczna-inteligencja/slownik-pojec-ai>; **sektor3-0.pl** for
plain-language word pairs <https://sektor3-0.pl/blog/prosty-jezyk-czyli-jak-pisac-w-zrozumialy-sposob/>;
and **zpe.gov.pl** (the state education portal) for register, aspect, standard-language, and
regionalism rulings <https://zpe.gov.pl/>.

**Provenance caveat.** The idiom dictionary **diki.pl returned HTTP 403** during research, and
**WSJP could not be reached by word** (its search returns HTTP 500), so §7 was re-sourced against
PWN's dictionary and Korpus Języka Polskiego, the Polish Wiktionary, and gov.pl instead; every §7 row
now carries a tier at point of use, and the wrong-calque column stays **craft** except where a
source names the error. The **CLDR currency chart URLs returned 404** (wrong path), so the currency
*symbol placement* is corroborated from the `pl` number-symbols chart + freeformatter, and the
exact CLDR currency *pattern string* is **⚠ not fetched verbatim**. Everything the research itself
labeled *unsourced* is carried below as **⚠**.

Sources: the authority list above *is* this section's source list — every entry carries its own
link at point of use.

---

## 3. Script & typography

**Character inventory & alphabet.** Polish is written in the **Latin script with a 32-letter
alphabet**: "There are 32 letters in the Polish alphabet: 9 vowels and 23 consonants." The
diacritic set is nine letters — **ą ć ę ł ń ó ś ź ż** — formed with three marks:
"the stroke (acute accent or bar) – *kreska*: ⟨ć, ł, ń, ó, ś, ź⟩; the overdot – *kropka*: ⟨ż⟩;
and the tail or *ogonek* – ⟨ą, ę⟩." The letters **q, v, x are non-native**:
"⟨q⟩, ⟨v⟩, and ⟨x⟩ are not used in any native Polish words and are mostly found in foreign words
(such as place names) and commercial names."

**Diacritic integrity (highest data-hygiene risk).** All nine letters exist as **precomposed**
characters in Latin Extended-A/-B (e.g. ł U+0142, ż U+017C, ś U+015B, ą U+0105). **ł/Ł are NOT
`l`+combining and must never be ASCII-folded to `l`; `ó` ≠ `o`.** Some MT/LLM models are known to
silently strip these diacritics — verify output bytes are real UTF-8, not ASCII digraphs. The
canonical test string is the Polish pangram exercising every diacritic:

- ✅ **Zażółć gęślą jaźń** — all nine diacritics intact, real UTF-8 code points.
- ❌ **Zazolc gesla jazn** — ASCII-folded; a silent corruption that changes/breaks words
  (`żółć` ≠ `zolc`).

**Quotation marks.** Primary (first level) is the "German-low / English-high" curly pair
**„ …”** (opening low U+201E, closing high U+201D). Second-level (quote-within-quote) uses
**guillemets pointing inward »…«** (or French «…»): "Cudzysłów francuski ( « » ) lub niemiecki
( » « ) służy do oznaczania cytatów drugiego stopnia, tzn. cytatów w cytatach." Anglo-Saxon
straight/curly `" "` and typewriter `"` should **not** be used as Polish primary quotes;
abandoning the system "zaburzy pewien całościowy system reguł posługiwania się określoną formą
cudzysłowu." *(Provenance note: this PWN cudzysłów ruling is a faithful two-sentence merge from
the same Poradnia page — kept verbatim as merged.)* British single quotes `' '` are reserved for
a narrow philological use — "wyróżniania definicji znaczeniowych wyrazów i połączeń wyrazowych w
publikacjach filologicznych" — which happens to be **idiomatic for UI/glossary term definitions.**

- ✅ Primary: **„tekst”** · nested: **„cytat »w cytacie« dalej”** · term gloss: **'znaczenie'**.
- ❌ **"tekst"** (straight Anglo quotes) or **“tekst”** (English high-high) as Polish primary.

**Whitespace / non-breaking space — a *title* rule, not a blanket ban.** PWN's ruling has two
halves, and the second one is where the obligation actually lives. Verbatim, complete:
> "jednoliterowe spójniki i przyimki (a, i, u, w itd.) **mogą pozostawać na końcu wiersza w tekście
> ciągłym**, natomiast **w tytułach** książek i ich rozdziałów, w tytułach artykułów itp. **zawsze
> powinny być przenoszone** do następnego wiersza."

*(one-letter conjunctions and prepositions — a, i, u, w etc. — **may remain at the end of a line in
running text**, whereas **in titles** of books and their chapters, in article titles and so on they
**must always be carried over** to the next line.)*

So the rule is: **mandatory** in titles and headings, **permitted-but-avoidable** in body copy.
Binding them everywhere with `&nbsp;` is a defensible house style and is what many Polish
typesetters do — but it is **not** the PWN rule, and a checker that treats a line-final *w* in
running prose as an error will flag correct Polish at scale. Implementation (editorial): `&nbsp;`
after single-letter words **in headings, titles, and other display text**; optional polish elsewhere.
**⚠** PWN names **a, i, u, w** followed by *itd.* ("etc."); extending the set to **o** and **z** is
this guide's editorial reading of that *itd.*, not an enumerated PWN list.

- ✅ Heading `Wprowadzenie w&nbsp;nauce` · `Ortografia i&nbsp;pisownia` — in a **title**, the
  one-letter word is bound forward and cannot end the line (PWN: *zawsze powinny być przenoszone*).
- ❌ A **heading** that wraps after a lone **„…w”** or **„…i”**, leaving the noun on the next line.
- ✅ In **running text**, `praca w naukach ścisłych` breaking after *w* is **acceptable Polish** —
  do not treat it as a defect (PWN: *mogą pozostawać na końcu wiersza w tekście ciągłym*).

**Hyphenation / line-breaking.** Words break on syllables; digraphs (cz, sz, rz, ch, dz, dź, dż)
and morphological units stay intact — "Kryterium morfologiczne jest nadrzędne wobec zasady
rozdzielania jednakowych liter i dwuznaków literowych." Set `lang="pl"` so the browser applies
Polish hyphenation dictionaries; `hyphens: auto` then respects these rules.

**Web fonts.** Choose fonts with **full Polish coverage** — the risk letters are ł/Ł, ń, ś/ź/ż,
ą/ę (ogonek), and ó. Many "Latin-subset" web-font builds drop Latin Extended-A and render tofu for
ą ę ł ż. Verify with the pangram `Zażółć gęślą jaźń`; the Google Fonts "Latin Extended" subset
covers Polish — test before shipping.

**Romanization: n/a.** Polish is natively Latin; no transliteration scheme applies.

Sources: <https://en.wikipedia.org/wiki/Polish_alphabet> ·
<https://sjp.pwn.pl/poradnia/haslo/rozne-cudzyslowy;8987.html> ·
<https://sjp.pwn.pl/zasady/204-54-8-inne-uwagi-dotyczace-przenoszenia-wyrazow;629563.html>

---

## 10. Technical integration checklist

- **Fonts to ship.** A font with **full Latin Extended-A/-B coverage** for ą ć ę ł ń ó ś ź ż;
  verify with the pangram **`Zażółć gęślą jaźń`** — reject any build that tofus ł/ż/ń. Google Fonts
  "Latin Extended" subset (incl. Noto families) covers Polish.
  <https://fonts.google.com/>
- **`lang` / `dir` attributes.** `lang="pl"` (base) / `lang="pl-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout — no bidi. Correct `lang` per variant and
  per foreign passage is **WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA)**. `lang="pl"` also triggers
  the browser's Polish hyphenation dictionary (§3).
- **4-way plural is load-bearing.** Wire `{n}` counts through the **CLDR `pl` plural rules
  (one / few / many / other)** — never string-append an ending. "1 punkt / 2 punkty / 5 punktów"
  are three distinct categories (§4).
- **Never interpolate a bare noun into a sentence.** 7-case declension means a nominative UI label
  reused as `{noun}` inside running text is wrong ~5/7 of the time (§4). Prefer full pre-declined
  phrases per grammatical slot, or rephrase so the noun keeps its citation form.
- **Past-tense gender has no neutral form.** For unknown-gender readers, **prefer impersonal
  phrasings** (*Kurs ukończony*) over a gendered past tense (§4). Do not ship one gender silently.
- **Non-breaking space after one-letter words — mandatory in titles, advisory in body copy.** In
  **headings, titles, and display text** insert `&nbsp;` after **a, i, u, w** (and, editorially,
  **o, z**) so they cannot end a line — PWN requires the carry-over there. In **running text** PWN
  explicitly **permits** a line-final one-letter word, so binding it is optional house style, not a
  correctness requirement (§3). A build step / sanitizer must not strip the NBSPs that are set.
- **Diacritic integrity in the pipeline.** Byte-check that ą ć ę ł ń ó ś ź ż survive every
  transform — some MT/LLM passes ASCII-fold them (§3, §11). A normalization/"sanitizer" step must
  not fold ł→l or ó→o.
- **Quotation style.** Use **„…”** primary, **»…«** nested, **'…'** for term-definition glosses —
  not Anglo `"…"` (§3). If a CMS auto-"smart-quotes" to English curly quotes, override it.
- **Tokenization / highlighting.** Whitespace word separation works — standard word tokenizers and
  word-boundary highlighting apply. Line-breaking: rely on `hyphens: auto` with `lang="pl"`
  (morphology-aware, digraphs intact — §3); do not hand-insert hyphens.
- **Index alphabet for glossary navigation.** Use **Polish collation** (a ą b c ć d e ę … l ł m n ń
  o ó … s ś … z ź ż), where ą/ć/ę/ł/ń/ó/ś/ź/ż sort **after** their base letters — drive it from
  **CLDR `pl` collation data**, not a plain A–Z Latin index.
- **Numbers/dates/currency.** Display per §5 (comma decimal, narrow-space grouping from 5 digits,
  dd.mm.yyyy, genitive month in long dates, `1 234,56 zł` symbol trailing); keep Western digits and
  ISO 8601 for backends/identifiers.

Sources: <https://www.unicode.org/cldr/charts/latest/by_type/numbers.symbols.html> ·
<https://sjp.pwn.pl/zasady/204-54-8-inne-uwagi-dotyczace-przenoszenia-wyrazow;629563.html> ·
<https://fonts.google.com/>

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Diacritic-integrity / ASCII-fold scan.** Flag Polish words that appear in an **ASCII-folded**
  form (e.g. `zazolc`, `slowo`, `wiecej`, `bedzie`) where the correct word carries ą ć ę ł ń ó ś ź ż
  — this is the highest-frequency silent corruption (§3). Byte-check that stored text is real UTF-8,
  not digraphs.
- **Forbidden / suspicious characters.** No stray **q, v, x** inside native Polish words (allowed
  only in foreign names/brands, §3). No English straight/curly quotes `" "`/`“ ”` as Polish primary
  quotes — expect **„…”** (§3).
- **Plural-category check.** Grouped counts use the **4-way `pl` plural** (one/few/many/other):
  spot-check `1 punkt` / `2 punkty` / `5 punktów`; flag `2 punkt`, `5 punkty`, or a hard-coded
  "1 punkt(y)" (§4).
- **Bare-noun interpolation scan.** Flag UI strings where a nominative `{noun}` label is dropped
  into a sentence context that needs an oblique case (§4, §10) — a leading cause of ungrammatical
  Polish.
- **Gendered past-tense scan.** In second-person copy, flag a **gendered past form assumed for an
  unknown reader** (*Ukończyłeś/Ukończyłaś*) where an impersonal form (*Kurs ukończony*) is wanted
  (§4).
- **Register consistency.** The recorded register is **ty** (§4): scan for stray **Pan/Pani/Państwo
  + 3rd-person verb** address that drifted in, and for the rude **Pan/Pani + 2nd-person verb**
  mismatch — flag any Pan/Pani register appearing on a `ty` screen.
- **Number / date / currency format.** Decimal `,` and narrow-space grouping (from 5 digits);
  dd.mm.yyyy short dates; genitive month in long dates; **`1 234,56 zł`** (symbol trailing) — flag
  English `1,234.56` or `$`/`zł`-first forms (§5).
- **Non-breaking-space check — scope it to titles.** Flag one-letter words **a/i/u/w** (editorially
  also **o/z**) that end a rendered line without an `&nbsp;` **in a heading, title, or other display
  string** — there PWN mandates the carry-over. **Do *not* flag them in running body copy:** PWN
  explicitly permits a line-final one-letter word in *tekst ciągły*, so a blanket check reports
  correct Polish as an error (§3, §10). If the project adopts bind-everywhere as house style, run
  the body-copy half as an **advisory**, never as a defect.
- **Source-language leak scan (EN/DE → PL).** Left-in English function words (the, and, you,
  please), German umlauts/ß, or English SVO/"of"-chain calques (glued nominal stacks where a
  genitive chain is wanted, §4) surfacing in Polish sentences.

Sources: <https://en.wikipedia.org/wiki/Polish_alphabet> ·
<https://www.unicode.org/cldr/charts/latest/by_type/numbers.symbols.html> ·
<https://sjp.pwn.pl/poradnia/haslo/rozne-cudzyslowy;8987.html>

---

*Provenance note:* this guide is built solely from an **external desk-research pass** (self-fetched,
quote-per-claim, then independently reviewed against the cited sources). The idiom
dictionary **diki.pl returned HTTP 403** and the **CLDR currency chart URLs 404'd**, so those
points rest on search summaries / corroborating sources and are marked at point of use. CLDR values
use the current stable **48 / 48.1** (the brief's stale "v28" was corrected). All **⚠** markers
indicate claims the research itself could not source verbatim, or that could not be confirmed from
the primary authorities in §2 (notably: the
word-order-flexibility secondary source, the exact CLDR plural rule text and currency pattern
string, five AI terms + hallucination/fine-tuning/inference/embedding/token, eight plain-language
pairs, and the dialekt/gwara distinction). A native-speaker review
against the §2 sources is still outstanding (see Status in the header).

*Evidence pass (§7 idiom table, 2026-07-27).* The stock-phrase table arrived with no per-row
citation and shipped under a blanket "mostly unsourced" hedge. Every ✅ has now been taken back to a
source and carries a tier — PWN dictionary/corpus, Polish Wiktionary, the University of Warsaw
neologism observatory, gov.pl — and the tier decides whether a row may inform a §11 check. The
wrong-calque column stayed the weak half and is now labeled **craft** rather than implied to be
documented: only three cells (rows 2, 5, 9) have real support. Three cells were **removed** because
they condemned correct Polish or taught the wrong lesson — *krok za krokiem* (48 corpus hits, a
different idiom, not a calque), *na jeden spojrzenie* (its defect is neuter gender agreement, not
calquing), and *w prostym języku* (gov.pl's own plain-language guidance uses it; the row is now a
grammatical **slot rule**, instrumental with a verb vs locative of the artifact). Two more were
reworded from error to register (*reguła kciuka*, *z pudełka*).

*Correction pass (one-letter words + §1/§7 merge, 2026-07-27).* Three things changed. (1) The
**§3 one-letter-word rule was inverted** in the previous revision: it quoted PWN from *"w tytułach
książek…"* onward and concluded that Polish typography **forbids** a line-final *a/i/o/u/w/z*, then
hardened that into a §10 instruction and a §11 check that would flag valid running copy. PWN's
sentence in full **permits** them *w tekście ciągłym* and mandates the carry-over **only in
titles**; §3, §10, and §11 now say so, and the §11 check is scoped to headings/display text with the
body-copy half downgraded to advisory. (2) The header's claim that the research supplied **no
speaker count** was false — a second research dossier opened with a cited 37–46 M range, now
carried. (3) §7 shipped a general ESL proverb list ("raining cats and dogs", "when pigs fly") where
the authoring brief asks for stock phrases of educational/technical writing; the on-domain table
from that same second dossier replaced it, with its "mostly unsourced" hedge inherited and the two
search-summary-sourced proverbs retained.
