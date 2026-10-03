/**
 * Simple Easy Language FAB - Direct Implementation
 *
 * Self-contained FAB component for Easy Language functionality.
 * No external dependencies, simple visibility logic.
 */

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  computed,
  effect,
  untracked,
  inject,
  ViewEncapsulation,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { DialogModule } from '@openng/optimus-ui/dialog';
import { ButtonModule } from '@openng/optimus-ui/button';
import { EasyLanguageService, EasyLanguageContent } from '../../services/easy-language.service';
import { FabRegistryService, FAB_PRIORITIES, FAB_DIALOG } from '../../services/fab-registry.service';
import { TranslationService } from '../../services/translation.service';
import { FocusReturn } from '../../utils/focus-return';
import { KEY_SOURCE_LANGUAGE, LANGUAGE_RULES } from '../../../config/languages';
import { SITE_CONFIG } from '../../../config/site';

/** Shared FAB-dialog slot id — see FabRegistryService.openDialogId. */
const DIALOG_ID = FAB_DIALOG.EASY_LANGUAGE;

@Component({
  selector: 'app-simple-easy-language-fab',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [DialogModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- FAB Button (only when NOT using FAB Registry) -->
    @if (shouldShow() && !hideButton) {
      <div class="simple-easy-fab" [class.visible]="isVisible" [class.in-stack]="inStack" [class.standalone]="!inStack">
        <button
          class="fab-button"
          (click)="showDialog()"
          [attr.aria-label]="translate('easyLanguage.fab.label')"
          type="button"
        >
          <i class="pi pi-language"></i>
          <span class="fab-label">{{ translate('easyLanguage.fab.label') }}</span>
        </button>
      </div>
    }

    <!-- Easy Language Dialog (always rendered for programmatic access) -->
    <!-- #dlg: [showHeader]="false" leaves Optimus UI's generated 'ariaLabelledBy'
         id pointing at nothing (the <span> carrying it lives inside the
         header's *ngIf), so the dialog has no accessible name. Putting that
         same id on the visible heading below repairs the reference.
         NOTE: no backticks in this comment - it sits inside a template literal. -->
    <p-dialog
      #dlg
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      (onHide)="closeDialog()"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [closeOnEscape]="true"
      [draggable]="false"
      [resizable]="false"
      [baseZIndex]="10000"
      styleClass="simple-easy-dialog"
      [style]="{ width: '90vw', maxWidth: '800px', height: 'auto', maxHeight: '90vh' }"
      [header]="''"
      [showHeader]="false"
      [closeAriaLabel]="translate('ui.close')"
    >
      <div class="dialog-content">
        <!-- Header -->
        <div class="dialog-header">
          <div class="header-icon">
            <i class="pi pi-language"></i>
          </div>
          <h2 class="dialog-title" [attr.id]="dlg.computedAriaLabelledBy()">
            {{ translate('easyLanguage.dialog.title') }}
          </h2>
          <button class="close-btn" (click)="closeDialog()" [attr.aria-label]="translate('ui.close')" type="button">
            <i class="pi pi-times" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="dialog-body">
          <!-- Full Portal Notice -->
          @if (!isCurrentlyInEasyLanguage()) {
            <div class="portal-notice">
              <i class="pi pi-info-circle notice-icon"></i>
              <div class="notice-content">
                <p>{{ translate('easyLanguage.dialog.fullPortalNotice') }}</p>
              </div>
            </div>
          }

          @if (contentInfo()) {
            <div class="content-preview">
              <h3 class="content-title">{{ translate('easyLanguage.dialog.preview') }}: {{ contentTitle() }}</h3>
              <div class="preview-blocks">
                @for (block of contentPreview(); track block.title) {
                  <div class="preview-block">
                    <h4 class="block-title">{{ block.title }}</h4>
                    <div class="block-content" [innerHTML]="block.content"></div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="dialog-footer">
          <p-button [label]="translate('ui.close')" severity="secondary" [text]="true" (onClick)="closeDialog()" />

          <!-- Language Switch Button (only show when not already in Easy Language) -->
          @if (!isCurrentlyInEasyLanguage()) {
            <p-button
              [label]="translate('easyLanguage.dialog.switchToEasyLanguage')"
              icon="pi pi-language"
              severity="success"
              (onClick)="switchToEasyLanguage()"
              styleClass="language-switch-btn"
            >
            </p-button>
          }
        </div>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      /* Base FAB styles */
      .simple-easy-fab {
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        transform: translateX(100px); /* Slide in animation */
        pointer-events: auto; /* Enable clicks */
      }

      /* Standalone mode: Fixed positioning */
      .simple-easy-fab.standalone {
        position: fixed;
        bottom: var(--space-6);
        right: var(--space-6);
        z-index: 1000;
      }

      /* Stack mode: Relative positioning */
      .simple-easy-fab.in-stack {
        position: relative;
      }

      .simple-easy-fab.visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(0); /* Slide in completed */
      }

      /* FAB Button — its own opaque surface (A11Y-004), same contract as
         app-fab-container: fill --surface-card, label --text-color, edge
         --fab-edge; the orange stays on the icon. --surface-0 is reset to
         initial in the FAB scope (styles.scss), so it must not be read here. */
      app-simple-easy-language-fab .fab-button {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-4);
        background: var(--surface-card);
        color: var(--orange-600);
        border: 2px solid var(--fab-edge);
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-weight: 600;
        min-width: 50px;
      }

      app-simple-easy-language-fab .fab-button:hover {
        background: var(--surface-hover);
        transform: scale(1.02);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      app-simple-easy-language-fab .fab-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-simple-easy-language-fab .fab-button i {
        font-size: 1.1rem;
      }

      app-simple-easy-language-fab .fab-label {
        white-space: nowrap;
        color: var(--text-color);
      }

      /* Mobile - show only icon */
      @media (max-width: 768px) {
        app-simple-easy-language-fab .fab-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          justify-content: center;
          padding: 0;
        }

        .fab-label {
          display: none;
        }
      }

      /* Dialog Styles */
      .simple-easy-dialog .p-dialog-mask {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .simple-easy-dialog .p-dialog {
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
      }

      .simple-easy-dialog .p-dialog-content {
        padding: 0;
        border-radius: 16px;
        background: var(--surface-ground);
      }

      .dialog-content {
        background: var(--surface-ground);
        display: flex;
        flex-direction: column;
        max-height: calc(90vh - 2rem);
      }

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-3) var(--space-4);
        background: var(--orange-50);
        border-bottom: 3px solid var(--orange-500);
      }

      app-simple-easy-language-fab .header-icon {
        display: flex;
        align-items: center;
        color: var(--orange-500);
      }

      .header-icon i {
        font-size: 1.5rem;
        line-height: 1;
      }

      .dialog-title {
        flex: 1;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--orange-700);
        margin: 0 var(--space-4);
      }

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 50%;
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1.1rem;
      }

      .close-btn:hover {
        background: var(--red-50);
        border-color: var(--red-400);
        color: var(--red-600);
      }

      .close-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .dialog-body {
        padding: var(--space-6);
        flex: 1;
        overflow-y: auto;
      }

      /* Portal Notice - uses pseudo-element for left accent bar */
      .portal-notice {
        display: flex;
        align-items: flex-start;
        gap: var(--space-4);
        padding: var(--space-5) var(--space-6);
        padding-left: calc(var(--space-6) + 6px);
        margin-bottom: var(--space-5);
        background: linear-gradient(135deg, var(--blue-50) 0%, var(--surface-card) 100%);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        position: relative;
        overflow: hidden;
      }

      .portal-notice::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        background: var(--blue-500);
      }

      .notice-icon {
        flex-shrink: 0;
        color: var(--blue-500);
        font-size: 1.75rem;
        line-height: 1.7;
        margin-top: 1px;
      }

      .notice-content {
        flex: 1;
      }

      .notice-content p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.7;
        color: var(--text-color);
        font-weight: 500;
      }

      .content-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: var(--space-2);
        text-align: center;
      }

      .preview-blocks {
        background: var(--surface-50);
        border-radius: 12px;
        padding: var(--space-4);
        border-left: 4px solid var(--orange-500);
      }

      .preview-block {
        margin-bottom: var(--space-4);
      }

      .preview-block:last-child {
        margin-bottom: 0;
      }

      .block-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--orange-600);
        margin-bottom: var(--space-2);
      }

      .block-content {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--text-color);
      }

      .dialog-footer {
        padding: var(--space-4) var(--space-6);
        border-top: 1px solid var(--surface-border);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: var(--space-3);
      }

      .language-switch-btn {
        margin-right: auto;
        font-weight: 600;
      }

      /* Dark theme — icon shade -300 on the dark card surface */
      .dark-theme .simple-easy-fab .fab-button {
        color: var(--orange-300);
      }

      .dark-theme .portal-notice {
        background: linear-gradient(135deg, var(--blue-900) 0%, var(--surface-800) 100%);
        border-color: var(--surface-border);
      }

      .dark-theme .portal-notice::before {
        background: var(--blue-400);
      }

      .dark-theme .notice-icon {
        color: var(--blue-400);
      }

      .dark-theme .dialog-header {
        background: var(--surface-800);
      }

      .dark-theme .dialog-title {
        color: var(--orange-200);
      }

      .dark-theme .preview-blocks {
        background: var(--surface-100);
      }

      .dark-theme .block-title {
        color: var(--orange-400);
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .simple-easy-fab {
          transition: none;
          transform: none;
        }

        .simple-easy-fab.visible {
          transform: none;
        }

        app-simple-easy-language-fab .fab-button {
          transition: none;
        }

        app-simple-easy-language-fab .fab-button:hover {
          transform: none;
        }
      }

      /* Very narrow mobile — stack the info icon centered above the text */
      @media (max-width: 400px) {
        .portal-notice {
          flex-direction: column;
          gap: var(--space-2);
        }

        .notice-icon {
          align-self: center;
        }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .simple-easy-dialog .p-dialog {
          margin: var(--space-2);
          width: calc(100vw - var(--space-4)) !important;
          max-width: none !important;
        }

        .dialog-header {
          padding: var(--space-4);
        }

        .dialog-title {
          font-size: 1.3rem;
        }

        .dialog-body {
          padding: var(--space-4);
        }

        .dialog-footer {
          flex-direction: column-reverse;
          align-items: stretch;
        }

        .dialog-footer .language-switch-btn {
          margin-right: 0;
        }

        .dialog-footer .p-button {
          width: 100%;
          justify-content: center;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class SimpleEasyLanguageFabComponent implements OnInit, OnDestroy {
  @Input() contentId!: string;
  @Input() contentType: 'article' | 'interview' | 'tool' | 'resource' | 'demo' | 'page' | 'blog' = 'interview';
  @Input() inStack: boolean = true; // Whether this FAB is inside a FABStack (default: true for consistency)
  // Default true: jede Instanz registriert sich im globalen FabRegistry und
  // wird von <app-fab-container> gerendert. Der eingebaute Standalone-Button
  // (Template-Render unten) ist nur noch ein Opt-out-Pfad fuer Sonderfaelle —
  // ohne diesen Default rendern Pages den Button doppelt (Registry + Inline).
  @Input() hideButton: boolean = true;
  /**
   * Bypass the easy-language registry check and always render the FAB.
   * Use for content types whose IDs aren't pre-registered in the (legacy)
   * mock registry — e.g. dynamically-created blog posts, where every post
   * gets propagated through langfix-schnell into a -easy variant by
   * default and we know the easy version exists without consulting the
   * hardcoded Map.
   */
  @Input() alwaysShow: boolean = false;

  dialogVisible = signal(false);
  contentInfo = signal<EasyLanguageContent | null>(null);
  isVisible = true; // Always visible when content is available

  // V2 PATTERN: Use computed signals instead of cached values
  contentPreview = computed(() => this.getContentPreview());
  contentTitle = computed(() => this.getContentTitle());

  private fabId: string = '';
  private autoRegistered = false;

  /** Hands focus back to the FAB that opened the dialog — Optimus UI does not. */
  private readonly focusReturn = new FocusReturn();

  private translationService = inject(TranslationService);
  private fabRegistry = inject(FabRegistryService);
  private readonly site = inject(SITE_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public easyLanguageService = inject(EasyLanguageService);

  constructor() {
    // Mutual exclusion: if another FAB dialog (e.g. Feedback) claims the
    // shared slot while we're open, close ourselves so only one is ever shown.
    effect(() => {
      const active = this.fabRegistry.openDialogId();
      if (active !== null && active !== DIALOG_ID) {
        untracked(() => {
          if (this.dialogVisible()) {
            this.dialogVisible.set(false);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    // Load content information
    const content = this.easyLanguageService.getEasyContent(this.contentId);
    if (content) {
      this.contentInfo.set(content);
    }

    // Auto-register with FAB Registry if content exists.
    // Registrierung haengt NICHT an hideButton — der globale FabContainer
    // soll den Button immer rendern. hideButton steuert nur ob die Komponente
    // zusaetzlich ihren eigenen Inline-Button rendert (Opt-out via Default).
    if (this.shouldShow()) {
      this.fabId = `easy-language-${this.contentId}`;
      // Only register if not already registered (prevents duplicates)
      if (!this.fabRegistry.isRegistered(this.fabId)) {
        this.fabRegistry.register({
          id: this.fabId,
          priority: FAB_PRIORITIES.EASY_LANGUAGE,
          icon: 'pi-language',
          labelKey: 'easyLanguage.fab.label',
          color: 'default',
          onClick: () => this.open(),
          ariaHaspopup: 'dialog',
        });
        this.autoRegistered = true;
      }
    }
  }

  ngOnDestroy(): void {
    // Unregister from FAB Registry if we auto-registered
    if (this.autoRegistered && this.fabId) {
      this.fabRegistry.unregister(this.fabId);
    }
    // Release the shared dialog slot if we still own it (this FAB is
    // page-scoped and gets destroyed on navigation — don't leave a stale
    // slot pointing at a component that no longer exists).
    if (this.fabRegistry.openDialogId() === DIALOG_ID) {
      this.fabRegistry.setActiveDialog(null);
    }
  }

  shouldShow(): boolean {
    if (this.alwaysShow) return true;
    return this.easyLanguageService.hasEasyVersion(this.contentId, this.contentType);
  }

  showDialog(): void {
    // Claim the shared FAB-dialog slot — closes any sibling dialog.
    this.focusReturn.capture();
    this.fabRegistry.setActiveDialog(DIALOG_ID);
    this.dialogVisible.set(true);
  }

  /**
   * Open dialog programmatically (called by FAB Registry)
   */
  open(): void {
    this.showDialog();
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    // Release the shared slot if we still own it.
    if (this.fabRegistry.openDialogId() === DIALOG_ID) {
      this.fabRegistry.setActiveDialog(null);
    }
    this.focusReturn.restore();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Check if current language is already Easy Language variant
   */
  isCurrentlyInEasyLanguage(): boolean {
    const currentLang = this.translationService.currentLanguage;
    return currentLang.endsWith('-easy');
  }

  /**
   * Switch to the Easy-Language variant of the current language (de -> de-easy,
   * en -> en-easy), as src/config/languages.json pairs them.
   */
  async switchToEasyLanguage(): Promise<void> {
    const currentLang = this.translationService.currentLanguage;
    const targetLang =
      LANGUAGE_RULES.easyVariantOf(currentLang) ?? LANGUAGE_RULES.easyVariantOf(KEY_SOURCE_LANGUAGE) ?? currentLang;

    await this.translationService.setLanguage(targetLang);
    this.closeDialog();

    // Smooth reload with fade-out animation (same as language-picker; browser only)
    if (!this.isBrowser) return;
    document.body.style.transition = 'opacity 0.2s ease-out';
    document.body.style.opacity = '0';

    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  /**
   * Build the namespace key for this contentId.
   * Convention: easyLanguage.content.<contentIdCamelCase>
   *   art-eu-ai-act  →  artEuAiAct
   *   eliza-demo     →  elizaDemo
   *   home           →  home
   */
  private contentNamespace(): string {
    const camel = (this.contentId || '').replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
    return `easyLanguage.content.${camel}`;
  }

  /**
   * Dialog title — pulled from easyLanguage.content.<contentIdCamelCase>.title
   * Falls back to the generic Vorschau title if the key is missing.
   */
  getContentTitle(): string {
    const ns = this.contentNamespace();
    const key = `${ns}.title`;
    const value = this.translate(key);
    // translate() returns the key itself when no translation is found
    if (value === key) {
      return this.translate('easyLanguage.content.preview.title');
    }
    return value;
  }

  /**
   * Dialog preview blocks — pulled from easyLanguage.content.<contentIdCamelCase>.blocks
   * Schema: blocks is an array of `{ title: string, content: string }` (max 4).
   * Falls back to the generic sample block if missing. A block names the site
   * and its operator through `{siteName}` / `{operator}` (src/config/site.json),
   * so no preview carries a name of its own.
   */
  getContentPreview(): Array<{ title: string; content: string }> {
    const ns = this.contentNamespace();
    const blocks = this.translationService.translateValue<Array<{ title: string; content: string }>>(`${ns}.blocks`);
    if (Array.isArray(blocks) && blocks.length > 0) {
      return blocks.slice(0, 4).map((b) => ({ title: this.site.fill(b.title), content: this.site.fill(b.content) }));
    }
    return [
      {
        title: this.translate('easyLanguage.content.preview.sampleTitle'),
        content: this.translate('easyLanguage.content.preview.sampleContent'),
      },
    ];
  }
}
