import { dateLocaleFor, formatNumberFor, numberLocaleFor } from './date-locale';

describe('dateLocaleFor', () => {
  // Noon, so no time zone the suite runs in can move the day.
  const date = new Date(2026, 6, 15, 12, 0, 0);
  const long: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const numeric: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

  it('maps English and its Easy-Language variant to American English', () => {
    expect(dateLocaleFor('en')).toBe('en-US');
    expect(dateLocaleFor('en-easy')).toBe('en-US');
  });

  it('maps German and its Easy-Language variant to German German', () => {
    expect(dateLocaleFor('de')).toBe('de-DE');
    expect(dateLocaleFor('de-easy')).toBe('de-DE');
  });

  it('falls back to the key-source language for an empty code', () => {
    expect(dateLocaleFor('')).toBe('en-US');
    expect(dateLocaleFor(undefined)).toBe('en-US');
  });

  it('leaves a language without a house-style region at its base code', () => {
    expect(dateLocaleFor('fr')).toBe('fr');
  });

  it('writes an English date the American way: month, day, comma, year', () => {
    expect(date.toLocaleDateString(dateLocaleFor('en'), long)).toBe('July 15, 2026');
    expect(date.toLocaleDateString(dateLocaleFor('en-easy'), long)).toBe('July 15, 2026');
    expect(date.toLocaleDateString(dateLocaleFor('en'), numeric)).toBe('07/15/2026');
  });

  it('writes a German date the German way', () => {
    expect(date.toLocaleDateString(dateLocaleFor('de'), long)).toBe('15. Juli 2026');
    expect(date.toLocaleDateString(dateLocaleFor('de-easy'), long)).toBe('15. Juli 2026');
    expect(date.toLocaleDateString(dateLocaleFor('de'), numeric)).toBe('15.07.2026');
  });
});

describe('numberLocaleFor / formatNumberFor', () => {
  it('uses the same house-style regions as dates', () => {
    expect(numberLocaleFor('en-easy')).toBe('en-US');
    expect(numberLocaleFor('de')).toBe('de-DE');
    expect(numberLocaleFor(undefined)).toBe('en-US');
  });

  it('groups and rounds in the page language, not the browser locale', () => {
    expect(formatNumberFor(1234567.4, 'en')).toBe('1,234,567');
    expect(formatNumberFor(1234567.4, 'de-easy')).toBe('1.234.567');
  });

  it('writes fixed fraction digits with the language decimal separator', () => {
    expect(formatNumberFor(3.25, 'en', 1)).toBe('3.3');
    expect(formatNumberFor(3.25, 'de', 1)).toBe('3,3');
    expect(formatNumberFor(12, 'de', 2)).toBe('12,00');
  });
});
