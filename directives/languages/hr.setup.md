<!-- base -->
# lang-hr — Croatian (hrvatski) — setup & sources

> **The translation guide itself is [`hr.md`](hr.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every strong rule below traces back to one of these. Croatian has
a single clear national authority (the Institute), which makes the typography, number, and terminology
sections unusually well-anchored.

- **Institut za hrvatski jezik** (the national language institute, formerly *Institut za hrvatski
  jezik i jezikoslovlje*) — **ihjj.hr**. Publisher of the *Hrvatski pravopis*, host of **Struna**
  (terminology) and of the online school grammar. The umbrella authority behind the three references
  below.
- **Hrvatski pravopis (pravopis.hr)** — the authoritative orthography, free and citable rule-by-rule.
  This guide leans on it for number/spacing rules (page **8.1 „Bjelina”**, `/pravilo/bjelina/54/`) and
  the respectful-address capitalization rule (`/pravilo/rijeci-iz-postovanja-i-pocasti/21/`). It is
  the single most practical reference for digital-content editors.
- **Struna — Hrvatsko strukovno nazivlje (struna.ihjj.hr)** — the official Croatian terminology
  database, run by the Institute. Primary authority for technical/scientific terms (§6). *Served over
  plain **http://** (no TLS) — that is expected for this host, not a red flag.*
- **Hrvatska školska gramatika (gramatika.hr)** — the Institute's online school grammar; used here for
  verbal aspect (§4).

**Style guides for digital content — an honest gap.** No single official Croatian **digital-content /
UX-writing** style guide (equivalent to a government content-design manual) was located this session.
For localization the practical stack is: *Hrvatski pravopis* for orthography + Struna for terminology
+ the EU's Croatian-language interinstitutional conventions for EU-facing text. A dedicated digital
style standard is **⚠ unverified — none found; treat as a gap**, not as "does not exist".

**Source-tier caveat (read before trusting a section).** The **strong** sections — §2 authorities, §3
typography, §5 numbers/currency, and the terminology *policy* of §6 — rest on pravopis.hr, Struna,
gramatika.hr and mfin.gov.hr and carry verbatim quotes. The **thinner** support — the case/word-order
parts of §4, the §6 seed rows without a Struna entry, §7 idioms, §8 plain language, §9 regional
variation — rests on **Wikipedia, Wikibooks, an easy-language advocacy page, and applied-translation
judgment**. Those are carried below because they are the best available, and each is marked at point
of use as **⚠ community-grade / editorial, native-speaker confirmation pending**.

Sources: <https://ihjj.hr/> · <https://pravopis.hr/pravilo/bjelina/54/> ·
<https://pravopis.hr/pravilo/rijeci-iz-postovanja-i-pocasti/21/> · <http://struna.ihjj.hr/> ·
<https://gramatika.hr/pravilo/glagolski-vid/36/>

---

## 3. Script & typography

**(Strong section — Hrvatski pravopis + Institute/encyclopedic sources.)**

**Character inventory.** Croatian is written in the **Latin script — the Gajica alphabet
(*hrvatska latinična abeceda*)**, left-to-right. The alphabet has **30 letters: 27 written with a
single character and 3 written with two characters (the digraphs *dž, lj, nj*)**, each digraph
counting as one letter (hr.wikipedia.org/wiki/Gajica — „Od 30 slova u hrvatskome jeziku 27 ih se piše
pomoću jednoga znaka (jednoslovi), a 3 pomoću dva znaka (dvoslovi) i to dže, elj i enj.”). The five
diacritic letters are **č, ć, đ, š, ž** (capitals **Č, Ć, Đ, Š, Ž**).

**Unicode range.** The accented letters live in Latin Extended-A and Latin-1: **č U+010D, ć U+0107,
đ U+0111, š U+0161, ž U+017E**, capital **Đ U+0110**. The **đ/Đ is a lowercase/uppercase d-with-stroke
— NOT the Icelandic eth (ð U+00F0 / Ð U+00D0)**; confusing the two is a real rendering and
copy-editing defect. The digraphs **dž, lj, nj are composed from two ordinary Latin letters** — the
deprecated single-codepoint "digraph" characters (e.g. U+01C6 ǆ, U+01C9 ǉ, U+01CC ǌ) **must not** be
used in modern text. (⚠ The exact codepoint values are stated from standard Unicode knowledge, **not
re-fetched from unicode.org this session** — verify against the Unicode charts before locking the kit.)
**UTF-8 mandatory; never ASCII-substitute** (c/cc/dj/s/z) in shipped content.

- ✅ Croatian: **duboko učenje**, **žig**, **đon**, **računalo**, **tisuća**
- ❌ ASCII-stripped: **duboko ucenje**, **zig**, **djon** (defect — flag in §11)

**The two real spelling error sources (flag to translators).**
1. **ć vs č** — different phonemes, different letters; mixing them is a genuine spelling error.
2. **đ vs dj** — **đ** is a single letter; writing **"dj"** is either an ASCII fallback or a
   Serbian/Bosnian-influenced habit and is **wrong** in standard Croatian (§9). Also do not confuse
   **đ** with the eth.

**Quotation marks — the one that is always wrong first.** Croatian primary quotation marks are the
**low-high „…” form** — the opening mark sits at the comma baseline, the closing mark is raised.
The alternative is the **»…« guillemet form, pointing inward** (i.e. **reversed** relative to French
usage). Marks always come in pairs, with **no space inside** (liber-media.hr — „Početni navodnik („)
stavlja se u razini zareza. Završni navodnik (”) postavlja se u razini izostavnika.”; „Početni
navodnik » otvara se prema desno, a završni navodnik « zatvara se prema lijevo.”; „Iza početnog i
ispred završnog navodnika ne piše se razmak.”; a vendor typography page that corroborates the pravopis
spacing rule).

**The nested (inner) pair is ‘…’ — the polunavodnici, not the ASCII apostrophe.** Opening
**‘ U+2018**, closing **’ U+2019**. hr.wikipedia («Navodnici») states the rule and — usefully for
this kit — names the ASCII form explicitly as the everyday-computing fallback rather than the
Croatian one: „Ako se neki navod nađe unutar postojećeg navoda, tada se on označava
polunavodnicima, oblikom jednakim izostavniku. U hrvatskoj inačici dolaze kao ‘ ’, dok je u
svakodnevnom radu s računalima najčešći oblik ' '.” ⚠ **Divergence on record.** CLDR's `hr` locale
data, re-fetched from the pinned **CLDR 48.2** release this session, gives a *different* inner
pair — `alternateQuotationStart` = **‚ U+201A**, `alternateQuotationEnd` = **‘ U+2018** — and also
a different outer closing mark, `quotationEnd` = **“ U+201C**, where the liber-media.hr rule above
uses **” U+201D**. This guide follows the Croatian-language reference for body copy; the CLDR
values are recorded because they are what software will emit when left to its defaults.

- ✅ Croatian: **„kliknite ovdje”**  ·  ✅ guillemets: **»kliknite ovdje«**
- ✅ Inner level, real polunavodnici: **„tekst ‘unutra’ tekst”**
- ❌ Inner level with the ASCII apostrophe: **„tekst 'unutra' tekst”**
- ❌ Straight ASCII: **"kliknite ovdje"**  ·  ❌ English curly (high-open, high-close): **“kliknite ovdje”**

**Direction & tokenization.** LTR; words are **whitespace-separated** with standard Unicode word-break
— ordinary tokenization and word-based highlighting work with no RTL/bidi handling.

**Hyphenation / line-breaking.** Croatian permits syllable-based line-break hyphenation. For digital
UI, leave hyphenation off unless a proper `hr` dictionary is available; setting **`lang="hr"`** on the
root switches on the browser's Croatian hyphenation and locale rules. Do not hand-insert hyphens.

**Web-font pitfall (the real risk).** The shipped font **must carry the full set č ć đ š ž
Č Ć Đ Š Ž**. Fonts (or icon subsets) with a truncated Latin set render **đ/Đ** as tofu or fall back
mid-word, and some display faces confuse **đ** with a struck-d design or the eth. A **Noto family
(via Google Fonts)** — or any face advertising **Latin Extended-A** coverage — is the safe default.
**Test-render** *„Umjetna inteligencija: duboko učenje, žig, đon, ćelija”* before locking a typeface.

**Romanization — not applicable.** Croatian is natively a Latin-script language, so there is **no
transliteration/romanization step** and nothing to keep out of the UI.

Sources: <https://hr.wikipedia.org/wiki/Gajica> · <https://www.liber-media.hr/navodnici> ·
<https://pravopis.hr/pravilo/bjelina/54/> (Unicode codepoints stated from standard knowledge —
⚠ not re-fetched from unicode.org this session) ·
<https://hr.wikipedia.org/wiki/Navodnici> (polunavodnici ‘…’ and the ASCII-fallback note — verbatim,
fetched this session) · <https://www.unicode.org/cldr/charts/latest/summary/hr.html> ·
<https://cldr.unicode.org/downloads/cldr-48> (the `hr` delimiter fields quoted above were read
codepoint-by-codepoint from the pinned CLDR 48.2 release of the locale data behind that chart)

---

## 10. Technical integration checklist

- **Fonts to ship:** a font with **full Latin coverage including č ć đ š ž Č Ć Đ Š Ž** — a **Noto**
  family (via Google Fonts) is the safe default. **Verify đ/Đ renders as a d-with-stroke, not the eth
  and not a tofu box**, and that the **„…” low-high quote glyphs** exist (§3). Missing Extended-A
  glyphs (especially **đ**) are the top Croatian rendering defect.
- **`lang` / `dir` attributes:** `lang="hr"` (base) and `lang="hr-easy"` (simplified variant, subject
  to the §Header token note); **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign
  passage is WCAG 2.2 SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="hr"` also switches on the browser's Croatian
  hyphenation dictionary (§3).
- **Quotation marks:** normalize straight/English quotes in body copy to Croatian **„…”** (U+201E open,
  U+201D close), nested single **‘…’** (U+2018 / U+2019, §3); the **»…«** guillemet form is an acceptable alternative but
  pick one and be consistent (§3).
- **Index alphabet for glossary navigation:** use **Croatian collation**, in which the **digraphs
  dž, lj, nj each sort as one letter** and the diacritic letters sort in their Croatian positions:
  `a b c č ć d dž đ e f g h i j k l lj m n nj o p r s š t u v z ž`. Drive this from **CLDR `hr`
  collation** rather than a naive Unicode-codepoint sort (which would scatter dž/lj/nj and the
  diacritics).
- **Numbers / dates / currency in display vs identifiers:** display per §5 (space grouping, comma
  decimal, `50 %` and `99,90 €` with a space, `26. 7. 2026.`, 24-hour time); keep Western digits and
  ISO 8601 (YYYY-MM-DD) for backends / identifiers / code.
- **Line-breaking / hyphenation:** `hyphens: auto` with `lang="hr"`; do not hand-insert hyphens (§3).
- **No romanization step:** Croatian is native Latin script — there is no transliteration layer to
  build or guard (§3).

Sources: <https://hr.wikipedia.org/wiki/Gajica> · <https://pravopis.hr/pravilo/bjelina/54/> ·
<https://www.liber-media.hr/navodnici> (CLDR `hr` collation invoked as the driver — ⚠ chart not fetched
this session)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Script / diacritic presence:** `hr` content is Latin script, but a **near-total absence of the
  Croatian diacritics** (č ć đ š ž) across a body of text signals ASCII-stripped output — flag text
  that should be Croatian but carries no such codepoints.
- **đ vs dj / eth:** flag **"dj"** where standard Croatian wants **đ** (ASCII fallback or Serbian/
  Bosnian habit, §3/§9), and flag the eth **ð/Ð (U+00F0/U+00D0)** anywhere — it is never correct
  Croatian (the correct letter is **đ/Đ**, U+0111/U+0110).
- **Forbidden punctuation in body copy:** no **straight ASCII quotes `"` `'`** and no **English curly
  double quotes “…”** at the outer level — Croatian body copy uses **„…”** (U+201E / U+201D) with the
  inner pair **‘…’** (U+2018 / U+2019), or the **»…«** guillemets (§3). The single marks **‘…’** are
  correct *only* as the inner level; an ASCII `'` there is the defect this check exists for.
- **Number formatting:** no **period-as-decimal or comma-as-thousands** — Croatian uses **comma decimal
  + space grouping** (`1 250 000,75`, not `1,250,000.75`) (§5).
- **Symbol spacing:** **%, €, kn** and units must be **space-separated** from the amount (`50 %`,
  `99,90 €`, `3 kg`); flag glued forms (`50%`, `99,90€`) as defects (§5).
- **Register consistency (ti):** ti is the recorded register (§4) — scan second-person copy for stray
  **Vi-forms** (the -te imperative *kliknite / unesite / zaboravite*, the pronoun *Vi* / possessive
  *Vaš*, and Vi verb agreement) — each is a register defect against the recorded ti baseline. (If a
  deployment switched to Vi, invert this check — the point is **one register, never mixed**.)
- **Croatian-vs-Serbian/Bosnian leak scan:** flag **ekavian** forms where ijekavian is expected
  (*mleko/vreme/reč* → *mlijeko/vrijeme/riječ*), Serbian/Bosnian lexis (*hiljada, kompjuter, fajl,
  server, istorija, fudbal, januar*) in place of Croatian (*tisuća, računalo, datoteka, poslužitelj,
  povijest, nogomet, siječanj*), any **Cyrillic** characters, and *da*+present where an infinitive is
  standard (§9).
- **Source-language leak scan (EN → HR):** left-in English function words (the, and, you, please),
  dictionary-form (nominative) nouns where an oblique case is required (§4), or English number/date
  formatting surfacing in Croatian text.

Sources: <https://pravopis.hr/pravilo/bjelina/54/> · <https://www.liber-media.hr/navodnici> ·
<https://hr.wikipedia.org/wiki/Gajica> ·
<https://hr.wikibooks.org/wiki/Osnovni_razlikovni_rje%C4%8Dnik_hrvatskog_jezika_i_srpskog_jezika>

---

*Provenance note:* this guide is **authored from a single agent-native research dossier (self-fetched,
quote-per-claim), then independently reviewed against its cited sources.** Four load-bearing anchors
were re-fetched and confirmed verbatim this session — **pravopis.hr** (number spacing „Bjelina” and the
Vi/Ti respect-capitalization rule), **struna.ihjj.hr** (umjetna inteligencija, duboko učenje), and
**mfin.gov.hr** (euro from January 1, 2023, fixed rate 1 EUR = 7,53450 HRK). Its **strong** sections
(§2 authorities, §3 typography, §5 numbers/currency, §6 terminology policy) rest on pravopis.hr /
Struna / gramatika.hr / mfin.gov.hr and carry verbatim quotes; its **thinner** sections (the
case/word-order parts of §4, §7 idioms, §8 plain language, §9 regional variation) rest on Wikipedia /
Wikibooks / an easy-language advocacy page / applied-translation judgment and are marked **⚠
community-grade / editorial, native-speaker confirmation pending** at point of use. Every ⚠ / editorial
marker the dossier set has been preserved. **Register: ti (informal), with Vi documented as the
formal alternative (§4).** A native-speaker review against the §2 sources is still outstanding (see
Status in the header).
