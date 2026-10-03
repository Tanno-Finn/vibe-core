import {
  annotateTree,
  classify,
  directoryPaths,
  isAbsolute,
  isHomeRelative,
  joinSegments,
  lookup,
  resolve,
  resolveIn,
  splitSegments,
  type PathNode,
} from './path-resolver.engine';

/**
 * The fixture is the tree the article's own walkthrough builds
 * (`articleTerminalIntro.paths.walkthrough`: mkdir project → cd project →
 * mkdir data src), plus the two leaf files the widget needs to have somewhere
 * to land:
 *
 *   /
 *   └── home/
 *       └── user/
 *           ├── project/
 *           │   ├── data/
 *           │   │   └── file.csv
 *           │   └── src/
 *           │       └── main.py
 *           └── notes.txt
 *
 * HOME is /home/user, so '~' expands there.
 */
const TREE: PathNode = {
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
};

const HOME = '/home/user';
const PROJECT = '/home/user/project';

describe('path-resolver.engine — splitting and joining', () => {
  it('drops empty segments from leading, trailing and doubled separators', () => {
    expect(splitSegments('/data//file.csv/')).toEqual(['data', 'file.csv']);
  });

  it('treats a backslash as a separator, because the article says tools accept both', () => {
    expect(splitSegments('data\\file.csv')).toEqual(['data', 'file.csv']);
  });

  it('keeps . and .. — they are instructions, not noise', () => {
    expect(splitSegments('../././data')).toEqual(['..', '.', '.', 'data']);
  });

  it('splits the root and the empty string to no segments at all', () => {
    expect(splitSegments('/')).toEqual([]);
    expect(splitSegments('')).toEqual([]);
  });

  it('joins no segments back into the root', () => {
    expect(joinSegments([])).toBe('/');
    expect(joinSegments(['home', 'user'])).toBe('/home/user');
  });
});

describe('path-resolver.engine — classification', () => {
  it('calls a leading separator absolute, on either slash', () => {
    expect(isAbsolute('/data')).toBe(true);
    expect(isAbsolute('\\data')).toBe(true);
    expect(isAbsolute('data')).toBe(false);
  });

  it('calls a bare ~ and ~/… home-relative', () => {
    expect(isHomeRelative('~')).toBe(true);
    expect(isHomeRelative('~/notes.txt')).toBe(true);
    expect(isHomeRelative('~\\notes.txt')).toBe(true);
  });

  it('does not treat ~name as home — that is another user, which is not modeled', () => {
    expect(isHomeRelative('~alice')).toBe(false);
    expect(classify('~alice')).toBe('relative');
  });

  it('classifies the three starting points', () => {
    expect(classify('/data/file.csv')).toBe('absolute');
    expect(classify('data/file.csv')).toBe('relative');
    expect(classify('~/notes.txt')).toBe('home');
  });
});

describe('path-resolver.engine — resolve', () => {
  it('appends a relative path to the working directory', () => {
    const r = resolve('data/file.csv', PROJECT, HOME);
    expect(r.kind).toBe('relative');
    expect(r.absolute).toBe('/home/user/project/data/file.csv');
  });

  it('ignores the working directory for an absolute path', () => {
    const r = resolve('/data/file.csv', PROJECT, HOME);
    expect(r.kind).toBe('absolute');
    expect(r.absolute).toBe('/data/file.csv');
  });

  it('expands ~ to the home directory, bare and with a tail', () => {
    expect(resolve('~', PROJECT, HOME).absolute).toBe('/home/user');
    expect(resolve('~/notes.txt', PROJECT, HOME).absolute).toBe('/home/user/notes.txt');
  });

  it('goes one level up per ..', () => {
    expect(resolve('..', '/home/user/project/data', HOME).absolute).toBe('/home/user/project');
    // /home/user/project → /home/user → /home
    expect(resolve('../..', PROJECT, HOME).absolute).toBe('/home');
  });

  it('stays put on . and on a trailing separator', () => {
    expect(resolve('.', PROJECT, HOME).absolute).toBe('/home/user/project');
    expect(resolve('./data/', PROJECT, HOME).absolute).toBe('/home/user/project/data');
  });

  it('stays at the root when .. is applied there — "cd .. from / stays at /"', () => {
    expect(resolve('..', '/', HOME).absolute).toBe('/');
    expect(resolve('../../..', '/', HOME).absolute).toBe('/');
    // and the same from below: more .. than there are levels lands on the root
    expect(resolve('../../../../../..', PROJECT, HOME).absolute).toBe('/');
  });

  it('resolves an empty or whitespace-only input to the working directory itself', () => {
    expect(resolve('', PROJECT, HOME).absolute).toBe('/home/user/project');
    expect(resolve('   ', PROJECT, HOME).absolute).toBe('/home/user/project');
  });

  it('accepts a backslash-separated relative path', () => {
    expect(resolve('data\\file.csv', PROJECT, HOME).absolute).toBe('/home/user/project/data/file.csv');
  });

  it('normalizes a working directory given with a trailing separator', () => {
    expect(resolve('data', '/home/user/project/', HOME).absolute).toBe('/home/user/project/data');
  });
});

describe('path-resolver.engine — the trace', () => {
  it('starts at the working directory and records one step per segment', () => {
    const { steps } = resolve('../src/main.py', '/home/user/project/data', HOME);
    expect(steps).toEqual([
      { segment: '/home/user/project/data', action: 'start', path: '/home/user/project/data' },
      { segment: '..', action: 'up', path: '/home/user/project' },
      { segment: 'src', action: 'down', path: '/home/user/project/src' },
      { segment: 'main.py', action: 'down', path: '/home/user/project/src/main.py' },
    ]);
  });

  it('labels the start as / for an absolute path and as ~ for a home-relative one', () => {
    expect(resolve('/data', PROJECT, HOME).steps[0]).toEqual({ segment: '/', action: 'start', path: '/' });
    expect(resolve('~/notes.txt', PROJECT, HOME).steps[0]).toEqual({
      segment: '~',
      action: 'start',
      path: '/home/user',
    });
  });

  it('always has a start step, even for an empty input', () => {
    expect(resolve('', PROJECT, HOME).steps.length).toBe(1);
  });
});

describe('path-resolver.engine — lookup', () => {
  it('finds directories and files, and reports a missing one', () => {
    expect(lookup(TREE, '/home/user/project/data')).toBe('dir');
    expect(lookup(TREE, '/home/user/project/data/file.csv')).toBe('file');
    expect(lookup(TREE, '/data/file.csv')).toBe('missing');
  });

  it('resolves the root itself to a directory', () => {
    expect(lookup(TREE, '/')).toBe('dir');
  });

  it('finds nothing below a file — a file has no contents to descend into', () => {
    expect(lookup(TREE, '/home/user/notes.txt/data')).toBe('missing');
  });

  it('is case-sensitive, like the Unix tree it models', () => {
    expect(lookup(TREE, '/home/User')).toBe('missing');
  });
});

describe('path-resolver.engine — the two lessons the widget exists for', () => {
  // articleTerminalIntro.paths.pitfalls.text, verbatim: "/data/file.csv is
  // something entirely different from data/file.csv".
  it('the same name with and without a leading slash lands in different places', () => {
    const relative = resolveIn(TREE, 'data/file.csv', PROJECT, HOME);
    const absolute = resolveIn(TREE, '/data/file.csv', PROJECT, HOME);

    expect(relative.absolute).toBe('/home/user/project/data/file.csv');
    expect(relative.target).toBe('file');

    expect(absolute.absolute).toBe('/data/file.csv');
    expect(absolute.target).toBe('missing');
  });

  // "Never lose track of your working directory — use pwd frequently."
  it('the same typed path lands elsewhere when the working directory moves', () => {
    const fromProject = resolveIn(TREE, 'data/file.csv', PROJECT, HOME);
    const fromHome = resolveIn(TREE, 'data/file.csv', HOME, HOME);

    expect(fromProject.absolute).toBe('/home/user/project/data/file.csv');
    expect(fromProject.target).toBe('file');

    expect(fromHome.absolute).toBe('/home/user/data/file.csv');
    expect(fromHome.target).toBe('missing');
  });
});

describe('path-resolver.engine — views derived from the tree', () => {
  it('offers every directory as a working directory, root first, depth-first', () => {
    expect(directoryPaths(TREE)).toEqual([
      '/',
      '/home',
      '/home/user',
      '/home/user/project',
      '/home/user/project/data',
      '/home/user/project/src',
    ]);
  });

  it('offers no file as a working directory', () => {
    expect(directoryPaths(TREE)).not.toContain('/home/user/notes.txt');
  });

  it('annotates the root as / and keeps the nesting intact', () => {
    const view = annotateTree(TREE);
    expect(view.path).toBe('/');
    expect(view.name).toBe('/');
    expect(view.type).toBe('dir');
    expect(view.children.length).toBe(1);
    expect(view.children[0].name).toBe('home');
  });

  it('gives every node its own absolute path', () => {
    const view = annotateTree(TREE);
    const user = view.children[0].children[0];
    expect(user.path).toBe('/home/user');
    expect(user.children.map((c) => c.path)).toEqual(['/home/user/project', '/home/user/notes.txt']);
  });

  it('annotates a leaf file with no children rather than undefined', () => {
    const view = annotateTree(TREE);
    const notes = view.children[0].children[0].children[1];
    expect(notes).toEqual({ path: '/home/user/notes.txt', name: 'notes.txt', type: 'file', children: [] });
  });

  it('produces a path for every node in the tree', () => {
    const paths: string[] = [];
    const walk = (node: { path: string; children: { path: string; children: unknown[] }[] }): void => {
      paths.push(node.path);
      for (const child of node.children) walk(child as never);
    };
    walk(annotateTree(TREE));

    expect(paths).toEqual([
      '/',
      '/home',
      '/home/user',
      '/home/user/project',
      '/home/user/project/data',
      '/home/user/project/data/file.csv',
      '/home/user/project/src',
      '/home/user/project/src/main.py',
      '/home/user/notes.txt',
    ]);
  });
});
