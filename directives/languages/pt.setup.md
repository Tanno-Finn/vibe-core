<!-- base -->
# lang-pt — Portuguese (português) — setup & sources

> **The translation guide itself is [`pt.md`](pt.md)** — §1 header block, §4
> grammar, §5 numbers/dates/currency, §6 terminology, §7 idiom anti-patterns, §8
> simplified-language pendant, §9 regional variation. This file carries the four
> sections that are read once rather than per job. Section numbers are shared across
> both files.

---

## 2. Authorities & primary sources

This is the guide's evidence base — every rule below traces back to one of these. Portuguese has
**two** national orthographic authorities (one per side of the Atlantic) plus a treaty that binds
them, which is itself the structural reason for §9.

| Authority | Role | Status |
|---|---|---|
| **Acordo Ortográfico da Língua Portuguesa (1990)** | The treaty text — the base orthography for this guide | ✅ fetched |
| **Academia das Ciências de Lisboa (ACL)** — publisher of the *Vocabulário Ortográfico da Língua Portuguesa* | Normative orthographic wordlist for the **European** variety | ✅ fetched |
| **Academia Brasileira de Letras (ABL)** — publisher of the **VOLP** | Normative orthographic wordlist for **Brazil** | **⚠ HTTP 403** — see note |
| **Ciberdúvidas da Língua Portuguesa** (ISCTE-IUL) | Usage-consultation service; the strongest source for PT/BR contrastive questions | ✅ fetched (re-fetched this session) |
| **Priberam** (dicionario.priberam.org) | Major reference dictionary; marks PT/BR variants | ✅ fetched |
| **Infopédia** (infopedia.pt) | Major European-variety reference dictionary | **⚠ HTTP 403** — indirect attestation only |
| **Unicode CLDR** | Locale data: numbers, dates, delimiters | ✅ fetched (JSON; re-fetched this session) |
| **ISO 24495-1:2023** — *Plain language, Part 1* | Variant-independent plain-language anchor | **⚠ HTTP 403** — metadata unquotable |
| **Decreto-Lei n.º 83/2018 (Portugal)** — web accessibility | Portugal's binding clarity-adjacent instrument | **⚠ empty response body** — unquotable |

**AO90 treaty — verified.** The preamble names the seven original signatory states: «a República
Popular de Angola, a República Federativa do Brasil, a República de Cabo Verde, a República da
Guiné-Bissau, a República de Moçambique, a República Portuguesa e a República Democrática de São Tomé
e Príncipe». Timor-Leste acceded later, after independence. The treaty provides that **each country
produces its own orthographic vocabulary** — which is why there are two academies below, not one.

**Academia das Ciências de Lisboa — verified.** Its vocabulary page states the remit explicitly: «A
elaboração e publicação do Vocabulário Ortográfico da Língua Portuguesa é uma competência da Academia
das Ciências de Lisboa», following «o Acordo Ortográfico da Língua Portuguesa (1990) – na variedade
portuguesa da língua», covering «a língua portuguesa moderna, ou seja, o período linguístico que
decorre do século XVI até à época atual». **Note *na variedade portuguesa da língua*: the ACL
vocabulary is the European-variety implementation of AO90, not a pan-lusophone one.**

**Academia Brasileira de Letras / VOLP — `⚠ unverified`.** `academia.org.br` returned **HTTP 403
Forbidden** to automated fetching, and was **not retried** in this session. What is safe to state is
the **institutional fact** — the ABL is the body that publishes the **VOLP**, the official orthographic
register for Brazil — which is corroborated **only** by the AO90 treaty text listing Brazil as a
signatory party and the treaty's own per-country-vocabulary mechanism. **Edition number and entry
count are deliberately omitted**; the dossier's search-result figures (a 6th edition, ~382,000
entries) were never fetched and are **not** asserted here. Fallback candidates for a human or
authenticated session: `www2.academia.org.br/boletins/vocabulario-ortografico-da-lingua-portuguesa`
and the VOLP search interface at `academia.org.br/nossa-lingua/busca-no-vocabulario`.

**Ciberdúvidas — verified, twice.** Two consultations carry this guide's two sharpest variant rules
(§9): the *rede neuronal* / *rede neural* split and the proclisis/enclisis contrast. Both were
**re-fetched in this authoring session** and both confirmed the dossier's quotes.

**Priberam — verified as a working terminological authority.** Its entry for the domain's core term
reads: «Ramo da ciência da computação que estuda o desenvolvimento de sistemas computacionais capazes
de executar tarefas ou de reproduzir ou simular capacidades associadas à inteligência humana (sigla:
I.A.)». Priberam is Portugal-based but marks Brazilian variants; it is the most practical single
lookup for a translator resolving a PT/BR spelling question.

**Infopédia — `⚠ 403`.** European-variety dictionary; attested only **second-hand**, cited by
Ciberdúvidas as the source consecrating `rede neuronal artificial` in Portugal (§6). A reliable
indirect attestation, **not** a direct quote. Not retried.

**Digital style guides.** There is **no single canonical pan-lusophone digital style guide**
comparable to a national broadcaster's. What exists and is citable: **Brazil** — the federal
plain-language law and the Rede Linguagem Simples Brasil (§8), which function as the de-facto style
authority for public-facing digital text; **Portugal** — web-accessibility obligations under
**Decreto-Lei n.º 83/2018**, supervised by the **AMA (Agência para a Modernização Administrativa)**.
**⚠ partially unverified:** the official Diário da República page for DL 83/2018 returned an **empty
response body**, so **no verbatim quote is available**. Fallback candidates:
`diariodarepublica.pt/dr/detalhe/decreto-lei/83-2018-116734769` and `acessibilidade.gov.pt`.

**Encyclopedic sources, labeled.** Wikipedia and Wikisource are used for the **treaty text itself**
(Wikisource reproduces AO90 verbatim) and for **terminology attestation with explicit variant
labeling** (§6 #2), corroborated by Ciberdúvidas. They are encyclopedic, not normative, and are
marked as such at point of use. **No AI-vendor, localization-vendor, or commercial-glossary source was
relied on for any claim in this guide.**

**Re-fetch log (this session).** Confirmed present at the cited URLs: CLDR `pt` `numbers.json`
(decimal `","`, group `"."`, decimal pattern `"#,##0.###"`, currency `"¤ #,##0.00"`); CLDR `pt-PT`
`numbers.json` (decimal `","`, group **U+00A0 NO-BREAK SPACE**, currency `"#,##0.00 ¤"`); CLDR
`pt-PT` `delimiters.json`
(`quotationStart` **«**, `quotationEnd` **»**); Ciberdúvidas *redes neuronais artificiais* («Em
Portugal, prefere-se «rede neuronal artifical», incluindo «rede neuronal»» — the misspelling
*artifical* is the source's own); Ciberdúvidas *colocação pronominal* (the `Te amo`/`Amo-te`,
`se reuniram`/`reuniram-se`, `Isso lhe interessou`/`Isso interessou-lhe`, `Carlos a chamou`/`Carlos
chamou-a` pairs, **plus** a further pair not in the dossier: `Os dois se amam` (BR) / `Os dois
amam-se` (PT)); Portuguese-language encyclopedia *Aprendizado de máquina* (the four-variant opening
sentence, and the supervised/unsupervised definitions).

Sources: <https://pt.wikisource.org/wiki/Acordo_Ortogr%C3%A1fico_da_L%C3%ADngua_Portuguesa_(1990)> ·
<https://www.acad-ciencias.pt/vocabulario/> ·
<https://ciberduvidas.iscte-iul.pt/consultorio/perguntas/redes-neuronais-artificiais/38009> ·
<https://ciberduvidas.iscte-iul.pt/artigos/rubricas/idioma/colocacao-pronominal-portugues-do-brasil-x-portugues-europeu/5754> ·
<https://dicionario.priberam.org/inteligencia%20artificial> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/pt-PT/delimiters.json>

---

## 3. Script & typography

**(Strong section — CLDR + AO90 treaty text.)**

**Character inventory.** Latin script, **left-to-right**, **spaces as word separators** — no special
segmentation logic (unlike CJK or Thai). The non-ASCII repertoire is small and fully covered by
**Latin-1 Supplement**:

| Diacritic | Letters | Function |
|---|---|---|
| Cedilha | `ç Ç` | /s/ before *a, o, u* |
| Til (tilde) | `ã õ Ã Õ` | nasal vowels |
| Acento agudo | `á é í ó ú Á É Í Ó Ú` | stress + **open** vowel quality |
| Acento circunflexo | `â ê ô Â Ê Ô` | stress + **closed** vowel quality |
| Acento grave (crase) | `à À` | contraction of preposition *a* + article *a* |
| Trema | `ü` | **abolished** in native words by AO90; survives only in proper names and loans |

**Normalize to NFC.** All of the above are **single code points in NFC**. Decomposed `ã`
(`a` + U+0303) breaks naive string comparison, search indexing, and CSS `::first-letter`. Normalize on
ingest.

**Uppercasing must preserve diacritics.** Portuguese is safe for `text-transform: uppercase`
*provided* the pipeline and the font both keep the marks.

- ✅ `ação` → **`AÇÃO`**
- ❌ `ação` → **`ACAO`** (ASCII-folded — a common and highly visible localization defect)

**Crase (`à`) is semantically load-bearing, not decorative.** `Vou a a escola` contracts to
`Vou à escola`. Dropping the grave accent is a real error, not a typographic nicety.

- ✅ **`Vou à escola.`** · **`Devido à latência…`**
- ❌ **`Vou a escola.`** · **`Devido a latência…`**

### Quotation marks — **a real pt-PT / pt-BR divergence, and it cannot be neutralized**

CLDR is unambiguous and the two locales genuinely differ (both files fetched; `pt-PT` re-fetched this
session):

| Locale | quotationStart / End | Alternates | Codepoints |
|---|---|---|---|
| **`pt`** (Brazilian base) | **“ … ”** | **‘ … ’** | U+201C / U+201D · U+2018 / U+2019 |
| **`pt-PT`** | **« … »** | **“ … ”** | U+00AB / U+00BB · U+201C / U+201D |

In Portugal the guillemets are set **without inner spaces** — `«texto»`, not `« texto »` (that is the
French convention). This is the **single most visible typographic tell of variant**, and there is **no
third option**: see §9.

- ✅ pt-BR: **“clique aqui”** (U+201C … U+201D) · nested **‘…’** (U+2018 … U+2019)
- ✅ pt-PT: **«clique aqui»** (U+00AB … U+00BB) · nested **“…”** (U+201C … U+201D)
- ❌ Straight ASCII in body copy: **"clique aqui"** (U+0022 on both sides)
- ❌ French spacing in pt-PT: **« clique aqui »** (inner spaces)
- ❌ Guillemets in pt-BR / curly doubles as the *primary* mark in pt-PT (variant leak, §9)

**Apostrophe.** Use the typographic apostrophe **’** (U+2019), not the ASCII `'` (U+0027), in body
copy — e.g. `d’água`, `pingo d’água`.

**Other punctuation.**
- **No space before `: ; ! ?`** (again, unlike French).
- **Ellipsis** is **…** (U+2026) or `...` — pick one per project, do not mix.
- **Em dash —** (U+2014) is the standard dialogue/aside marker in both variants.
- **Decimal comma** means numbers inside prose need care with sentence-final periods (§5).

### Hyphenation — rewritten by AO90

AO90 rewrote hyphenation; with mute consonants (§9) it is one of the two areas where a translator
working from pre-2009 reference material produces **visibly outdated** text. The treaty's base rule
for *justaposição* compounds: «Emprega-se o hífen nas palavras compostas por justaposição que não
contêm formas de ligação».

Concrete fetched outcomes:
- **Hyphen removed:** `pára-quedas` → **`paraquedas`**; `manda-chuva` → **`mandachuva`**;
  `fim-de-semana` → **`fim de semana`** (three separate words).
- **Hyphen added:** `microondas` → **`micro-ondas`**; `arquiinimigo` → **`arqui-inimigo`** — a hyphen
  is now **required when prefix-final and stem-initial vowels are identical**.
- **Verbal forms:** the hyphen in `hão-de` / `há-de` is eliminated.

**Operative generalization for this domain** (AI/ML copy is prefix-dense):

| Pattern | Rule | Example |
|---|---|---|
| prefix + **same** vowel | hyphen | **`micro-ondas`**, **`anti-inflamatório`** |
| prefix + **different** vowel | no hyphen | **`autoaprendizagem`**, **`coocorrência`**, **`antiaéreo`** |
| prefix + **h** | hyphen | **`anti-histórico`** |
| prefix ending in **r** before **r** | hyphen | **`hiper-realista`** |
| prefix + **s**-initial stem | no hyphen, **double the s** | **`autossupervisionado`** |

- ✅ **`autoatenção`**, **`autossupervisionado`**, **`pré-treino`**, **`pós-processamento`**,
  **`multimodal`**, **`micro-ajuste`**
- ❌ **`auto-atenção`**, **`autosupervisionado`** (single `s`), **`microondas`**, **`fim-de-semana`**

**Line-breaking on the web.** Browsers need **`lang="pt"`** (or `lang="pt-BR"` / `lang="pt-PT"`) on
`<html>` for `hyphens: auto` to apply **Portuguese** hyphenation patterns. Serving Portuguese under
`lang="en"` silently produces wrong break points — a one-line fix with an outsized quality effect.

**Web fonts and the real rendering risk.** Any well-built Latin webfont covers Portuguese, but
**verify the shipped subset actually includes `ã õ ç â ê ô à`**. The classic failure: a `latin`
subset that omits **Latin-1 Supplement**, so `ç` and `ã` render as tofu or fall back mid-word —
**extremely** visible in Portuguese, where these letters appear in the highest-frequency words
(`não`, `ação`, `são`, `também`). Use `unicode-range` deliberately or ship **`latin-ext`**. A **Noto**
family (Noto Sans / Noto Serif) is a safe default and covers the repertoire fully.

**Text expansion and wrapping.**
- Portuguese runs **~15–25 % longer than English** (`settings` → `configurações`, `learning` →
  `aprendizagem`). Budget UI width against the **longest** string, not the average.
- Words are long: enable **`overflow-wrap: break-word`** on narrow columns, or you get horizontal
  scroll on mobile with `desenvolvimento`, `supervisionado`, `responsabilização`.
- **Avoid all-caps for long labels** — diacritics crowd the cap-height band and legibility drops.

**Romanization — not applicable.** Portuguese is natively Latin-script; there is **no
transliteration/romanization step** and nothing to keep out of the UI.

Sources: <https://pt.wikisource.org/wiki/Acordo_Ortogr%C3%A1fico_da_L%C3%ADngua_Portuguesa_(1990)> ·
<https://pt.wikipedia.org/wiki/Lista_das_altera%C3%A7%C3%B5es_previstas_pelo_acordo_ortogr%C3%A1fico_de_1990> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/pt/delimiters.json> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/pt-PT/delimiters.json>
(text-expansion and font-subset pitfalls are editorial engineering guidance, not academy-sourced)

---

## 10. Technical integration checklist

- **Fonts to ship:** a Latin font whose subset **actually includes Latin-1 Supplement** —
  `ã õ ç â ê ô à á é í ó ú` — plus the quote glyphs the chosen variant needs (**« »** U+00AB/U+00BB for
  pt-PT, **“ ”** U+201C/U+201D for pt-BR) and the apostrophe **’** U+2019. Ship **`latin-ext`** or set
  `unicode-range` deliberately. A **Noto** family (Noto Sans / Noto Serif) is the safe default.
  A bare `latin` subset that drops `ç` and `ã` is the top Portuguese rendering defect (§3).
- **`lang` / `dir` attributes:** `lang="pt"` (base), `lang="pt-BR"` / `lang="pt-PT"` for forked
  builds, `lang="pt-easy"` for the simplified pendant (subject to the header's token note);
  **`dir="ltr"`** throughout. Correct `lang` per variant and per foreign passage is WCAG 2.2
  SC 3.1.1 (Level A) / 3.1.2 (Level AA). `lang="pt*"` also switches on the browser's **Portuguese**
  hyphenation dictionary for `hyphens: auto` (§3).
- **⚠ Never format on bare `pt`.** Key every locale-aware number, date, and currency call on the
  **full tag** (`pt-BR` / `pt-PT`). Bare `pt` in CLDR **is** the Brazilian base — dot grouping,
  symbol-first currency — so a European-market build using `pt` **silently emits Brazilian output**
  with no error (§5, §9.4). **The highest-value single check in this list.**
- **Unicode normalization:** normalize to **NFC** on ingest. Decomposed `ã` (`a` + U+0303) breaks
  string comparison, search indexing, and `::first-letter` (§3).
- **Quotation-mark normalization:** normalize straight ASCII `"` (U+0022) and `'` (U+0027) in body
  copy to the variant's marks — **“ ”** for pt-BR, **« »** (no inner spaces) for pt-PT — and the
  apostrophe to **’** (§3, §9.5). Decide the glyph **once, per build**, and lint for the other.
- **Never concatenate sentences from fragments.** Gender agreement propagates across articles,
  adjectives, and participles (§4), so `{item} selecionado` is broken for every feminine noun. Use a
  full sentence per case, or **ICU `select` on gender**.
- **Uppercasing must preserve diacritics** — `ação` → `AÇÃO`, never `ACAO`. Verify both the CSS
  pipeline and the font (§3).
- **Text expansion:** budget **~15–25 %** more width than English, tested against the **longest**
  string. Enable **`overflow-wrap: break-word`** on narrow columns — Portuguese words are long
  (`responsabilização`, `autossupervisionado`) and will otherwise cause horizontal scroll on mobile
  (§3).
- **Index alphabet for glossary navigation:** drive from **CLDR `pt` collation**, not a naive
  codepoint sort. Portuguese sorts accented letters **with their base letter** — `á` with `a`, `ç`
  with `c`, `ã` with `a` — so the visible index alphabet is plain
  `a b c d e f g h i j k l m n o p q r s t u v w x y z`, with diacritics folded into their base
  positions rather than pushed to the end (which is what a raw codepoint sort would do).
- **Line-breaking / hyphenation:** `hyphens: auto` with the correct `lang`; do not hand-insert
  hyphens. AO90 hyphen rules (§3) apply to **compound spelling**, which is an editorial matter, not a
  line-breaking one — don't conflate them.
- **Display vs identifiers:** display per §5 (comma decimal, variant grouping, variant currency
  placement, `26 de julho de 2026`, 24-hour time); keep **Western digits and ISO 8601
  (`YYYY-MM-DD`)** for backends, identifiers, and code.
- **Fork list as a build artifact.** Maintain the §9.8 fork list (dupla grafia, core computing
  vocabulary, domain terminology, quote glyph, currency/grouping) as an **explicit, reviewable set of
  overrides** — not as scattered ad-hoc string edits.
- **No romanization step:** Portuguese is native Latin script — there is no transliteration layer to
  build or guard (§3).

Sources: <https://unpkg.com/cldr-numbers-full@48.2.0/main/pt/numbers.json> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/pt-PT/delimiters.json> ·
<https://pt.wikisource.org/wiki/Acordo_Ortogr%C3%A1fico_da_L%C3%ADngua_Portuguesa_(1990)>
(collation, NFC, expansion, and fork-list items are editorial engineering guidance)

---

## 11. Verification additions

Language-specific deterministic checks, to plug into the check list in
[translation-quality → Verification](../translation-quality.md):

- **Diacritic-presence / ASCII-folding check.** `pt` content is Latin script, but a **near-total
  absence of `ç ã õ á é í ó ú â ê ô à`** across a body of text signals ASCII-folded or untranslated
  output. Flag it. Specifically flag **`ACAO`/`acao`, `nao`, `sao`, `informacao`** — the folded forms
  of the highest-frequency Portuguese words (§3).
- **Crase check.** Flag `a` immediately before a feminine noun phrase where `à` is required
  (`devido a latência` → `devido à latência`). ⚠ Heuristic — crase is context-dependent; treat hits as
  review candidates, not defects (§3).
- **Forbidden punctuation in body copy.**
  - No **straight ASCII quotes** `"` (U+0022) or `'` (U+0027) — use the variant's marks (**“ ”**
    U+201C/U+201D for pt-BR; **« »** U+00AB/U+00BB for pt-PT) and **’** (U+2019) for the apostrophe.
  - **Quote-glyph variant leak:** flag **«»** in a pt-BR build and **“”** used as the *primary* mark
    in a pt-PT build (§9.5).
  - **No inner spaces inside guillemets** in pt-PT — flag `« texto »` (French convention) (§3).
  - **No space before `: ; ! ?`** (§3).
- **Number-format check.** No **period-as-decimal**: `0.85` in Portuguese body copy is a defect —
  it must be `0,85`. No **comma-as-thousands** (`1,234.56`). Grouping must match the build's variant:
  **`1.234.567,89`** (pt-BR) vs **`1 234 567,89`** (pt-PT) (§5, §9.4).
- **Currency-pattern check.** pt-BR: symbol **before**, dot grouping (`R$ 1.234,56`). pt-PT: symbol
  **after**, space grouping (`1 234,56 €`). Flag any crossed combination — `€ 1.234,56`,
  `R$ 1 234,56` (§9.4).
- **Bare-`pt`-locale lint (build-level, highest value).** Grep the codebase for locale-aware
  formatting calls keyed on bare **`'pt'`** — every one is a latent silent-Brazilian-defaults bug in a
  European build (§5, §10).
- **Date-format check.** Day-first only — flag `MM/DD` ordering. Flag **capitalized month names**
  (`26 de Julho de 2026`) — AO90 lowercased them (§5, §9.1). Flag 12-hour times (`2:30 PM`) in
  end-user copy.
- **Register consistency (dropped-subject 3sg is the decided register, §4).**
  - Flag **`tu`-morphology**: `podes`, `tens`, `queres`, `fazes`, the pronoun `tu`, possessive `teu`/
    `tua`, and `tu`-imperatives (`ajusta`, `seleciona`, `clica`) — each is a register defect.
  - Flag **`você` density**: `você` appearing in most sentences of a passage is the pro-drop failure
    (§4). Occasional contrastive `você` is fine; a `você` per sentence is not.
- **Clitic-placement scan (variant leak).** Flag **enclitic hyphenated pronouns** (`-se`, `-lhe`,
  `-me`, `-te`, `-o`, `-a` attached to a verb: `Registe-se`, `Encontra-se`, `Trata-se`, `Note-se`) and
  **sentence-initial proclitics** (`Se registre`, `Se encontra`, `Te`). In neutral base text **both**
  are defects — the correct fix is the paraphrase, not the other clitic (§9.6).
- **Progressive-aspect scan.** Flag `está a ` + infinitive (PT-marked) and `-ndo` gerunds after
  `estar` (BR-marked) in neutral base text; the neutral form is the **simple present** (§4, §9.6).
- **Dupla-grafia / variant-mix scan (the mixed-variant tell).** Within one build, flag the presence of
  **both** members of any fork pair: `facto`/`fato`, `contacto`/`contato`, `receção`/`recepção`,
  `académico`/`acadêmico`, `neurónio`/`neurônio`, `connosco`/`conosco`, `ecrã`/`tela`,
  `ficheiro`/`arquivo`, `utilizador`/`usuário`, `registo`/`cadastro` (§9.1, §9.7).
- **Domain-terminology variant scan.** Within one build, flag co-occurrence of **`aprendizado`** and
  **`aprendizagem`**, of **`rede neural`** and **`rede neuronal`**, and of **`treino`** and
  **`treinamento`**. Also flag **gender mismatch** across the split: `aprendizagem supervisionado`,
  `aprendizado profunda`, `o aprendizagem`, `a aprendizado` (§9.2).
- **Hyphenation / prefix check (AO90).** Flag pre-AO90 forms `pára-quedas`, `fim-de-semana`,
  `hão-de`, `há-de`, `microondas`; flag the frequent errors **`auto-atenção`** and
  **`autosupervisionado`** (single `s` — the correct form doubles it: `autossupervisionado`) (§3).
- **Acronym check.** **`IA`**, not `AI` and not `I.A.`; expanded on first use — `IA (inteligência
  artificial)` (§6, §8).
- **False-friend scan (EN → PT).** Flag `atualmente` and `eventualmente` for review — they are the two
  that most often survive undetected — plus `livraria`, `pretender`, `parentes`, `realizar` in senses
  calqued from English (§7).
- **Source-language leak scan (EN → PT).** Left-in English function words (the, and, you, please),
  English adjective-before-noun order in domain terms (`neural rede`, `artificial inteligência`), and
  English number/date formatting surfacing in Portuguese text.

Sources: <https://unpkg.com/cldr-numbers-full@48.2.0/main/pt/numbers.json> ·
<https://unpkg.com/cldr-misc-full@48.2.0/main/pt-PT/delimiters.json> ·
<https://ciberduvidas.iscte-iul.pt/artigos/rubricas/idioma/colocacao-pronominal-portugues-do-brasil-x-portugues-europeu/5754> ·
<https://pt.wikisource.org/wiki/Acordo_Ortogr%C3%A1fico_da_L%C3%ADngua_Portuguesa_(1990)>
(the check *formulations* are engineering guidance derived from the sourced rules above)

---

*Provenance note:* this guide is **authored from a single agent-native research dossier (self-fetched,
quote-per-claim), then independently reviewed against its cited sources.** Six load-bearing anchors
were **re-fetched and confirmed during authoring**: CLDR `pt` `numbers.json`, CLDR `pt-PT`
`numbers.json`, CLDR `pt-PT` `delimiters.json`, the Ciberdúvidas consultation *Redes neuronais
artificiais*, the Ciberdúvidas article *Colocação pronominal: português do Brasil × português
europeu*, and the Portuguese-language encyclopedia article *Aprendizado de máquina*. All six matched
the dossier's quotes; one additional contrast pair (`Os dois se amam` / `Os dois amam-se`) was found
during the re-fetch and is marked as such at point of use.

**Honest gaps, carried forward from the dossier and not papered over:** the **ABL / VOLP** site
returned **HTTP 403**, so the ABL's role rests on the **AO90 treaty text alone** and no edition or
entry-count figure is asserted; **Infopédia** returned **HTTP 403** and is attested only indirectly;
**Portugal's Decreto-Lei n.º 83/2018** page returned an **empty response body**, so §8's Portugal
subsection carries **no verbatim quote**; the **ISO 24495-1:2023** page returned **HTTP 403**;
**9 of the 15 AI/ML terms in §6 have no codifying authority** and are marked `⚠`; **§7 idioms are
craft-tier** with no authority citation by construction; and the computing-vocabulary rows in §9.7
other than `treino`/`treinamento` and `aprendizagem`/`aprendizado` are **⚠ partially verified**.
Known-403 domains were **not retried** in this session.

**Outstanding:** a **native-speaker review** — ideally one Brazilian and one European reader, given
§9 — against the §2 sources. Until that happens the header status stands: **planned, not yet reviewed
by a native speaker.**
