/**
 * path-resolver.engine — pure path arithmetic for the `app-path-resolver`
 * mini-widget (article art-terminal-intro, section "Paths"). Deliberately
 * framework-free so the resolution rules are unit-tested in isolation (see
 * path-resolver.engine.spec.ts) and the widget only wires signals around them.
 *
 * The rules modeled here are exactly the ones the article states in prose:
 *
 *   absolute   starts at the root — "/data/file.csv"
 *   relative   starts at the working directory — "data/file.csv"
 *   home       starts at the home directory — "~/notes.txt"
 *   "."        stay where you are
 *   ".."       one level up; at the root there is no level up, so "/" stays "/"
 *
 * Both "/" and "\" are accepted as separators, because the article tells the
 * reader that "most modern tools accept both separators" — a resolver that
 * rejected one would contradict the page it sits on.
 *
 * Deliberately NOT modeled (see specs/2026-08-24-path-resolver-widget/shape.md):
 * symlinks, globs, quoting, Windows drive letters. Each would teach a second
 * lesson badly inside a widget built for one.
 */

/** One node in the demo file tree. A file simply has no children. */
export interface PathNode {
  /** The segment name. The root node's name is never rendered. */
  name: string;
  type: 'dir' | 'file';
  children?: PathNode[];
}

/** How the typed path decided where to start. */
export type PathKind = 'absolute' | 'relative' | 'home';

/** What the resolved path points at in the tree. */
export type TargetKind = 'dir' | 'file' | 'missing';

/** One line of the segment-by-segment trace shown under the result. */
export interface ResolveStep {
  /** The segment as typed — '..', '.', 'data', or '~' / '/' for the start. */
  segment: string;
  /** What that segment did: start somewhere, go up, stay, or go down. */
  action: 'start' | 'up' | 'stay' | 'down';
  /** The absolute path after applying this segment. */
  path: string;
}

/** Everything the widget renders for one (working directory, input) pair. */
export interface Resolution {
  /** Whether the reader typed an absolute, relative or home-relative path. */
  kind: PathKind;
  /** The resolved absolute path, always starting with '/'. */
  absolute: string;
  /** The walk that produced it, first entry always the starting point. */
  steps: ResolveStep[];
  /** What lives at `absolute` in the tree. */
  target: TargetKind;
}

/** Join already-clean segments into an absolute path. `[]` is the root. */
export function joinSegments(segments: readonly string[]): string {
  return segments.length === 0 ? '/' : '/' + segments.join('/');
}

/**
 * Split an absolute or relative path into its meaningful segments. Empty
 * segments — a leading separator, a trailing one, or a doubled one — carry no
 * meaning in a path and are dropped, so 'data//file/' and 'data/file' split
 * alike. '.' and '..' survive; they are instructions, not noise.
 */
export function splitSegments(path: string): string[] {
  return path.split(/[/\\]/).filter((segment) => segment.length > 0);
}

/** True if the path starts at the root, on either separator. */
export function isAbsolute(path: string): boolean {
  return /^[/\\]/.test(path);
}

/**
 * True if the path starts at the home directory: a bare '~' or a '~' followed
 * by a separator. '~foo' is NOT home-relative — in a real shell that names
 * another user's home, which this widget does not model, so it stays a plain
 * relative segment rather than silently pretending to be something it is not.
 */
export function isHomeRelative(path: string): boolean {
  return path === '~' || /^~[/\\]/.test(path);
}

/** Which of the three starting points the typed path chose. */
export function classify(path: string): PathKind {
  if (isAbsolute(path)) return 'absolute';
  if (isHomeRelative(path)) return 'home';
  return 'relative';
}

/**
 * Resolve `input` against `workingDirectory`, tracing every step.
 *
 * `workingDirectory` and `homeDirectory` are absolute paths, split by the same
 * rules as `input` — empty segments carry no meaning, so '/home/user' and
 * '/home/user/' describe the same directory, and '/' is the root.
 *
 * An empty (or whitespace-only) input resolves to the working directory
 * itself — that is what a shell does with no argument, and it keeps the widget
 * showing a real answer while the reader is mid-typing rather than blanking.
 */
export function resolve(input: string, workingDirectory: string, homeDirectory: string): Omit<Resolution, 'target'> {
  const typed = input.trim();
  const kind = classify(typed);

  // Where the walk begins, and which part of the input is left to walk.
  let segments: string[];
  let rest: string;
  let startLabel: string;

  if (kind === 'absolute') {
    segments = [];
    rest = typed;
    startLabel = '/';
  } else if (kind === 'home') {
    segments = splitSegments(homeDirectory);
    rest = typed.slice(1); // drop the '~'; the separator after it splits away
    startLabel = '~';
  } else {
    segments = splitSegments(workingDirectory);
    rest = typed;
    startLabel = joinSegments(segments);
  }

  const steps: ResolveStep[] = [{ segment: startLabel, action: 'start', path: joinSegments(segments) }];

  for (const segment of splitSegments(rest)) {
    if (segment === '.') {
      steps.push({ segment, action: 'stay', path: joinSegments(segments) });
    } else if (segment === '..') {
      // At the root there is nothing above; the article says so explicitly
      // ("cd .. from / stays at /"), so this is a no-op, not an error.
      segments.pop();
      steps.push({ segment, action: 'up', path: joinSegments(segments) });
    } else {
      segments.push(segment);
      steps.push({ segment, action: 'down', path: joinSegments(segments) });
    }
  }

  return { kind, absolute: joinSegments(segments), steps };
}

/**
 * What lives at `absolutePath` in `tree`. The tree's own root node stands for
 * '/', so its name is never matched against a segment. A segment that names a
 * file mid-path (e.g. 'file.csv/data') finds nothing, which is correct: a file
 * has no contents to descend into.
 */
export function lookup(tree: PathNode, absolutePath: string): TargetKind {
  let node: PathNode = tree;
  for (const segment of splitSegments(absolutePath)) {
    const child = node.children?.find((c) => c.name === segment);
    if (!child) return 'missing';
    node = child;
  }
  return node.type;
}

/** Resolve and look up in one call — what the widget actually needs. */
export function resolveIn(tree: PathNode, input: string, workingDirectory: string, homeDirectory: string): Resolution {
  const resolution = resolve(input, workingDirectory, homeDirectory);
  return { ...resolution, target: lookup(tree, resolution.absolute) };
}

/**
 * Every directory in the tree as an absolute path, root first, then
 * depth-first in declaration order — the list the widget offers as working
 * directories. Derived rather than configured, so it can never disagree with
 * the tree it is drawn from.
 */
export function directoryPaths(tree: PathNode): string[] {
  const paths: string[] = [];

  const walk = (node: PathNode, segments: string[]): void => {
    if (node.type !== 'dir') return;
    paths.push(joinSegments(segments));
    for (const child of node.children ?? []) walk(child, [...segments, child.name]);
  };

  walk(tree, []);
  return paths;
}

/**
 * The tree with an absolute path on every node, keeping the nesting — the
 * template renders it as nested `<ul>`s, so the hierarchy is carried by the
 * document structure rather than by indentation a screen reader cannot see.
 * The root keeps its shape and is displayed as '/': it is where an absolute
 * path starts, and the reader needs to see that '/' is a real place.
 */
export interface TreeView {
  path: string;
  name: string;
  type: 'dir' | 'file';
  children: TreeView[];
}

export function annotateTree(tree: PathNode): TreeView {
  const walk = (node: PathNode, segments: string[]): TreeView => ({
    path: joinSegments(segments),
    name: segments.length === 0 ? '/' : node.name,
    type: node.type,
    children: (node.children ?? []).map((child) => walk(child, [...segments, child.name])),
  });

  return walk(tree, []);
}
