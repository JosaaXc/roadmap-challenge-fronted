import { LearningPath, PathNode } from '../models/paths-models';
import { buildTimeline } from './path-timeline';

// A path's catalogue courses in order. Resources are the user's own additions, so they stay out
export function pathCourses(path: Pick<LearningPath, 'nodes' | 'edges'>): PathNode[] {
  return buildTimeline(path).courses.map((entry) => entry.node);
}

// Their covers in the same order: what lights a page with the colours of the path
export function pathCovers(path: Pick<LearningPath, 'nodes' | 'edges'>): string[] {
  return pathCourses(path).flatMap((course) => course.imageUrl ?? []);
}

// The path Mis rutas offers to pick up again. Only paths with a course left count; a started
// one wins over one never opened, and among equals the one touched last
export function pickResumePath(paths: readonly LearningPath[]): LearningPath | null {
  let best: LearningPath | null = null;
  for (const path of paths) {
    if (pathCourses(path).every((course) => course.isCompleted)) continue;
    if (!best || isBetterResume(path, best)) best = path;
  }
  return best;
}

function isBetterResume(path: LearningPath, than: LearningPath): boolean {
  const started = path.progress > 0;
  if (started !== than.progress > 0) return started;
  return touchedAt(path) > touchedAt(than);
}

function touchedAt(path: LearningPath): number {
  return new Date(path.updatedAt ?? path.createdAt).getTime();
}
