/**
 * Share Service
 *
 * Provides centralized sharing functionality using the Web Share API with fallback to clipboard.
 * Supports sharing content with title, description, and URL using the native sharing capabilities
 * or clipboard as fallback for unsupported browsers.
 */

import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from './toast.service';
import { TranslationService } from './translation.service';

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Share content using Web Share API or fallback to clipboard
   * @param shareData - The data to share (title, text, url)
   * @returns Promise that resolves when sharing is complete
   */
  async share(shareData: ShareData): Promise<void> {
    // Sharing is a user gesture; there is nothing to share during prerender.
    if (!this.isBrowser) return;
    try {
      // Try Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }

      // Fallback: Copy URL to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        this.toastService.showSuccess(
          this.translationService.translate('share.urlCopied'),
          this.translationService.translate('share.success'),
        );
        return;
      }

      // Ultimate fallback: Create temporary textarea for older browsers
      this.fallbackCopyToClipboard(shareData.url);
      this.toastService.showSuccess(
        this.translationService.translate('share.urlCopied'),
        this.translationService.translate('share.success'),
      );
    } catch (error) {
      if (typeof console !== 'undefined') {
        console.error('Error sharing content:', error);
      }
      this.toastService.showError(
        this.translationService.translate('share.error'),
        this.translationService.translate('share.errorTitle'),
      );
    }
  }

  /**
   * Fallback method to copy text to clipboard for older browsers
   * @param text - Text to copy to clipboard
   */
  private fallbackCopyToClipboard(text: string): void {
    const doc = this.document;
    const textArea = doc.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    doc.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      doc.execCommand('copy');
    } catch (err) {
      if (typeof console !== 'undefined') {
        console.error('Fallback copy failed:', err);
      }
      throw new Error('Copy to clipboard failed');
    } finally {
      doc.body.removeChild(textArea);
    }
  }

  /**
   * Create share data from basic parameters
   * @param title - Content title
   * @param description - Content description
   * @param url - Content URL
   * @returns ShareData object
   */
  createShareData(title: string, description: string, url: string): ShareData {
    return {
      title: title.trim(),
      text: description.trim(),
      url: url.trim(),
    };
  }
}
