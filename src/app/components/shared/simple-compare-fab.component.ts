/**
 * Simple Compare FAB
 *
 * Registry-driven FAB for the catalog compare feature. Unlike most FABs it has
 * *dynamic* visibility: it only appears once the user has marked enough tools
 * for comparison (compareCount in [min, max]) and the compare table view is not
 * already open. Because those conditions live in `@Input`s that change at
 * runtime, the component (un)registers itself with the global
 * `FabRegistryService` from `ngOnChanges` rather than once in `ngOnInit`.
 *
 * Historical note: this FAB used to render its own inline button inside
 * `<app-fab-stack>`. That stack was deprecated and hidden when all FABs moved
 * to the global FabRegistry/FabContainer. Every other FAB
 * migrated; this one was missed, which left the compare FAB invisible and
 * unreachable. It now registers like its siblings and is rendered by
 * `<app-fab-container>`.
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FabRegistryService, FAB_PRIORITIES } from '../../services/fab-registry.service';

@Component({
  selector: 'app-simple-compare-fab',
  standalone: true,
  imports: [],
  // No inline rendering: the global <app-fab-container> renders the registered
  // FAB. This component is a pure registry controller.
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class SimpleCompareFabComponent implements OnChanges, OnDestroy {
  @Input() compareCount: number = 0;
  @Input() minCompareCount: number = 2;
  @Input() maxCompareCount: number = 5;
  @Input() compareMode: boolean = false;
  @Input() labelKey: string = 'aiTools.buttons.compare';
  @Input() tooltipKey: string = 'aiTools.buttons.compare';

  @Output() compareTriggered = new EventEmitter<{ count: number; event: Event }>();

  private readonly fabId = 'compare';
  private registered = false;

  private fabRegistry = inject(FabRegistryService);

  ngOnChanges(): void {
    this.syncRegistration();
  }

  ngOnDestroy(): void {
    if (this.registered) {
      this.fabRegistry.unregister(this.fabId);
      this.registered = false;
    }
  }

  shouldShow(): boolean {
    return this.compareCount >= this.minCompareCount && this.compareCount <= this.maxCompareCount && !this.compareMode;
  }

  /**
   * Reconcile the FAB's registry presence with the current inputs. Registers
   * when the FAB should be shown, keeps its badge in sync while shown, and
   * unregisters once it should hide (enough tools removed, or compare mode
   * opened).
   */
  private syncRegistration(): void {
    if (this.shouldShow()) {
      if (this.registered) {
        this.fabRegistry.updateBadge(this.fabId, this.compareCount);
      } else {
        this.fabRegistry.register({
          id: this.fabId,
          priority: FAB_PRIORITIES.COMPARE,
          icon: 'pi-balance-scale',
          labelKey: this.labelKey,
          color: 'purple',
          badge: this.compareCount,
          onClick: () => this.handleCompare(),
        });
        this.registered = true;
      }
    } else if (this.registered) {
      this.fabRegistry.unregister(this.fabId);
      this.registered = false;
    }
  }

  private handleCompare(): void {
    if (this.shouldShow()) {
      this.compareTriggered.emit({ count: this.compareCount, event: new Event('click') });
    }
  }
}
