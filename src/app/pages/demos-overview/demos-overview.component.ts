/**
 * DemosOverviewComponent
 *
 * Hub page for all interactive demos.
 * Uses ContentHubTemplate for consistent layout.
 */
import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';

// Components
import {
  ContentHubTemplateComponent,
  ContentHubConfig,
  ContentItem,
} from '../../components/shared/content-hub-template.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';

// Services
import { DemosService, DemoMeta } from '../../services/demos.service';

@Component({
  selector: 'app-demos-overview',
  standalone: true,
  imports: [ContentHubTemplateComponent, SimpleEasyLanguageFabComponent],
  template: `
    <app-content-hub-template
      [config]="hubConfig"
      [items]="contentItems()"
      [loading]="loading"
      [loadFailed]="loadFailed"
      (retry)="loadDemos()"
    >
    </app-content-hub-template>

    <app-simple-easy-language-fab contentId="demos-overview" contentType="page"> </app-simple-easy-language-fab>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class DemosOverviewComponent implements OnInit {
  private demosService = inject(DemosService);

  // Hub configuration
  hubConfig: ContentHubConfig = {
    titleKey: 'demos.title',
    subtitleKey: 'demos.subtitle',
    ctaLabelKey: 'demos.startDemo',
  };

  // State
  demos = signal<DemoMeta[]>([]);
  loading = signal(true);
  loadFailed = signal(false);

  // Convert DemoMeta to ContentItem
  contentItems = computed<ContentItem[]>(() => {
    return this.demos().map((demo) => ({
      id: demo.id,
      path: demo.path,
      titleKey: demo.titleKey,
      descriptionKey: demo.descriptionKey,
      category: demo.category,
      difficulty: demo.difficulty,
      estimatedTime: demo.estimatedTime,
      featured: demo.featured,
      icon: demo.icon,
      tags: demo.tags,
    }));
  });

  ngOnInit(): void {
    this.loadDemos();
  }

  loadDemos(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.demosService.getAllDemos().subscribe({
      next: (demos) => {
        // Hide not-yet-released demos (staged weekly drop); dev shows all.
        this.demos.set(demos.filter((d) => this.demosService.isVisible(d)));
        this.loading.set(false);
      },
      error: (err) => {
        // The service drops its cache on error, so retry re-fetches.
        console.error('Failed to load demos:', err);
        this.loadFailed.set(true);
        this.loading.set(false);
      },
    });
  }
}
