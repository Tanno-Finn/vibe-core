import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { CascadeSelect } from '@openng/optimus-ui/cascadeselect';
import { CascadeSelectDemoComponent } from './cascade-select-demo.component';

/**
 * The Listbox guide renders CascadeSelect through this wrapper because the shipped
 * 2.0.2 bundle cannot be evaluated unlinked (see the component's own header). That
 * trade cost the article its template type-checking: six inputs and one output became
 * strings inside `inputBinding`, and nothing in the repo would have noticed a library
 * rename until three demos rendered empty.
 *
 * Two nets are put back here, and neither needs the package to render:
 *
 *   COMPILE TIME  `BOUND_MEMBERS` is typed `keyof CascadeSelect`, so a renamed input
 *                 fails to compile — in the component (via its `bound()` helper) and
 *                 again in this file. A spec that does not compile does not load, and
 *                 check-test-baseline fails on the file count.
 *   RUN TIME      the wrapper must survive a package that throws while loading, which
 *                 is exactly what this runner produces. Not a contrivance: it is the
 *                 failure mode the whole file exists to contain, and before the
 *                 `catch` it would have surfaced as an unhandled rejection.
 *
 * What this spec deliberately does NOT assert: `role="combobox"`, the hidden input's
 * `aria-label`, an `onChange` round trip, or the ControlValueAccessor calls the demo
 * makes after mounting. All four need the component in the DOM, and it cannot get
 * there under Vitest — `externalPackages: true` leaves node_modules unlinked, so
 * `openng-optimus-ui-cascadeselect.mjs` throws while it is being evaluated. The third
 * test measures that instead of assuming it, so the day the pin moves and the module
 * loads, this spec turns red and says the wrapper can go.
 */
const BOUND_MEMBERS: readonly (keyof CascadeSelect)[] = [
  'options',
  'optionLabel',
  'optionGroupLabel',
  'optionGroupChildren',
  'placeholder',
  'ariaLabel',
  'onChange',
];

/**
 * `mount()` settles on a dynamic import, which no fixture stability signal covers. The
 * budget is time, not iterations: evaluating the package is the slowest step in the
 * suite, and with 31 spec files loading in parallel it outran the old 1 s loop and the
 * default 5 s test timeout — the spec went red inside build:prod while passing alone.
 * `ASYNC_TIMEOUT` gives the two tests that wait on it the same headroom.
 */
const SETTLE_BUDGET_MS = 20_000;
const ASYNC_TIMEOUT = 30_000;

async function settle(instance: CascadeSelectDemoComponent): Promise<void> {
  const deadline = Date.now() + SETTLE_BUDGET_MS;
  while (instance.loadFailed() === null && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 10));
  }
}

describe('CascadeSelectDemoComponent', () => {
  let fixture: ComponentFixture<CascadeSelectDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascadeSelectDemoComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CascadeSelectDemoComponent);
    fixture.componentRef.setInput('options', [{ name: 'North', states: [{ cities: [{ city: 'Oslo' }] }] }]);
    fixture.componentRef.setInput('optionGroupChildren', ['states', 'cities']);
    fixture.detectChanges();
    TestBed.inject(ApplicationRef).tick(); // afterNextRender does not run on detectChanges alone
    await fixture.whenStable();
  });

  it('binds only members the shipped CascadeSelect declares', () => {
    // The assertion that matters is the type annotation above: `keyof CascadeSelect`
    // rejects a name the library no longer has. The count guards the list itself.
    expect(BOUND_MEMBERS).toHaveLength(7);
    expect(new Set(BOUND_MEMBERS).size).toBe(BOUND_MEMBERS.length);
  });

  it('stays out of the layout so the created element is the layout child', () => {
    expect((fixture.nativeElement as HTMLElement).getAttribute('style')).toContain('display: contents');
  });

  it('contains a package that cannot be evaluated in this runner instead of throwing', async () => {
    await settle(fixture.componentInstance);
    expect(fixture.componentInstance.loadFailed()).toMatch(/Cannot access 'CascadeSelect' before initialization/);
    expect((fixture.nativeElement as HTMLElement).querySelector('p-cascadeselect')).toBeNull();
  }, ASYNC_TIMEOUT);

  it('leaves the value untouched while nothing can write to it', async () => {
    // `value` is a model with two writers, the `onChange` output binding and the
    // `registerOnChange` callback the ControlValueAccessor path installs. Neither can
    // fire without the library, so an unloaded demo must still read as unselected.
    await settle(fixture.componentInstance);
    expect(fixture.componentInstance.value()).toBeNull();
  }, ASYNC_TIMEOUT);
});
