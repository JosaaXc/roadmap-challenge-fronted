import { SuggestedCourse } from './suggested-path-models';

// Preview of a generated path, shared by the landing and the auth pages. Every course is a real
// one from the catalog, so the landing can dress the preview with their covers
export const SAMPLE_PATH_TOPIC = 'Backend';

export const SAMPLE_PATH: readonly SuggestedCourse[] = [
  { title: 'JavaScript Moderno', slug: 'javascript-moderno', status: 'completed' },
  {
    title: 'Node.js: De cero a experto',
    slug: 'nodejs-de-cero-a-experto',
    status: 'completed',
    unlockAfter: 'JavaScript Moderno',
  },
  {
    title: 'TypeScript: Tu guía completa',
    slug: 'typescript-guia-completa',
    status: 'next',
    unlockAfter: 'Node.js: De cero a experto',
  },
  {
    title: 'Nest: backend escalable',
    slug: 'nest',
    status: 'locked',
    unlockAfter: 'TypeScript: Tu guía completa',
  },
  {
    title: 'Docker y despliegue',
    slug: 'docker-guia-practica',
    status: 'locked',
    unlockAfter: 'Nest: backend escalable',
  },
];
