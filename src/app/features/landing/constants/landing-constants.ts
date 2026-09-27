import { LandingStep } from '../models/landing-models';

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
