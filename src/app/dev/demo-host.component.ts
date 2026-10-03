import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VIBE_DEV_SENTINEL } from './dev-sentinel';

// Every gallery component, imported STATICALLY (SPEC N5.2, D5 amendment).
// A static @switch template is the only way to give each demo real
// `<ng-content>` projection and typed input literals — dynamic
// `createComponent` cannot project content cleanly. This mirrors the codebase's
// thumbnail-@case idiom (one @case per registry slug).
import { StandardContainerComponent } from '../components/shared/standard-container.component';
import { TextContainerComponent } from '../components/shared/text-container.component';
import { PageHeaderComponent } from '../components/shared/page-header.component';
import { BreadcrumbComponent } from '../components/shared/breadcrumb.component';
import { InfoBoxComponent } from '../components/shared/info-box.component';
import { ExampleBoxComponent } from '../components/shared/example-box.component';
import { DefinitionComponent } from '../components/didactic/definition.component';
import { PromptExampleComponent } from '../components/didactic/prompt-example.component';
import { FormulaBlockComponent } from '../components/didactic/formula-block.component';
import { InfoTooltipComponent } from '../components/shared/info-tooltip.component';
import { CheckpointComponent } from '../components/shared/checkpoint.component';
import { TakeawaysListComponent } from '../components/shared/takeaways-list.component';
import { QuizContainerComponent } from '../components/shared/quiz-container.component';
import { GenericCardComponent } from '../components/ui/generic-card.component';
import { StatCardComponent } from '../components/didactic/stat-card.component';
import { CircularProgressComponent } from '../components/ui/circular-progress.component';
import { SplitBarComponent } from '../components/shared/split-bar.component';
import { StepIndicatorComponent } from '../components/didactic/step-indicator.component';

/**
 * Live-demo host for the design-system detail page (SPEC N5.2, D5).
 *
 * One `@case ('<slug>')` per registry entry renders a realistic inline usage of
 * that component. `scripts/check-design-system.mjs` scans this file and FAILS if
 * any registry slug lacks an `@case ('<slug>')` here — so a registry entry
 * without a live demo breaks the gate.
 *
 * SYNC CONTRACT: `DEMO_SNIPPETS[slug]` below must say the same thing as the
 * markup inside the matching `@case`. The detail page's Example tab shows the
 * snippet as escaped, copyable code, so a snippet that has drifted teaches the
 * reader markup they did not see rendered. The same gate CHECKS this (check 7):
 * both sides are compared with whitespace collapsed, so indentation and line
 * wrapping are free and any token difference fails the build.
 *
 * i18n NOTE: dev tooling is exempt from the translation system (English-only) by
 * design — see dev-hub.component.ts. Some demoed components take *Key inputs that
 * run through TranslationService; because `translate()` returns the key verbatim
 * when no translation exists, plain-English strings are passed as "keys" so the
 * demo reads naturally without a translation backend.
 */
@Component({
  selector: 'app-demo-host',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StandardContainerComponent,
    TextContainerComponent,
    PageHeaderComponent,
    BreadcrumbComponent,
    InfoBoxComponent,
    ExampleBoxComponent,
    DefinitionComponent,
    PromptExampleComponent,
    FormulaBlockComponent,
    InfoTooltipComponent,
    CheckpointComponent,
    TakeawaysListComponent,
    QuizContainerComponent,
    GenericCardComponent,
    StatCardComponent,
    CircularProgressComponent,
    SplitBarComponent,
    StepIndicatorComponent,
  ],
  template: `
    <div class="demo-host" [attr.data-dev-sentinel]="sentinel">
      @switch (slug) {
        @case ('standard-container') {
          <app-standard-container
            [config]="{ type: 'info', title: 'What is a gradient?', icon: 'pi pi-compass', collapsible: true, initiallyExpanded: true }">
            <p>A gradient points in the direction of steepest increase of a function. Gradient descent walks the opposite way to minimise the loss.</p>
          </app-standard-container>
        }
        @case ('text-container') {
          <app-text-container
            title="Reading long-form text"
            content="<p>The text container adds reading-time and word-count metadata around any long-form HTML passage, with typography tuned for readability.</p><p>It is built on top of the standard container, so it inherits the same collapse behavior and surface styling.</p>"
            [showFooterStats]="false">
          </app-text-container>
        }
        @case ('page-header') {
          <app-page-header
            title="Design System"
            subtitle="Reusable building blocks for the learning portal">
          </app-page-header>
        }
        @case ('breadcrumb') {
          <app-breadcrumb
            [customBreadcrumbs]="[
              { label: 'Topics', url: '/topics' },
              { label: 'Machine Learning', url: '/topics/ml' },
              { label: 'Gradient Descent' }
            ]">
          </app-breadcrumb>
        }
        @case ('info-box') {
          <app-info-box
            [box]="{
              type: 'links',
              title: 'Further reading',
              items: [
                { title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762', description: 'The original transformer paper.' },
                { title: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' }
              ]
            }">
          </app-info-box>
        }
        @case ('example-box') {
          <app-example-box type="good" label="After" title="A well-scoped prompt">
            <p>Summarise the article in exactly three bullet points, each under 15 words.</p>
          </app-example-box>
        }
        @case ('definition') {
          <app-definition
            title="Precision vs. Recall"
            firstOptionLabel="Precision"
            firstOptionContent="Of everything the model flagged as positive, how much was actually positive."
            secondOptionLabel="Recall"
            secondOptionContent="Of everything that was actually positive, how much the model found."
            [showExample]="false">
          </app-definition>
        }
        @case ('prompt-example') {
          <app-prompt-example
            type="good"
            label="Effective prompt"
            code="Act as a copy editor. Fix grammar only, keep my wording, and return just the corrected text."
            [copyable]="true">
          </app-prompt-example>
        }
        @case ('formula-block') {
          <app-formula-block label="Gradient descent update">
            w<sub>new</sub> = w<sub>old</sub> &minus; &eta; &middot; &nabla;L(w)
          </app-formula-block>
        }
        @case ('info-tooltip') {
          <p>
            The algorithm groups points within
            <app-info-tooltip
              text="Epsilon is the neighbourhood radius DBSCAN uses to decide which points are density-reachable."
              forLabel="epsilon">
            </app-info-tooltip>
            of each other.
          </p>
        }
        @case ('checkpoint') {
          <app-checkpoint
            checkpointId="ds-demo"
            storageKey="ds-demo-checkpoints"
            titleKey="Learning goals"
            markCompleteKey="Mark complete"
            completedLabelKey="Completed"
            [items]="[
              { text: 'I can explain what a gradient is' },
              { text: 'I can describe how gradient descent works' },
              { text: 'I know why the learning rate matters' }
            ]">
          </app-checkpoint>
        }
        @case ('takeaways-list') {
          <app-takeaways-list
            text="1. **Data quality first**: garbage in, garbage out.&#10;&#10;2. **Bias persists**: a model inherits the patterns in its training data.">
          </app-takeaways-list>
        }
        @case ('quiz-container') {
          <app-quiz-container
            title="Quick check"
            quizId="ds-demo-quiz"
            [questions]="[
              {
                id: 'q1',
                question: 'What does the learning rate control?',
                type: 'single',
                options: [
                  { id: 'a', text: 'The size of each gradient-descent step', isCorrect: true },
                  { id: 'b', text: 'The number of layers in the network', isCorrect: false }
                ],
                explanation: 'The learning rate scales how far the weights move on each update.'
              }
            ]">
          </app-quiz-container>
        }
        @case ('generic-card') {
          <app-generic-card
            title="Transformer models"
            subtitle="Architecture family"
            description="Self-attention lets every token attend to every other token, capturing long-range context."
            icon="pi pi-sitemap"
            [chips]="[{ label: 'NLP' }, { label: 'Deep Learning' }]"
            [primaryActions]="[{ label: 'Learn more', icon: 'pi pi-arrow-right', action: noop }]">
          </app-generic-card>
        }
        @case ('stat-card') {
          <app-stat-card
            label="Model accuracy"
            [value]="94.2"
            suffix="%"
            [decimals]="1"
            icon="pi pi-chart-line"
            color="green"
            trend="up"
            trendValue="+2.1%">
          </app-stat-card>
        }
        @case ('circular-progress') {
          <app-circular-progress [value]="72" label="Course progress"></app-circular-progress>
        }
        @case ('split-bar') {
          <app-split-bar
            [leftValue]="63"
            leftLabel="Agreed"
            rightLabel="Disagreed"
            leftIcon="pi pi-check"
            rightIcon="pi pi-times">
          </app-split-bar>
        }
        @case ('step-indicator') {
          <app-step-indicator
            layout="horizontal"
            [steps]="[
              { label: 'Collect data', status: 'completed' },
              { label: 'Train model', status: 'active' },
              { label: 'Evaluate', status: 'pending' }
            ]">
          </app-step-indicator>
        }
        @default {
          <p class="demo-host__empty">No live demo is registered for "{{ slug }}".</p>
        }
      }
    </div>
  `,
  styles: [`
    .demo-host { width: 100%; }
    .demo-host__empty {
      margin: 0;
      color: var(--text-color-secondary, #6b7280);
      font-style: italic;
    }
  `],
})
export class DemoHostComponent {
  /** Registry slug selecting which @case renders. */
  @Input() slug = '';

  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** No-op action for demoed components that require an action callback. */
  noop = (): void => {};
}

/**
 * Escaped, copyable usage snippet per slug, shown in the detail page's Example
 * tab. SYNC CONTRACT (see class doc): each string must mirror the markup in the
 * matching `@case` above, token for token — `check-design-system.mjs` compares
 * the two with whitespace collapsed and fails on any difference.
 */
export const DEMO_SNIPPETS: Record<string, string> = {
  'standard-container':
`<app-standard-container
  [config]="{ type: 'info', title: 'What is a gradient?', icon: 'pi pi-compass', collapsible: true, initiallyExpanded: true }">
  <p>A gradient points in the direction of steepest increase of a function. Gradient descent walks the opposite way to minimise the loss.</p>
</app-standard-container>`,
  'text-container':
`<app-text-container
  title="Reading long-form text"
  content="<p>The text container adds reading-time and word-count metadata around any long-form HTML passage, with typography tuned for readability.</p><p>It is built on top of the standard container, so it inherits the same collapse behavior and surface styling.</p>"
  [showFooterStats]="false">
</app-text-container>`,
  'page-header':
`<app-page-header
  title="Design System"
  subtitle="Reusable building blocks for the learning portal">
</app-page-header>`,
  'breadcrumb':
`<app-breadcrumb
  [customBreadcrumbs]="[
    { label: 'Topics', url: '/topics' },
    { label: 'Machine Learning', url: '/topics/ml' },
    { label: 'Gradient Descent' }
  ]">
</app-breadcrumb>`,
  'info-box':
`<app-info-box
  [box]="{
    type: 'links',
    title: 'Further reading',
    items: [
      { title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762', description: 'The original transformer paper.' },
      { title: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' }
    ]
  }">
</app-info-box>`,
  'example-box':
`<app-example-box type="good" label="After" title="A well-scoped prompt">
  <p>Summarise the article in exactly three bullet points, each under 15 words.</p>
</app-example-box>`,
  'definition':
`<app-definition
  title="Precision vs. Recall"
  firstOptionLabel="Precision"
  firstOptionContent="Of everything the model flagged as positive, how much was actually positive."
  secondOptionLabel="Recall"
  secondOptionContent="Of everything that was actually positive, how much the model found."
  [showExample]="false">
</app-definition>`,
  'prompt-example':
`<app-prompt-example
  type="good"
  label="Effective prompt"
  code="Act as a copy editor. Fix grammar only, keep my wording, and return just the corrected text."
  [copyable]="true">
</app-prompt-example>`,
  'formula-block':
`<app-formula-block label="Gradient descent update">
  w<sub>new</sub> = w<sub>old</sub> &minus; &eta; &middot; &nabla;L(w)
</app-formula-block>`,
  'info-tooltip':
`<p>
  The algorithm groups points within
  <app-info-tooltip
    text="Epsilon is the neighbourhood radius DBSCAN uses to decide which points are density-reachable."
    forLabel="epsilon">
  </app-info-tooltip>
  of each other.
</p>`,
  'checkpoint':
`<app-checkpoint
  checkpointId="ds-demo"
  storageKey="ds-demo-checkpoints"
  titleKey="Learning goals"
  markCompleteKey="Mark complete"
  completedLabelKey="Completed"
  [items]="[
    { text: 'I can explain what a gradient is' },
    { text: 'I can describe how gradient descent works' },
    { text: 'I know why the learning rate matters' }
  ]">
</app-checkpoint>`,
  'takeaways-list':
`<app-takeaways-list
  text="1. **Data quality first**: garbage in, garbage out.&#10;&#10;2. **Bias persists**: a model inherits the patterns in its training data.">
</app-takeaways-list>`,
  'quiz-container':
`<app-quiz-container
  title="Quick check"
  quizId="ds-demo-quiz"
  [questions]="[
    {
      id: 'q1',
      question: 'What does the learning rate control?',
      type: 'single',
      options: [
        { id: 'a', text: 'The size of each gradient-descent step', isCorrect: true },
        { id: 'b', text: 'The number of layers in the network', isCorrect: false }
      ],
      explanation: 'The learning rate scales how far the weights move on each update.'
    }
  ]">
</app-quiz-container>`,
  'generic-card':
`<app-generic-card
  title="Transformer models"
  subtitle="Architecture family"
  description="Self-attention lets every token attend to every other token, capturing long-range context."
  icon="pi pi-sitemap"
  [chips]="[{ label: 'NLP' }, { label: 'Deep Learning' }]"
  [primaryActions]="[{ label: 'Learn more', icon: 'pi pi-arrow-right', action: noop }]">
</app-generic-card>`,
  'stat-card':
`<app-stat-card
  label="Model accuracy"
  [value]="94.2"
  suffix="%"
  [decimals]="1"
  icon="pi pi-chart-line"
  color="green"
  trend="up"
  trendValue="+2.1%">
</app-stat-card>`,
  'circular-progress':
`<app-circular-progress [value]="72" label="Course progress"></app-circular-progress>`,
  'split-bar':
`<app-split-bar
  [leftValue]="63"
  leftLabel="Agreed"
  rightLabel="Disagreed"
  leftIcon="pi pi-check"
  rightIcon="pi pi-times">
</app-split-bar>`,
  'step-indicator':
`<app-step-indicator
  layout="horizontal"
  [steps]="[
    { label: 'Collect data', status: 'completed' },
    { label: 'Train model', status: 'active' },
    { label: 'Evaluate', status: 'pending' }
  ]">
</app-step-indicator>`,
};

/** Strip-proof sentinel reference (D2) so this module carries the literal. */
export const DEMO_HOST_SENTINEL = VIBE_DEV_SENTINEL;
