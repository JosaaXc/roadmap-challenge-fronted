import { LearningPath, PathNode } from '../models/paths-models';

// Progress as the server computes it: every node counts, rounded to one decimal
export function progressOf(nodes: readonly PathNode[]): number {
  if (nodes.length === 0) return 0;
  const completed = nodes.filter((node) => node.isCompleted).length;
  return Math.round((completed / nodes.length) * 1000) / 10;
}

// The path with one step flipped and its progress recalculated, for optimistic updates
export function withStepFlipped(path: LearningPath, nodeId: string): LearningPath {
  const nodes = path.nodes.map((node) =>
    node.id === nodeId ? { ...node, isCompleted: !node.isCompleted } : node,
  );
  return { ...path, nodes, progress: progressOf(nodes) };
}
