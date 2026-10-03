/**
 * CheckpointComponent - Reusable learning checkpoint for lessons
 *
 * Displays a list of learning goals that users can mark as understood.
 * Persists completion state through UserProgressService (saved to localStorage
 * only with progress consent; otherwise kept for the session).
 * Provides visual feedback with animations and toast notifications.
 *
 * Usage:
 * <app-checkpoint
 *   checkpointId="foundations"
 *   storageKey="prompting-guide-checkpoints"
 *   [items]="[{ textKey: 'articleApisMcp.checkpoint.item1' }]"
 *   titleKey="articleApisMcp.checkpoint.title"
 *   (completed)="onCheckpointCompleted($event)"
 *   (uncompleted)="onCheckpointUncompleted($event)">
 * </app-checkpoint>
 */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { ToastService } from '../../services/toast.service';
import { UserProgressService } from '../../services/user-progress.service';
import { safeStorage } from '../../utils/safe-storage';

export interface CheckpointItem {
  text?: string;
  textKey?: string;
}

@Component({
  selector: 'app-checkpoint',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkpoint" [class.completed]="isCompleted" [attr.id]="'checkpoint-' + checkpointId">
      <div class="checkpoint-header">
        <i class="header-icon pi" [ngClass]="isCompleted ? 'pi-check-circle' : icon"></i>
        @switch (headingLevel) {
          @case (2) {
            <h2 class="checkpoint-title">{{ t(titleKey) }}</h2>
          }
          @case (3) {
            <h3 class="checkpoint-title">{{ t(titleKey) }}</h3>
          }
          @case (4) {
            <h4 class="checkpoint-title">{{ t(titleKey) }}</h4>
          }
          @case (5) {
            <h5 class="checkpoint-title">{{ t(titleKey) }}</h5>
          }
          @default {
            <h6 class="checkpoint-title">{{ t(titleKey) }}</h6>
          }
        }
      </div>
      <div class="checkpoint-body">
        <div class="checkpoint-content">
          <ul>
            @for (item of items; track item) {
              <li>{{ getItemText(item) }}</li>
            }
          </ul>
        </div>
        <button
          class="checkpoint-action"
          (click)="toggle()"
          [attr.aria-pressed]="isCompleted"
          [attr.aria-label]="isCompleted ? t(completedLabelKey) : t(markCompleteKey)"
        >
          <span class="action-icon">
            <i class="pi" [ngClass]="isCompleted ? 'pi-check' : 'pi-circle'"></i>
          </span>
          <span class="action-text">
            {{ isCompleted ? t(completedLabelKey) : t(markCompleteKey) }}
          </span>
        </button>
      </div>
      @if (isFlashing) {
        <div class="checkpoint-flash"></div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* A query container: the @container rules below read the width of the
       column this widget sits in (article, demo frame, card), not the window. */
      :host {
        display: block;
        container-type: inline-size;
      }

      /* Container shell — matches StandardContainer visual pattern */
      .checkpoint {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        margin-bottom: var(--space-4);
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s ease;
      }

      /* State: not completed — warning look (dashed border for non-color differentiation) */
      .checkpoint:not(.completed) {
        border-left-width: var(--border-width-accent, 3px);
        border-left-style: dashed;
        border-left-color: var(--semantic-orange-fg, #c2410c);
        border-color: color-mix(in srgb, var(--semantic-orange-fg, #c2410c) 30%, var(--surface-border));
        border-left-color: var(--semantic-orange-fg, #c2410c);
      }

      /* State: completed — success look (solid border for non-color differentiation) */
      .checkpoint.completed {
        border-left-width: var(--border-width-accent, 3px);
        border-left-style: solid;
        border-left-color: var(--semantic-green-fg, #15803d);
        border-color: color-mix(in srgb, var(--semantic-green-fg, #15803d) 30%, var(--surface-border));
        border-left-color: var(--semantic-green-fg, #15803d);
      }

      /* Header */
      .checkpoint-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--surface-border);
        transition: background 0.3s ease;
      }

      .checkpoint:not(.completed) .checkpoint-header {
        background: color-mix(in srgb, var(--semantic-orange-fg, #c2410c) 15%, var(--surface-card));
      }

      .checkpoint.completed .checkpoint-header {
        background: color-mix(in srgb, var(--semantic-green-fg, #15803d) 15%, var(--surface-card));
      }

      .checkpoint-header .checkpoint-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      /* 800, not 700: on the tinted header the 700 shades fall under 4.5:1 (orange
         measured 4.14:1 by check-a11y; green computes to about 4.2:1). */
      .checkpoint:not(.completed) .checkpoint-header .checkpoint-title {
        color: var(--p-orange-800, #9a3412);
      }

      .checkpoint.completed .checkpoint-header .checkpoint-title {
        color: var(--p-green-800, #166534);
      }

      :host-context(.dark-theme) .checkpoint:not(.completed) .checkpoint-header .checkpoint-title {
        color: var(--p-orange-400, #fb923c);
      }

      :host-context(.dark-theme) .checkpoint.completed .checkpoint-header .checkpoint-title {
        color: var(--p-green-400, #4ade80);
      }

      .header-icon {
        font-size: 1.1rem;
        transition: color 0.3s ease;
      }

      .checkpoint:not(.completed) .header-icon {
        color: var(--semantic-orange-fg, #c2410c);
      }

      .checkpoint.completed .header-icon {
        color: var(--semantic-green-fg, #15803d);
      }

      /* Body — content + action side by side */
      .checkpoint-body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-4);
      }

      .checkpoint-content {
        flex: 1;
        min-width: 250px;
      }

      .checkpoint-content ul {
        margin: 0;
        padding-left: var(--space-5);
      }

      .checkpoint-content li {
        margin-bottom: var(--space-1);
        color: var(--text-color-secondary);
        line-height: 1.5;
      }

      /* Action button */
      .checkpoint-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        padding: var(--space-3);
        border: 2px solid var(--surface-border);
        border-radius: var(--border-radius);
        background: var(--surface-card);
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 180px;
        width: 180px;
      }

      .checkpoint:not(.completed) .checkpoint-action:hover {
        border-color: var(--semantic-orange-fg, #c2410c);
      }

      .checkpoint:not(.completed) .checkpoint-action:hover .action-icon {
        background: var(--semantic-orange-fg, #c2410c);
        border-color: var(--semantic-orange-fg, #c2410c);
        color: var(--primary-color-text, #fff);
      }

      .checkpoint:not(.completed) .checkpoint-action:hover .action-text {
        color: var(--p-orange-600, #ea580c);
      }

      .checkpoint.completed .checkpoint-action:hover {
        border-color: var(--semantic-green-fg, #15803d);
      }

      .action-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 52px;
        border: 3px solid var(--surface-border);
        border-radius: 50%;
        font-size: 1.5rem;
        color: var(--text-color-secondary);
        transition: all 0.2s ease;
      }

      .checkpoint.completed .action-icon {
        background: var(--semantic-green-fg, #15803d);
        border-color: var(--semantic-green-fg, #15803d);
        color: var(--primary-color-text, #fff);
      }

      .action-text {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-color-secondary);
        text-align: center;
        transition: color 0.2s ease;
      }

      .checkpoint.completed .action-text {
        color: var(--p-green-600, #16a34a);
      }

      /* Flash animation on completion */
      .checkpoint-flash {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
          circle,
          color-mix(in srgb, var(--semantic-green-fg, #15803d) 30%, transparent) 0%,
          transparent 70%
        );
        animation: flash-pulse 0.6s ease-out forwards;
        pointer-events: none;
      }

      @keyframes flash-pulse {
        0% {
          opacity: 1;
          transform: scale(0.8);
        }
        100% {
          opacity: 0;
          transform: scale(1.5);
        }
      }

      /* WCAG 2.3.3: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .checkpoint,
        .checkpoint-header,
        .checkpoint-action,
        .action-icon,
        .action-text,
        .checkpoint-flash {
          animation: none !important;
          transition: none !important;
        }
      }

      /* Narrow widget */
      @container (max-width: 768px) {
        .checkpoint-body {
          flex-direction: column;
          align-items: stretch;
        }

        .checkpoint-action {
          width: 100%;
          flex-direction: row;
          justify-content: center;
          gap: var(--space-3);
        }
      }

      /* Print styles */
      @media print {
        .checkpoint {
          break-inside: avoid;
        }

        .checkpoint-action {
          display: none;
        }
      }
    `,
  ],
})
export class CheckpointComponent implements OnInit {
  @Input() checkpointId = '';
  @Input() storageKey = '';
  @Input() items: CheckpointItem[] = [];
  @Input() titleKey = 'checkpoint.title';
  @Input() headingLevel: 2 | 3 | 4 | 5 | 6 = 3;
  @Input() markCompleteKey = 'checkpoint.markComplete';
  @Input() completedLabelKey = 'checkpoint.completedLabel';
  @Input() toastTitleKey = 'checkpoint.completed';
  @Input() toastMessageKey = 'checkpoint.progressSaved';
  @Input() toastNotSavedKey = 'checkpoint.progressNotSaved';
  @Input() icon = 'pi-list-check';

  @Output() completed = new EventEmitter<string>();
  @Output() uncompleted = new EventEmitter<string>();

  isCompleted = false;
  isFlashing = false;

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  private translationService = inject(TranslationService);
  private toastService = inject(ToastService);
  private userProgressService = inject(UserProgressService);

  ngOnInit(): void {
    this.loadState();

    // Re-check state on language change (in case storage was modified elsewhere)
    this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Force change detection by reloading state
      this.loadState();
      this.cdr.markForCheck();
    });
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  getItemText(item: CheckpointItem): string {
    if (item.text) {
      return item.text;
    }
    if (item.textKey) {
      return this.t(item.textKey);
    }
    return '';
  }

  toggle(): void {
    const wasCompleted = this.isCompleted;
    this.isCompleted = !this.isCompleted;
    this.saveState();

    if (this.isCompleted && !wasCompleted) {
      // Just completed
      this.isFlashing = true;
      // "Your progress has been saved." is only true with progress consent;
      // without it the tick lives in this session only, and the toast says so
      // (and where to allow saving) instead of leaving the visitor to assume.
      const detail = this.t(this.userProgressService.isSaving() ? this.toastMessageKey : this.toastNotSavedKey);
      this.toastService.showSuccess(this.t(this.toastTitleKey), detail);
      this.completed.emit(this.checkpointId);

      setTimeout(() => {
        this.isFlashing = false;
        this.cdr.markForCheck();
      }, 600);
    } else if (!this.isCompleted && wasCompleted) {
      // Just uncompleted
      this.uncompleted.emit(this.checkpointId);
    }
  }

  private loadState(): void {
    if (!this.storageKey || !this.checkpointId) {
      return;
    }
    this.migrateFromLocalStorage();
    this.isCompleted = this.userProgressService.isCheckpointCompleted(this.storageKey, this.checkpointId);
  }

  private saveState(): void {
    if (!this.storageKey || !this.checkpointId) {
      return;
    }
    if (this.isCompleted) {
      this.userProgressService.setCheckpointCompleted(this.storageKey, this.checkpointId);
    } else {
      this.userProgressService.removeCheckpointCompleted(this.storageKey, this.checkpointId);
    }
  }

  /**
   * One-time migration from legacy localStorage to UserProgressService. The
   * ticks are read into the session either way; the old key is only removed
   * once they can be saved in its place (progress consent). Without consent it
   * stays until the visitor decides — a "no" removes it with the rest.
   */
  private migrateFromLocalStorage(): void {
    if (!this.storageKey) return;
    try {
      const stored = safeStorage.get(this.storageKey);
      if (stored) {
        const checkpoints: string[] = JSON.parse(stored);
        for (const id of checkpoints) {
          this.userProgressService.setCheckpointCompleted(this.storageKey, id);
        }
        if (this.userProgressService.isSaving()) {
          safeStorage.remove(this.storageKey);
        }
      }
    } catch {
      safeStorage.remove(this.storageKey);
    }
  }
}
