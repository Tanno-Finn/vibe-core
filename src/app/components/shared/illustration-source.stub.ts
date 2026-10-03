/**
 * PROD STUB for IllustrationSourceComponent — swapped in via angular.json
 * `fileReplacements` (production). The real source component holds the ~390 KB live
 * @case markup needed only by the dev baker (/dev/bake); replacing it with this empty
 * stub keeps that markup entirely out of the prod bundle. /dev/bake is dev-only +
 * guarded, so the stub is never actually rendered in prod.
 *
 * Keep the selector + inputs in sync with illustration-source.component.ts so
 * DevBakeComponent compiles against either.
 */
import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-illustration-source',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class IllustrationSourceComponent {
  @Input({ required: true }) stepId!: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'fluid' | 'cover' = 'md';
}
