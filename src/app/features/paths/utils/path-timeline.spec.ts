import { PathEdge, PathNode, PathTimeline } from '../models/paths-models';
import { buildTimeline } from './path-timeline';

const course = (id: string, position: number): PathNode => ({
  id,
  type: 'DEVTALLES_COURSE',
  title: id,
  isCompleted: false,
  position,
});

const resource = (id: string, position: number): PathNode => ({
  id,
  type: 'EXTERNAL_LINK',
  title: id,
  isCompleted: false,
  position,
});

const edge = (sourceNodeId: string, targetNodeId: string): PathEdge => ({
  id: `${sourceNodeId}-${targetNodeId}`,
  isOptional: false,
  sourceNodeId,
  targetNodeId,
});

// The generated path: four courses in a straight chain
const courses = [course('A', 0), course('B', 1), course('C', 2), course('D', 3)];
const chain = [edge('A', 'B'), edge('B', 'C'), edge('C', 'D')];

// Reads a timeline as ids, which is what the assertions care about
function shape(timeline: PathTimeline) {
  return {
    courses: timeline.courses.map((entry) => [entry.node.id, entry.resources.map((r) => r.id)]),
    orphans: timeline.orphans.map((node) => node.id),
  };
}

describe('buildTimeline', () => {
  it('hangs each resource under the course it was added to, not at the end', () => {
    const timeline = buildTimeline({
      nodes: [...courses, resource('R1', 4), resource('R2', 5)],
      edges: [...chain, edge('A', 'R1'), edge('C', 'R2')],
    });

    expect(shape(timeline)).toEqual({
      courses: [
        ['A', ['R1']],
        ['B', []],
        ['C', ['R2']],
        ['D', []],
      ],
      orphans: [],
    });
  });

  it('keeps a stable order when the backend repeats a position', () => {
    const timeline = buildTimeline({
      nodes: [...courses, resource('R3', 5), resource('R2', 5)],
      edges: [...chain, edge('B', 'R3'), edge('B', 'R2')],
    });

    expect(shape(timeline).courses[1]).toEqual(['B', ['R2', 'R3']]);
  });

  it('places a resource hung from another resource right after its parent', () => {
    const timeline = buildTimeline({
      nodes: [...courses, resource('R1', 4), resource('R2', 5)],
      edges: [...chain, edge('B', 'R1'), edge('R1', 'R2')],
    });

    expect(shape(timeline).courses[1]).toEqual(['B', ['R1', 'R2']]);
  });

  it('moves a resource that lost its parent after the last course', () => {
    const timeline = buildTimeline({
      nodes: [...courses, resource('R2', 5)],
      edges: chain,
    });

    expect(shape(timeline).orphans).toEqual(['R2']);
  });

  it('keeps an orphan chain parent first, whatever their positions', () => {
    const timeline = buildTimeline({
      nodes: [...courses, resource('R9', 7), resource('R8', 4)],
      edges: [...chain, edge('R9', 'R8')],
    });

    expect(shape(timeline).orphans).toEqual(['R9', 'R8']);
  });
});
