/**
 * Highlight Directive
 *
 * Simple directive that adds glossary highlighting to existing text content.
 * Does NOT change the text - only adds highlighting to AI terms.
 *
 * Usage:
 * <h3 appHighlight>{{ event.title }}</h3>
 * <p appHighlight>{{ event.description }}</p>
 * <span appHighlight>Any text content</span>
 */
import { Directive, ElementRef, Input, OnInit, OnDestroy, inject, computed, effect, signal } from '@angular/core';

// Services
import { TranslationService } from '../services/translation.service';
import { HighlightingService } from '../services/highlighting.service';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private translationService = inject(TranslationService);
  private highlightingService = inject(HighlightingService);
  private originalText: string = '';
  /** Pre-highlight children of a rich-HTML host, cloned — see applyHighlighting(). */
  private originalNodes: DocumentFragment | null = null;
  private eventListeners: Array<{ element: HTMLElement; event: string; handler: EventListener }> = [];

  // Reactive source-text input. Templates that hold *reactive* text (changes
  // with language/data, e.g. glossary entries) should bind it explicitly:
  //   <div [appHighlight]="entry.definition">{{ entry.definition }}</div>
  // Without this binding, the directive falls back to reading textContent at
  // ngOnInit, which captures whatever the SSR-rendered text was. After
  // hydration that DOM gets replaced with hand-built spans, severing
  // Angular's text-node binding — so subsequent interpolation updates can no
  // longer reach the DOM. Templates with static text don't need to change;
  // the attribute form `<div appHighlight>...</div>` still works.
  private sourceTextSignal = signal<string | undefined>(undefined);
  @Input('appHighlight') set sourceText(value: string | undefined) {
    if (typeof value === 'string') {
      this.sourceTextSignal.set(value);
    }
  }

  // When set, matches pointing to this glossary entry id are filtered out — used
  // on a glossary entry's own definition so the entry's term doesn't self-link.
  private suppressEntryIdSignal = signal<string | undefined>(undefined);
  @Input() set suppressEntryId(value: string | undefined) {
    this.suppressEntryIdSignal.set(value);
  }

  // Reactive properties
  currentLanguage = computed(() => this.translationService.currentLanguage);
  isServiceReady = computed(() => this.highlightingService.isLoadedSignal());
  highlightingEnabled = computed(() => this.highlightingService.highlightingEnabled$());
  // Track per-language data loading — triggers re-highlight when new language data arrives
  dataVersion = computed(() => this.highlightingService.dataVersion());

  // Effect to re-highlight when content, language or enabled state changes
  private highlightEffect = effect(() => {
    // Access all reactive signals to track them
    this.currentLanguage();
    this.isServiceReady();
    this.highlightingEnabled();
    this.dataVersion();
    const reactiveText = this.sourceTextSignal();
    this.suppressEntryIdSignal();

    // When a reactive text input is provided, treat it as the new source.
    // This lets the directive react to text changes that Angular's
    // interpolation can no longer deliver because applyHighlighting() has
    // replaced the host's child nodes.
    if (typeof reactiveText === 'string' && reactiveText.trim() && reactiveText.trim() !== this.originalText) {
      this.originalText = reactiveText.trim();
    }

    this.applyHighlighting();
  });

  ngOnInit(): void {
    // Save original text content BEFORE any effects run
    const element = this.elementRef.nativeElement;
    if (!this.originalText && element.textContent) {
      this.originalText = element.textContent.trim();
    }

    // Initialize highlighting service
    this.highlightingService.initialize().catch(() => {
      // Silent fail - directive works without highlighting
    });
  }

  ngOnDestroy(): void {
    this.cleanupEventListeners();
  }

  private cleanupEventListeners(): void {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  /**
   * Apply highlighting to current element text content
   */
  private applyHighlighting(): void {
    // SSR-Guard: DOM-Manipulation läuft ausschließlich im Browser.
    if (typeof document === 'undefined') return;

    const element = this.elementRef.nativeElement;
    const currentLang = this.currentLanguage();
    const serviceReady = this.isServiceReady();
    const enabled = this.highlightingEnabled();

    // Save original text on first run if not already saved
    if (!this.originalText && element.textContent) {
      this.originalText = element.textContent.trim();
    }

    // If no original text saved, do nothing
    if (!this.originalText) {
      return;
    }

    if (!serviceReady) {
      // Keep original content if service not ready
      return;
    }

    // Rich-HTML path: element contains structural markup we must preserve
    // (paragraphs, bold, em, br, lists, code). Without this, the flat path
    // would nuke innerHTML and collapse multi-paragraph content into a wall.
    //
    // The baseline is kept as cloned DOM nodes, never as an HTML string: the
    // content was already sanitized by Angular when it was bound, and restoring
    // clones puts back exactly those nodes without a serialize/re-parse round
    // trip (no innerHTML write, so no chance of mutation-XSS-style drift).
    const hasOurHighlights = element.querySelector('.glossary-highlight') !== null;
    const fresh = !hasOurHighlights ? element.innerHTML : null;
    const isRich = fresh !== null ? this.hasRichHtml(fresh) : this.originalNodes !== null;
    if (isRich) {
      // First-time or after Angular refreshed [innerHTML] from a signal:
      // capture as new baseline (no highlights of ours are in it yet).
      if (fresh !== null) {
        this.originalNodes = this.snapshotChildren(element);
      }

      // If disabled, ensure we show the original content without highlights.
      if (!enabled) {
        if (hasOurHighlights) {
          this.restoreChildren(element);
        }
        return;
      }

      try {
        this.applyHighlightingPreservingHtml(element, currentLang);
      } catch {
        /* keep original */
      }
      return;
    }

    // If highlighting is disabled, make sure we show plain text
    if (!enabled) {
      // Only update if currently has highlighted content
      if (element.querySelector('.glossary-highlight')) {
        element.textContent = this.originalText;
      }
      return;
    }

    try {
      const processed = this.highlightingService.processContent(this.originalText, currentLang, {
        excludeEntryId: this.suppressEntryIdSignal(),
      });

      if (!processed?.textSegments || processed.textSegments.length === 0) {
        // Keep original if no highlighting found
        return;
      }

      // No actual glossary match in this text. Replacing the host's children here
      // would sever Angular's interpolation text node for nothing — and because the
      // naked attribute form has no reactive @Input to re-feed it, the field would
      // then freeze on the current language (it could no longer follow an in-place
      // language switch). So when there is nothing to highlight and we have not
      // previously injected highlights, leave Angular's text node attached and live.
      // Only fall through to rebuild when stale highlights from a previous language
      // must be cleared. Mirrors the rich-HTML path's `if (!anyHighlight) continue`.
      const anyHighlight = processed.textSegments.some((s: { isHighlight: boolean }) => s.isHighlight);
      if (!anyHighlight && !element.querySelector('.glossary-highlight')) {
        return;
      }

      // Clean up previous listeners before rebuilding
      this.cleanupEventListeners();

      // Clear and rebuild with highlighting
      element.innerHTML = '';

      processed.textSegments.forEach((segment) => {
        const node = this.buildSegmentNode(element, segment);
        if (node) element.appendChild(node);
      });
    } catch {
      // Silent fallback - keep original text
    }
  }

  /** Deep-clone the host's current children into a detached fragment. */
  private snapshotChildren(element: HTMLElement): DocumentFragment {
    const fragment = element.ownerDocument.createDocumentFragment();
    element.childNodes.forEach((child) => fragment.appendChild(child.cloneNode(true)));
    return fragment;
  }

  /** Replace the host's children with a fresh clone of the saved baseline. */
  private restoreChildren(element: HTMLElement): void {
    if (this.originalNodes !== null) {
      element.replaceChildren(this.originalNodes.cloneNode(true));
    }
  }

  private hasRichHtml(html: string): boolean {
    return /<(p|br|strong|em|code|ul|ol|li|a|i|h[1-6]|blockquote|pre|sub|sup|small|mark)\b/i.test(html);
  }

  private applyHighlightingPreservingHtml(element: HTMLElement, currentLang: string): void {
    // Restore the captured pre-highlight nodes so re-runs don't accumulate state.
    this.restoreChildren(element);
    this.cleanupEventListeners();

    // Collect text nodes (skip empty / whitespace-only). Also skip text inside
    // existing glossary highlights so we never nest them.
    const textNodes: Text[] = [];
    const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (n: Node) => {
        const t = n.textContent ?? '';
        if (!t.trim()) return NodeFilter.FILTER_REJECT;
        const parent = (n as Text).parentElement;
        if (parent && parent.closest('.glossary-highlight')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let n: Node | null;
    while ((n = walker.nextNode())) textNodes.push(n as Text);

    for (const textNode of textNodes) {
      const text = textNode.textContent ?? '';
      let processed;
      try {
        processed = this.highlightingService.processContent(text, currentLang, {
          excludeEntryId: this.suppressEntryIdSignal(),
        });
      } catch {
        continue;
      }
      if (!processed?.textSegments || processed.textSegments.length === 0) continue;
      // No highlights in this fragment → leave the text node intact.
      const anyHighlight = processed.textSegments.some((s: { isHighlight: boolean }) => s.isHighlight);
      if (!anyHighlight) continue;

      const fragment = element.ownerDocument.createDocumentFragment();
      processed.textSegments.forEach(
        (segment: {
          isHighlight: boolean;
          text: string;
          highlightData?: { term: string; termId: string; definition: string; category: string };
        }) => {
          // Context check must start at the text node's own parent, not the
          // directive host — an <a> nested INSIDE the host would otherwise
          // slip through the interactive-ancestor guard.
          const node = this.buildSegmentNode(textNode.parentElement ?? element, segment);
          if (node) fragment.appendChild(node);
        },
      );
      textNode.parentNode?.replaceChild(fragment, textNode);
    }
  }

  private buildSegmentNode(
    host: HTMLElement,
    segment: {
      isHighlight: boolean;
      text: string;
      highlightData?: { term: string; termId: string; definition: string; category: string };
    },
  ): Node | null {
    if (!segment.isHighlight) {
      return host.ownerDocument.createTextNode(segment.text);
    }
    const span = host.ownerDocument.createElement('span');
    span.className = 'glossary-highlight';
    span.textContent = segment.text;

    if (segment.highlightData) {
      // No native title: the popover is the explanation and a hover-only
      // duplicate reaches neither touch nor keyboard (guide anti-pattern).
      // No role=button/tabindex inside links or buttons — nested interactive
      // controls are invalid (WCAG 4.1.2) and a glossary click would swallow
      // the surrounding link's navigation (e.g. teaser cards whose
      // title+excerpt live inside one <a>). The span keeps its styling there.
      const isInsideInteractive = host.closest('a, button, [role="button"]') !== null;
      if (!isInsideInteractive) {
        span.tabIndex = 0;
        span.role = 'button';

        const handleClick = (event: Event) => {
          event.preventDefault();
          event.stopPropagation();
          const rect = span.getBoundingClientRect();
          this.highlightingService.showPopover(
            segment.highlightData!.termId,
            segment.highlightData!.term,
            segment.highlightData!.definition,
            segment.highlightData!.category,
            { x: rect.left, y: rect.bottom + 5, termTop: rect.top },
          );
        };
        span.addEventListener('click', handleClick);
        this.eventListeners.push({ element: span, event: 'click', handler: handleClick });

        // role="button" promises both keys a native button answers to; Space
        // must not scroll the page (handleClick prevents the default).
        const handleKeydown = (event: Event) => {
          const key = (event as KeyboardEvent).key;
          if (key === 'Enter' || key === ' ' || key === 'Spacebar') handleClick(event);
        };
        span.addEventListener('keydown', handleKeydown);
        this.eventListeners.push({ element: span, event: 'keydown', handler: handleKeydown });
      }
    }
    return span;
  }
}
