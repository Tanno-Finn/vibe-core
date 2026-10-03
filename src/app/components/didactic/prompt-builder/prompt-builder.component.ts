/**
 * PromptBuilderComponent
 *
 * A click-together prompt: the reader picks one building block per category
 * and watches a structured prompt assemble itself, segment by segment, with a
 * quality meter that names which category is still missing.
 *
 * The widget owns the mechanics and its own chrome (`promptBuilder.*`): the
 * one-per-category selection rule, the preview, the copy button, the meter.
 * Everything with an opinion about the subject comes from `config` — the
 * categories, the blocks, and a `translationPrefix` for the instruction and
 * the closing hint — so the same builder can teach a coding prompt in one
 * article and a very different prompt in the next.
 *
 * A category carries its own two quality strings (`qualityLabelKey`,
 * `missingLabelKey`) instead of the widget deriving key names from category
 * ids: derived keys silently render raw when an article invents a new
 * category, and the raw-key gate cannot see through string concatenation.
 *
 * SSR-safe: the clipboard write and the "copied" timeout are browser-only
 * (`isPlatformBrowser`), and nothing runs before the first click, so an
 * embedding page prerenders with the builder in its empty state.
 */
import {
  Component,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  signal,
  computed,
  input,
  inject,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TranslationService } from '../../../services/translation.service';

/** One column of choices — exactly one block per category ends up in the prompt. */
export interface PromptBuilderCategory {
  /** Stable id; blocks reference it through `category`. */
  id: string;
  /** i18n key for the category heading ("Role"). */
  labelKey: string;
  /** OpenNG Icons class for the heading, e.g. `pi pi-user`. */
  icon: string;
  /** Design-token color for the chips and the prompt underline. */
  color: string;
  /** i18n key for the met/unmet criterion ("Role defined"). */
  qualityLabelKey: string;
  /** i18n key for this category inside the "still missing: …" tip ("a role"). */
  missingLabelKey: string;
}

/** One selectable building block. Its color follows its category. */
export interface PromptBuilderBlock {
  /** Stable id — used for selection tracking. */
  id: string;
  /** Id of the owning category. */
  category: string;
  /** i18n key for the chip label ("Senior developer"). */
  labelKey: string;
  /** i18n key for the sentence this block contributes to the prompt. */
  textKey: string;
}

/** Configuration for one embedded builder. */
export interface PromptBuilderConfig {
  /** Categories in the order they are offered — and assembled. */
  categories: PromptBuilderCategory[];
  /** All blocks across all categories. */
  blocks: PromptBuilderBlock[];
  /**
   * i18n prefix for the framing text: `<prefix>.instruction`,
   * `<prefix>.hint.title` and `<prefix>.hint.description` must exist.
   */
  translationPrefix: string;
}

/** How long the copy button stays in its "copied" state, in ms. */
const COPIED_FEEDBACK_MS = 2000;

@Component({
  selector: 'app-prompt-builder',
  standalone: true,
  imports: [],
  template: `
    <div class="builder">
      <p class="instruction">{{ translate(config().translationPrefix + '.instruction') }}</p>

      <!-- Choices, one row per category -->
      <div class="categories">
        @for (cat of config().categories; track cat.id) {
          <div class="category">
            <div class="category-header" [style.border-left-color]="cat.color">
              <i [class]="cat.icon" aria-hidden="true"></i>
              <span class="category-label">{{ translate(cat.labelKey) }}</span>
            </div>
            <div class="blocks-row">
              @for (block of blocksOf(cat.id); track block.id) {
                <button
                  type="button"
                  class="block-chip"
                  [class.selected]="isSelected(block.id)"
                  [style.--chip-color]="cat.color"
                  [attr.aria-pressed]="isSelected(block.id)"
                  (click)="toggleBlock(block.id)"
                >
                  {{ translate(block.labelKey) }}
                </button>
              }
            </div>
          </div>
        }
      </div>

      <!-- The assembled prompt -->
      <div class="preview-section">
        <div class="preview-header">
          <h3>{{ translate('promptBuilder.label.yourPrompt') }}</h3>
          <div class="preview-actions">
            <span class="block-count">{{ selectedIds().length }} {{ translate('promptBuilder.label.blocks') }}</span>
            @if (selectedIds().length > 0) {
              <button type="button" class="reset-btn" (click)="resetAll()">
                {{ translate('promptBuilder.label.reset') }}
              </button>
            }
          </div>
        </div>

        <div class="preview-box" [class.preview-empty]="selectedIds().length === 0" aria-live="polite">
          @if (selectedIds().length === 0) {
            <div class="empty-state">{{ translate('promptBuilder.label.emptyState') }}</div>
          } @else {
            <div class="prompt-text">
              @for (block of selectedBlocks(); track block.id; let last = $last) {
                <span class="prompt-segment" [style.border-bottom-color]="colorOf(block.category)">{{
                  translate(block.textKey)
                }}</span
                >{{ last ? '' : ' ' }}
              }
            </div>
          }
        </div>

        @if (selectedIds().length > 0) {
          <div class="copy-bar">
            <button type="button" class="copy-btn" (click)="copyPrompt()">
              {{ copied() ? translate('promptBuilder.label.copied') : translate('promptBuilder.label.copyPrompt') }}
            </button>
            <span class="char-count">{{ promptText().length }} {{ translate('promptBuilder.label.characters') }}</span>
          </div>
        }
      </div>

      <!-- Which categories are covered so far -->
      @if (selectedIds().length > 0) {
        <div class="quality-section">
          <h3>{{ translate('promptBuilder.quality.title') }}</h3>
          <div class="quality-bar">
            <div class="quality-fill" [style.width.%]="qualityPercent()" [style.background]="qualityColor()"></div>
          </div>
          <div class="quality-details">
            @for (criterion of qualityCriteria(); track criterion.categoryId) {
              <div class="criterion" [class.criterion-met]="criterion.met">
                <span class="criterion-icon" aria-hidden="true">{{ criterion.met ? '✓' : '✗' }}</span>
                <span>{{ translate(criterion.labelKey) }}</span>
              </div>
            }
          </div>
          <p class="quality-tip">{{ qualityTip() }}</p>
        </div>
      }

      <!-- Framing: why the pattern, not the individual sentences, is the point -->
      <div class="hint-box">
        <strong>{{ translate(config().translationPrefix + '.hint.title') }}</strong>
        <p>{{ translate(config().translationPrefix + '.hint.description') }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      /* A query container: the @container rules below read the width of the
       column this widget sits in (article, demo frame, card), not the window. */
      :host {
        display: block;
        container-type: inline-size;
      }

      .builder {
        display: block;
      }

      .instruction {
        color: var(--text-color-secondary);
        font-size: 0.95rem;
        margin: 0 0 1.5rem;
      }

      /* ── Choices ── */
      .categories {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .category {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1rem;
      }

      .category-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        border-left: 3px solid var(--primary-color);
        padding-left: 0.5rem;
      }

      .category-header i {
        font-size: 1rem;
        color: var(--text-color-secondary);
      }

      .category-label {
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--text-color-secondary);
      }

      .blocks-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .block-chip {
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-family: inherit;
        cursor: pointer;
        border: 2px solid var(--chip-color, var(--surface-border));
        background: var(--surface-card);
        color: var(--text-color);
        transition:
          background 0.2s ease,
          color 0.2s ease;
      }

      .block-chip:hover {
        background: var(--surface-ground);
      }

      .block-chip:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .block-chip.selected {
        background: var(--chip-color, var(--primary-color));
        color: var(--primary-color-text);
        font-weight: 600;
      }

      /* ── Preview ── */
      .preview-section {
        margin-bottom: 1.5rem;
      }

      .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .preview-header h3 {
        font-size: 1.05rem;
        margin: 0;
        color: var(--text-color);
      }

      .preview-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      /* Primary text color, not secondary: this chip sits on surface-ground,
       where the muted tone drops under the 4.5:1 contrast floor. */
      .block-count {
        font-size: 0.8rem;
        color: var(--text-color);
        background: var(--surface-ground);
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
      }

      .reset-btn {
        font-size: 0.8rem;
        padding: 0.25rem 0.6rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius, 4px);
        background: var(--surface-card);
        color: var(--text-color);
        font-family: inherit;
        cursor: pointer;
      }

      .reset-btn:hover {
        background: var(--surface-ground);
      }

      .reset-btn:focus-visible,
      .copy-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* The empty state is marked by a dashed border, never by dimmed text. */
      .preview-box {
        background: var(--surface-card);
        border: 2px solid var(--surface-border);
        border-radius: 8px;
        padding: 1.25rem;
        min-height: 80px;
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.88rem;
        line-height: 1.7;
        color: var(--text-color);
        transition: border-color 0.2s;
      }

      .preview-box.preview-empty {
        background: color-mix(in srgb, var(--surface-card) 70%, var(--surface-ground));
        border-style: dashed;
      }

      .preview-box:not(.preview-empty) {
        border-color: var(--primary-color);
      }

      .empty-state {
        color: var(--text-color);
        text-align: center;
        font-family: var(--font-family, sans-serif);
        padding: 1rem 0;
      }

      .prompt-text {
        white-space: pre-wrap;
        word-break: break-word;
      }

      .prompt-segment {
        border-bottom: 2px solid transparent;
        padding-bottom: 1px;
      }

      .copy-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
      }

      .copy-btn {
        padding: 0.4rem 1rem;
        border-radius: var(--border-radius, 6px);
        font-size: 0.85rem;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        border: 1px solid var(--primary-color);
        background: var(--primary-color);
        color: var(--primary-color-text);
      }

      .char-count {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      /* ── Quality meter ── */
      .quality-section {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .quality-section h3 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        color: var(--text-color);
      }

      .quality-bar {
        height: 8px;
        background: var(--surface-ground);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.75rem;
      }

      .quality-fill {
        height: 100%;
        border-radius: 4px;
        transition:
          width 0.3s ease,
          background 0.3s ease;
      }

      .quality-details {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1rem;
        margin-bottom: 0.75rem;
      }

      /* Met/unmet is carried by the tick or cross, not by color alone. */
      .criterion {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.85rem;
        color: var(--text-color);
      }

      .criterion-met {
        color: var(--semantic-green-fg);
      }

      .criterion-icon {
        font-weight: 700;
        font-size: 0.9rem;
      }

      .quality-tip {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
      }

      /* ── Framing ── */
      .hint-box {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--semantic-blue-fg);
        border-radius: 0 8px 8px 0;
        padding: 1rem 1.25rem;
      }

      .hint-box strong {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      .hint-box p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }

      @container (max-width: 480px) {
        .category {
          padding: 0.75rem;
        }
        .block-chip {
          font-size: 0.8rem;
          padding: 0.35rem 0.65rem;
        }
        .preview-box {
          font-size: 0.82rem;
          padding: 1rem;
        }
        .preview-header {
          flex-direction: column;
          align-items: flex-start;
        }
        .quality-details {
          flex-direction: column;
          gap: 0.35rem;
        }
      }

      /* Print: the chips, the preview and the meter are all transient state.
       What survives on paper is the catalog of building blocks and the hint
       that explains why the pattern matters. */
      @media print {
        .preview-section,
        .quality-section {
          display: none !important;
        }

        .category {
          break-inside: avoid;
          margin-bottom: 0.75rem;
        }

        .block-chip {
          border-width: 1px;
          background: none !important;
          color: var(--text-color) !important;
          font-weight: 400 !important;
        }

        .hint-box {
          break-inside: avoid;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptBuilderComponent implements OnDestroy {
  readonly config = input.required<PromptBuilderConfig>();

  private readonly translationService = inject(TranslationService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly selectedIds = signal<string[]>([]);
  readonly copied = signal(false);

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  /** Selected blocks in category order — the prompt reads top to bottom. */
  readonly selectedBlocks = computed(() => {
    const order = this.config().categories.map((c) => c.id);
    const blocks = this.config().blocks;
    return this.selectedIds()
      .map((id) => blocks.find((b) => b.id === id))
      .filter((b): b is PromptBuilderBlock => !!b)
      .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
  });

  readonly promptText = computed(() =>
    this.selectedBlocks()
      .map((b) => this.translate(b.textKey))
      .join(' '),
  );

  readonly qualityCriteria = computed(() => {
    const blocks = this.config().blocks;
    const covered = new Set(this.selectedIds().map((id) => blocks.find((b) => b.id === id)?.category));
    return this.config().categories.map((cat) => ({
      categoryId: cat.id,
      labelKey: cat.qualityLabelKey,
      met: covered.has(cat.id),
    }));
  });

  readonly qualityPercent = computed(() => {
    const criteria = this.qualityCriteria();
    if (criteria.length === 0) return 0;
    return (criteria.filter((c) => c.met).length / criteria.length) * 100;
  });

  readonly qualityColor = computed(() => {
    const pct = this.qualityPercent();
    if (pct <= 25) return 'var(--semantic-red-fg)';
    if (pct <= 50) return 'var(--semantic-orange-fg)';
    if (pct <= 75) return 'var(--semantic-blue-fg)';
    return 'var(--semantic-green-fg)';
  });

  readonly qualityTip = computed(() => {
    const missing = this.config().categories.filter(
      (cat) => !this.qualityCriteria().find((c) => c.categoryId === cat.id)?.met,
    );
    if (missing.length === 0) return this.translate('promptBuilder.quality.tipComplete');

    const joined = missing
      .map((cat) => this.translate(cat.missingLabelKey))
      .join(this.translate('promptBuilder.quality.tipJoin'));
    return this.translate('promptBuilder.quality.tipIncomplete').replace('{{missing}}', joined);
  });

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    this.clearCopiedTimer();
  }

  blocksOf(categoryId: string): PromptBuilderBlock[] {
    return this.config().blocks.filter((b) => b.category === categoryId);
  }

  colorOf(categoryId: string): string {
    return this.config().categories.find((c) => c.id === categoryId)?.color ?? 'var(--primary-color)';
  }

  isSelected(blockId: string): boolean {
    return this.selectedIds().includes(blockId);
  }

  /** One block per category: picking a second one replaces the first. */
  toggleBlock(blockId: string): void {
    const blocks = this.config().blocks;
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    const current = this.selectedIds();
    if (current.includes(blockId)) {
      this.selectedIds.set(current.filter((id) => id !== blockId));
    } else {
      const otherCategories = current.filter((id) => blocks.find((b) => b.id === id)?.category !== block.category);
      this.selectedIds.set([...otherCategories, blockId]);
    }
    this.resetCopiedState();
  }

  resetAll(): void {
    this.selectedIds.set([]);
    this.resetCopiedState();
  }

  /** Browser-only: there is no clipboard on the server. */
  copyPrompt(): void {
    const text = this.promptText();
    if (!this.isBrowser || !text || !navigator.clipboard) return;

    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      this.clearCopiedTimer();
      this.copiedTimer = setTimeout(() => this.copied.set(false), COPIED_FEEDBACK_MS);
    });
  }

  private resetCopiedState(): void {
    this.copied.set(false);
    this.clearCopiedTimer();
  }

  private clearCopiedTimer(): void {
    if (this.copiedTimer !== null) {
      clearTimeout(this.copiedTimer);
      this.copiedTimer = null;
    }
  }
}
