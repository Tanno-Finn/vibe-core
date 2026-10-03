/**
 * Breadcrumb Component
 * Provides navigation breadcrumbs for better UX.
 * Route-aware trail with an optional home root item.
 */

import {
  Component,
  Input,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Optimus UI
import { BreadcrumbModule } from '@openng/optimus-ui/breadcrumb';
import { MenuItem } from '@openng/optimus-ui/api';

// Services
import { TranslationService } from '../../services/translation.service';
import type { ExtendedRoute } from '../../app.routes';
import { routedPagesByPath } from '../../utils/routed-pages';
import { SITE } from '../../../config/site';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  translateKey?: string;
  icon?: string;
}

/**
 * Path of the root item — the start page of src/config/site.json ("home" as the
 * kit ships), never repeated in the trail.
 */
export const HOME_PATH = SITE.startPage;

/**
 * The trail for a route path, derived from the route itself: its group
 * (`groupTitleKey`, not a link) followed by the page (`titleKey`, linked).
 * Home and anything that is not a routed page yield no trail. There is no
 * hand-written route map any more, so a trail cannot name a route that does
 * not exist; pass `[customBreadcrumbs]` for deeper hierarchies.
 */
export function routeBreadcrumbs(path: string, pages: ReadonlyMap<string, ExtendedRoute>): BreadcrumbItem[] {
  const page = pages.get(path);
  if (!page?.titleKey || path === HOME_PATH) return [];
  const trail: BreadcrumbItem[] = [];
  if (page.groupTitleKey) {
    trail.push({ label: page.group ?? page.groupTitleKey, translateKey: page.groupTitleKey });
  }
  trail.push({ label: path, translateKey: page.titleKey, url: `/${path}` });
  return trail;
}

/**
 * The trail as Optimus UI MenuItems. Two rules keep it honest for keyboard and
 * screen-reader users:
 *   - the LAST crumb is the current page: never a link (it would link to
 *     itself), out of the tab order. p-breadcrumb itself puts
 *     `aria-current="page"` on the last visible item (`isCurrentPage`), so the
 *     component sets nothing of its own — a MenuItem key named 'aria-current'
 *     was never rendered.
 *   - a crumb without a url (a route group) is not a link either; p-breadcrumb
 *     would still render it as an <a tabindex="0"> — a dead tab stop — so it
 *     gets tabindex -1.
 */
export function toMenuItems(trail: BreadcrumbItem[], translate: (key: string) => string): MenuItem[] {
  return trail.map((item, index) => {
    const label = item.translateKey ? translate(item.translateKey) : item.label;
    const isCurrent = index === trail.length - 1;
    const link = isCurrent ? undefined : item.url;
    return {
      label,
      title: label,
      icon: item.icon,
      ...(link ? { routerLink: link } : { tabindex: '-1' }),
    };
  });
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterModule, BreadcrumbModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // p-breadcrumb renders its own <nav> root, so the component adds no second
  // landmark: the label goes onto that nav through the pass-through (`pt.root`).
  template: `
    @if (breadcrumbItems.length > 1) {
      <div class="breadcrumb-container">
        <p-breadcrumb
          [model]="breadcrumbItems"
          [home]="showHome ? homeItem : undefined"
          styleClass="custom-breadcrumb"
          [pt]="{ root: { 'aria-label': translate('app.nav.breadcrumb') } }"
        >
        </p-breadcrumb>
      </div>
    }
  `,
  // Class names are Optimus UI's own (openng-optimus-ui-breadcrumb.mjs,
  // `classes`): p-breadcrumb-item-link / -item-label / -item-icon,
  // p-breadcrumb-home-item, p-breadcrumb-separator. The former selectors
  // (.p-menuitem-link, .p-menuitem-text, .p-breadcrumb-chevron,
  // .p-breadcrumb-home .p-menuitem-icon) were PrimeNG 17 names and matched
  // nothing. A crumb WITH an href is a link (accent foreground, underlined on
  // hover); the group crumb and the current page have none and read as text.
  styles: [
    `
      app-breadcrumb .breadcrumb-container {
        margin-bottom: var(--spacing-lg, 1.5rem);
        padding: var(--spacing-sm, 0.75rem) 0;
      }

      app-breadcrumb .custom-breadcrumb {
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
      }

      app-breadcrumb .custom-breadcrumb .p-breadcrumb-separator {
        color: var(--text-color-secondary);
      }

      app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-link[href],
      app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-link[href] .p-breadcrumb-item-label,
      app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-link[href] .p-breadcrumb-item-icon {
        color: var(--primary-color-fg);
        text-decoration: none;
      }

      app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-link[href]:hover .p-breadcrumb-item-label {
        color: var(--primary-color-fg);
        text-decoration: underline;
      }

      app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-link:not([href]) .p-breadcrumb-item-label {
        color: var(--text-color-secondary);
      }

      app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-link[aria-current='page'] .p-breadcrumb-item-label {
        color: var(--text-color);
        font-weight: 600;
      }

      app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-label {
        font-size: var(--font-size-sm, 0.875rem);
      }

      /* Print: hide breadcrumb navigation. The component is unencapsulated,
         so the rule names the element (a :host here would never match). */
      @media print {
        app-breadcrumb {
          display: none !important;
        }
      }

      /* Responsive design */
      @media (max-width: 768px) {
        app-breadcrumb .breadcrumb-container {
          margin-bottom: var(--spacing-md, 1rem);
          padding: var(--spacing-xs, 0.5rem) 0;
        }

        app-breadcrumb .custom-breadcrumb {
          padding: var(--spacing-xs, 0.5rem) var(--spacing-sm, 0.75rem);
        }

        app-breadcrumb .custom-breadcrumb .p-breadcrumb-item-label {
          font-size: var(--font-size-xs, 0.75rem);
        }
      }
    `,
  ],
})
export class BreadcrumbComponent implements OnInit {
  @Input() customBreadcrumbs?: BreadcrumbItem[];
  @Input() showHome: boolean = true;

  // Injected services
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  private readonly destroyRef = inject(DestroyRef);

  breadcrumbItems: MenuItem[] = [];
  homeItem: MenuItem = {
    icon: 'pi pi-home',
    routerLink: `/${HOME_PATH}`,
    title: 'Home',
  };

  /** Routed pages of the live router config, indexed once: the source of the derived trails. */
  private readonly pages = routedPagesByPath(this.router.config as ExtendedRoute[]);

  ngOnInit(): void {
    // Initialize breadcrumbs for current route
    this.updateBreadcrumbs();

    // Update home item translation
    this.updateHomeItem();

    // Listen to route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Listen to language changes
    this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateHomeItem();
      this.updateBreadcrumbs();
    });
  }

  /**
   * Update breadcrumbs based on current route
   */
  private updateBreadcrumbs(): void {
    const currentUrl = this.router.url;
    const route = this.extractRouteFromUrl(currentUrl);

    let breadcrumbs: BreadcrumbItem[];

    if (this.customBreadcrumbs) {
      breadcrumbs = this.customBreadcrumbs;
    } else {
      breadcrumbs = routeBreadcrumbs(route, this.pages);
    }

    this.breadcrumbItems = toMenuItems(breadcrumbs, (key) => this.translate(key));
  }

  /**
   * Update home item with current translation
   */
  private updateHomeItem(): void {
    this.homeItem = {
      icon: 'pi pi-home',
      routerLink: `/${HOME_PATH}`,
      title: this.translate('app.nav.home'),
      label: this.translate('app.nav.home'),
    };
  }

  /**
   * Get translation for a key
   */
  protected translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Extract route from URL
   */
  private extractRouteFromUrl(url: string): string {
    return url.split('?')[0].split('#')[0].replace('/', '') || HOME_PATH;
  }

  /**
   * Set custom breadcrumbs programmatically
   */
  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.customBreadcrumbs = breadcrumbs;
    this.updateBreadcrumbs();
  }

  /**
   * Add a breadcrumb item
   */
  addBreadcrumb(item: BreadcrumbItem, position?: number): void {
    if (!this.customBreadcrumbs) {
      const currentUrl = this.router.url;
      const route = this.extractRouteFromUrl(currentUrl);
      this.customBreadcrumbs = routeBreadcrumbs(route, this.pages);
    }

    if (position !== undefined) {
      this.customBreadcrumbs.splice(position, 0, item);
    } else {
      this.customBreadcrumbs.push(item);
    }

    this.updateBreadcrumbs();
  }

  /**
   * Remove a breadcrumb item by index
   */
  removeBreadcrumb(index: number): void {
    if (this.customBreadcrumbs && index >= 0 && index < this.customBreadcrumbs.length) {
      this.customBreadcrumbs.splice(index, 1);
      this.updateBreadcrumbs();
    }
  }

  /**
   * Clear all breadcrumbs
   */
  clearBreadcrumbs(): void {
    this.customBreadcrumbs = [];
    this.breadcrumbItems = [];
  }
}
