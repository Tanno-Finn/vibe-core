/**
 * FAB Registry Service
 *
 * Central service for managing Floating Action Buttons (FABs) across the application.
 * Pages register/unregister FABs dynamically, and the FabContainerComponent renders them.
 *
 * Priority determines vertical position:
 * - Higher priority = lower position (closer to bottom)
 * - Feedback: 100 (always at bottom)
 * - Easy Language: 50 (middle)
 * - Table of Contents: 10 (top)
 */

import { Injectable, signal, computed } from '@angular/core';

/**
 * FAB color themes
 */
export type FabColor = 'default' | 'primary' | 'teal' | 'orange' | 'blue' | 'green' | 'red';

/**
 * FAB registration data
 */
export interface FabRegistration {
  /** Unique identifier for the FAB */
  id: string;

  /** Priority determines position: higher = lower on screen */
  priority: number;

  /** Optimus UI icon class (e.g., 'pi-megaphone', 'pi-list') */
  icon: string;

  /** Translation key for the label */
  labelKey: string;

  /** Color theme */
  color: FabColor;

  /** Callback when FAB is clicked */
  onClick: () => void;

  /** Whether the FAB is visible (default: true) */
  visible?: boolean;

  /** Optional badge count (e.g., for compare count) */
  badge?: number;

  /** ARIA haspopup attribute for FABs that open panels/dialogs */
  ariaHaspopup?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | 'true';

  /** ARIA expanded state for FABs that open panels/dialogs */
  ariaExpanded?: boolean;
}

/**
 * Stable ids for the mutually-exclusive modal FAB dialogs. These are the
 * values stored in `FabRegistryService.openDialogId` — the two dialog
 * components claim/watch the slot by these ids, so they MUST agree. Keep them
 * here (single source of truth) rather than as per-component string literals.
 */
export const FAB_DIALOG = {
  FEEDBACK: 'feedback',
  EASY_LANGUAGE: 'easy-language',
} as const;

/**
 * Standard priority constants
 */
export const FAB_PRIORITIES = {
  FEEDBACK: 100, // Always at bottom
  EASY_LANGUAGE: 50, // Middle
  EXPORT: 30, // Between ToC and Easy Language
  TABLE_OF_CONTENTS: 10, // Top area
  COMPARE: 5, // Very top
  SCROLL_TO_TOP: 1, // Above all other FABs (transient, slides in)
} as const;

@Injectable({
  providedIn: 'root',
})
export class FabRegistryService {
  /** Internal FAB storage */
  private fabMap = signal<Map<string, FabRegistration>>(new Map());

  /**
   * ID of the FAB dialog that is currently open (or null).
   *
   * The modal FAB dialogs (feedback, easy-language) are independent
   * components with their own visibility state. They register themselves
   * here on open and watch this signal so that opening one auto-closes any
   * sibling — only one FAB dialog can be open at a time. Use `setActiveDialog`
   * to claim/release the slot.
   */
  private activeDialogId = signal<string | null>(null);
  readonly openDialogId = this.activeDialogId.asReadonly();

  /**
   * Claim (or, with null, release) the single FAB-dialog slot. Any other
   * open FAB dialog watching `openDialogId` will close itself.
   */
  setActiveDialog(id: string | null): void {
    this.activeDialogId.set(id);
  }

  /**
   * All registered FABs sorted by priority (lowest first = top, highest last = bottom)
   * In a column flex container, first items render at top, last at bottom.
   */
  sortedFabs = computed(() => {
    const fabs = [...this.fabMap().values()];
    // Sort by priority ascending: low priority (ToC: 10) at top, high priority (Feedback: 100) at bottom
    return fabs.sort((a, b) => a.priority - b.priority);
  });

  /**
   * Count of visible FABs
   */
  visibleCount = computed(() => {
    return this.sortedFabs().filter((fab) => fab.visible !== false).length;
  });

  /**
   * Register a new FAB
   * @param fab FAB registration data
   */
  register(fab: FabRegistration): void {
    const current = this.fabMap();
    const updated = new Map(current);
    updated.set(fab.id, { ...fab, visible: fab.visible ?? true });
    this.fabMap.set(updated);
  }

  /**
   * Unregister a FAB by ID
   * @param id FAB identifier
   */
  unregister(id: string): void {
    const current = this.fabMap();
    if (current.has(id)) {
      const updated = new Map(current);
      updated.delete(id);
      this.fabMap.set(updated);
    }
  }

  /**
   * Update FAB visibility
   * @param id FAB identifier
   * @param visible New visibility state
   */
  updateVisibility(id: string, visible: boolean): void {
    const current = this.fabMap();
    const fab = current.get(id);
    if (fab) {
      const updated = new Map(current);
      updated.set(id, { ...fab, visible });
      this.fabMap.set(updated);
    }
  }

  /**
   * Update FAB badge count
   * @param id FAB identifier
   * @param count New badge count (0 or undefined to hide)
   */
  updateBadge(id: string, count: number | undefined): void {
    const current = this.fabMap();
    const fab = current.get(id);
    if (fab) {
      const updated = new Map(current);
      updated.set(id, { ...fab, badge: count });
      this.fabMap.set(updated);
    }
  }

  /**
   * Check if a FAB is registered
   * @param id FAB identifier
   */
  isRegistered(id: string): boolean {
    return this.fabMap().has(id);
  }

  /**
   * Get a specific FAB by ID
   * @param id FAB identifier
   */
  getFab(id: string): FabRegistration | undefined {
    return this.fabMap().get(id);
  }

  /**
   * Clear all FABs (useful for testing)
   */
  clearAll(): void {
    this.fabMap.set(new Map());
  }
}
