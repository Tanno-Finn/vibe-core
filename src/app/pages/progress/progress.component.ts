/**
 * Progress page (/progress, page id `prgs`).
 *
 * A read-only view of how far the visitor has got through the content this kit
 * ships: one row per topic with a status, and a compact summary above it.
 * Shaped in specs/2026-08-24-progress-page/shape.md.
 *
 * There is no backend. `LearningProgressService` stands in for one — it reads the
 * two content indexes over HTTP, waits the way a round-trip waits, and folds the
 * locally stored progress over them. That makes all four states real: the wait is
 * the injected latency, the failure is a failed index fetch (offline, blocked
 * request, an index missing from a deploy) with a retry that genuinely re-fetches,
 * and the empty branch is what a fork that stripped the seed content sees.
 *
 * SSR-safe: the page is prerendered (TIER_1_ROUTES) and the stored progress lives
 * in localStorage, so the load starts in `afterNextRender` — never at
 * construction. The server renders the loading branch and the browser takes it
 * from there; a client-side read during bootstrap would disagree with the server
 * markup and hydration would throw the DOM away.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';

import { ButtonModule } from '@openng/optimus-ui/button';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { TagModule } from '@openng/optimus-ui/tag';

import { TranslationService } from '../../services/translation.service';
import {
  LearningProgressReport,
  LearningProgressService,
  TopicKind,
  TopicStatus,
} from '../../services/learning-progress.service';
import { ArticleComponent } from '../../components/shared/article.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { StandardContainerComponent } from '../../components/shared/standard-container.component';
import { StatCardComponent } from '../../components/didactic/stat-card.component';

/** The four branches the page can be in. Only one renders at a time. */
type PageState = 'loading' | 'error' | 'empty' | 'ready';

/**
 * Reads as "nothing yet" while no report has landed; never shown on its own.
 * `saved` so no storage note flashes up before the real state is known.
 */
const NO_REPORT: LearningProgressReport = {
  topics: [],
  progressStorage: 'saved',
  summary: {
    topicCount: 0,
    done: 0,
    inProgress: 0,
    notStarted: 0,
    completedSteps: 0,
    totalSteps: 0,
    percentComplete: 0,
  },
};

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    SkeletonModule,
    TagModule,
    ArticleComponent,
    PageHeaderComponent,
    StandardContainerComponent,
    StatCardComponent,
  ],
  template: `
    <app-article width="page" [transparentBackground]="true">
      <app-page-header titleKey="progress.title" subtitleKey="progress.subtitle"></app-page-header>

      <app-standard-container
        id="progress-overview"
        [config]="{
          titleKey: 'progress.overviewTitle',
          type: 'primary',
          elevation: 'md',
          icon: 'pi pi-chart-bar',
          headingLevel: 2,
        }"
      >
        <!-- Every p-skeleton is hard-coded aria-hidden, so the wait and its end
             would both be silent without this. One atomic region carries all three
             sentences; the visual branches below stay out of it, so landing on the
             page does not read the whole table aloud. -->
        <div
          class="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          [attr.aria-busy]="state() === 'loading' ? 'true' : null"
        >
          @if (loading()) {
            {{ t('common.loading') }}
          } @else if (failed()) {
            {{ t('common.loadError') }}
          } @else if (state() === 'empty') {
            {{ t('progress.emptyTitle') }}
          } @else {
            {{ t('common.loadingDone') }}
          }
        </div>

        @if (state() === 'loading') {
          <div class="lp-skeleton" aria-hidden="true">
            <div class="lp-summary">
              @for (tile of skeletonTiles; track tile) {
                <p-skeleton height="6rem" borderRadius="12px"></p-skeleton>
              }
            </div>
            <div class="lp-skeleton__rows">
              @for (row of skeletonRows; track row) {
                <p-skeleton width="55%" height="1.15rem"></p-skeleton>
                <p-skeleton width="100%" height="0.9rem"></p-skeleton>
              }
            </div>
          </div>
        } @else if (state() === 'error') {
          <div class="lp-notice">
            <i class="pi pi-exclamation-triangle lp-notice__icon" aria-hidden="true"></i>
            <h3 class="lp-notice__title">{{ t('common.loadError') }}</h3>
            <p class="lp-notice__text">{{ t('common.loadErrorHint') }}</p>
            <!-- aria-disabled, not [disabled]: the visitor is standing on this
                 button when they press it, and disabling a focused element blurs
                 it to <body> for the whole load. reload() ignores the extra
                 clicks instead, so focus never leaves (A11Y-001). -->
            <button
              pButton
              #retryButton
              type="button"
              [outlined]="true"
              class="lp-retry"
              [attr.aria-disabled]="loading() ? 'true' : null"
              [attr.aria-label]="t('common.retry')"
              (click)="reload()"
            >
              <i [class]="loading() ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" pButtonIcon aria-hidden="true"></i>
              <span pButtonLabel>{{ loading() ? t('common.loading') : t('common.retry') }}</span>
            </button>
          </div>
        } @else if (state() === 'empty') {
          <div class="lp-notice">
            <i class="pi pi-inbox lp-notice__icon" aria-hidden="true"></i>
            <h3 class="lp-notice__title" tabindex="-1" #emptyTitle>{{ t('progress.emptyTitle') }}</h3>
            <p class="lp-notice__text">{{ t('progress.emptyText') }}</p>
          </div>
        } @else {
          <div class="lp-summary">
            <app-stat-card
              [label]="t('progress.summary.overall')"
              [value]="summary().percentComplete"
              suffix="%"
              icon="pi pi-chart-pie"
              color="primary"
              [compact]="true"
              [showProgress]="true"
              [progressValue]="summary().percentComplete"
              [progressLabel]="stepsLabel()"
            ></app-stat-card>
            <!-- The three count tiles carry the same words as the row tags, so a
                 visitor never has to map two vocabularies onto each other. -->
            <app-stat-card
              [label]="statusLabels().done"
              [value]="summary().done"
              icon="pi pi-check-circle"
              color="green"
              [compact]="true"
            ></app-stat-card>
            <app-stat-card
              [label]="statusLabels().inProgress"
              [value]="summary().inProgress"
              icon="pi pi-hourglass"
              color="orange"
              [compact]="true"
            ></app-stat-card>
            <app-stat-card
              [label]="statusLabels().notStarted"
              [value]="summary().notStarted"
              icon="pi pi-circle"
              color="blue"
              [compact]="true"
            ></app-stat-card>
          </div>

          <h3 class="lp-topics__title" tabindex="-1" #topicsTitle>{{ t('progress.topicsTitle') }}</h3>

          <!-- A plain table: no sorting, no selection, no paging, so p-table would
               add a state machine and nothing else (table guide, "When to use"). -->
          <div class="lp-table-wrap">
            <table class="lp-table">
              <caption class="sr-only">
                {{
                  t('progress.table.caption')
                }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ t('progress.table.topic') }}</th>
                  <th scope="col">{{ t('progress.table.status') }}</th>
                  <th scope="col" class="lp-table__num">{{ t('progress.table.steps') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (topic of topics(); track topic.id) {
                  <tr>
                    <th scope="row" class="lp-table__topic">
                      <a [routerLink]="topic.route">{{ t(topic.titleKey) }}</a>
                      <span class="lp-table__kind">{{ kindLabels()[topic.kind] }}</span>
                    </th>
                    <td>
                      <!-- The word is in the tag's own value; severity only repeats
                           what the text already says (A11Y-006). The severities
                           used here are measured in the tags-and-chips guide:
                           light success 4.57, warn 4.52, both over 4.5:1 but with
                           no headroom - do not restyle them without re-measuring. -->
                      <p-tag
                        [value]="statusLabels()[topic.status]"
                        [severity]="statusSeverity[topic.status]"
                        [icon]="statusIcon[topic.status]"
                        [rounded]="true"
                      ></p-tag>
                    </td>
                    <!-- No sr-only prefix here: the column header already says
                         "Steps", and a second label makes the cell announce it
                         twice. -->
                    <td class="lp-table__num">{{ topic.completedSteps }} / {{ topic.totalSteps }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Without consent the numbers above count this visit only and start
             from zero on the next, not because nothing was done. Saying only
             "your progress is stored here" in that state would be a falsehood,
             so the page says which of the two it is: a "no", or no decision yet. -->
        <div class="lp-notes">
          @if (progressStorage() === 'declined') {
            <p class="lp-note lp-note--flag">
              <i class="pi pi-eye-slash" aria-hidden="true"></i>
              {{ t('progress.trackingOffNote') }}
            </p>
          } @else if (progressStorage() === 'undecided') {
            <p class="lp-note lp-note--flag">
              <i class="pi pi-info-circle" aria-hidden="true"></i>
              {{ t('progress.trackingUndecidedNote') }}
            </p>
          }
          <p class="lp-note">
            {{ t('progress.storageNote') }}
            <a routerLink="/user-settings">{{ t('progress.settingsLink') }}</a>
          </p>
        </div>
      </app-standard-container>
    </app-article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .lp-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: var(--space-4);
        margin-bottom: var(--space-6);
      }

      .lp-skeleton__rows {
        display: grid;
        gap: var(--space-3);
      }

      .lp-topics__title {
        margin: 0 0 var(--space-4) 0;
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .lp-topics__title:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 4px;
      }

      /* A three-column table fits a phone, but a long topic title in a large
         font does not — so the wrapper scrolls instead of the page. */
      .lp-table-wrap {
        overflow-x: auto;
      }

      .lp-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      .lp-table th,
      .lp-table td {
        padding: var(--space-3) var(--space-3);
        text-align: left;
        border-bottom: 1px solid var(--surface-border);
        vertical-align: middle;
      }

      .lp-table thead th {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-color-secondary);
        border-bottom-width: 2px;
      }

      .lp-table tbody tr:last-child th,
      .lp-table tbody tr:last-child td {
        border-bottom: none;
      }

      .lp-table__topic {
        font-weight: 500;
      }

      /* Underlined at rest, not on hover: styles.scss gives bare anchors nothing,
         so without this the only thing marking a link as a link is that it sits
         in the first column (A11Y-006 — not color, and not position either). */
      .lp-table__topic a {
        color: var(--text-color);
        text-decoration: underline;
        text-decoration-color: var(--surface-border);
        text-underline-offset: 3px;
      }

      .lp-table__topic a:hover {
        text-decoration-color: currentColor;
      }

      .lp-table__topic a:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 3px;
        border-radius: 2px;
      }

      .lp-table__kind {
        display: block;
        margin-top: var(--space-1);
        font-size: 0.78rem;
        font-weight: 400;
        color: var(--text-color-secondary);
      }

      .lp-table__num {
        text-align: right;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      /* Error and empty share one shape — a centered icon, a heading, a sentence. */
      .lp-notice {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-6) var(--space-4);
        text-align: center;
      }

      .lp-notice__icon {
        font-size: 2rem;
        color: var(--text-color-secondary);
      }

      .lp-notice__title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .lp-notice__title:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 4px;
      }

      .lp-notice__text {
        margin: 0;
        max-width: 42ch;
        color: var(--text-color-secondary);
        line-height: 1.6;
      }

      /* WCAG 2.4.7, same call as /feedback: Aura gives buttons a 1px ring, the kit
         standard is 2px --primary-color-fg at 2px offset, so upgrade it here. The
         kit-wide rules in styles.scss cover form fields, not .p-button. */
      .lp-retry:focus-visible {
        outline: 2px solid var(--primary-color-fg, #f59e0b);
        outline-offset: 2px;
      }

      .lp-notes {
        margin-top: var(--space-6);
        padding-top: var(--space-4);
        border-top: 1px solid var(--surface-border);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .lp-note {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.6;
        color: var(--text-color-secondary);
      }

      .lp-note--flag {
        display: flex;
        align-items: baseline;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--border-radius-lg, 12px);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        background: var(--surface-card);
        color: var(--text-color);
      }

      @media (max-width: 600px) {
        .lp-summary {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class ProgressComponent {
  private readonly progress = inject(LearningProgressService);
  private readonly translation = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  /** How much placeholder the wait promises — four tiles and five rows, the usual shape. */
  readonly skeletonTiles = [1, 2, 3, 4];
  readonly skeletonRows = [1, 2, 3, 4, 5];

  private readonly report = signal<LearningProgressReport | null>(null);
  /**
   * Read by the template as well as by `state()`: the announcement region needs
   * "is a load running" and "did the last one fail" separately, because during a
   * retry both are true at once and the visible branch stays on the error.
   */
  readonly loading = signal(true);
  readonly failed = signal(false);

  /**
   * Set when the visitor pressed "try again", cleared once the outcome has been
   * handed a focus target. Without it, the very first load would steal focus from
   * wherever the visitor already was.
   */
  private reloadRequested = false;

  // Each of these lives inside an @if branch, so a state swap destroys whatever the
  // visitor was standing on. Every swap the visitor asked for hands focus on to an
  // element that still exists (A11Y-001).
  private readonly retryButton = viewChild<ElementRef<HTMLElement>>('retryButton');
  private readonly topicsTitle = viewChild<ElementRef<HTMLElement>>('topicsTitle');
  private readonly emptyTitle = viewChild<ElementRef<HTMLElement>>('emptyTitle');

  /** Tracked so every t() call re-runs after an in-place language switch. */
  private readonly currentLanguage = computed(() => this.translation.currentLanguage);

  /**
   * `failed` is checked before `loading` on purpose: a retry keeps the error
   * branch on screen (busy, with a spinner) instead of tearing it down, so the
   * button the visitor is standing on survives the wait. The first load has no
   * failure yet, so it still reads 'loading'.
   */
  readonly state = computed<PageState>(() => {
    if (this.failed()) return 'error';
    if (this.loading()) return 'loading';
    return this.topics().length === 0 ? 'empty' : 'ready';
  });

  readonly topics = computed(() => (this.report() ?? NO_REPORT).topics);
  readonly summary = computed(() => (this.report() ?? NO_REPORT).summary);
  readonly progressStorage = computed(() => (this.report() ?? NO_REPORT).progressStorage);

  constructor() {
    this.translation.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => this.cdr.detectChanges());

    // Storage and the content indexes may only be read once hydration has matched
    // the prerendered markup — see the file header.
    afterNextRender(() => this.startLoad());
  }

  // ── labels ─────────────────────────────────────────────────────────────────

  t(key: string): string {
    this.currentLanguage();
    return this.translation.translate(key);
  }

  /**
   * Built from literal keys rather than `t('progress.status.' + status)` so the
   * keys are greppable and a typo is visible at review time.
   *
   * Measured, so nobody relies on the wrong thing: `check-i18n-keys.mjs` does
   * NOT check these. It matches literal `translate('…')` calls and `someKey:`
   * properties, and this page — like every other page that went the `t()` route —
   * offers it neither. From this whole file the gate sees exactly one key,
   * `progress.overviewTitle`, because that one sits in a `titleKey:` property.
   * Literal keys are still the right shape (they are what the gate would need if
   * it ever learns about `t()`), but they buy no coverage today.
   */
  readonly statusLabels = computed<Record<TopicStatus, string>>(() => ({
    notStarted: this.t('progress.status.notStarted'),
    inProgress: this.t('progress.status.inProgress'),
    done: this.t('progress.status.done'),
  }));

  readonly kindLabels = computed<Record<TopicKind, string>>(() => ({
    article: this.t('progress.kind.article'),
    demo: this.t('progress.kind.demo'),
  }));

  readonly statusSeverity: Record<TopicStatus, 'success' | 'warn' | 'secondary'> = {
    done: 'success',
    inProgress: 'warn',
    notStarted: 'secondary',
  };

  readonly statusIcon: Record<TopicStatus, string> = {
    done: 'pi pi-check',
    inProgress: 'pi pi-hourglass',
    notStarted: 'pi pi-circle',
  };

  /** "7 / 12" under the overall tile — the numbers behind the percentage. */
  readonly stepsLabel = computed(() => `${this.summary().completedSteps} / ${this.summary().totalSteps}`);

  // ── loading ────────────────────────────────────────────────────────────────

  /**
   * The retry the error branch offers. Both content services re-fetch on a new
   * subscribe. Extra clicks during a reload are ignored here rather than by
   * disabling the button — see the template comment on why that matters.
   */
  reload(): void {
    if (this.loading()) return;
    this.reloadRequested = true;
    this.startLoad();
  }

  private startLoad(): void {
    this.loading.set(true);
    this.cdr.detectChanges();

    this.progress
      .load()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (report) => {
          this.report.set(report);
          // Cleared only on success, so a retry keeps the error branch (and the
          // focused button) alive for the whole of the reload.
          this.failed.set(false);
          this.settle();
        },
        error: () => {
          this.report.set(null);
          this.failed.set(true);
          this.settle();
        },
      });
  }

  /**
   * Render the outcome, then — only if the visitor asked for this load — put the
   * cursor on whatever replaced what they were standing on. The detectChanges is
   * not optional: the target does not exist until its @if branch has rendered.
   *
   * A retry that fails again needs no move: the error branch was never torn
   * down, so focus is still on the button.
   */
  private settle(): void {
    this.loading.set(false);
    this.cdr.detectChanges();

    if (!this.reloadRequested) return;
    this.reloadRequested = false;

    if (this.state() === 'error') return;
    const target = this.state() === 'empty' ? this.emptyTitle() : this.topicsTitle();
    target?.nativeElement.focus();
  }
}
