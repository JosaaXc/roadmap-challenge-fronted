import { CatalogLevel, LandingStep } from '../models/landing-models';

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
      'Cierras un curso, se desbloquea el siguiente y la ruta queda guardada en tu cuenta.',
  },
];

// The catalog page's levels, easiest first: the order the courses are meant to be taken in
export const CATALOG_LEVELS: readonly CatalogLevel[] = [
  {
    value: 'BEGINNER',
    label: 'Principiante',
    description: 'Para dar tus primeros pasos en un lenguaje, un framework o una herramienta.',
  },
  {
    value: 'INTERMEDIATE',
    label: 'Intermedio',
    description: 'Para ir más a fondo en lo que ya usas y construir proyectos completos.',
  },
  {
    value: 'ADVANCED',
    label: 'Avanzado',
    description: 'Arquitectura, escala y lo que hace falta para llevar un sistema a producción.',
  },
];

// Technology pills the catalog page shows before "Ver todas", the ones with most courses
export const CATALOG_PINNED_FILTERS = 10;

// Covers blurred into the light at the top of the catalog page
export const CATALOG_LIGHT_COVERS = 8;
