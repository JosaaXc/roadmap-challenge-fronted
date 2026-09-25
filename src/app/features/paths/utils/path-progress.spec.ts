import { LearningPath, PathNode } from '../models/paths-models';
import { progressOf, withStepFlipped } from './path-progress';

const step = (id: string, isCompleted: boolean): PathNode => ({
  id,
  type: 'DEVTALLES_COURSE',
  title: id,
  isCompleted,
  position: 0,
});

const path = (nodes: PathNode[]): LearningPath => ({
  id: 'path',
  title: 'Ruta',
  description: '',
  progress: progressOf(nodes),
  isFavorite: false,
  isPublic: false,
  nodes,
  edges: [],
  nextStep: null,
  createdAt: '2026-09-24T00:00:00.000Z',
});

describe('progressOf', () => {
  it('rounds to one decimal, as the server does', () => {
    expect(progressOf([step('A', true), step('B', false), step('C', false)])).toBe(33.3);
    expect(progressOf([step('A', true), step('B', true), step('C', false)])).toBe(66.7);
  });

  it('reaches 100 only when every step is done, and is 0 for an empty path', () => {
    expect(progressOf([step('A', true), step('B', true)])).toBe(100);
    expect(progressOf([])).toBe(0);
  });
});

describe('withStepFlipped', () => {
  it('flips one step and recalculates the progress', () => {
    const flipped = withStepFlipped(path([step('A', false), step('B', false)]), 'A');

    expect(flipped.nodes.map((node) => node.isCompleted)).toEqual([true, false]);
    expect(flipped.progress).toBe(50);
  });

  it('leaves the original path untouched, so a signal sees a new value', () => {
    const original = path([step('A', false)]);
    const flipped = withStepFlipped(original, 'A');

    expect(flipped).not.toBe(original);
    expect(original.nodes[0].isCompleted).toBe(false);
  });

  it('flipping twice gives back the starting state', () => {
    const original = path([step('A', true), step('B', false)]);
    const twice = withStepFlipped(withStepFlipped(original, 'B'), 'B');

    expect(twice.nodes).toEqual(original.nodes);
    expect(twice.progress).toBe(original.progress);
  });
});
