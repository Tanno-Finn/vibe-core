#!/usr/bin/env node
/**
 * docx.mjs — Markdown or HTML → an accessible Word file (kit tool `docx`, capability `file:docx`).
 *
 * WHAT: writes a real .docx from one Markdown or HTML file, so screen-reader users get
 * what they need from a handout: built-in heading styles ("heading 1" … "heading 6",
 * listed in Word's navigation pane and announced by screen readers), real lists, tables
 * with a marked header row, working links, and the document language (per run, too, for
 * a paragraph in another language). No second copy of the text: the Word file is built
 * from the same file the HTML handout is.
 *
 * HOW: Markdown goes through `marked` to HTML; HTML is parsed with `jsdom` (no scripts
 * run, nothing is fetched). The content root is --select, else <main>, else <body>.
 * The language is --lang, else <html lang>, else exit 2. A bare language gets a region
 * (de → de-DE, it → it-IT, en → en-US, fr → fr-FR, es → es-ES; lld → it-IT with a
 * warning, because Word has no Ladin). Page A4, margins 2 cm, --font (Verdana) at --size
 * (12 pt), line spacing 1.5. Right to left: `<html dir="rtl">` (or `<body dir>`), else a
 * right-to-left language (ar, fa, he, ur …) makes the whole document right to left — mirrored
 * paragraphs, tables and page; an element's own dir or lang does the same for its part. Such
 * text gets Arial as its complex-script font, since Verdana has no Arabic or Hebrew letters.
 * The file is written with scripts/lib/zip.mjs: fixed dates,
 * no author, no timestamps, so the same input gives the same bytes.
 *
 * Mapping: h1–h6 → headings; p; strong/b, em/i, u, code, br; http/https/mailto links
 * → hyperlinks (other links → plain text); ul/ol nested up to three levels; table →
 * Word table (thead rows or th-only rows repeat as header rows, th bold); blockquote →
 * "Quote"; hr → a bottom border; pre → monospace lines; class "page-break" or an
 * inline break-before: page / page-break-before: always → the next paragraph starts
 * a new page; img → "[Bild: alt]" / "[Image: alt]" in the document language (images
 * are not embedded yet); aria-hidden="true", script, style, template → skipped. Any
 * other element keeps its text; the unmapped element types are listed as a warning.
 *
 * WHAT IT CANNOT SEE: whether Word and LibreOffice open it without a repair prompt on
 * your machine (they do for the test fixtures), images, colours and layout boxes.
 *
 * Run:  node tools/docx.mjs <input.md|input.html> [--lang de]   (--help for all)
 */
import { writeZip } from '../scripts/lib/zip.mjs';
import { EXIT, ToolError, inputFile, outputPath, positiveInt, readText, requireDep, runTool } from './lib/cli.mjs';

const REGION = {
  de: 'de-DE',
  it: 'it-IT',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  tr: 'tr-TR',
  uk: 'uk-UA',
  ru: 'ru-RU',
  pl: 'pl-PL',
  ro: 'ro-RO',
  pt: 'pt-PT',
  nl: 'nl-NL',
  sq: 'sq-AL',
  ar: 'ar-SA',
  fa: 'fa-IR',
  he: 'he-IL',
  ur: 'ur-PK',
};
const IMAGE_WORD = {
  de: 'Bild',
  it: 'Immagine',
  en: 'Image',
  fr: 'Image',
  es: 'Imagen',
  tr: 'Görsel',
  uk: 'Зображення',
  ru: 'Изображение',
  pl: 'Obraz',
  ro: 'Imagine',
  pt: 'Imagem',
  nl: 'Afbeelding',
  ar: 'صورة',
  fa: 'تصویر',
  he: 'תמונה',
};
// Languages written right to left: their paragraphs, runs and tables are mirrored in Word.
const RTL_LANGS = new Set(['ar', 'fa', 'he', 'ur', 'ps', 'yi', 'dv', 'sd', 'ug', 'ckb']);
const isRtl = (tag) => RTL_LANGS.has(String(tag).split('-')[0].toLowerCase());
// A complex-script font with Arabic and Hebrew letters (Verdana has none).
const RTL_FONT = 'Arial';
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const TEXT_WIDTH = 11906 - 2 * 1134; // A4 width minus two 2 cm margins, in twips

const SKIP = new Set(['script', 'style', 'template', 'head', 'noscript']);
const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const CONTAINERS = new Set([
  'html',
  'body',
  'div',
  'section',
  'article',
  'main',
  'header',
  'footer',
  'nav',
  'aside',
  'figure',
  'form',
  'fieldset',
  'details',
  'dl',
  'address',
  'hgroup',
  'center',
]);
const BLOCK_PARAGRAPHS = new Set(['p', 'figcaption', 'dt', 'dd', 'summary', 'legend', 'caption']);
const BLOCKS = new Set([
  ...HEADINGS,
  ...CONTAINERS,
  ...BLOCK_PARAGRAPHS,
  'ul',
  'ol',
  'table',
  'blockquote',
  'hr',
  'pre',
  'li',
]);
const INLINE_KNOWN = new Set([
  'span',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'code',
  'br',
  'a',
  'img',
  'small',
  'sup',
  'sub',
  'mark',
  'abbr',
  'time',
  'cite',
  'q',
  's',
  'del',
  'ins',
  'label',
  'kbd',
  'samp',
  'var',
  'dfn',
  'bdi',
  'bdo',
  'data',
  'wbr',
  'tt',
]);
const TABLE_PARTS = new Set(['thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'colgroup', 'col']);

/** Text for XML: escaped, and without the control characters XML forbids (Word refuses the file). */
const esc = (s) =>
  s
    // eslint-disable-next-line no-control-regex -- matching control characters is the point
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** A language tag with a region, for Word's proofing and screen readers' voice choice. */
function withRegion(tag, warn) {
  if (tag.includes('-')) return tag;
  const primary = tag.toLowerCase();
  if (primary === 'lld') {
    warn?.('Ladin (lld) has no language in Word; the text is marked it-IT so a screen reader uses an Italian voice.');
    return 'it-IT';
  }
  if (REGION[primary]) return REGION[primary];
  warn?.(`no region known for "${tag}"; it is written as given — Word may not offer proofing for it.`);
  return tag;
}

class Converter {
  constructor({ lang }) {
    this.lang = lang;
    this.links = []; // { id, url }
    this.nums = []; // { numId, abstract, ilvl, start }
    this.unmapped = new Map();
    this.images = 0;
    this.pendingBreak = false;
    this.sawRtl = false;
  }

  note(tag) {
    this.unmapped.set(tag, (this.unmapped.get(tag) || 0) + 1);
  }

  isHidden(el) {
    return el.getAttribute('aria-hidden') === 'true' || SKIP.has(el.localName);
  }

  breaksBefore(el) {
    const style = (el.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
    return (
      el.classList.contains('page-break') ||
      style.includes('break-before:page') ||
      style.includes('page-break-before:always')
    );
  }

  /** Does `el` hold block content (so it is laid out as blocks, not as one run of text)? */
  hasBlocks(el) {
    for (const c of el.children) {
      if (this.isHidden(c)) continue;
      if (BLOCKS.has(c.localName) || this.hasBlocks(c)) return true;
    }
    return false;
  }

  langOf(el, ctx) {
    const l = el.getAttribute('lang');
    return l ? withRegion(l) : ctx.lang;
  }

  /** The context inside `el`: its language, and its direction (dir="rtl|ltr", else from a lang attribute). */
  scope(el, ctx) {
    const lang = this.langOf(el, ctx);
    const dir = (el.getAttribute('dir') || '').toLowerCase();
    const rtl = dir === 'rtl' ? true : dir === 'ltr' ? false : el.hasAttribute('lang') ? isRtl(lang) : !!ctx.rtl;
    if (rtl) this.sawRtl = true;
    return { ...ctx, lang, rtl };
  }

  // --- inline content → run objects -------------------------------------------------
  inline(node, ctx, runs) {
    if (node.nodeType === 3) {
      runs.push({ text: node.textContent, ctx });
      return;
    }
    if (node.nodeType !== 1 || this.isHidden(node)) return;
    const tag = node.localName;
    const next = this.scope(node, ctx);
    if (tag === 'br') return void runs.push({ br: true });
    if (tag === 'img') {
      this.images++;
      const word = IMAGE_WORD[this.lang.split('-')[0]] || 'Image';
      runs.push({ text: ` [${word}: ${(node.getAttribute('alt') || '').trim() || '—'}] `, ctx });
      return;
    }
    if (tag === 'strong' || tag === 'b') next.b = true;
    else if (tag === 'em' || tag === 'i') next.i = true;
    else if (tag === 'u') next.u = true;
    else if (tag === 'code' || tag === 'kbd' || tag === 'samp' || tag === 'tt') next.code = true;
    else if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      if (/^(https?:|mailto:)/i.test(href)) next.link = this.link(href);
    } else if (!INLINE_KNOWN.has(tag) && !BLOCKS.has(tag) && !TABLE_PARTS.has(tag)) this.note(tag);
    for (const c of node.childNodes) this.inline(c, next, runs);
  }

  link(url) {
    const found = this.links.find((l) => l.url === url);
    if (found) return found.id;
    const id = `rId${10 + this.links.length}`;
    this.links.push({ id, url });
    return id;
  }

  rPr(ctx) {
    const p = [];
    if (ctx.link) p.push('<w:rStyle w:val="Hyperlink"/>');
    if (ctx.code) p.push('<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/>');
    if (ctx.b) p.push('<w:b/><w:bCs/>');
    if (ctx.i) p.push('<w:i/><w:iCs/>');
    if (ctx.u) p.push('<w:u w:val="single"/>');
    if (ctx.rtl) p.push('<w:rtl/>');
    if (ctx.lang && ctx.lang !== this.lang) {
      // Word reads a right-to-left run's language from w:bidi, every other run's from w:val.
      p.push(isRtl(ctx.lang) ? `<w:lang w:bidi="${esc(ctx.lang)}"/>` : `<w:lang w:val="${esc(ctx.lang)}"/>`);
    }
    return p.length ? `<w:rPr>${p.join('')}</w:rPr>` : '';
  }

  /** Collapses HTML whitespace across runs and trims the paragraph's ends. */
  tidy(runs, { pre = false } = {}) {
    if (pre) return runs;
    const out = [];
    let lastSpace = true; // at the start of a paragraph or after a break
    for (const r of runs) {
      if (r.br) {
        if (out.length && out.at(-1).text !== undefined) out.at(-1).text = out.at(-1).text.replace(/ $/, '');
        out.push(r);
        lastSpace = true;
        continue;
      }
      let t = r.text.replace(/[\t\n\r\f ]+/g, ' ');
      if (lastSpace) t = t.replace(/^ /, '');
      if (!t) continue;
      lastSpace = t.endsWith(' ');
      out.push({ ...r, text: t });
    }
    for (;;) {
      const last = out.at(-1);
      if (last?.br) out.pop();
      else if (last && !(last.text = last.text.replace(/ $/, ''))) out.pop();
      else return out;
    }
  }

  runsXml(runs) {
    let xml = '';
    let openLink = null;
    for (const r of runs) {
      const link = r.br ? openLink : r.ctx.link || null;
      if (link !== openLink) {
        if (openLink) xml += '</w:hyperlink>';
        if (link) xml += `<w:hyperlink r:id="${link}" w:history="1">`;
        openLink = link;
      }
      if (r.br) xml += '<w:r><w:br/></w:r>';
      else {
        const parts = r.text.split('\n');
        xml += `<w:r>${this.rPr(r.ctx)}${parts.map((t) => `<w:t xml:space="preserve">${esc(t)}</w:t>`).join('<w:br/>')}</w:r>`;
      }
    }
    if (openLink) xml += '</w:hyperlink>';
    return xml;
  }

  paragraph(out, runs, { style, numPr, border, pre, rtl } = {}) {
    const clean = this.tidy(runs, { pre });
    if (!clean.length && !border) return false;
    const pPr = [];
    if (style) pPr.push(`<w:pStyle w:val="${style}"/>`);
    if (this.pendingBreak) {
      pPr.push('<w:pageBreakBefore/>');
      this.pendingBreak = false;
    }
    if (numPr) pPr.push(`<w:numPr><w:ilvl w:val="${numPr.ilvl}"/><w:numId w:val="${numPr.numId}"/></w:numPr>`);
    if (border) pPr.push('<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="auto"/></w:pBdr>');
    if (rtl) pPr.push('<w:bidi/>');
    out.push(`<w:p>${pPr.length ? `<w:pPr>${pPr.join('')}</w:pPr>` : ''}${this.runsXml(clean)}</w:p>`);
    return true;
  }

  // --- block content ------------------------------------------------------------------
  /** Lays out the children of `el` as blocks; loose inline content becomes paragraphs. */
  children(el, ctx, out) {
    let pending = [];
    const flush = () => {
      if (pending.length) this.paragraph(out, pending, { style: ctx.pStyle, rtl: ctx.rtl });
      pending = [];
    };
    for (const c of el.childNodes) {
      if (c.nodeType === 1 && this.isHidden(c)) continue;
      const isBlock =
        c.nodeType === 1 && (BLOCKS.has(c.localName) || TABLE_PARTS.has(c.localName) || this.hasBlocks(c));
      if (isBlock) {
        flush();
        this.block(c, ctx, out);
      } else this.inline(c, ctx, pending);
    }
    flush();
  }

  block(el, ctx, out) {
    const tag = el.localName;
    if (this.breaksBefore(el)) this.pendingBreak = true;
    const here = this.scope(el, ctx);
    if (HEADINGS.has(tag)) {
      const runs = [];
      for (const c of el.childNodes) this.inline(c, here, runs);
      this.paragraph(out, runs, { style: `Heading${tag[1]}`, rtl: here.rtl });
    } else if (BLOCK_PARAGRAPHS.has(tag)) {
      if (this.hasBlocks(el)) return this.children(el, here, out);
      const runs = [];
      for (const c of el.childNodes) this.inline(c, here, runs);
      this.paragraph(out, runs, { style: ctx.pStyle, rtl: here.rtl });
    } else if (tag === 'ul' || tag === 'ol') this.list(el, here, out, 0);
    else if (tag === 'table') this.table(el, here, out);
    else if (tag === 'blockquote') this.children(el, { ...here, pStyle: 'Quote' }, out);
    else if (tag === 'hr') this.paragraph(out, [], { border: true });
    else if (tag === 'pre') {
      const runs = [{ text: el.textContent.replace(/\r\n/g, '\n').replace(/\n$/, ''), ctx: { ...here, code: true } }];
      this.paragraph(out, runs, { style: ctx.pStyle, pre: true });
    } else {
      if (!CONTAINERS.has(tag) && !TABLE_PARTS.has(tag) && tag !== 'li') this.note(tag);
      this.children(el, here, out);
    }
  }

  list(el, ctx, out, depth) {
    const ordered = el.localName === 'ol';
    const ilvl = Math.min(depth, 2);
    const numId = this.nums.length + 2; // numId 1 is the shared bullet list
    if (ordered) this.nums.push({ numId, ilvl, start: Number(el.getAttribute('start')) || 1 });
    const numPr = { ilvl, numId: ordered ? numId : 1 };
    for (const li of el.children) {
      if (this.isHidden(li)) continue;
      if (li.localName !== 'li') {
        this.block(li, ctx, out);
        continue;
      }
      if (this.breaksBefore(li)) this.pendingBreak = true;
      const here = this.scope(li, ctx);
      const runs = [];
      const nested = [];
      for (const c of li.childNodes) {
        if (c.nodeType === 1 && (c.localName === 'ul' || c.localName === 'ol')) nested.push(c);
        else if (c.nodeType === 1 && ['table', 'pre', 'blockquote'].includes(c.localName)) nested.push(c);
        else {
          if (runs.length && c.nodeType === 1 && BLOCK_PARAGRAPHS.has(c.localName)) runs.push({ br: true });
          this.inline(c, here, runs);
        }
      }
      this.paragraph(out, runs, { style: 'ListParagraph', numPr, rtl: here.rtl });
      for (const n of nested) {
        if (n.localName === 'ul' || n.localName === 'ol') this.list(n, here, out, depth + 1);
        else this.block(n, here, out);
      }
    }
  }

  table(el, ctx, out) {
    const rows = [...el.querySelectorAll(':scope > tr, :scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr')];
    if (!rows.length) return;
    if (this.pendingBreak) {
      out.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
      this.pendingBreak = false;
    }
    const cellsOf = (tr) => [...tr.children].filter((c) => c.localName === 'td' || c.localName === 'th');
    const span = (c) => Math.max(1, Number(c.getAttribute('colspan')) || 1);
    const cols = Math.max(...rows.map((tr) => cellsOf(tr).reduce((n, c) => n + span(c), 0)), 1);
    const colW = Math.floor(TEXT_WIDTH / cols);
    const border = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="000000"/>`;
    let xml =
      `<w:tbl><w:tblPr>${ctx.rtl ? '<w:bidiVisual/>' : ''}<w:tblW w:w="5000" w:type="pct"/><w:tblBorders>` +
      ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(border).join('') +
      '</w:tblBorders><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr>' +
      `<w:tblGrid>${`<w:gridCol w:w="${colW}"/>`.repeat(cols)}</w:tblGrid>`;
    for (const tr of rows) {
      const cells = cellsOf(tr);
      const header =
        tr.parentElement.localName === 'thead' || (cells.length && cells.every((c) => c.localName === 'th'));
      xml += `<w:tr>${header ? '<w:trPr><w:tblHeader/></w:trPr>' : ''}`;
      for (const c of cells) {
        const inner = [];
        this.children(c, { ...this.scope(c, ctx), b: c.localName === 'th' || ctx.b }, inner);
        if (!inner.length || !inner.at(-1).startsWith('<w:p')) inner.push('<w:p/>');
        const s = span(c);
        xml += `<w:tc><w:tcPr><w:tcW w:w="${colW * s}" w:type="dxa"/>${s > 1 ? `<w:gridSpan w:val="${s}"/>` : ''}</w:tcPr>${inner.join('')}</w:tc>`;
      }
      xml += '</w:tr>';
    }
    out.push(xml + '</w:tbl>');
  }
}

// --- package parts -------------------------------------------------------------------
function stylesXml({ lang, font, size, csFont }) {
  const hp = size * 2; // half-points
  const f = esc(font);
  const cs = esc(csFont || font);
  const heading = (n, factor) =>
    `<w:style w:type="paragraph" w:styleId="Heading${n}"><w:name w:val="heading ${n}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/>` +
    `<w:pPr><w:keepNext/><w:keepLines/><w:spacing w:before="240" w:after="120"/><w:outlineLvl w:val="${n - 1}"/></w:pPr>` +
    `<w:rPr><w:b/><w:bCs/><w:sz w:val="${Math.round(hp * factor)}"/><w:szCs w:val="${Math.round(hp * factor)}"/></w:rPr></w:style>`;
  return (
    XML +
    `<w:styles xmlns:w="${W}">` +
    `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${f}" w:hAnsi="${f}" w:eastAsia="${f}" w:cs="${cs}"/>` +
    `<w:sz w:val="${hp}"/><w:szCs w:val="${hp}"/><w:lang w:val="${esc(lang)}" w:eastAsia="${esc(lang)}" w:bidi="${esc(lang)}"/></w:rPr></w:rPrDefault>` +
    '<w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
    '<w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style>' +
    '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/>' +
    '<w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>' +
    '<w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style>' +
    [1.5, 1.33, 1.17, 1.08, 1, 1].map((factor, i) => heading(i + 1, factor)).join('') +
    '<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="34"/><w:qFormat/><w:pPr><w:ind w:left="720"/><w:contextualSpacing/></w:pPr></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Quote"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="29"/><w:qFormat/><w:pPr><w:ind w:left="567" w:right="567"/></w:pPr><w:rPr><w:i/><w:iCs/></w:rPr></w:style>' +
    '<w:style w:type="character" w:styleId="Hyperlink"><w:name w:val="Hyperlink"/><w:basedOn w:val="DefaultParagraphFont"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rPr><w:color w:val="0563C1"/><w:u w:val="single"/></w:rPr></w:style>' +
    '</w:styles>'
  );
}

function numberingXml(nums) {
  const lvl = (i, fmt, text) =>
    `<w:lvl w:ilvl="${i}"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/><w:lvlText w:val="${text}"/><w:lvlJc w:val="left"/>` +
    `<w:pPr><w:ind w:left="${720 * (i + 1)}" w:hanging="360"/></w:pPr></w:lvl>`;
  const bullets = ['•', '◦', '▪'].map((t, i) => lvl(i, 'bullet', t)).join('');
  const decimals = [lvl(0, 'decimal', '%1.'), lvl(1, 'lowerLetter', '%2)'), lvl(2, 'lowerRoman', '%3.')].join('');
  return (
    XML +
    `<w:numbering xmlns:w="${W}">` +
    `<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>${bullets}</w:abstractNum>` +
    `<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="hybridMultilevel"/>${decimals}</w:abstractNum>` +
    '<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>' +
    nums
      .map(
        (n) =>
          `<w:num w:numId="${n.numId}"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="${n.ilvl}"><w:startOverride w:val="${n.start}"/></w:lvlOverride></w:num>`,
      )
      .join('') +
    '</w:numbering>'
  );
}

function packageParts({ body, lang, title, font, size, conv, rtl }) {
  const ct = 'application/vnd.openxmlformats-officedocument.wordprocessingml';
  return [
    {
      name: '[Content_Types].xml',
      data:
        XML +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        `<Override PartName="/word/document.xml" ContentType="${ct}.document.main+xml"/>` +
        `<Override PartName="/word/styles.xml" ContentType="${ct}.styles+xml"/>` +
        `<Override PartName="/word/numbering.xml" ContentType="${ct}.numbering+xml"/>` +
        `<Override PartName="/word/settings.xml" ContentType="${ct}.settings+xml"/>` +
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
        '</Types>',
    },
    {
      name: '_rels/.rels',
      data:
        XML +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        `<Relationship Id="rId1" Type="${R}/officeDocument" Target="word/document.xml"/>` +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
        '</Relationships>',
    },
    {
      name: 'docProps/core.xml',
      data:
        XML +
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">' +
        `${title ? `<dc:title>${esc(title)}</dc:title>` : ''}<dc:language>${esc(lang)}</dc:language></cp:coreProperties>`,
    },
    {
      name: 'word/_rels/document.xml.rels',
      data:
        XML +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        `<Relationship Id="rId1" Type="${R}/styles" Target="styles.xml"/>` +
        `<Relationship Id="rId2" Type="${R}/numbering" Target="numbering.xml"/>` +
        `<Relationship Id="rId3" Type="${R}/settings" Target="settings.xml"/>` +
        conv.links
          .map((l) => `<Relationship Id="${l.id}" Type="${R}/hyperlink" Target="${esc(l.url)}" TargetMode="External"/>`)
          .join('') +
        '</Relationships>',
    },
    {
      name: 'word/document.xml',
      data:
        XML +
        `<w:document xmlns:w="${W}" xmlns:r="${R}"><w:body>${body}` +
        `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="709" w:footer="709" w:gutter="0"/>${rtl ? '<w:bidi/>' : ''}</w:sectPr>` +
        '</w:body></w:document>',
    },
    { name: 'word/styles.xml', data: stylesXml({ lang, font, size, csFont: conv.sawRtl ? RTL_FONT : undefined }) },
    { name: 'word/numbering.xml', data: numberingXml(conv.nums) },
    {
      name: 'word/settings.xml',
      data:
        XML +
        `<w:settings xmlns:w="${W}"><w:defaultTabStop w:val="708"/><w:characterSpacingControl w:val="doNotCompress"/>` +
        '<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>' +
        `<w:themeFontLang w:val="${esc(lang)}"/></w:settings>`,
    },
  ];
}

await runTool({
  id: 'docx',
  summary: 'Markdown or HTML → an accessible Word file (headings, lists, tables, language)',
  usage: 'node tools/docx.mjs <input.md|input.html> [options]',
  description: [
    'Writes a .docx with real heading styles, lists, tables, links and the document language,',
    'so a screen reader can navigate it and reads it in the right voice.',
  ],
  options: {
    out: {
      type: 'string',
      arg: '<file.docx>',
      help: 'where to write the Word file',
      defaultText: 'next to the input, .docx',
    },
    lang: { type: 'string', arg: '<bcp47>', help: 'document language, e.g. de, it, en-GB', defaultText: '<html lang>' },
    title: { type: 'string', arg: '<text>', help: 'document title', defaultText: '<title>, else the first h1' },
    select: {
      type: 'string',
      arg: '<css>',
      help: 'convert only this part of the page',
      defaultText: '<main>, else <body>',
    },
    font: { type: 'string', arg: '<name>', help: 'font', default: 'Verdana' },
    size: { type: 'string', arg: '<pt>', help: 'font size in points', default: '12' },
    force: { type: 'boolean', help: 'replace an existing output file' },
  },
  examples: [
    'node tools/docx.mjs out/teacher/arbeitsblatt.html',
    'node tools/docx.mjs notes.md --lang it --title "Il ciclo dell\'acqua"',
  ],
  async run({ values, positionals, report, root }) {
    if (positionals.length !== 1) throw new ToolError(EXIT.USAGE, 'give exactly one input file (.md or .html).');
    const input = inputFile(root, positionals[0], { exts: ['.md', '.markdown', '.html', '.htm'] });
    const size = positiveInt('size', values.size);
    const out = outputPath(root, values.out ?? input.replace(/\.(md|markdown|html?)$/i, '.docx'), {
      force: values.force,
      input,
    });

    let html = readText(input);
    if (/\.(md|markdown)$/i.test(input)) {
      const { marked } = await requireDep('marked');
      html = `<!doctype html><html><head></head><body>${marked.parse(html)}</body></html>`;
    }
    const { JSDOM } = await requireDep('jsdom');
    const { document } = new JSDOM(html).window;

    const given = values.lang || document.documentElement.getAttribute('lang');
    if (!given) throw new ToolError(EXIT.USAGE, 'no document language — set --lang or <html lang>.');
    const lang = withRegion(given.trim(), (m) => report.warn(m));

    let rootEl;
    if (values.select) {
      try {
        rootEl = document.querySelector(values.select);
      } catch {
        throw new ToolError(EXIT.USAGE, `--select "${values.select}" is not a valid CSS selector.`);
      }
      if (!rootEl) throw new ToolError(EXIT.USAGE, `--select "${values.select}" matches nothing in ${input}.`);
    } else rootEl = document.querySelector('main') || document.body;

    const title =
      values.title ||
      document.title.trim() ||
      rootEl.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() ||
      '';
    const dirAttr = (document.documentElement.getAttribute('dir') || document.body?.getAttribute('dir') || '')
      .trim()
      .toLowerCase();
    const rtl = dirAttr ? dirAttr === 'rtl' : isRtl(lang);
    const conv = new Converter({ lang });
    if (rtl) conv.sawRtl = true;
    const blocks = [];
    conv.children(rootEl, { lang, rtl }, blocks);
    if (!blocks.length)
      throw new ToolError(EXIT.USAGE, `no text found in ${input}${values.select ? ` under ${values.select}` : ''}.`);
    if (!blocks.at(-1).startsWith('<w:p')) blocks.push('<w:p/>');

    const parts = packageParts({ body: blocks.join(''), lang, title, font: values.font, size, conv, rtl });
    report.write(out, writeZip(parts, { first: ['[Content_Types].xml'] }));
    report.data.lang = lang;
    report.data.rtl = rtl;
    report.data.title = title;
    report.say(
      `${blocks.length} block(s), language ${lang}${rtl ? ', right to left' : ''}${title ? `, title "${title}"` : ''}`,
    );
    if (conv.images) {
      report.warn(`${conv.images} image(s) written as their alt text in brackets — images are not embedded.`);
    }
    if (conv.unmapped.size) {
      const list = [...conv.unmapped].sort().map(([t, n]) => `${t} (${n})`);
      report.warn(`${conv.unmapped.size} element type(s) without a Word mapping, text kept: ${list.join(', ')}`);
    }
    report.notChecked.push(
      'whether Word or LibreOffice opens it without a repair prompt on this machine: open it once',
      'images (only their alt text is written), colours and layout boxes',
      'whether the headings form a sensible outline (Word: View → Navigation Pane)',
    );
  },
});
