import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { readZip } from '../../scripts/lib/zip.mjs';
import { BOM, FIX, run, scratch } from './helpers.mjs';

const fx = (name) => join(FIX, 'docx', name);

/** Converts and returns the parts as strings; every part must parse as XML. */
function convert(t, input, args = []) {
  const out = join(scratch(t), 'out.docx');
  const r = run('docx', [input, '--out', out, '--json', ...args]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const zip = readZip(readFileSync(out));
  const parts = {};
  for (const [name, data] of zip) {
    parts[name] = data.toString('utf8');
    const doc = new JSDOM(parts[name], { contentType: 'application/xml' }).window.document;
    assert.equal(doc.getElementsByTagName('parsererror').length, 0, `${name} does not parse`);
  }
  return { parts, report: r.json(), out };
}

const headings = (xml) => [...xml.matchAll(/<w:pStyle w:val="(Heading\d)"\/>/g)].map((m) => m[1]);

test('docx: the worksheet keeps headings, lists, table, link and both languages', (t) => {
  const { parts } = convert(t, fx('worksheet.html'));
  const doc = parts['word/document.xml'];
  assert.deepEqual(headings(doc), ['Heading1', 'Heading2', 'Heading2', 'Heading3']);
  assert.ok((doc.match(/<w:numPr>/g) || []).length >= 2, 'list items carry numbering');
  assert.equal((doc.match(/<w:tbl>/g) || []).length, 1);
  assert.match(doc, /<w:tblHeader\/>/);
  const link = /<w:hyperlink r:id="(rId\d+)"/.exec(doc);
  assert.ok(link, 'a hyperlink exists');
  assert.match(parts['word/_rels/document.xml.rels'], new RegExp(`Id="${link[1]}"[^>]*TargetMode="External"`));
  assert.match(doc, /<w:lang w:val="it-IT"\/><\/w:rPr><w:t xml:space="preserve">L'acqua/);
  assert.match(parts['word/styles.xml'], /<w:lang w:val="de-DE"/);
  assert.match(parts['docProps/core.xml'], /<dc:title>Der Wasserkreislauf<\/dc:title>/);
  assert.doesNotMatch(parts['docProps/core.xml'], /dcterms:created|dc:creator/);
  assert.match(doc, /<w:pageBreakBefore\/>/, 'the page-break div starts a new page');
});

test('docx: aria-hidden boxes are not in the text', (t) => {
  const { parts } = convert(t, fx('worksheet.html'));
  assert.doesNotMatch(parts['word/document.xml'], /☐/);
});

test('docx: Markdown with every element converts, and [Content_Types].xml comes first', (t) => {
  const { parts, report, out } = convert(t, fx('all-elements.md'), ['--lang', 'en']);
  const doc = parts['word/document.xml'];
  assert.deepEqual(headings(doc), ['Heading1', 'Heading2', 'Heading3']);
  assert.match(doc, /<w:ilvl w:val="1"\/><w:numId w:val="1"\/>/, 'the nested bullet list is on level 2');
  assert.match(doc, /<w:tblHeader\/>/);
  assert.match(doc, /<w:pStyle w:val="Quote"\/>/);
  assert.match(doc, /\[Image: A cloud over a lake\]/);
  assert.match(parts['word/styles.xml'], /<w:lang w:val="en-US"/);
  assert.ok(report.warnings.some((w) => /image/.test(w)));
  const bytes = readFileSync(out);
  assert.equal(bytes.toString('utf8', 30, 30 + '[Content_Types].xml'.length), '[Content_Types].xml');
});

test('docx: no language anywhere is exit 2', () => {
  const r = run('docx', [fx('all-elements.md'), '--out', join('tmp', 'never.docx')]);
  assert.equal(r.status, 2);
  assert.match(r.stdout + r.stderr, /set --lang or <html lang>/);
});

test('docx: two runs give identical bytes', (t) => {
  const dir = scratch(t);
  assert.equal(run('docx', [fx('worksheet.html'), '--out', join(dir, 'a.docx')]).status, 0);
  assert.equal(run('docx', [fx('worksheet.html'), '--out', join(dir, 'b.docx')]).status, 0);
  assert.ok(readFileSync(join(dir, 'a.docx')).equals(readFileSync(join(dir, 'b.docx'))));
});

test('docx: Ladin is written as it-IT with a warning', (t) => {
  const { parts, report } = convert(t, fx('all-elements.md'), ['--lang', 'lld']);
  assert.match(parts['word/styles.xml'], /<w:lang w:val="it-IT"/);
  assert.ok(report.warnings.some((w) => /Ladin/.test(w)));
});

test('docx: --help exits 0, an unknown flag exits 2', () => {
  assert.equal(run('docx', ['--help']).status, 0);
  assert.equal(run('docx', ['--nope']).status, 2);
});

test('docx: a byte-order mark in front of the Markdown (Windows editors) does not swallow the first heading', (t) => {
  const input = join(scratch(t), 'bom.md');
  writeFileSync(input, BOM + '# Titel\n\nEin Satz.\n\n## Teil\n\nNoch ein Satz.\n');
  const { parts } = convert(t, input, ['--lang', 'de']);
  assert.deepEqual(headings(parts['word/document.xml']), ['Heading1', 'Heading2']);
  assert.doesNotMatch(parts['word/document.xml'], new RegExp(`${BOM}|# Titel`));
});

test('docx: control characters XML forbids are dropped, so Word can open the file', (t) => {
  const input = join(scratch(t), 'ctrl.html');
  writeFileSync(
    input,
    '<!doctype html><html lang="de"><head><title>T&#1;itel</title></head><body><p>A\u000bB</p></body></html>',
  );
  const { parts } = convert(t, input);
  assert.match(parts['docProps/core.xml'], /<dc:title>Titel<\/dc:title>/);
  assert.match(parts['word/document.xml'], />AB</);
});

test('docx: --out naming the input itself is exit 2, even with --force, and the input stays', (t) => {
  const input = join(scratch(t), 'notes.md');
  writeFileSync(input, '# Notes\n');
  const r = run('docx', [input, '--lang', 'en', '--out', input, '--force']);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.equal(readFileSync(input, 'utf8'), '# Notes\n');
});

test('docx: an Arabic document is right to left — paragraphs, runs, table, page — with Arial for its letters', (t) => {
  const input = join(scratch(t), 'ar.html');
  writeFileSync(
    input,
    '<!doctype html><html lang="ar"><body><h1>دورة الماء</h1><p>يتبخر الماء.</p>' +
      '<table><tr><th>كلمة</th><th>معنى</th></tr><tr><td>تبخر</td><td></td></tr></table>' +
      '<p lang="de" dir="ltr">Deutsch</p></body></html>',
  );
  const { parts, report } = convert(t, input);
  const doc = parts['word/document.xml'];
  assert.equal(report.rtl, true);
  assert.match(doc, /<w:pStyle w:val="Heading1"\/><w:bidi\/>/, 'the heading is a right-to-left paragraph');
  assert.match(doc, /<w:rtl\/><\/w:rPr><w:t xml:space="preserve">يتبخر/, 'the run is right to left');
  assert.match(doc, /<w:tblPr><w:bidiVisual\/>/, 'the table is mirrored');
  assert.match(doc, /<w:bidi\/><\/w:sectPr>/, 'the page is right to left');
  assert.match(
    doc,
    /<w:lang w:val="de-DE"\/><\/w:rPr><w:t xml:space="preserve">Deutsch/,
    'the German line is marked German',
  );
  assert.doesNotMatch(doc, /<w:rtl\/><\/w:rPr><w:t xml:space="preserve">Deutsch/, 'and is left to right');
  assert.match(parts['word/styles.xml'], /w:cs="Arial"/);
  assert.match(parts['word/styles.xml'], /<w:lang w:val="ar-SA"/);
});

test('docx: a German document stays left to right, with no direction markup at all', (t) => {
  const { parts, report } = convert(t, fx('worksheet.html'));
  assert.equal(report.rtl, false);
  assert.doesNotMatch(parts['word/document.xml'], /<w:bidi\/>|<w:rtl\/>|bidiVisual/);
  assert.match(parts['word/styles.xml'], /w:cs="Verdana"/);
});
