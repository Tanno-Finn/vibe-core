/**
 * safeStorage spec — the wrapper's whole job is "never throw": Safari Private
 * Mode, quota errors and disabled storage all make `localStorage` throw, and a
 * throw during bootstrap is a white screen. It also pins the absence of
 * `clear()`, whose use by the update check used to wipe every preference.
 */
import { safeStorage } from './safe-storage';

describe('safeStorage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('round-trips a value through set, get and remove', () => {
    safeStorage.set('mode', 'dark');
    expect(safeStorage.get('mode')).toBe('dark');
    expect(localStorage.getItem('mode')).toBe('dark');

    safeStorage.remove('mode');
    expect(safeStorage.get('mode')).toBeNull();
  });

  it('returns null for a key that was never written', () => {
    expect(safeStorage.get('never-written')).toBeNull();
  });

  it('returns null instead of throwing when reading is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    expect(() => safeStorage.get('mode')).not.toThrow();
    expect(safeStorage.get('mode')).toBeNull();
  });

  it('swallows a quota error on write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(() => safeStorage.set('mode', 'dark')).not.toThrow();
  });

  it('swallows an error on remove', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    expect(() => safeStorage.remove('mode')).not.toThrow();
  });

  it('offers no blanket clear() — targeted helpers live in storage-keys.ts', () => {
    expect('clear' in safeStorage).toBe(false);
  });
});
