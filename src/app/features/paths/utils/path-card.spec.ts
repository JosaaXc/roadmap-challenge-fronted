import { LearningPath, PathNode } from '../models/paths-models';
import { toPathCard } from './path-card';

const course = (title: string): PathNode => ({
  id: title,
  type: 'DEVTALLES_COURSE',
  title,
  isCompleted: false,
  position: 0,
});

const resource = (title: string): PathNode => ({ ...course(title), type: 'EXTERNAL_LINK' });

const path = (nodes: PathNode[]): LearningPath => ({
  id: 'path',
  title: 'Ruta Personalizada: Backend',
  description: '',
  progress: 0,
  isFavorite: false,
  isPublic: false,
  nodes,
  edges: [],
  nextStep: null,
  createdAt: '2026-09-24T00:00:00.000Z',
});

describe('toPathCard', () => {
  it('lists three courses and sums up the rest', () => {
    const card = toPathCard(path(['Node', 'React', 'SQL', 'Docker', 'Nest'].map(course)));

    expect(card.courses).toBe('Node, React, SQL y 2 cursos más');
    expect(card.courseCount).toBe(5);
  });

  it('uses the singular for one remaining course', () => {
    const card = toPathCard(path(['Node', 'React', 'SQL', 'Docker'].map(course)));

    expect(card.courses).toBe('Node, React, SQL y 1 curso más');
  });

  it('leaves the user resources out of the list and the count', () => {
    const card = toPathCard(path([course('Node'), resource('MDN'), course('React')]));

    expect(card.courses).toBe('Node, React');
    expect(card.courseCount).toBe(2);
  });
});
