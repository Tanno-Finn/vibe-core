import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  afterNextRender,
  input,
  inputBinding,
  model,
  outputBinding,
  signal,
  viewChild,
} from '@angular/core';
import type { CascadeSelect, CascadeSelectChangeEvent } from '@openng/optimus-ui/cascadeselect';

/**
 * The six input names and the one output name below are strings, because
 * `inputBinding`/`outputBinding` take strings — the template checker that would
 * have caught a renamed input is exactly what this file trades away.
 *
 * This puts the check back at COMPILE time: `K extends keyof CascadeSelect`
 * accepts only a member the shipped component actually declares, so a rename in
 * a library update fails `ng build` here instead of blanking three demos at
 * runtime. `import type` is erased before the bundle exists, so the TDZ path the
 * whole file works around stays closed — the package is still only ever reached
 * through the dynamic `import()` in `mount()`.
 */
const bound = <K extends keyof CascadeSelect>(name: K): K => name;

/**
 * One `p-cascadeSelect` for the Listbox guide, created from a module this file loads at
 * RUNTIME instead of naming it in `imports`. The rendered DOM is the same component with
 * the same inputs, so every claim the guide makes about roles, names, and nodes holds
 * against it unchanged.
 *
 * WHY THE ARTICLE CANNOT SIMPLY WRITE `<p-cascadeSelect>`
 *   `openng-optimus-ui-cascadeselect.mjs` (Optimus UI 2.0.2) declares `CascadeSelectSub`
 *   (:176) with a static `ɵfac` whose `deps` names `CascadeSelect` (:274) — a class the
 *   same file only declares at :452, without the `forwardRef` its value accessor uses
 *   three lines earlier (:173). A static class field is evaluated when the class is
 *   defined, so the raw module throws `ReferenceError: Cannot access 'CascadeSelect'
 *   before initialization`. It is the only forward reference of that kind in all of
 *   Optimus UI (scanned 2026-09-07 across every fesm2022 bundle).
 *
 *   In the browser this is harmless: the Angular linker rewrites the declaration into a
 *   factory function during bundling, and the reference moves into a function body. The
 *   Vitest runner (`@angular/build:unit-test`) is different on two counts: it keeps
 *   node_modules external and unlinked (`externalPackages: true`) and it builds every
 *   spec without code splitting (`disableCodeSplitting: true`). The registry's lazy
 *   `import()` of the article is therefore folded into every spec bundle that reaches
 *   `app.routes.ts`, the package import inside it is hoisted to the bundle's top level,
 *   and Node evaluates the broken module before the first test runs. Six specs failed to
 *   load that way, among them the devOnly-route guard from the 2026-09-01 security
 *   assessment. `@defer` would not help — it defers rendering, not the hoisted import.
 *
 *   A dynamic import of an EXTERNAL specifier is the one form esbuild cannot hoist: it
 *   stays a real `import()` in the spec bundle and is never called there. In the app it
 *   is an ordinary lazy chunk. `afterNextRender` keeps the load browser-only, which is
 *   also where the guide's demos are read.
 *
 *   Revisit when the pin moves: the moment that `ɵfac` carries a `forwardRef`, this file
 *   can go and the three `<p-cascadeSelect>` return to the article template.
 */
@Component({
  selector: 'app-cascade-select-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The created element becomes the layout child, exactly as the inline tag was.
  host: { style: 'display: contents' },
  template: `<ng-container #outlet />`,
})
export class CascadeSelectDemoComponent {
  /** The option hierarchy (regions -> states -> cities); typed loosely on purpose, see the article. */
  readonly options = input.required<unknown[]>();
  readonly optionGroupChildren = input.required<string[]>();
  readonly placeholder = input<string>();
  readonly ariaLabel = input<string>();
  readonly value = model<unknown>(null);

  /**
   * Whether the package failed to evaluate. It does exactly that under the Vitest
   * runner, which is the environment this whole file exists because of, so the
   * rejection is caught rather than left to become an unhandled one: a demo that
   * cannot load must leave an empty stage, not a failing spec file.
   */
  readonly loadFailed = signal<string | null>(null);

  private readonly outlet = viewChild.required('outlet', { read: ViewContainerRef });

  constructor() {
    afterNextRender(() => {
      void this.mount().catch((e: unknown) => this.loadFailed.set(e instanceof Error ? e.message : String(e)));
    });
  }

  private async mount(): Promise<void> {
    const { CascadeSelect } = await import('@openng/optimus-ui/cascadeselect');
    const ref = this.outlet().createComponent(CascadeSelect, {
      bindings: [
        inputBinding(bound('options'), this.options),
        inputBinding(bound('optionLabel'), () => 'city'),
        inputBinding(bound('optionGroupLabel'), () => 'name'),
        inputBinding(bound('optionGroupChildren'), this.optionGroupChildren),
        inputBinding(bound('placeholder'), this.placeholder),
        inputBinding(bound('ariaLabel'), this.ariaLabel),
        outputBinding<CascadeSelectChangeEvent>(bound('onChange'), (e) => this.value.set(e.value)),
      ],
    });

    // `[(ngModel)]` is not available to a component created this way — a directive
    // cannot be attached to `createComponent`. The ControlValueAccessor underneath it
    // can: `writeValue` and `registerOnChange` are the two methods a form control
    // calls, declared on BaseEditableHolder, which is the inheritance the guide's Key
    // API and Accessibility sections both rest on. Driving them directly keeps that
    // claim exercised by a rendered demo instead of only asserted in prose.
    ref.instance.registerOnChange((v: unknown) => this.value.set(v));
    ref.instance.writeValue(this.value());
  }
}
