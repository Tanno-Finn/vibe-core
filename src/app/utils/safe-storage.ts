/**
 * Safe localStorage wrapper that swallows exceptions.
 *
 * Why this exists: Safari Private Mode, strict cookie settings, quota errors,
 * and disabled storage all cause `localStorage` access to throw. When a
 * constructor-bound service like ThemeService or UserProgressService reads
 * localStorage during app bootstrap, an unhandled throw crashes the entire
 * Angular app with a white screen.
 *
 * Usage:
 *   import { safeStorage } from '../utils/safe-storage';
 *   const value = safeStorage.get('theme');
 *   safeStorage.set('theme', 'dark');
 *   safeStorage.remove('theme');
 *
 * There is deliberately no `clear()`. A blanket wipe is how every deploy used to
 * erase theme, font, language and the feedback inbox. To drop caches use
 * `clearUpdateCaches()`, to honor "delete all my data" use
 * `removeAllKitStorage()` — both in `storage-keys.ts`, which lists every key.
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, value);
    } catch {
      // Silently ignore — Private Mode, quota exceeded, disabled storage, SSR
    }
  },

  remove(key: string): void {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
    } catch {
      // Silently ignore
    }
  },
};
