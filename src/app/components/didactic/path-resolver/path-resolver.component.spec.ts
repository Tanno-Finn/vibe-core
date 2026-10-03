/**
 * PathResolverComponent spec — the wiring the engine tests cannot see.
 *
 * path-resolver.engine.spec.ts already pins the arithmetic. What is left, and
 * what actually breaks in practice, is the template: whether the controls are
 * really bound, whether the labels really point at them, whether the marked
 * tree rows follow the answer, and whether reset restores BOTH parameters.
 * Every case here therefore goes through the DOM — reading the rendered text
 * and dispatching real events — rather than calling the component's methods,
 * because an API-level case would stay green with the bindings deleted.
 *
 * TranslationService is stubbed to echo the key, so no assertion depends on
 * translated copy. The one exception is `pathResolver.summary`, which is given
 * a real placeholder template: the live region's whole job is interpolation,
 * and echoing the key would test nothing.
 *
 * The live-region cases pin a contract that is easy to regress back into: the
 * visible panels update per keystroke, but the announcement waits for the path
 * to SETTLE (blur/Enter), while a select change and a reset — both already
 * discrete acts — speak at once.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { TranslationService } from '../../../services/translation.service';
import { PathResolverComponent, type PathResolverConfig } from './path-resolver.component';

/** The article's own tree: the walkthrough's project/data/src, plus two files. */
const CONFIG: PathResolverConfig = {
  homeDirectory: '/home/user',
  defaultWorkingDirectory: '/home/user/project',
  defaultInput: 'data/file.csv',
  tree: {
    name: '',
    type: 'dir',
    children: [
      {
        name: 'home',
        type: 'dir',
        children: [
          {
            name: 'user',
            type: 'dir',
            children: [
              {
                name: 'project',
                type: 'dir',
                children: [
                  { name: 'data', type: 'dir', children: [{ name: 'file.csv', type: 'file' }] },
                  { name: 'src', type: 'dir', children: [{ name: 'main.py', type: 'file' }] },
                ],
              },
              { name: 'notes.txt', type: 'file' },
            ],
          },
        ],
      },
    ],
  },
};

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage$ = () => 'en';
  get currentLanguage(): string {
    return 'en';
  }
  translate(key: string): string {
    return key === 'pathResolver.summary' ? '{{kind}} | {{absolute}} | {{target}}' : key;
  }
}

describe('PathResolverComponent', () => {
  let fixture: ComponentFixture<PathResolverComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathResolverComponent],
      providers: [{ provide: TranslationService, useClass: TranslationServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(PathResolverComponent);
    fixture.componentRef.setInput('config', CONFIG);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  const select = (): HTMLSelectElement => host.querySelector('select.field') as HTMLSelectElement;
  const input = (): HTMLInputElement => host.querySelector('input.field') as HTMLInputElement;
  const resolved = (): string => (host.querySelector('.absolute') as HTMLElement).textContent!.trim();
  const verdict = (): string => (host.querySelector('.target') as HTMLElement).textContent!.trim();

  /** Type into the real field the way a reader would. */
  function type(value: string): void {
    input().value = value;
    input().dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  /** Blur/Enter — what tells the widget the typed path has settled. */
  function commit(): void {
    input().dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
  }

  /** Pick a working directory through the real select. */
  function chooseDirectory(value: string): void {
    select().value = value;
    select().dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
  }

  it('starts at the configured parameters and resolves them', () => {
    expect(select().value).toBe('/home/user/project');
    expect(input().value).toBe('data/file.csv');
    expect(resolved()).toBe('/home/user/project/data/file.csv');
    expect(verdict()).toContain('pathResolver.target.file');
  });

  it('associates each label with the control it names', () => {
    const labels = Array.from(host.querySelectorAll('label')).map((l) => l.getAttribute('for'));

    expect(select().id).toBeTruthy();
    expect(input().id).toBeTruthy();
    expect(select().id).not.toBe(input().id);
    expect(labels).toContain(select().id);
    expect(labels).toContain(input().id);
  });

  it('marks the selected option with the ATTRIBUTE, so the prerendered select agrees with the verdict', () => {
    // A [selected] property binding sets the DOM only and never reaches the
    // server-rendered HTML: the page would ship showing "/" while the panel
    // below it already resolved from /home/user/project.
    const marked = Array.from(select().options).filter((o) => o.hasAttribute('selected'));

    expect(marked.map((o) => o.value)).toEqual(['/home/user/project']);

    chooseDirectory('/home/user');
    expect(
      Array.from(select().options)
        .filter((o) => o.hasAttribute('selected'))
        .map((o) => o.value),
    ).toEqual(['/home/user']);
  });

  it('offers every directory and no file as a working directory', () => {
    const options = Array.from(select().options).map((o) => o.value);

    expect(options).toEqual([
      '/',
      '/home',
      '/home/user',
      '/home/user/project',
      '/home/user/project/data',
      '/home/user/project/src',
    ]);
    expect(options).not.toContain('/home/user/notes.txt');
  });

  it('re-resolves on every keystroke — the leading slash the article warns about', () => {
    type('/data/file.csv');

    expect(resolved()).toBe('/data/file.csv');
    expect(verdict()).toContain('pathResolver.target.missing');
  });

  it('re-resolves when the working directory moves under an unchanged path', () => {
    chooseDirectory('/home/user');

    expect(input().value).toBe('data/file.csv');
    expect(resolved()).toBe('/home/user/data/file.csv');
    expect(verdict()).toContain('pathResolver.target.missing');
  });

  it('renders one trace row per segment, growing as the reader types', () => {
    expect(host.querySelectorAll('.trace li').length).toBe(3); // start + data + file.csv

    type('../src/main.py');
    expect(host.querySelectorAll('.trace li').length).toBe(4); // start + .. + src + main.py
  });

  it('marks the working directory and the landing row in the tree', () => {
    const here = host.querySelector('.node.is-here');
    const target = host.querySelector('.node.is-target');

    expect(here?.textContent).toContain('project');
    expect(here?.textContent).toContain('pathResolver.tree.here');
    expect(target?.textContent).toContain('file.csv');
    expect(target?.textContent).toContain('pathResolver.tree.target');
  });

  it('marks no tree row at all when the path lands nowhere', () => {
    type('/data/file.csv');

    expect(host.querySelector('.node.is-target')).toBeNull();
    expect(host.querySelector('.node.is-here')).not.toBeNull();
  });

  const region = (): HTMLElement => host.querySelector('p.sr-only') as HTMLElement;

  it('announces the verdict as one interpolated sentence in a polite live region', () => {
    expect(region().getAttribute('aria-live')).toBe('polite');
    expect(region().textContent!.trim()).toBe(
      'pathResolver.kind.relative | /home/user/project/data/file.csv | pathResolver.target.file',
    );
  });

  it('does NOT re-announce on every keystroke, only once the path has settled', () => {
    const before = region().textContent!.trim();

    // Mid-typing: the visible panel has already moved on...
    type('~');
    expect(resolved()).toBe('/home/user');
    // ...but the live region has not, so a screen reader is not read a fresh
    // absolute path on top of its own character echo.
    expect(region().textContent!.trim()).toBe(before);

    // `change` is blur or Enter — the path has settled, so now it speaks.
    commit();
    expect(region().textContent!.trim()).toBe('pathResolver.kind.home | /home/user | pathResolver.target.dir');
  });

  it('announces a working-directory change at once — picking from a select is already settled', () => {
    chooseDirectory('/home/user');

    expect(region().textContent!.trim()).toBe(
      'pathResolver.kind.relative | /home/user/data/file.csv | pathResolver.target.missing',
    );
  });

  it('announces the restored state when reset is pressed', () => {
    type('/nowhere');
    commit();
    expect(region().textContent!.trim()).toContain('/nowhere');

    (host.querySelector('.reset-btn') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(region().textContent!.trim()).toBe(
      'pathResolver.kind.relative | /home/user/project/data/file.csv | pathResolver.target.file',
    );
  });

  it('restores BOTH parameters when reset is pressed', () => {
    chooseDirectory('/home/user/project/src');
    type('../../notes.txt');
    expect(resolved()).toBe('/home/user/notes.txt');

    (host.querySelector('.reset-btn') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(select().value).toBe('/home/user/project');
    expect(input().value).toBe('data/file.csv');
    expect(resolved()).toBe('/home/user/project/data/file.csv');
  });

  it('shows the working directory itself while the field is empty, rather than blanking', () => {
    type('');

    expect(resolved()).toBe('/home/user/project');
    expect(verdict()).toContain('pathResolver.target.dir');
  });
});
