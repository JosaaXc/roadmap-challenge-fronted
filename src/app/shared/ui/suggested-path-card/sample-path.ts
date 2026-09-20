import { SuggestedCourse } from './suggested-path-models';

// Preview of a generated path, shared by the landing and the auth pages until
// the generator endpoint exists
export const SAMPLE_PATH_TOPIC = 'Backend';

export const SAMPLE_PATH: readonly SuggestedCourse[] = [
  { title: 'JavaScript Moderno', status: 'completed' },
  { title: 'Node y Express', status: 'completed' },
  { title: 'TypeScript: Tu guía completa', status: 'in-progress', progress: 40 },
  {
    title: 'Nest: backend escalable',
    status: 'locked',
    unlockAfter: 'TypeScript: Tu guía completa',
  },
  { title: 'Docker y despliegue', status: 'locked', unlockAfter: 'Nest: backend escalable' },
];
