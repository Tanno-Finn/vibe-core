/**
 * Notification Bell — header component that visualizes unread portal-wide
 * notifications and exposes them via a popover. Reads everything from
 * `NotificationService`.
 *
 * Concept reference: an internal design note.
 *
 * Note on selectors: Optimus UI's p-popover appends its overlay to <body>,
 * which means CSS selectors prefixed with `app-notification-bell` would
 * miss the popover content. Selectors targeting popover content are
 * therefore unprefixed (the component already runs ViewEncapsulation.None,
 * so naming collisions are still avoided through the `notifications-`
 * namespace alone).
 */
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  ViewChild,
  ViewEncapsulation,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonModule } from '@openng/optimus-ui/button';
import { BadgeModule } from '@openng/optimus-ui/badge';
import { PopoverModule, Popover } from '@openng/optimus-ui/popover';
import { TooltipModule } from '@openng/optimus-ui/tooltip';

import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { NotificationType } from '../../models/notification.model';

const TYPE_ICONS: Record<NotificationType, string> = {
  launch: 'pi pi-sparkles',
  feature: 'pi pi-star',
  release: 'pi pi-bolt',
  bugfix: 'pi pi-wrench',
  article: 'pi pi-file',
  blog: 'pi pi-pencil',
  demo: 'pi pi-play',
  glossary: 'pi pi-book',
  timeline: 'pi pi-clock',
  tool: 'pi pi-th-large',
  language: 'pi pi-flag',
  quality: 'pi pi-check-circle',
  maintenance: 'pi pi-cog',
};

const FALLBACK_ICON = 'pi pi-info-circle';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, ButtonModule, BadgeModule, PopoverModule, TooltipModule],
  template: `
    <div class="notification-bell">
      <span class="sr-only" aria-live="polite" aria-atomic="true">{{ liveAnnouncement() }}</span>

      <button
        type="button"
        class="bell-button"
        [attr.aria-label]="bellAriaLabel()"
        [attr.aria-expanded]="popoverOpen()"
        aria-haspopup="true"
        aria-controls="notifications-popover-content"
        [pTooltip]="t('notifications.bell.label')"
        tooltipPosition="bottom"
        (click)="onBellClick($event)"
      >
        <i class="pi pi-bell" aria-hidden="true"></i>
        @if (unreadCount() > 0) {
          <span class="bell-badge" aria-hidden="true">{{ badgeText() }}</span>
        }
      </button>

      <p-popover #pop (onShow)="onPopoverShow()" (onHide)="onPopoverHide()">
        <div
          id="notifications-popover-content"
          class="notifications-popover"
          role="region"
          [attr.aria-label]="t('notifications.bell.label')"
        >
          <header class="notifications-header">
            <h3>{{ t('notifications.bell.label') }}</h3>
          </header>

          <ul class="notifications-list">
            @for (n of visibleNotifications(); track n.id) {
              <li class="notifications-item" [class.unread]="service.isUnread(n)">
                <i class="notifications-icon {{ n.icon || iconForType(n.type) }}" aria-hidden="true"></i>
                <div class="notifications-body">
                  <strong class="notifications-title" [id]="'notif-title-' + n.id">{{ t(n.titleKey) }}</strong>
                  <p class="notifications-description">{{ t(n.descriptionKey) }}</p>
                  <time class="notifications-time" [attr.datetime]="n.publishedAt">{{
                    formatRelative(n.publishedAt)
                  }}</time>
                  @if (n.link) {
                    <a
                      class="notifications-cta"
                      [routerLink]="n.link"
                      [queryParams]="n.linkQueryParams || undefined"
                      [fragment]="n.linkFragment || undefined"
                      [attr.aria-labelledby]="'notif-cta-' + n.id + ' notif-title-' + n.id"
                      [id]="'notif-cta-' + n.id"
                      (click)="onItemClick(n.id)"
                    >
                      {{ t(n.linkLabelKey || 'notifications.cta.open') }}
                    </a>
                  }
                </div>
              </li>
            } @empty {
              <li class="notifications-empty-row">{{ t('notifications.bell.empty') }}</li>
            }
          </ul>

          <footer class="notifications-footer">
            <a routerLink="/news" class="notifications-view-all" (click)="closeOverlays()">
              {{ t('notifications.bell.viewAll') }}
            </a>
          </footer>
        </div>
      </p-popover>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* ── Host + bell button (live inside the component DOM) ─────────────── */
      app-notification-bell {
        display: inline-flex;
        align-items: center;
        line-height: 1;
      }

      app-notification-bell .notification-bell {
        position: relative;
        display: flex;
        align-items: center;
      }

      app-notification-bell .bell-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        padding: 0;
        border: 1px solid var(--surface-border);
        border-radius: 50%;
        background: var(--surface-card);
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      app-notification-bell .bell-button:hover {
        background: var(--surface-hover);
        color: var(--primary-color-fg);
      }

      app-notification-bell .bell-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-notification-bell .bell-button i.pi-bell {
        font-size: 1.1rem;
      }

      /* Badge pushed inward to sit on the inscribed square of the
       circular bell so it doesn't drift off the rounded edge. */
      app-notification-bell .bell-badge {
        position: absolute;
        top: 6px;
        right: 6px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        border-radius: 8px;
        background: var(--red-500, #dc2626);
        color: #fff;
        font-size: 0.65rem;
        font-weight: 700;
        line-height: 16px;
        text-align: center;
        box-sizing: border-box;
      }

      @media print {
        app-notification-bell {
          display: none !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        app-notification-bell .bell-button {
          transition: none;
        }
      }

      /* ── Popover content (lives inside <body>, so no host prefix here) ──── */
      .notifications-popover {
        width: min(380px, 90vw);
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        background: var(--surface-card);
        color: var(--text-color);
      }

      .notifications-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--surface-border);
      }

      .notifications-header h3 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .notifications-list {
        flex: 1;
        list-style: none;
        margin: 0;
        padding: 0;
        overflow-y: auto;
      }

      .notifications-item {
        display: grid;
        grid-template-columns: 24px 1fr;
        gap: 0.6rem;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--surface-border);
      }

      /* Unread state still conveyed via the tinted row background plus a
       subtle left-edge accent — the leading bullet/dot was visually noisy. */
      .notifications-item.unread {
        background: color-mix(in srgb, var(--primary-color) 6%, var(--surface-card));
        box-shadow: inset 3px 0 0 var(--primary-color);
      }

      .notifications-icon {
        color: var(--primary-color-fg);
        font-size: 1.1rem;
        align-self: start;
        margin-top: 4px;
      }

      .notifications-body {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 0;
      }

      .notifications-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .notifications-description {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        line-height: 1.4;
      }

      .notifications-time {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }

      .notifications-cta {
        align-self: flex-start;
        margin-top: 0.25rem;
        padding: 4px 10px;
        border: 1px solid var(--primary-color);
        border-radius: var(--border-radius);
        color: var(--primary-color-fg);
        font-size: 0.8rem;
        text-decoration: none;
      }

      .notifications-cta:hover {
        background: color-mix(in srgb, var(--primary-color) 8%, var(--surface-card));
      }

      .notifications-empty-row {
        padding: 2rem 1rem;
        text-align: center;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
      }

      .notifications-footer {
        padding: 0.5rem 1rem;
        border-top: 1px solid var(--surface-border);
        text-align: center;
      }

      .notifications-view-all {
        color: var(--primary-color-fg);
        font-size: 0.85rem;
        text-decoration: none;
      }

      .notifications-view-all:hover {
        text-decoration: underline;
      }

      .notifications-view-all:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: var(--border-radius);
      }
    `,
  ],
})
export class NotificationBellComponent {
  service = inject(NotificationService);
  private translationService = inject(TranslationService);

  @ViewChild('pop') popoverRef?: Popover;

  unreadCount = this.service.unreadCount;
  visibleNotifications = this.service.visibleNotifications;
  liveAnnouncement = this.service.liveAnnouncement;

  // Phase I.19 (2026-05-14): Tick-Signal für relative Zeit-Labels.
  // formatRelative() liest nowTick(), wodurch der Wert innerhalb eines CD-Passes
  // stabil ist (Angular cached den Signal-Read). Das eliminiert den NG0100
  // ExpressionChangedAfterItHasBeenCheckedError, der zuvor passierte wenn
  // Date.now() zwischen den beiden CD-Passes eine Sekundengrenze überquerte.
  private nowTick = signal(Date.now());

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const interval = setInterval(() => this.nowTick.set(Date.now()), 30_000);
      inject(DestroyRef).onDestroy(() => clearInterval(interval));
    }
  }

  // Tracks p-popover open/close state so the bell button can expose the
  // disclosure pattern via aria-expanded.
  popoverOpen = signal(false);

  badgeText = computed(() => {
    const c = this.unreadCount();
    return c > 9 ? '9+' : String(c);
  });

  bellAriaLabel = computed(() => {
    const c = this.unreadCount();
    if (c === 0) return this.t('notifications.bell.label');
    return this.t('notifications.bell.labelWithCount').replace('{count}', String(c));
  });

  onBellClick(event: Event): void {
    this.popoverRef?.toggle(event);
    // markPopoverOpened is dispatched by p-popover's (onShow) callback.
  }

  onPopoverShow(): void {
    this.popoverOpen.set(true);
    this.service.markPopoverOpened();
  }

  onPopoverHide(): void {
    this.popoverOpen.set(false);
    this.service.markPopoverClosed();
  }

  onItemClick(id: string): void {
    this.service.markRead(id);
    this.closeOverlays();
  }

  closeOverlays(): void {
    this.popoverRef?.hide();
  }

  iconForType(type: NotificationType): string {
    return TYPE_ICONS[type] ?? FALLBACK_ICON;
  }

  formatRelative(iso: string): string {
    const rtf = this.rtf();
    const ms = this.nowTick() - new Date(iso).getTime();
    const sec = Math.round(ms / 1000);
    if (Math.abs(sec) < 60) return rtf.format(-sec, 'second');
    const min = Math.round(sec / 60);
    if (Math.abs(min) < 60) return rtf.format(-min, 'minute');
    const hour = Math.round(min / 60);
    if (Math.abs(hour) < 24) return rtf.format(-hour, 'hour');
    const day = Math.round(hour / 24);
    if (Math.abs(day) < 30) return rtf.format(-day, 'day');
    const month = Math.round(day / 30);
    if (Math.abs(month) < 12) return rtf.format(-month, 'month');
    return rtf.format(-Math.round(month / 12), 'year');
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeOverlays();
  }

  // Cache one Intl.RelativeTimeFormat per language — avoids re-instantiating
  // on every list item / paint cycle.
  private rtfCache = new Map<string, Intl.RelativeTimeFormat>();
  private rtf(): Intl.RelativeTimeFormat {
    const lang = this.translationService.currentLanguage || 'en';
    let inst = this.rtfCache.get(lang);
    if (!inst) {
      inst = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
      this.rtfCache.set(lang, inst);
    }
    return inst;
  }
}
