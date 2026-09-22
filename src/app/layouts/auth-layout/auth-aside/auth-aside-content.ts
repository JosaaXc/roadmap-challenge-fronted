// Which pitch the aside shows, declared by each auth route in its `data`
export type AuthAsideVariant = 'sign-in' | 'sign-up';

export interface AuthAsideContent {
  readonly headline: string;
  // Devi only greets returning visitors, so a new one gets the headline alone
  readonly greeting?: string;
}

export const AUTH_ASIDE_CONTENT: Record<AuthAsideVariant, AuthAsideContent> = {
  'sign-in': {
    headline: 'Tu ruta queda guardada y sigue desde el curso que dejaste abierto.',
    greeting: '¡Hola de nuevo!',
  },
  'sign-up': {
    headline: 'Con una cuenta, la ruta que generes queda guardada con tu avance.',
  },
};
