/**
 * Definition Component
 *
 * A specialized component for displaying definitions with toggleable content types.
 * Uses StandardContainerComponent as its foundation and provides a select button
 * to switch between different description types (e.g., "Analogie" and "Definition").
 */
import { Component, Input, inject, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Optimus UI imports
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';

// Custom components
import { StandardContainerComponent, ContainerConfig, ContainerType } from '../shared/standard-container.component';
import { HighlightDirective } from '../../directives/highlight.directive';

// Services
import { TranslationService } from '../../services/translation.service';

export interface DefinitionOption {
  label: string;
  value: string;
  content: string;
}

@Component({
  selector: 'app-definition',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, StandardContainerComponent, SelectButtonModule, HighlightDirective],
  template: `
    <app-standard-container [config]="containerConfig">
      <!-- Custom header with select button -->
      <div slot="header" class="definition-header">
        <div class="header-content">
          <div class="title-section">
            @if (icon) {
              <i [class]="icon" class="definition-icon" [attr.aria-hidden]="true"></i>
            }
            @switch (headingLevel) {
              @case (2) {
                <h2 class="definition-title" [appHighlight]="title">{{ title }}</h2>
              }
              @case (3) {
                <h3 class="definition-title" [appHighlight]="title">{{ title }}</h3>
              }
              @case (4) {
                <h4 class="definition-title" [appHighlight]="title">{{ title }}</h4>
              }
              @case (5) {
                <h5 class="definition-title" [appHighlight]="title">{{ title }}</h5>
              }
              @default {
                <h6 class="definition-title" [appHighlight]="title">{{ title }}</h6>
              }
            }
          </div>

          <div class="toggle-section">
            <p-selectbutton
              [options]="toggleOptions"
              [(ngModel)]="selectedOption"
              (onChange)="onToggleChange($event)"
              optionLabel="label"
              optionValue="value"
              styleClass="definition-toggle"
              [attr.aria-label]="translationService.translate('definition.toggleViewLabel')"
            >
            </p-selectbutton>
          </div>
        </div>
      </div>

      <!-- Content section (screen only) -->
      <div class="definition-content screen-only">
        <div class="content-text" appHighlight [innerHTML]="currentContent"></div>

        <!-- Optional footer content -->
        @if (showExample && currentExample) {
          <div class="example-section">
            <h3 class="example-title">
              <i class="pi pi-lightbulb" [attr.aria-hidden]="true"></i>
              <span [appHighlight]="translationService.translate('definition.example')">{{
                translationService.translate('definition.example')
              }}</span>
            </h3>
            <div class="example-content" appHighlight [innerHTML]="currentExample"></div>
          </div>
        }
      </div>

      <!-- Print-only: both options visible -->
      <div class="definition-print-content">
        <div class="print-option">
          <h3 class="print-option-label">{{ toggleOptions[0].label }}:</h3>
          <div class="content-text" [innerHTML]="firstOptionContent"></div>
          @if (showExample && firstOptionExample) {
            <div class="example-section">
              <h3 class="example-title">
                <i class="pi pi-lightbulb" [attr.aria-hidden]="true"></i>
                <span>{{ translationService.translate('definition.example') }}</span>
              </h3>
              <div class="example-content" [innerHTML]="firstOptionExample"></div>
            </div>
          }
        </div>
        <div class="print-option">
          <h3 class="print-option-label">{{ toggleOptions[1].label }}:</h3>
          <div class="content-text" [innerHTML]="secondOptionContent"></div>
          @if (showExample && secondOptionExample) {
            <div class="example-section">
              <h3 class="example-title">
                <i class="pi pi-lightbulb" [attr.aria-hidden]="true"></i>
                <span>{{ translationService.translate('definition.example') }}</span>
              </h3>
              <div class="example-content" [innerHTML]="secondOptionExample"></div>
            </div>
          }
        </div>
      </div>
    </app-standard-container>
  `,
  styles: [
    `
      /* A query container: the @container rules below read the width of the
       column this widget sits in (article, demo frame, card), not the window.
       Encapsulation is None, so the host is named, not :host. */
      app-definition {
        display: block;
        container-type: inline-size;
      }

      /* Definition header styling */
      app-definition .definition-header {
        width: 100%;
      }

      app-definition .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
        flex-wrap: wrap;
      }

      app-definition .title-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      app-definition .definition-icon {
        color: var(--p-pink-500);
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      app-definition .definition-title {
        margin: 0;
        color: var(--text-color);
        font-weight: 600;
        font-size: 1.125rem;
        line-height: 1.2;
      }

      app-definition .toggle-section {
        flex-shrink: 0;
      }

      /* Content styling */
      app-definition .definition-content {
        padding: 0;
      }

      app-definition .content-text {
        color: var(--text-color);
        line-height: 1.6;
        margin-bottom: 0;
      }

      app-definition .content-text :global(p) {
        margin: 0 0 1rem 0;
      }

      app-definition .content-text :global(p:last-child) {
        margin-bottom: 0;
      }

      app-definition .content-text :global(strong) {
        color: var(--text-color);
        font-weight: 600;
      }

      app-definition .content-text :global(em) {
        color: var(--primary-color-fg);
        font-style: italic;
      }

      /* Example section */
      app-definition .example-section {
        margin-top: 1.5rem;
        padding: 1rem;
        background: var(--surface-50);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--blue-500);
      }

      app-definition .example-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 0 0.75rem 0;
        /* -700: -600 measured 4.41:1 on --surface-50 in light (A11Y-004). */
        color: var(--blue-700);
        font-size: 1rem;
        font-weight: 600;
      }

      app-definition .example-title .pi-lightbulb {
        color: var(--blue-500);
      }

      app-definition .example-content {
        color: var(--text-color);
        line-height: 1.5;
      }

      app-definition .example-content :global(p) {
        margin: 0 0 0.75rem 0;
      }

      app-definition .example-content :global(p:last-child) {
        margin-bottom: 0;
      }

      /* Optimus UI SelectButton customizations */
      app-definition .definition-toggle {
        font-size: 0.875rem;
        /* Aura paints the unpressed label {surface.500} on {surface.100}: 4.34:1 in
           light (selectbutton guide; check-a11y, A11Y-004). The secondary text color
           clears 4.5:1 and still differs from the pressed label, which carries the state.
           The segments are p-togglebutton hosts (no .p-button, no .p-highlight): their
           pressed state, focus ring and colours come from the kit-wide rules in styles.scss. */
        --p-togglebutton-color: var(--text-color-secondary);
      }

      /* Responsive design */
      @container (max-width: 768px) {
        app-definition .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        app-definition .toggle-section {
          width: 100%;
        }

        app-definition .definition-toggle {
          width: 100%;
        }

        app-definition .example-section {
          padding: 0.75rem;
          margin-top: 1rem;
        }
      }

      @container (max-width: 480px) {
        app-definition .definition-title {
          font-size: 1rem;
        }
      }

      /* Dark theme adjustments
       Note: .example-section uses --surface-50 + --blue-600 which already
       flip in dark mode (styles.scss inverts the unprefixed scale). An
       earlier override set background: var(--surface-800) which in dark
       mode resolves to #f8fafc → light box with light text. Removed. */

      /* V2 Highlighting Styles */

      /* Popover Styles */
      app-definition .glossary-popover {
        position: fixed;
        z-index: 10000;
        background: var(--surface-0);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        max-width: 320px;
        min-width: 280px;
        animation: popoverFadeIn 0.15s ease-out;
      }

      app-definition .popover-arrow {
        position: absolute;
        top: -6px;
        left: 20px;
        width: 12px;
        height: 12px;
        background: var(--surface-0);
        border: 1px solid var(--surface-border);
        border-right: none;
        border-bottom: none;
        transform: rotate(45deg);
      }

      app-definition .popover-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--surface-border);
        background: var(--surface-50);
        border-radius: 8px 8px 0 0;
      }

      app-definition .popover-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      app-definition .close-btn {
        background: none;
        border: none;
        color: var(--text-color-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      app-definition .close-btn:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      app-definition .popover-content {
        padding: 16px;
      }

      app-definition .definition-text {
        margin: 0 0 12px 0;
        line-height: 1.5;
        color: var(--text-color);
        font-size: 0.9rem;
      }

      app-definition .definition-meta {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      app-definition .category-tag {
        font-size: 0.75rem;
        background: var(--primary-100);
        color: var(--primary-700);
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
      }

      @media (prefers-reduced-motion: reduce) {
        app-definition .glossary-popover {
          animation: none;
        }
      }

      @keyframes popoverFadeIn {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Dark theme adjustments for highlighting */

      .dark-theme app-definition .glossary-popover {
        background: var(--surface-800);
        border-color: var(--surface-700);
      }

      .dark-theme app-definition .popover-arrow {
        background: var(--surface-800);
        border-color: var(--surface-700);
      }

      .dark-theme app-definition .popover-header {
        background: var(--surface-900);
        border-color: var(--surface-700);
      }

      .dark-theme app-definition .category-tag {
        background: var(--primary-800);
        color: var(--primary-200);
      }

      /* Print-only block: hidden on screen */
      app-definition .definition-print-content {
        display: none;
      }

      /* Print styles */
      @media print {
        app-definition .toggle-section {
          display: none;
        }

        /* Hide interactive content, show print block */
        app-definition .definition-content.screen-only {
          display: none !important;
        }
        app-definition .definition-print-content {
          display: block !important;
        }

        app-definition .print-option {
          margin-bottom: 1rem;
        }
        app-definition .print-option + .print-option {
          border-top: 1px solid #ccc;
          padding-top: 1rem;
        }
        app-definition .print-option-label {
          font-weight: 700;
          margin: 0 0 0.25rem 0;
          color: #000;
          font-size: 1rem;
        }

        .content-text,
        app-definition .example-content {
          color: #000 !important;
        }

        app-definition .example-section {
          border-color: #666;
          background: #f9f9f9;
        }

        /* Hide highlighting and popovers in print */
        app-definition .glossary-popover {
          display: none !important;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefinitionComponent {
  // Inject services
  protected translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // Subscribe to language changes for reactivity
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  /**
   * Definition title (required)
   */
  @Input({ required: true }) title!: string;

  /**
   * Icon for the definition (defaults to book icon)
   */
  @Input() icon: string = 'pi pi-book';

  /**
   * Container type for styling (defaults to definition)
   */
  @Input() type: ContainerType = 'definition';

  /**
   * Container elevation
   */
  @Input() elevation: 'none' | 'sm' | 'md' | 'lg' = 'sm';

  /**
   * First toggle option label (default: "Analogie")
   */
  @Input() firstOptionLabel?: string;

  /**
   * Second toggle option label (default: "Definition")
   */
  @Input() secondOptionLabel?: string;

  /**
   * Content for the first option (Analogie)
   */
  @Input({ required: true }) firstOptionContent!: string;

  /**
   * Content for the second option (Definition)
   */
  @Input({ required: true }) secondOptionContent!: string;

  /**
   * Optional example for the first option
   */
  @Input() firstOptionExample?: string;

  /**
   * Optional example for the second option
   */
  @Input() secondOptionExample?: string;

  /**
   * Whether to show example sections
   */
  @Input() showExample: boolean = true;

  /**
   * Whether the container should be collapsible
   */
  @Input() collapsible: boolean = false;

  /**
   * Initial expanded state
   */
  @Input() initiallyExpanded: boolean = true;

  /**
   * Heading level for the definition title (a11y WCAG 1.3.1)
   */
  @Input() headingLevel: 2 | 3 | 4 | 5 | 6 = 3;

  // Internal state
  selectedOption: string = 'first';

  /**
   * Toggle options for the select button
   */
  get toggleOptions(): DefinitionOption[] {
    return [
      {
        label: this.firstOptionLabel || this.translationService.translate('definition.analogy'),
        value: 'first',
        content: this.firstOptionContent,
      },
      {
        label: this.secondOptionLabel || this.translationService.translate('definition.definition'),
        value: 'second',
        content: this.secondOptionContent,
      },
    ];
  }

  /**
   * Current content based on selected option
   */
  get currentContent(): string {
    return this.selectedOption === 'first' ? this.firstOptionContent : this.secondOptionContent;
  }

  /**
   * Current example based on selected option
   */
  get currentExample(): string | undefined {
    return this.selectedOption === 'first' ? this.firstOptionExample : this.secondOptionExample;
  }

  /**
   * Container configuration
   */
  get containerConfig(): ContainerConfig {
    return {
      type: this.type,
      title: this.title, // Will be overridden by custom header
      customHeaderSlot: true,
      elevation: this.elevation,
      collapsible: this.collapsible,
      initiallyExpanded: this.initiallyExpanded,
      headingLevel: this.headingLevel,
    };
  }

  /**
   * Handle toggle change event
   */
  onToggleChange(event: { value?: string }): void {
    if (event.value != null) {
      this.selectedOption = event.value;
    }
  }
}
