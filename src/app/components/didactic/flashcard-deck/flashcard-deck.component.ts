/**
 * FlashcardDeckComponent
 *
 * A flip-card deck for embedding inside an article: one card at a time, front
 * showing a term and a one-line prompt, back showing the explanation, a code
 * line and a worked example. The reader flips by clicking the card, walks the
 * deck with prev/next or the dot row, and can shuffle to self-test in a
 * different order.
 *
 * Content-free by design: the caller passes a `config` with one entry per card,
 * each naming a `translationKeyPrefix` whose `.front`, `.frontSub`, `.back`,
 * `.backFormula` and `.backExample` keys carry the text. The component itself
 * only owns its chrome strings (`flashcardDeck.*`).
 *
 * SSR-safe: no timers and no browser globals — the only non-deterministic bit
 * is the shuffle, which runs on a click and therefore never during prerender.
 */
import { Component, ChangeDetectionStrategy, computed, linkedSignal, input, inject } from '@angular/core';

import { TranslationService } from '../../../services/translation.service';

/** One card in the deck. */
export interface FlashcardDeckCard {
  /** Stable id — used for tracking and for the "already seen" dots. */
  id: number;
  /**
   * i18n prefix — `<prefix>.front`, `.frontSub`, `.back`, `.backFormula` and
   * `.backExample` must exist. `backFormula` is rendered as a monospace block,
   * so it carries a command, a signature or a formula.
   */
  translationKeyPrefix: string;
}

/** Configuration for one embedded deck. */
export interface FlashcardDeckConfig {
  cards: FlashcardDeckCard[];
}

@Component({
  selector: 'app-flashcard-deck',
  standalone: true,
  imports: [],
  template: `
    <div class="deck">
      <!-- Progress -->
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="progressPercent()"></div>
      </div>
      <div class="progress-label">{{ progressLabel() }}</div>

      <!-- Card -->
      <div
        class="card-container"
        (click)="toggleFlip()"
        (keydown.enter)="toggleFlip()"
        (keydown.space)="toggleFlip(); $event.preventDefault()"
        tabindex="0"
        role="button"
        [attr.aria-pressed]="isFlipped()"
      >
        <div class="card" [class.flipped]="isFlipped()">
          <!-- Front -->
          <div class="card-face card-front">
            <div class="card-badge">{{ translate('flashcardDeck.badge.term') }}</div>
            <h3 class="card-term">{{ cardText('front') }}</h3>
            <p class="card-sub">{{ cardText('frontSub') }}</p>
            <div class="card-hint">{{ translate('flashcardDeck.hint.flip') }}</div>
          </div>

          <!-- Back -->
          <div class="card-face card-back">
            <div class="card-badge badge-back">{{ translate('flashcardDeck.badge.explanation') }}</div>
            <p class="card-desc">{{ cardText('back') }}</p>
            <div class="detail-section">
              <div class="detail-label">{{ translate('flashcardDeck.label.syntax') }}</div>
              <pre class="detail-block">{{ cardText('backFormula') }}</pre>
            </div>
            <div class="detail-section">
              <div class="detail-label">{{ translate('flashcardDeck.label.example') }}</div>
              <p class="example-text">{{ cardText('backExample') }}</p>
            </div>
            <div class="card-hint">{{ translate('flashcardDeck.hint.flipBack') }}</div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="nav-controls">
        <button class="nav-btn" (click)="prevCard()" [disabled]="currentIndex() === 0">
          {{ translate('flashcardDeck.nav.prev') }}
        </button>
        <button class="nav-btn shuffle-btn" (click)="shuffle()">
          {{ translate('flashcardDeck.nav.shuffle') }}
        </button>
        <button class="nav-btn" (click)="nextCard()" [disabled]="currentIndex() === totalCards() - 1">
          {{ translate('flashcardDeck.nav.next') }}
        </button>
      </div>

      <!-- Card dots -->
      <div class="card-dots">
        @for (card of cards(); track card.id; let i = $index) {
          <button
            class="dot"
            [class.active]="i === currentIndex()"
            [class.seen]="seenCards().has(card.id)"
            (click)="goToCard(i)"
            [attr.aria-label]="cardAriaLabel(i)"
            [attr.aria-current]="i === currentIndex()"
          ></button>
        }
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

      .deck {
        display: block;
      }

      /* ── Progress ── */
      .progress-bar {
        height: 4px;
        background: var(--surface-border);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 0.25rem;
      }

      .progress-fill {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s ease;
        border-radius: 2px;
      }

      .progress-label {
        font-size: 0.78rem;
        color: var(--text-color-secondary);
        text-align: center;
        margin-bottom: 1rem;
      }

      /* ── Card ── */
      .card-container {
        perspective: 1000px;
        cursor: pointer;
        margin-bottom: 1rem;
      }

      .card-container:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 4px;
        border-radius: 12px;
      }

      .card {
        position: relative;
        width: 100%;
        min-height: 300px;
        transition: transform 0.5s ease;
        transform-style: preserve-3d;
      }

      .card.flipped {
        transform: rotateY(180deg);
      }

      .card-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
      }

      .card-front {
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .card-back {
        transform: rotateY(180deg);
        overflow-y: auto;
      }

      .card-badge {
        display: inline-block;
        padding: 0.15rem 0.5rem;
        background: var(--primary-color);
        color: var(--primary-color-text);
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        margin-bottom: 0.75rem;
      }

      /* The back badge is the quieter of the two — outlined instead of filled, so
       it reads as a section marker and keeps contrast in both themes. */
      .badge-back {
        align-self: flex-start;
        background: var(--surface-ground);
        color: var(--text-color);
        border: 1px solid var(--surface-border);
      }

      .card-term {
        font-size: 1.6rem;
        margin: 0 0 0.5rem;
        color: var(--text-color);
        font-family: var(--font-mono);
      }

      .card-sub {
        font-size: 0.95rem;
        color: var(--text-color-secondary);
        margin: 0;
        line-height: 1.4;
      }

      .card-hint {
        margin-top: auto;
        padding-top: 0.75rem;
        font-size: 0.72rem;
        color: var(--text-color-secondary);
      }

      .card-desc {
        font-size: 0.88rem;
        line-height: 1.55;
        color: var(--text-color);
        margin: 0 0 0.75rem;
      }

      .detail-section {
        margin-bottom: 0.5rem;
      }

      .detail-label {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--text-color-secondary);
        margin-bottom: 0.2rem;
      }

      .detail-block {
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        font-family: var(--font-mono);
        font-size: 0.82rem;
        margin: 0;
        white-space: pre;
        overflow-x: auto;
        color: var(--text-color);
      }

      .example-text {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        margin: 0;
        font-style: italic;
      }

      /* ── Navigation ── */
      .nav-controls {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }

      .nav-btn {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius, 6px);
        background: var(--surface-card);
        color: var(--text-color);
        cursor: pointer;
        font-family: inherit;
        transition:
          background 0.15s,
          border-color 0.15s;
      }

      .nav-btn:hover:not(:disabled) {
        background: var(--surface-ground);
        border-color: var(--primary-color-fg);
      }

      .nav-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .nav-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      /* The accent-colored control uses the foreground variant of the primary
       token — the plain primary shade does not clear 4.5:1 on a card surface. */
      .shuffle-btn {
        color: var(--primary-color-fg);
        border-color: var(--primary-color-fg);
      }

      /* ── Dots ── */
      .card-dots {
        display: flex;
        justify-content: center;
        gap: 0.4rem;
      }

      .dot {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: background 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dot:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .dot::after {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid var(--surface-border);
        background: transparent;
        transition: inherit;
      }

      .dot.seen::after {
        background: var(--surface-border);
      }

      .dot.active::after {
        background: var(--primary-color);
        border-color: var(--primary-color-fg);
      }

      /* ── Narrow widget ── */
      @container (max-width: 480px) {
        .card {
          min-height: 280px;
        }
        .card-face {
          padding: 1rem;
        }
        .card-term {
          font-size: 1.3rem;
        }
      }

      /* Print: the flip is a screen affordance. Both faces are laid out flat so
       the deck prints as a readable term/explanation list. */
      @media print {
        .nav-controls,
        .card-dots,
        .card-hint,
        .progress-bar,
        .progress-label {
          display: none !important;
        }

        .card-container {
          cursor: default;
          perspective: none;
        }

        .card,
        .card.flipped {
          transform: none !important;
          min-height: auto;
          position: static;
        }

        .card-face {
          position: static !important;
          transform: none !important;
          backface-visibility: visible !important;
          break-inside: avoid;
          margin-bottom: 1.5rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardDeckComponent {
  readonly config = input.required<FlashcardDeckConfig>();

  private readonly translationService = inject(TranslationService);

  /**
   * Deck order is local state (shuffle rewrites it) but has to follow a new
   * `config` — hence linkedSignal rather than a plain signal or a computed.
   */
  readonly cards = linkedSignal<FlashcardDeckCard[]>(() => [...this.config().cards]);
  readonly currentIndex = linkedSignal({ source: () => this.config(), computation: () => 0 });
  readonly isFlipped = linkedSignal({ source: () => this.config(), computation: () => false });
  readonly seenCards = linkedSignal(() => {
    const cards = this.config().cards;
    return new Set<number>(cards.length > 0 ? [cards[0].id] : []);
  });

  readonly totalCards = computed(() => this.cards().length);
  readonly currentCard = computed(() => this.cards()[this.currentIndex()]);
  readonly progressPercent = computed(() =>
    this.totalCards() === 0 ? 0 : ((this.currentIndex() + 1) / this.totalCards()) * 100,
  );

  readonly progressLabel = computed(() =>
    this.translate('flashcardDeck.progress')
      .replace('{{current}}', (this.currentIndex() + 1).toString())
      .replace('{{total}}', this.totalCards().toString()),
  );

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  cardText(field: string): string {
    const card = this.currentCard();
    return card ? this.translate(card.translationKeyPrefix + '.' + field) : '';
  }

  cardAriaLabel(index: number): string {
    return this.translate('flashcardDeck.nav.cardAriaLabel').replace('{{num}}', String(index + 1));
  }

  toggleFlip(): void {
    this.isFlipped.update((v) => !v);
  }

  nextCard(): void {
    if (this.currentIndex() < this.totalCards() - 1) {
      this.isFlipped.set(false);
      this.currentIndex.update((i) => i + 1);
      this.markSeen();
    }
  }

  prevCard(): void {
    if (this.currentIndex() > 0) {
      this.isFlipped.set(false);
      this.currentIndex.update((i) => i - 1);
    }
  }

  goToCard(index: number): void {
    this.isFlipped.set(false);
    this.currentIndex.set(index);
    this.markSeen();
  }

  shuffle(): void {
    const shuffled = [...this.cards()];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.cards.set(shuffled);
    this.currentIndex.set(0);
    this.isFlipped.set(false);
    this.seenCards.set(new Set(shuffled.length > 0 ? [shuffled[0].id] : []));
  }

  private markSeen(): void {
    const card = this.cards()[this.currentIndex()];
    if (!card) return;
    this.seenCards.update((s) => new Set(s).add(card.id));
  }
}
