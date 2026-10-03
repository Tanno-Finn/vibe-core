/**
 * FAB Stack Container - Vertikal gestapelte FABs in der rechten unteren Ecke
 *
 * Container für alle FABs mit automatischer vertikaler Anordnung.
 * Alle FABs werden in der rechten unteren Ecke gestapelt angezeigt.
 *
 * Z-index Management:
 * - Spätere Kinder (weiter unten im DOM) haben höhere z-index Werte
 * - Dies stellt sicher, dass bei Überlappungen der untere FAB klickbar bleibt
 * - Empfohlene Reihenfolge: Wichtigste/häufigste FABs zuletzt (unten positioniert)
 */

import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fab-stack',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [],
  template: `
    <!-- DEPRECATED: FabStackComponent is replaced by global FabContainerComponent.
         FABs now register via FabRegistryService. This container is hidden
         but children (dialogs/popovers) still render for backwards compatibility. -->
    <div class="fab-stack-deprecated">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Hide the old fab-stack container - FABs now use global FabRegistry */
      app-fab-stack .fab-stack-deprecated {
        /* Don't position - let children render naturally (for dialogs/popovers) */
        position: absolute;
        visibility: hidden;
        pointer-events: none;
        width: 0;
        height: 0;
        overflow: hidden;
      }

      /* Children that are dialogs/popovers need to be visible */
      .fab-stack-deprecated .p-dialog-mask,
      .fab-stack-deprecated .p-dialog,
      app-fab-stack .fab-stack-deprecated .p-popover {
        visibility: visible;
        pointer-events: auto;
      }
    `,
  ],
})
export class FabStackComponent {
  // Simple container - children manage themselves
}
