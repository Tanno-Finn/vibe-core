/**
 * Text Container Component
 *
 * Specialized container for displaying long-form text content with enhanced readability features.
 * Built on top of StandardContainerComponent with text-specific optimizations:
 * - Automatic reading time calculation
 * - Word count display
 * - Progress indicator for long texts
 * - Typography optimized for readability (uses full container width)
 * - Print-friendly styling
 */
import {
  Component,
  Input,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Optimus UI imports
import { ProgressBarModule } from '@openng/optimus-ui/progressbar';
import { ButtonModule } from '@openng/optimus-ui/button';

// Custom components
import { StandardContainerComponent, ContainerConfig, ContainerType } from './standard-container.component';
import { InfoTooltipComponent } from './info-tooltip.component';

// Services
import { TranslationService } from '../../services/translation.service';

// Highlighting System
import { HighlightDirective } from '../../directives/highlight.directive';

// Required alongside ProgressBarModule: PrimeNG 21 emits aria-level on
// role="progressbar", which is only valid on role="heading".
import { StripInvalidAriaDirective } from '../../directives/strip-invalid-aria.directive';
import { scrollBehavior } from '../../utils/reduced-motion';

@Component({
  selector: 'app-text-container',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    StandardContainerComponent,
    ProgressBarModule,
    StripInvalidAriaDirective,
    ButtonModule,
    InfoTooltipComponent,
    HighlightDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-standard-container [config]="containerConfig">
      <!-- Custom header with reading stats -->
      @if (showMetadata) {
        <div slot="header" class="text-header">
          <div class="header-content">
            <div class="title-section">
              @if (icon) {
                <i [class]="icon" class="text-icon"></i>
              }
              <h2 class="text-title" [appHighlight]="title">{{ title }}</h2>
            </div>
            <div class="metadata-section">
              <!-- Explanations ride app-info-tooltip (click/focus), not a
                   hover-only pTooltip on a passive span (pattern ladder). -->
              @if (showReadingTime) {
                <span class="reading-time">
                  <i class="pi pi-clock" aria-hidden="true"></i>
                  {{ readingTime }} {{ translationService.translate('article.readingTimeShort') }}
                  <app-info-tooltip
                    [text]="translationService.translate('article.readingTimeTooltip')"
                    [forLabel]="translationService.translate('article.readingTime')"
                    [moreInfoLabel]="translationService.translate('article.moreInfo')"
                  />
                </span>
              }
              @if (showWordCount) {
                <span class="word-count">
                  <i class="pi pi-file-word" aria-hidden="true"></i>
                  {{ wordCount }} {{ translationService.translate('article.wordCount') }}
                  <app-info-tooltip
                    [text]="translationService.translate('article.wordCountTooltip')"
                    [forLabel]="translationService.translate('article.wordCount')"
                    [moreInfoLabel]="translationService.translate('article.moreInfo')"
                  />
                </span>
              }
            </div>
          </div>
        </div>
      }

      <!-- Progress indicator for long texts -->
      @if (showProgressIndicator && isLongText) {
        <div class="progress-container">
          <p-progressbar
            [value]="readingProgress"
            [showValue]="false"
            [ariaLabel]="translationService.translate('textContainer.readingProgress') + ': ' + readingProgress + '%'"
            styleClass="reading-progress"
          >
          </p-progressbar>
          <div class="progress-label">
            {{ translationService.translate('textContainer.readingProgress') }}: {{ readingProgress }}%
          </div>
        </div>
      }

      <!-- Main text content -->
      <div class="text-content" #textContent (scroll)="onScroll()">
        <article class="text-article" [innerHTML]="content" appHighlight></article>
      </div>

      <!-- Footer with actions only -->
      @if (showFooterStats) {
        <div slot="footer" class="text-footer">
          <div class="footer-actions">
            <p-button
              [label]="translationService.translate('textContainer.backToTop')"
              icon="pi pi-arrow-up"
              [outlined]="true"
              size="small"
              (click)="scrollToTop()"
            >
            </p-button>
          </div>
        </div>
      }
    </app-standard-container>

    <!-- Global Glossary Popover -->
  `,
  styles: [
    `
      /* Text header styling */
      app-text-container .text-header {
        width: 100%;
      }

      app-text-container .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
      }

      app-text-container .title-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      app-text-container .text-icon {
        color: var(--primary-color-fg);
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      app-text-container .text-title {
        margin: 0;
        color: var(--text-color);
        font-weight: 600;
        font-size: 1.25rem;
        line-height: 1.2;
      }

      app-text-container .metadata-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-shrink: 0;
      }

      .reading-time,
      app-text-container .word-count {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .reading-time i,
      app-text-container .word-count i {
        color: var(--primary-color-fg);
      }

      /* Progress indicator */
      app-text-container .progress-container {
        padding: 0 0 1rem 0;
        border-bottom: 1px solid var(--surface-border);
        margin-bottom: 1rem;
      }

      app-text-container .progress-label {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        text-align: center;
      }

      /* Main text content */
      app-text-container .text-content {
        position: relative;
      }

      app-text-container .text-article {
        width: 100%;
        max-width: none; /* Use full container width */
        margin: 0;
        line-height: 1.6;
        color: var(--text-color);
      }

      /* Typography optimizations */
      .text-article :global(h1),
      .text-article :global(h2),
      .text-article :global(h3),
      .text-article :global(h4),
      .text-article :global(h5),
      app-text-container .text-article :global(h6) {
        color: var(--text-color);
        margin: 2rem 0 1rem 0;
        line-height: 1.3;
        font-weight: 600;
        scroll-margin-top: 2rem; /* Account for sticky headers */
      }

      app-text-container .text-article :global(h1) {
        font-size: 2rem;
      }
      app-text-container .text-article :global(h2) {
        font-size: 1.5rem;
      }
      app-text-container .text-article :global(h3) {
        font-size: 1.25rem;
      }
      app-text-container .text-article :global(h4) {
        font-size: 1.125rem;
      }
      app-text-container .text-article :global(h5) {
        font-size: 1rem;
      }
      app-text-container .text-article :global(h6) {
        font-size: 0.875rem;
      }

      app-text-container .text-article :global(p) {
        margin: 0 0 1.5rem 0;
        text-align: justify;
        hyphens: auto;
      }

      app-text-container .text-article :global(p:last-child) {
        margin-bottom: 0;
      }

      .text-article :global(ul),
      app-text-container .text-article :global(ol) {
        margin: 1rem 0;
        padding-left: 2rem;
      }

      app-text-container .text-article :global(li) {
        margin: 0.5rem 0;
        line-height: 1.5;
      }

      app-text-container .text-article :global(blockquote) {
        margin: 1.5rem 0;
        padding: 1rem 1.5rem;
        border-left: 4px solid var(--primary-color);
        background: var(--surface-50);
        font-style: italic;
        color: var(--text-color-secondary);
      }

      app-text-container .text-article :global(strong) {
        font-weight: 600;
        color: var(--text-color);
      }

      app-text-container .text-article :global(em) {
        color: var(--primary-color-fg);
        font-style: italic;
      }

      app-text-container .text-article :global(code) {
        background: var(--surface-100);
        padding: 0.125rem 0.25rem;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }

      /* Footer styling */
      app-text-container .text-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }

      app-text-container .footer-actions {
        display: flex;
        gap: 0.5rem;
      }

      /* Optimus UI Progress Bar customization */
      app-text-container .reading-progress {
        height: 4px;
        background: var(--surface-200);
      }

      app-text-container .reading-progress .p-progressbar-value {
        background: var(--primary-color);
        transition: width 0.3s ease;
      }

      /* WCAG 2.3.3 Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        app-text-container .reading-progress .p-progressbar-value {
          transition: none;
        }
      }

      /* Responsive design */
      @media (max-width: 768px) {
        app-text-container .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }

        app-text-container .metadata-section {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        app-text-container .text-article {
          /* Already using full width */
        }

        app-text-container .text-article :global(p) {
          text-align: left;
          hyphens: none;
        }

        app-text-container .text-footer {
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        app-text-container .text-title {
          font-size: 1.125rem;
        }

        app-text-container .metadata-section {
          width: 100%;
        }

        .reading-time,
        app-text-container .word-count {
          font-size: 0.8rem;
        }

        app-text-container .text-article :global(h1) {
          font-size: 1.5rem;
        }
        app-text-container .text-article :global(h2) {
          font-size: 1.25rem;
        }
        app-text-container .text-article :global(h3) {
          font-size: 1.125rem;
        }
      }

      .dark-theme app-text-container .text-article :global(blockquote) {
        background: var(--surface-800);
      }

      .dark-theme app-text-container .text-article :global(code) {
        background: var(--surface-700);
      }

      /* Print styles */
      @media print {
        .progress-container,
        app-text-container .footer-actions {
          display: none;
        }

        app-text-container .text-article {
          color: #000;
        }

        .text-article :global(h1),
        .text-article :global(h2),
        .text-article :global(h3),
        .text-article :global(h4),
        .text-article :global(h5),
        app-text-container .text-article :global(h6) {
          color: #000;
          break-after: avoid;
        }

        app-text-container .text-article :global(p) {
          text-align: justify;
          orphans: 3;
          widows: 3;
        }
      }
    `,
  ],
})
export class TextContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('textContent') textContentRef!: ElementRef;

  // Inject services
  protected translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  /**
   * Container title (required)
   */
  @Input({ required: true }) title!: string;

  /**
   * Main text content (required, supports HTML)
   */
  @Input({ required: true }) content!: string;

  /**
   * Icon for the container
   */
  @Input() icon: string = 'pi pi-file-text';

  /**
   * Container type for styling
   */
  @Input() type: ContainerType = 'primary';

  /**
   * Container elevation
   */
  @Input() elevation: 'none' | 'sm' | 'md' | 'lg' = 'sm';

  /**
   * Whether to show reading time and word count in header
   */
  @Input() showMetadata: boolean = true;

  /**
   * Whether to show reading time
   */
  @Input() showReadingTime: boolean = true;

  /**
   * Whether to show word count
   */
  @Input() showWordCount: boolean = true;

  /**
   * Whether to show progress indicator for long texts
   */
  @Input() showProgressIndicator: boolean = true;

  /**
   * Whether to show footer statistics
   */
  @Input() showFooterStats: boolean = true;

  /**
   * Whether the container should be collapsible (always true for text containers)
   */
  @Input() collapsible: boolean = true;

  /**
   * Initial expanded state
   */
  @Input() initiallyExpanded: boolean = true;

  /**
   * Words per minute reading speed (for calculation)
   */
  @Input() wordsPerMinute: number = 200;

  /**
   * Minimum word count to consider text as "long"
   */
  @Input() longTextThreshold: number = 500;

  // Internal state
  readingProgress: number = 0;

  // Computed properties
  get wordCount(): number {
    const text = this.stripHtml(this.content);
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  get characterCount(): number {
    return this.stripHtml(this.content).length;
  }

  get readingTime(): number {
    return Math.ceil(this.wordCount / this.wordsPerMinute);
  }

  get isLongText(): boolean {
    return this.wordCount >= this.longTextThreshold;
  }

  get containerConfig(): ContainerConfig {
    return {
      type: this.type,
      title: this.title,
      customHeaderSlot: this.showMetadata,
      showFooter: this.showFooterStats,
      elevation: this.elevation,
      collapsible: true, // Always collapsible for text containers
      initiallyExpanded: this.initiallyExpanded,
      headingLevel: 2,
    };
  }

  constructor() {
    // Subscribe to language changes for reactivity
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // Set up scroll listener for progress tracking
    if (this.showProgressIndicator && this.isLongText) {
      this.setupScrollListener();
    }
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
  }

  /**
   * Strip HTML tags from content, for wordCount/characterCount only.
   *
   * Uses DOMParser, which builds an INERT document: scripts do not run and
   * no resource request is ever issued, whatever the markup contains.
   *
   * The previous implementation assigned `innerHTML` on a detached div and
   * carried a comment claiming that was safe because the node is never in
   * the DOM. That is false. The div is still owned by the live document, so
   * the image request starts as soon as the src attribute is parsed —
   * measured in Chrome, `<img src="/404.png" onerror=…>` fires its handler
   * from a detached div, while the same payload through DOMParser does not.
   * Both return the same text, so there is nothing to trade off.
   */
  private stripHtml(html: string): string {
    if (typeof DOMParser === 'undefined') {
      // SSR fallback: a plain regex strip is enough for the two counters.
      return html.replace(/<[^>]*>/g, '');
    }
    return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
  }

  /**
   * Scroll to top of container
   */
  scrollToTop(): void {
    if (this.textContentRef) {
      this.textContentRef.nativeElement.scrollIntoView({
        behavior: scrollBehavior(),
        block: 'start',
      });
    }
  }

  /**
   * Handle scroll events for progress tracking
   * browser-only: scroll event handler.
   */
  onScroll(): void {
    if (!this.showProgressIndicator || !this.isLongText) return;

    const element = this.textContentRef?.nativeElement;
    if (!element) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));

    this.readingProgress = Math.round(progress);
  }

  /**
   * Set up scroll listener
   */
  private scrollHandler = () => this.onScroll();

  private setupScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.scrollHandler);
  }

  private removeScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.scrollHandler);
  }
}
