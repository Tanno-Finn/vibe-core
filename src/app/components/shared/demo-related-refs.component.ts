/**
 * DemoRelatedRefsComponent
 *
 * Adapter wrapper for `<app-related-refs>` inside demo pages — mirrors the
 * article-side mount in LessonTemplate so demos get the same "Verwandte
 * Inhalte" surface: ontology-driven cross-refs via `[forNode]`, plus the
 * "Im Graph" map-trigger. Editorial pin from DemosService is merged on top
 * (hybrid mode) when present.
 */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, of } from 'rxjs';
import { DemosService } from '../../services/demos.service';
import { RelatedRefs } from '../../services/related-refs.types';
import { OntologyNodeType } from '../../services/ontology.types';
import { RelatedRefsComponent } from './related-refs.component';

@Component({
  selector: 'app-demo-related',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RelatedRefsComponent],
  template: `
    <app-related-refs
      density="expansive"
      [richTypes]="['articles', 'demos', 'external', 'tools', 'resources']"
      [forNode]="forNode"
      [refs]="(refs$ | async) ?? null"
      [mapTrigger]="true"
      [cardWrap]="true"
    >
    </app-related-refs>
  `,
})
export class DemoRelatedRefsComponent implements OnChanges {
  @Input({ required: true }) demoId!: string;

  private demos = inject(DemosService);

  refs$: Observable<RelatedRefs | null> = of(null);
  forNode!: { type: OntologyNodeType; id: string };

  ngOnChanges(_changes: SimpleChanges): void {
    this.forNode = { type: 'demo', id: this.demoId };
    this.refs$ = this.demos.getDemoById(this.demoId).pipe(map((d) => d?.related ?? null));
  }
}
