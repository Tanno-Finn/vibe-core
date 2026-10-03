/**
 * Seed article (/articles/seed-article-1) — the article that documents itself.
 *
 * Like the example demo (src/app/pages/example-demo/), this page is
 * deliberately content-free ("fachfrei"): its subject is the STRUCTURE of a
 * good article page. Every section both demonstrates a building block and
 * explains it, so downstream kit users can copy this file as the blueprint
 * for their own article pages:
 *
 *   1. <app-lesson-template> — the article chrome: page header, toolbar
 *      (back / meta chips / share), reading progress, ToC + Easy-Language
 *      FABs, and the auto-wired "Verwandte Inhalte" footer
 *      (<app-related-refs> fed from assets/data/core/articles/index.json →
 *      `related` — here the seed glossary terms + timeline events), and the
 *      cited-sources list, fed from `sourceReferences` in the core JSON
 *      (here the seed source seed-source-1).
 *   2. Intro callout (app-example-box) — "this is a placeholder template"
 *   3. Prose section (app-text-container) — the workhorse text block
 *   4. Definition block (app-definition) — Analogy/Definition toggle
 *   5. Example block (app-example-box with label/result)
 *   6. Checkpoint (app-checkpoint) — persisted self-check, 1 question
 *   7. Takeaways + "write your own" close (→ /dev/design, /new-content)
 *
 * Route: articles/seed-article-1 (hidden — reached via learning path,
 * /learn tiles, or the 4-char page id /article/sda1 — the QR-code
 * mechanic). Meta lives in assets/data/core/articles/seed-article-1.json.
 *
 * SSR-safe: no window/document access here; LessonTemplateComponent guards
 * its own browser APIs, so the page prerenders (see
 * scripts/generate-prerender-routes.js, T2).
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// Services
import { TranslationService } from '../../../services/translation.service';

// Kit components
import { LessonTemplateComponent, LessonMeta } from '../../../components/shared/lesson-template.component';
import { TocItem } from '../../../components/shared/table-of-contents-fab.component';
import { StandardContainerComponent } from '../../../components/shared/standard-container.component';
import { TextContainerComponent } from '../../../components/shared/text-container.component';
import { ExampleBoxComponent } from '../../../components/shared/example-box.component';
import { CheckpointComponent } from '../../../components/shared/checkpoint.component';
import { TakeawaysListComponent } from '../../../components/shared/takeaways-list.component';
import { DefinitionComponent } from '../../../components/didactic/definition.component';

@Component({
  selector: 'app-seed-article-1',
  standalone: true,
  imports: [
    LessonTemplateComponent,
    StandardContainerComponent,
    TextContainerComponent,
    ExampleBoxComponent,
    CheckpointComponent,
    TakeawaysListComponent,
    DefinitionComponent,
  ],
  template: `
    <!-- 1 · The lesson template provides the entire article chrome.
         meta.id links this page to its core JSON (articles/seed-article-1.json):
         the related-refs footer, Easy-Language FAB and route guard all key
         off that id. -->
    <app-lesson-template [meta]="meta" [tocItems]="tocItems">
      <!-- 2 · Intro callout: tell the visitor what this page is (a blueprint) -->
      <app-example-box id="intro" type="info" titleKey="seedArticle.intro.title" contentKey="seedArticle.intro.text" />

      <!-- 3 · Prose section: app-text-container is the workhorse block for
           running text. It brings its own card, reading-time metadata and
           collapse behavior — one container per thematic section. -->
      <app-text-container
        id="structure"
        [title]="translate('seedArticle.structure.title')"
        [content]="translate('seedArticle.structure.text')"
      />

      <!-- 4 · Definition block: the Analogy/Definition toggle lets readers
           pick the register they need — lead with the analogy, offer the
           precise definition one click away. -->
      <app-definition
        id="definition"
        [title]="translate('seedArticle.definition.title')"
        [firstOptionContent]="translate('seedArticle.definition.analogy')"
        [secondOptionContent]="translate('seedArticle.definition.precise')"
        [firstOptionExample]="translate('seedArticle.definition.example')"
        [secondOptionExample]="translate('seedArticle.definition.example')"
        [headingLevel]="2"
      />

      <!-- 5 · Example block: label/result pattern for concrete cases -->
      <app-example-box
        id="example"
        type="good"
        titleKey="seedArticle.example.title"
        contentKey="seedArticle.example.text"
        labelKey="seedArticle.example.label"
        resultKey="seedArticle.example.result"
      />

      <!-- 6 · Checkpoint: a persisted self-check about the structure itself -->
      <app-checkpoint
        id="checkpoint"
        checkpointId="structure"
        storageKey="seed-article-1-checkpoints"
        titleKey="seedArticle.checkpoint.title"
        [headingLevel]="2"
        [items]="[{ textKey: 'seedArticle.checkpoint.item1' }]"
      />

      <!-- 7 · Takeaways + "write your own" close -->
      <app-standard-container
        id="takeaways"
        [config]="{
          titleKey: 'seedArticle.takeaways.title',
          type: 'success',
          elevation: 'sm',
          headingLevel: 2,
        }"
      >
        <app-takeaways-list [text]="translate('seedArticle.takeaways.text')" />
      </app-standard-container>

      <app-standard-container
        id="write-your-own"
        [config]="{
          titleKey: 'seedArticle.next.title',
          type: 'primary',
          elevation: 'sm',
          headingLevel: 2,
        }"
      >
        <p>{{ translate('seedArticle.next.text') }}</p>
        <ul class="next-links">
          <li><code>/dev/design</code> — {{ translate('seedArticle.next.designWorkshop') }}</li>
          <li><code>/new-content</code> — {{ translate('seedArticle.next.newContent') }}</li>
        </ul>
      </app-standard-container>
    </app-lesson-template>
  `,
  styles: [
    `
      /* The lesson template owns page layout; this page only spaces its
       projected building blocks. */
      app-example-box,
      app-text-container,
      app-definition,
      app-checkpoint,
      app-standard-container {
        display: block;
        margin-bottom: var(--space-5, 1.5rem);
      }

      .next-links {
        margin: 0.5rem 0 0;
        padding-left: 1.25rem;
        line-height: 1.7;
      }
      .next-links code {
        background: var(--surface-section, var(--surface-ground));
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        padding: 0.1rem 0.4rem;
        font-size: 0.85em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedArticle1Component {
  private readonly translationService = inject(TranslationService);

  /** Article metadata for the lesson template. `id` MUST match the core JSON
   *  (assets/data/core/articles/seed-article-1.json) — related refs, Easy
   *  Language and the visibility guard all resolve through it. */
  readonly meta: LessonMeta = {
    id: 'seed-article-1',
    titleKey: 'seedArticle.title',
    subtitleKey: 'seedArticle.subtitle',
    readingTime: '5 min',
    difficulty: 'beginner',
    difficultyKey: 'difficulty.beginner',
    focus: 'theory',
    categoryKey: 'categories.fundamentals',
  };

  /** ToC entries — ids must match the section element ids in the template.
   *  Getter, so labels re-translate when the language changes. */
  get tocItems(): TocItem[] {
    return [
      { id: 'intro', label: this.translate('seedArticle.intro.title') },
      { id: 'structure', label: this.translate('seedArticle.structure.title') },
      { id: 'definition', label: this.translate('seedArticle.definition.title') },
      { id: 'example', label: this.translate('seedArticle.example.title') },
      { id: 'checkpoint', label: this.translate('seedArticle.checkpoint.title') },
      { id: 'takeaways', label: this.translate('seedArticle.takeaways.title') },
      { id: 'write-your-own', label: this.translate('seedArticle.next.title') },
    ];
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
