/**
 * TakeawaysListComponent
 *
 * Renders a numbered "Kernaussagen"-Block from a single translation string with
 * lightweight markdown: `1. **Title**: text\n\n2. **Title** — text...`.
 *
 * Why: Translated content files already contain this markdown pattern
 * for synthesis/checklist sections. Rendering via plain `{{ }}` interpolation
 * shows literal asterisks. Parsing once here keeps all translation files
 * untouched and lets the same string work across articles.
 */
import { Component, Input, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { HighlightDirective } from '../../directives/highlight.directive';

interface TakeawayItem {
  title: string;
  text: string;
}

@Component({
  selector: 'app-takeaways-list',
  standalone: true,
  imports: [HighlightDirective],
  template: `
    @if (parsed().items.length > 0) {
      <ol class="takeaways-list">
        @for (item of parsed().items; track $index) {
          <li>
            @if (item.title) {
              <strong [appHighlight]="item.title">{{ item.title }}</strong
              ><span class="takeaway-sep">: </span>
            }
            <span [appHighlight]="item.text">{{ item.text }}</span>
          </li>
        }
      </ol>
    }
    @if (parsed().closing) {
      <p class="takeaways-closing" [appHighlight]="parsed().closing!">{{ parsed().closing }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .takeaways-list {
        list-style: decimal;
        padding-left: 1.5rem;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-3, 0.75rem);
      }
      .takeaways-list li {
        line-height: 1.6;
      }
      .takeaways-list strong {
        font-weight: 700;
        color: var(--text-color);
      }
      .takeaway-sep {
        font-weight: 400;
      }
      .takeaways-closing {
        margin-top: var(--space-4, 1rem);
        line-height: 1.6;
      }
    `,
  ],
})
export class TakeawaysListComponent {
  private textSignal = signal<string>('');

  @Input() set text(value: string) {
    this.textSignal.set(value ?? '');
  }

  parsed = computed<{ items: TakeawayItem[]; closing?: string }>(() => {
    const raw = this.textSignal();
    if (!raw) return { items: [] };

    // Split into blocks: a new block starts on a line beginning with `<n>.` or
    // after a blank line. Handles both `1. ...\n2. ...` (single newline) and
    // `1. ...\n\n2. ...` (paragraph-style) formats found across translations.
    const lines = raw.split(/\r?\n/);
    const blocks: string[] = [];
    let current: string[] = [];
    const flush = () => {
      if (current.length === 0) return;
      const joined = current.join('\n').trim();
      if (joined) blocks.push(joined);
      current = [];
    };
    for (const line of lines) {
      if (/^\s*\d+\.\s*/.test(line)) {
        flush();
        current.push(line);
      } else if (line.trim() === '') {
        flush();
      } else {
        current.push(line);
      }
    }
    flush();

    const items: TakeawayItem[] = [];
    const closingParts: string[] = [];

    for (const block of blocks) {
      const bold = block.match(/^\s*\d+\.\s*\*\*([^*]+)\*\*([\s\S]*)$/);
      if (bold) {
        const title = bold[1].trim();
        const rest = bold[2].replace(/^[\s:—–-]+/, '').trim();
        items.push({ title, text: rest });
        continue;
      }
      const plainNumbered = block.match(/^\s*\d+\.\s*([\s\S]*)$/);
      if (plainNumbered) {
        items.push({ title: '', text: plainNumbered[1].trim() });
        continue;
      }
      closingParts.push(block);
    }

    return {
      items,
      closing: closingParts.length > 0 ? closingParts.join('\n\n') : undefined,
    };
  });
}
