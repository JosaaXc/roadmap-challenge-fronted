import { LearningPath, PathNode, PathTimeline } from '../models/paths-models';

// Ties only happen between resources, whose position the backend can repeat after a deletion
export function byPosition(a: PathNode, b: PathNode): number {
  return a.position - b.position || a.id.localeCompare(b.id);
}

// The backend appends every resource at the end of `position` and records where it hangs
// only as an edge from its parent, so the order on screen has to come from the edges
export function buildTimeline(path: Pick<LearningPath, 'nodes' | 'edges'>): PathTimeline {
  const nodes = [...path.nodes].sort(byPosition);
  const byId = new Map(nodes.map((node) => [node.id, node]));

  const childrenOf = new Map<string, PathNode[]>();
  for (const edge of path.edges) {
    const child = byId.get(edge.targetNodeId);
    if (!child || child.type !== 'EXTERNAL_LINK' || !byId.has(edge.sourceNodeId)) continue;
    childrenOf.set(edge.sourceNodeId, [...(childrenOf.get(edge.sourceNodeId) ?? []), child]);
  }
  const hasParent = new Set([...childrenOf.values()].flat().map((node) => node.id));

  // Depth first, so a resource hung from another resource comes right after it
  const placed = new Set<string>();
  const descendants = (parentId: string): PathNode[] => {
    const result: PathNode[] = [];
    for (const child of [...(childrenOf.get(parentId) ?? [])].sort(byPosition)) {
      if (placed.has(child.id)) continue;
      placed.add(child.id);
      result.push(child, ...descendants(child.id));
    }
    return result;
  };

  const courses = nodes
    .filter((node) => node.type === 'DEVTALLES_COURSE')
    .map((node) => ({ node, resources: descendants(node.id) }));

  // Deleting a resource drops its edges, so whatever hung from it is left without a parent
  const orphans: PathNode[] = [];
  for (const node of nodes) {
    if (node.type !== 'EXTERNAL_LINK' || placed.has(node.id) || hasParent.has(node.id)) continue;
    placed.add(node.id);
    orphans.push(node, ...descendants(node.id));
  }

  return { courses, orphans };
}
