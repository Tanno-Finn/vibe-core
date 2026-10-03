import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'info' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastConfig {
  summary: string;
  detail?: string;
  type: ToastType;
  icon?: string;
  position?: ToastPosition;
  duration?: number;
  closable?: boolean;
  action?: {
    label: string;
    command: () => void;
  };
}

export interface Toast extends ToastConfig {
  id: string;
  visible: boolean;
  timeoutId?: ReturnType<typeof setTimeout>;
}

/**
 * Service for showing toast notifications across the application
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private nextId: number = 1;

  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  // Maximum number of toasts to display
  private readonly MAX_TOASTS = 5;

  // Default configuration
  private defaultConfig: Partial<ToastConfig> = {
    type: 'info',
    position: 'top-right',
    duration: 3000,
    closable: true,
  };

  constructor() {}

  /**
   * Show a success toast message
   */
  showSuccess(summary: string, detail?: string, config: Partial<ToastConfig> = {}): string {
    return this.show({
      ...this.defaultConfig,
      ...config,
      summary,
      detail,
      type: 'success',
      icon: config.icon || 'pi pi-check-circle',
    });
  }

  /**
   * Show an info toast message
   */
  showInfo(summary: string, detail?: string, config: Partial<ToastConfig> = {}): string {
    return this.show({
      ...this.defaultConfig,
      ...config,
      summary,
      detail,
      type: 'info',
      icon: config.icon || 'pi pi-info-circle',
    });
  }

  /**
   * Show a warning toast message
   */
  showWarning(summary: string, detail?: string, config: Partial<ToastConfig> = {}): string {
    return this.show({
      ...this.defaultConfig,
      ...config,
      summary,
      detail,
      type: 'warning',
      icon: config.icon || 'pi pi-exclamation-triangle',
    });
  }

  /**
   * Show an error toast message
   */
  showError(summary: string, detail?: string, config: Partial<ToastConfig> = {}): string {
    return this.show({
      ...this.defaultConfig,
      ...config,
      summary,
      detail,
      type: 'error',
      icon: config.icon || 'pi pi-times-circle',
    });
  }

  /**
   * Show a custom toast with given configuration
   */
  show(config: ToastConfig): string {
    // Merge with default config
    const fullConfig: ToastConfig = {
      ...this.defaultConfig,
      ...config,
    };

    // Create toast
    const id = `toast_${this.nextId++}`;
    const toast: Toast = {
      ...fullConfig,
      id,
      visible: true,
    };

    // Add to toasts array
    this.toasts.push(toast);

    // Remove oldest toasts if we exceed MAX_TOASTS
    if (this.toasts.length > this.MAX_TOASTS) {
      // Remove the oldest toasts (from the beginning)
      const toastsToRemove = this.toasts.slice(0, this.toasts.length - this.MAX_TOASTS);

      // Clear timeouts for removed toasts with a slight delay for animation
      toastsToRemove.forEach((oldToast) => {
        if (oldToast.timeoutId) {
          clearTimeout(oldToast.timeoutId);
        }

        // Mark as not visible for animation
        oldToast.visible = false;
      });

      // Remove after animation delay (300ms)
      setTimeout(() => {
        // Keep only the last MAX_TOASTS
        this.toasts = this.toasts.slice(-this.MAX_TOASTS);
        this.emitToasts();
      }, 300);
    }

    this.emitToasts();

    // Auto close after duration if specified
    if (fullConfig.duration && fullConfig.duration > 0) {
      toast.timeoutId = setTimeout(() => {
        this.remove(id);
      }, fullConfig.duration);
    }

    return id;
  }

  /**
   * Remove a specific toast by id
   */
  remove(id: string): void {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      const toast = this.toasts[index];

      // Clear the timeout if it exists
      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }

      // Remove the toast
      this.toasts.splice(index, 1);
      this.emitToasts();
    }
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    // Clear all timeouts
    this.toasts.forEach((toast) => {
      if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
      }
    });

    // Clear the array
    this.toasts = [];
    this.emitToasts();
  }

  /**
   * Emit the updated toasts array
   */
  private emitToasts(): void {
    this.toastsSubject.next([...this.toasts]);
  }
}
