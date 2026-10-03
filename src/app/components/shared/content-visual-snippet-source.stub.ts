/**
 * PROD STUB for ContentVisualSnippetSourceComponent — swapped in via angular.json
 * `fileReplacements` (production), keeping the live @case markup out of the prod bundle.
 * /dev/bake is dev-only + guarded, so this stub is never rendered in prod.
 *
 * Keep the selector + inputs in sync with content-visual-snippet-source.component.ts.
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-content-visual-snippet-source',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class ContentVisualSnippetSourceComponent {
  @Input() type = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
