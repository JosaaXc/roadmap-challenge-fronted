// What the generation screen says it is doing, in order. It never says how the path is built
export const GENERATION_STEPS = [
  'Leyendo tus respuestas',
  'Buscando cursos en el catálogo',
  'Ordenando tu ruta',
] as const;

// Each step stays active this long before the next one takes over
export const GENERATION_STEP_MS = 400;

// The screen lasts at least this long even when the API is faster, so the steps can be read
export const GENERATION_MIN_MS = 1500;

// The finished list stays on screen this long before the page changes, within the minimum
export const GENERATION_FINISH_MS = 300;
