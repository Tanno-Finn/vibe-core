/**
 * DevModeService
 * Provides a "simulate production" toggle for development.
 * Only functional when Angular isDevMode() is true.
 * Persists toggle state in localStorage.
 */
import { Injectable, signal, computed, isDevMode } from '@angular/core';
import { environment } from '../../environments/environment';
import { safeStorage } from '../utils/safe-storage';

const STORAGE_KEY = 'dev-simulate-prod';

@Injectable({
  providedIn: 'root',
})
export class DevModeService {
  /** Whether the dev user has toggled "simulate prod" on */
  readonly simulateProd = signal(this.loadState());

  /** True when content should be treated as production (real prod OR simulated) */
  readonly isEffectivelyProd = computed(() => environment.production || this.simulateProd());

  /** True when we're in dev mode (toggle should be visible) */
  readonly showDevTools = isDevMode();

  toggle(): void {
    const next = !this.simulateProd();
    this.simulateProd.set(next);
    safeStorage.set(STORAGE_KEY, JSON.stringify(next));
  }

  private loadState(): boolean {
    if (environment.production) return false;
    try {
      return JSON.parse(safeStorage.get(STORAGE_KEY) || 'false');
    } catch {
      return false;
    }
  }
}
