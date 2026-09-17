import { CatalogStat, CourseStatus, LandingStep, SuggestedCourse } from '../models/landing-models';

// Topic the previewed path is generated for
export const SUGGESTED_PATH_TOPIC = 'Backend';

// Preview of a generated path. Hardcoded because this is an example.
export const SUGGESTED_PATH: readonly SuggestedCourse[] = [
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

export const COURSE_STATUS_LABEL: Record<CourseStatus, string> = {
  completed: 'Completado',
  'in-progress': 'En progreso',
  locked: 'Bloqueado',
};

export const LANDING_STEPS: readonly LandingStep[] = [
  {
    ordinal: '01',
    title: 'Cuéntanos qué quieres lograr',
    description: 'Tu nivel actual, el puesto al que apuntas y las horas que tienes por semana.',
  },
  {
    ordinal: '02',
    title: 'Obtén tu ruta ordenada',
    description:
      'Los cursos quedan en secuencia: cada uno llega cuando ya tienes lo que pide antes.',
  },
  {
    ordinal: '03',
    title: 'Marca tu avance',
    description:
      'Cierras un módulo, se desbloquea el siguiente y la ruta queda guardada en tu cuenta.',
  },
];

export const CATALOG_STATS: readonly CatalogStat[] = [
  { value: '+80', label: 'Cursos a elegir' },
  { value: '+6', label: 'Categorías' },
  { value: '+4', label: 'Instructores' },
];

export const CATALOG_CATEGORIES: readonly string[] = [
  'Backend',
  'Desarrollo Web',
  'Base de datos',
  'Móvil',
  'Dart y Flutter',
  'Más…',
];
